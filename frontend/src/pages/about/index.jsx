import Navbar from "../../components/navbar/index";
import Image from "next/image";
import Link from "next/link";


const stats = [
  { value: "2.4M+", label: "Professionals" },
  { value: "18K+", label: "Companies" },
  { value: "93%", label: "Placed" },
];


export default function About() {
  return (
    <section className="about-section">
        <Navbar/>

      <style>{`
        .about-section {
          min-height: 100vh;
          background: #080612;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 60px;
          padding: 80px 20px;
          position: relative;
          overflow: hidden;
        }

       
        .about-section::before {
          content: "";
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%);
          top: -100px;
          left: -100px;
        }

        .about-section::after {
          content: "";
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%);
          bottom: -100px;
          right: -100px;
        }

       
        .about-container {
          display: flex;
          align-items: center;
          gap: 60px;
          max-width: 1100px;
          width: 100%;
          flex-wrap: wrap;
          justify-content: center;
        }

       
        .about-img {
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          box-shadow: 0 20px 60px rgba(124,58,237,0.25);
        }

       
        .about-text {
          max-width: 520px;
        }

        .about-label {
          font-size: 12px;
          margin-top: 30px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #a78bfa;
          margin-bottom: 10px;
        }

        .about-title {
          font-size: 36px;
          font-weight: 700;
          color: #e2d9f3;
          margin-bottom: 10px;
        }

        .about-line {
          width: 70px;
          height: 3px;
          background: linear-gradient(135deg, #7c3aed, #c026d3);
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .about-desc {
          font-size: 14px;
          color: #9ca3af;
          line-height: 1.7;
          margin-bottom: 16px;
        }

       
        .about-stats {
          display: flex;
          gap: 12px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .stat-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 14px 18px;
          border-radius: 12px;
          text-align: center;
          min-width: 90px;
          transition: 0.2s;
        }

        .stat-box:hover {
          border-color: #7c3aed;
          background: rgba(124,58,237,0.12);
        }

        .stat-value {
          color: #a78bfa;
          font-weight: 700;
          font-size: 18px;
        }

        .stat-label {
          font-size: 11px;
          color: #6b7280;
        }

      
        .about-btn {
          margin-top: 28px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          padding: 10px 22px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: 0.2s;
        }

        .about-btn:hover {
          opacity: 0.85;
        }
      `}</style>

      <div className="about-container">

      
        <div className="about-img">
          <Image
            src="/group-image.png"
            width={320}
            height={320}
            alt="team"
          />
        </div>

      
        <div className="about-text">
          <div className="about-label">Who we are</div>
          <h2 className="about-title">What we do?</h2>
          <div className="about-line"></div>

          <p className="about-desc">
           CareerPilot is a global career platform built for software engineers, now live in 40+ countries with over 18,000 companies actively hiring.
          </p>

          <p className="about-desc">
            We help you navigate your dream career with AI-powered job matching, warm introductions, and real-time market insights - so you can discover the right opportunities faster and stand out in a competitive job market.
          </p>

          <p className="about-desc">
            Our mission: we help you move faster toward your dream career.
          </p>

      
          <div className="about-stats">
            {stats.map((s) => (
              <div key={s.label} className="stat-box">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <Link href="/features" className="about-btn">
            Explore Features →
          </Link>
        </div>

      </div>
    </section>
  );
}