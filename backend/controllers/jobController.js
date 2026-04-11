import Groq from "groq-sdk";         
import axios from "axios";
import Job from "../models/job.js";
import { AppError } from "../middleware/errorHandler.js";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


const parseQueryWithAI = async (query) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",        
    max_tokens: 300,
    temperature: 0,                    
    messages: [
      {
        role: "system",
        content: `You are a job search query parser. Extract structured filters from the user's natural language job search query. Return ONLY a valid JSON object with no markdown, no explanation, no backticks.

Use this exact shape:
{
  "title": "primary job role or title",
  "skills": ["skill1", "skill2"],
  "experienceLevel": "fresher | junior | mid | senior | lead | null",
  "location": "city name or null",
  "isRemote": true or false,
  "employmentType": "fulltime | parttime | internship | contract | null",
  "searchQuery": "optimised 3-6 word string for a job board API"
}

Rules:
- "fresher", "entry level", "0 years", "no experience" → experienceLevel: "fresher"
- "remote", "wfh", "work from home" → isRemote: true
- "intern", "internship" → employmentType: "internship"
- If title implies skills (e.g. "MERN" → MongoDB, Express, React, Node.js), include them in skills array
- searchQuery should be concise and focused for best job board results`,
      },
      {
        role: "user",
        content: query,
      },
    ],
  });

  const text  = response.choices[0].message.content.trim();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};


const fetchFromJSearch = async (filters) => {
  const params = {
    query: filters.searchQuery || filters.title,
    page: "1",
    num_pages: "2",
    date_posted: "month",
  };

  if (filters.isRemote) {
    params.remote_jobs_only = "true";
  }

  if (filters.location && !filters.isRemote) {
    params.query = `${params.query} ${filters.location}`;
  }

  const { data } = await axios.get("https://jsearch.p.rapidapi.com/search", {
    params,
    headers: {
      "X-RapidAPI-Key": process.env.JSEARCH_API_KEY,
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    },
    timeout: 10000, 
  });

  return data.data || [];
};


const scoreJob = (raw, filters) => {
  let score = 0;
  const titleLower = (raw.job_title || "").toLowerCase();
  const descLower = (raw.job_description || "").toLowerCase();
  const combinedText = `${titleLower} ${descLower}`;

  if (filters.title && titleLower.includes(filters.title.toLowerCase())) {
    score += 40;
  }


  filters.skills?.forEach((skill) => {
    if (combinedText.includes(skill.toLowerCase())) score += 10;
  });

  
  if (filters.experienceLevel === "fresher") {
    const freshSignals = ["fresher", "entry level", "0-1 year", "graduate", "junior"];
    if (freshSignals.some((s) => combinedText.includes(s))) score += 20;
  
    const seniorSignals = ["senior", "lead", "principal", "5+ years", "7+ years"];
    if (seniorSignals.some((s) => combinedText.includes(s))) score -= 30;
  }

 
  if (filters.isRemote && raw.job_is_remote) score += 15;


  if (raw.job_min_salary) score += 5;

  return score;
};


const shapeJob = (raw) => ({
  id: raw.job_id,
  title: raw.job_title,
  company: {
    name: raw.employer_name,
    logo: raw.employer_logo || null,
    website: raw.employer_website || null,
  },
  location: {
    city: raw.job_city || null,
    country: raw.job_country || null,
    isRemote: raw.job_is_remote || false,
    displayText: raw.job_is_remote
      ? "Remote"
      : [raw.job_city, raw.job_country].filter(Boolean).join(", ") ||
        "Location not specified",
  },
  salary:
    raw.job_min_salary && raw.job_max_salary
      ? {
          min: raw.job_min_salary,
          max: raw.job_max_salary,
          currency: raw.job_salary_currency || "USD",
          displayText: `$${Math.round(raw.job_min_salary / 1000)}K – $${Math.round(
            raw.job_max_salary / 1000
          )}K`,
        }
      : null,
  employmentType: raw.job_employment_type?.toLowerCase() || null,
  skills: raw.job_required_skills || [],
  description: raw.job_description
    ? raw.job_description.slice(0, 300).trimEnd() + "…"
    : null,
  applyLink: raw.job_apply_link, 
  postedAt: raw.job_posted_at_datetime_utc || null,
  source: "jsearch",
});



export const searchJobs = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    if (query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Query is too short — try something like 'MERN developer fresher'",
      });
    }

 
    let filters;
    try {
      filters = await parseQueryWithAI(query.trim());
    } catch (aiError) {
      
      console.error("AI parse failed, falling back:", aiError.message);
      filters = {
        title: query.trim(),
        skills: [],
        experienceLevel: null,
        location: null,
        isRemote: false,
        employmentType: null,
        searchQuery: query.trim(),
      };
    }

    
    const rawJobs = await fetchFromJSearch(filters);

    if (!rawJobs.length) {
      return res.status(200).json({
        success: true,
        filters,
        totalFound: 0,
        jobs: [],
        message: "No jobs found. Try different keywords or remove location filters.",
      });
    }

   
    const scoredJobs = rawJobs
      .map((raw) => ({ raw, score: scoreJob(raw, filters) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);

  
    const jobs = scoredJobs.map(({ raw }) => shapeJob(raw));

  
    if (jobs.length > 0) {
      const docsToInsert = scoredJobs.map(({ raw }) => Job.fromJSearch(raw));
      Job.insertMany(docsToInsert, { ordered: false }).catch(() => {
        
      });
    }


    return res.status(200).json({
      success: true,
      query: query.trim(),
      filters,              
      totalFound: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);             
  }
};



export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).lean();

    if (!job) {
      throw new AppError("Job not found", 404);
    }

    return res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};



export const toggleSaveJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      throw new AppError("Job not found", 404);
    }

    const userId = req.user._id;
    const alreadySaved = job.savedBy.includes(userId);

    if (alreadySaved) {
      job.savedBy.pull(userId);
    } else {
      job.savedBy.push(userId);
    }

    await job.save();

    return res.status(200).json({
      success: true,
      saved: !alreadySaved,
      message: alreadySaved ? "Job removed from saved" : "Job saved successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const getSavedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ savedBy: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      totalFound: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};