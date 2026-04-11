import Image from "next/image";
import Navbar from "../../components/navbar/index";

export default function FeaturePage() {
  return (
    <>
     <Navbar/>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');

        * {
          font-family: "Geist", sans-serif;
        }

        .feature-section {
          min-height: 100vh;
          background: #080612;
          padding: 80px 20px;
          position: relative;
          overflow: hidden;
        }

     
        .feature-section::before {
          content: "";
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%);
          top: -100px;
          left: -100px;
        }

        .feature-section::after {
          content: "";
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%);
          bottom: -100px;
          right: -100px;
        }

    
        .feature-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .feature-badge {
          font-size: 12px;
          color: #a78bfa;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 6px 18px;
          border-radius: 999px;
          background: rgba(255,255,255,0.03);
        }

        .feature-title {
          font-size: 38px;
          font-weight: 700;
          color: #e2d9f3;
          margin-top: 20px;
        }

        .feature-sub {
          color: #9ca3af;
          font-size: 14px;
          max-width: 420px;
          margin: 12px auto 0;
          line-height: 1.6;
        }

   
        .feature-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1100px;
          margin: auto;
        }

        .feature-row {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

      
        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 20px;
          transition: 0.25s;
          display: flex;
          gap: 20px;
        }

        .feature-card:hover {
          border-color: #7c3aed;
          background: rgba(124,58,237,0.08);
        }

        .feature-card.small {
          flex: 1;
          flex-direction: column;
        }

        .feature-card.big {
          flex: 1.5;
          align-items: center;
        }

        .feature-img {
          width: 45%;
          border-radius: 12px;
          object-fit: cover;
        }

       
        .feature-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(124,58,237,0.15);
          color: #a78bfa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .feature-heading {
          font-size: 15px;
          font-weight: 600;
          color: #e2d9f3;
        }

        .feature-text {
          font-size: 13px;
          color: #9ca3af;
          margin-top: 6px;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .feature-card.big {
            flex-direction: column;
          }

          .feature-img {
            width: 100%;
            height: 180px;
          }
        }
      `}
      </style>

      <section className="feature-section">

       
        <div className="feature-header">
         

          <h1 className="feature-title">
            Everything You Need to <br /> Land Your Dream Job 
          </h1>

          <p className="feature-sub">
            AI-powered tools, smart job matching, and real-time insights -
            built for developers to grow faster.
          </p>
        </div>

      
        <div className="feature-grid">

        
          <div className="feature-row">

            <div className="feature-card big">
              <Image width={500} height={200} alt="image" src="/Ai_Job.jpg" className="feature-img" />

              <div>
                <h3 className="feature-heading">AI Job Matching</h3>
                <p className="feature-text">
                Matches jobs based on skills, resume
                </p>
                <p className="feature-text">
                  Personalized recommendations
                </p>
              </div>
            </div>

            <div className="feature-card big">
              <Image width={500} height={200} alt="image" src="/global_opp.jpg" className="feature-img" />

              <div>
                <h3 className="feature-heading">Global Opportunities</h3>
                <p className="feature-text">
                  Remote + global jobs
                </p>
                <p className="feature-text">
                  40+ countries hiring
                </p>
              </div>
            </div>


          </div>

      
          <div className="feature-row">

             <div className="feature-card big">
              <Image width={500} height={200} alt="image" src="/networking.jpg" className="feature-img" />

              <div>
               
                <h3 className="feature-heading">Warm Networking</h3>
                <p className="feature-text">
                  Connect with hiring managers
                </p>
                <p className="feature-text">
                 Get referrals
                </p>
              </div>
            </div>


            <div className="feature-card big">
              <Image width={500} height={200} alt="image" src="/marketing.jpeg" className="feature-img" />

              <div>
               
                <h3 className="feature-heading">Real-Time Market</h3>
                <p className="feature-text">
                 Salary trends
                </p>
                <p className="feature-text">
                Hiring demand
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>
    </>
  );
}