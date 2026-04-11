import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {

    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    company: {
      name: {
        type: String,
        required: [true, "Company name is required"],
        trim: true,
      },
      logo: {
        type: String,       
        default: null,
      },
      website: {
        type: String,
        default: null,
      },
    },

    location: {
      city: {
        type: String,
        trim: true,
        default: null,
      },
      state: {
        type: String,
        trim: true,
        default: null,
      },
      country: {
        type: String,
        trim: true,
        default: null,
      },
      isRemote: {
        type: Boolean,
        default: false,
      },
     
      displayText: {
        type: String,
        trim: true,
        default: null,
      },
    },

    salary: {
      min: {
        type: Number,
        default: null,
      },
      max: {
        type: Number,
        default: null,
      },
      currency: {
        type: String,
        default: "USD",
        uppercase: true,
        maxlength: 3,
      },
      period: {
        type: String,
        enum: ["hourly", "monthly", "yearly", null],
        default: null,
      },
 
      displayText: {
        type: String,
        default: null,
      },
    },

  
    applyLink: {
      type: String,
      required: [true, "Apply link is required"],
      trim: true,
    },

    skills: {
      type: [String],       
      default: [],
    },

    employmentType: {
      type: String,
      enum: ["fulltime", "parttime", "contract", "internship", "freelance", null],
      default: null,
      lowercase: true,
    },

    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior", "lead", null],
      default: null,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      default: null,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },

 
    externalId: {
      type: String,
      unique: true,
      sparse: true,       
      default: null,
    },

   
    source: {
      type: String,
      default: "jsearch",
    },

    postedAt: {
      type: Date,
      default: null,
    },

   
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,       
  }
);



jobSchema.index({ title: "text", "company.name": "text", skills: "text" });


jobSchema.index({ employmentType: 1 });
jobSchema.index({ experienceLevel: 1 });
jobSchema.index({ "location.isRemote": 1 });
jobSchema.index({ postedAt: -1 });          


jobSchema.virtual("locationString").get(function () {
  if (this.location.isRemote) return "Remote";
  const parts = [this.location.city, this.location.country].filter(Boolean);
  return parts.join(", ") || "Location not specified";
});


jobSchema.virtual("salaryString").get(function () {
  if (this.salary.displayText) return this.salary.displayText;
  if (!this.salary.min && !this.salary.max) return null;
  const fmt = (n) =>
    n >= 1000 ? `${(n / 1000).toFixed(0)}K` : `${n}`;
  const currency = this.salary.currency === "USD" ? "$" : this.salary.currency;
  if (this.salary.min && this.salary.max) {
    return `${currency}${fmt(this.salary.min)} – ${currency}${fmt(this.salary.max)}`;
  }
  return `${currency}${fmt(this.salary.min || this.salary.max)}`;
});


jobSchema.statics.fromJSearch = function (raw) {
  return {
    title: raw.job_title,
    company: {
      name: raw.employer_name,
      logo: raw.employer_logo || null,
      website: raw.employer_website || null,
    },
    location: {
      city: raw.job_city || null,
      state: raw.job_state || null,
      country: raw.job_country || null,
      isRemote: raw.job_is_remote || false,
      displayText: raw.job_is_remote
        ? "Remote"
        : [raw.job_city, raw.job_country].filter(Boolean).join(", ") || null,
    },
    salary: {
      min: raw.job_min_salary || null,
      max: raw.job_max_salary || null,
      currency: raw.job_salary_currency || "USD",
      period: raw.job_salary_period?.toLowerCase() || null,
    },
    applyLink: raw.job_apply_link,
    skills: raw.job_required_skills || [],
    employmentType: raw.job_employment_type?.toLowerCase() || null,
    description: raw.job_description?.slice(0, 5000) || null,
    externalId: raw.job_id,
    source: "jsearch",
    postedAt: raw.job_posted_at_datetime_utc
      ? new Date(raw.job_posted_at_datetime_utc)
      : null,
  };
};

const Job = mongoose.model("Job", jobSchema);

export default Job;