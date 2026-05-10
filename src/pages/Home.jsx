// src/pages/LandingPage.jsx

import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Real-Time Communication",
      desc: "Organized channels, instant messaging, and live collaboration for your entire company.",
    },
    {
      title: "Task Management",
      desc: "Assign tasks, track progress, and manage workflows without switching tools.",
    },
    {
      title: "Attendance Tracking",
      desc: "Monitor employee activity, attendance, and productivity in one place.",
    },
    {
      title: "Leave Management",
      desc: "Approve requests, manage schedules, and simplify HR operations.",
    },
    {
      title: "Ticket System",
      desc: "Internal issue tracking and support workflows built directly into your workspace.",
    },
    {
      title: "Enterprise Security",
      desc: "Role permissions, authentication, audit logs, and secure workspace management.",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;700&display=swap');

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        body{
          background:#0d0d0d;
          font-family:'DM Sans',sans-serif;
        }

        .landing-root{
          background:#0d0d0d;
          color:white;
          min-height:100vh;
          overflow-x:hidden;
        }

        /* NAVBAR */

        .navbar{
          position:sticky;
          top:0;
          z-index:100;

          backdrop-filter:blur(10px);

          background:rgba(13,13,13,0.72);

          border-bottom:1px solid rgba(255,255,255,0.05);

          display:flex;
          align-items:center;
          justify-content:space-between;

          padding:18px 7%;
        }

        .logo-wrap{
          display:flex;
          align-items:center;
          gap:12px;
        }

        .logo-box{
          width:40px;
          height:40px;
          border-radius:12px;

          background:linear-gradient(135deg,#c8a56e,#8a6230);

          display:flex;
          align-items:center;
          justify-content:center;

          color:#0d0d0d;
          font-weight:700;
        }

        .logo-text{
          font-size:32px;
          font-family:'Cormorant Garamond',serif;
          color:rgba(255,255,255,0.92);
          letter-spacing:0.05em;
        }

        .nav-actions{
          display:flex;
          gap:14px;
          align-items:center;
        }

        .btn{
          border:none;
          outline:none;
          cursor:pointer;
          transition:0.25s;
          font-family:'DM Sans',sans-serif;
        }

        .btn-outline{
          height:46px;
          padding:0 18px;

          background:transparent;

          border:1px solid rgba(255,255,255,0.08);

          border-radius:12px;

          color:rgba(255,255,255,0.7);
        }

        .btn-outline:hover{
          background:rgba(255,255,255,0.04);
          color:white;
        }

        .btn-gold{
          height:46px;
          padding:0 18px;

          border-radius:12px;

          background:linear-gradient(135deg,#c8a56e,#8a6230);

          color:#0d0d0d;
          font-weight:700;
        }

        .btn-gold:hover{
          transform:translateY(-2px);
          opacity:0.92;
        }

        /* HERO */

        .hero{
          padding:90px 7% 100px;

          display:grid;
          grid-template-columns:1fr 1fr;
          gap:80px;
          align-items:center;
        }

        .hero-badge{
          width:fit-content;

          padding:8px 16px;

          border-radius:999px;

          background:rgba(200,165,110,0.08);

          border:1px solid rgba(200,165,110,0.2);

          color:#c8a56e;

          font-size:12px;

          margin-bottom:26px;
        }

        .hero-title{
          font-size:82px;
          line-height:0.95;
          font-family:'Cormorant Garamond',serif;

          color:rgba(255,255,255,0.96);

          margin-bottom:30px;
        }

        .hero-title span{
          color:#c8a56e;
        }

        .hero-desc{
          color:rgba(255,255,255,0.55);

          font-size:18px;
          line-height:1.9;

          max-width:560px;

          margin-bottom:40px;
        }

        .hero-actions{
          display:flex;
          gap:16px;
          flex-wrap:wrap;
        }

        .hero-btn{
          height:56px;
          padding:0 26px;
          border-radius:14px;
          font-size:15px;
        }

        /* PREVIEW */

        .preview-wrap{
          position:relative;
        }

        .dashboard-preview{
          background:#111111;

          border:1px solid rgba(255,255,255,0.06);

          border-radius:28px;

          overflow:hidden;

          box-shadow:
          0 0 0 1px rgba(255,255,255,0.03),
          0 50px 100px rgba(0,0,0,0.6);
        }

        .preview-top{
          height:60px;

          border-bottom:1px solid rgba(255,255,255,0.05);

          display:flex;
          align-items:center;
          gap:8px;

          padding:0 20px;
        }

        .dot{
          width:10px;
          height:10px;
          border-radius:50%;

          background:rgba(255,255,255,0.2);
        }

        .preview-body{
          display:grid;
          grid-template-columns:220px 1fr;
          min-height:480px;
        }

        .preview-sidebar{
          border-right:1px solid rgba(255,255,255,0.05);

          padding:22px;
        }

        .preview-channel{
          height:44px;

          border-radius:10px;

          background:rgba(255,255,255,0.04);

          display:flex;
          align-items:center;

          padding:0 14px;

          margin-bottom:10px;

          color:rgba(255,255,255,0.5);

          font-size:13px;
        }

        .preview-channel.active{
          background:rgba(200,165,110,0.1);
          color:white;
        }

        .preview-chat{
          padding:28px;
        }

        .chat-line{
          display:flex;
          gap:12px;

          margin-bottom:22px;
        }

        .avatar{
          width:36px;
          height:36px;
          border-radius:10px;

          background:linear-gradient(135deg,#c8a56e,#8a6230);

          flex-shrink:0;
        }

        .bubble{
          flex:1;
        }

        .bubble-name{
          font-size:12px;
          color:rgba(255,255,255,0.7);
          margin-bottom:8px;
        }

        .bubble-msg{
          background:rgba(255,255,255,0.04);

          border:1px solid rgba(255,255,255,0.05);

          border-radius:14px;

          padding:14px;

          color:rgba(255,255,255,0.6);

          line-height:1.8;
          font-size:13px;
        }

        /* SECTION */

        .section{
          padding:110px 7%;
        }

        .section-head{
          text-align:center;
          margin-bottom:70px;
        }

        .section-title{
          font-size:62px;
          font-family:'Cormorant Garamond',serif;

          color:rgba(255,255,255,0.95);

          margin-bottom:18px;
        }

        .section-desc{
          max-width:720px;

          margin:auto;

          color:rgba(255,255,255,0.5);

          line-height:1.9;

          font-size:16px;
        }

        /* FEATURES */

        .feature-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
          gap:24px;
        }

        .feature-card{
          background:#111111;

          border:1px solid rgba(255,255,255,0.06);

          border-radius:28px;

          padding:34px;

          transition:0.3s;
        }

        .feature-card:hover{
          transform:translateY(-6px);

          border-color:rgba(200,165,110,0.18);
        }

        .feature-icon{
          width:54px;
          height:54px;

          border-radius:16px;

          background:rgba(200,165,110,0.08);

          border:1px solid rgba(200,165,110,0.15);

          display:flex;
          align-items:center;
          justify-content:center;

          margin-bottom:24px;
        }

        .feature-title{
          font-size:18px;
          color:rgba(255,255,255,0.88);
          margin-bottom:14px;
        }

        .feature-desc{
          color:rgba(255,255,255,0.45);
          line-height:1.9;
          font-size:14px;
        }

        /* WHY */

        .why-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:24px;
        }

        .why-card{
          background:#111111;

          border:1px solid rgba(255,255,255,0.06);

          border-radius:28px;

          padding:32px;
        }

        .why-card.large{
          grid-column:span 2;
        }

        .why-badge{
          width:fit-content;

          padding:8px 14px;

          border-radius:999px;

          background:rgba(200,165,110,0.08);

          border:1px solid rgba(200,165,110,0.2);

          color:#c8a56e;

          font-size:12px;

          margin-bottom:22px;
        }

        .why-title{
          font-size:44px;
          line-height:1.1;

          font-family:'Cormorant Garamond',serif;

          color:rgba(255,255,255,0.95);

          margin-bottom:20px;
        }

        .why-desc{
          color:rgba(255,255,255,0.5);

          line-height:1.9;
        }

        .why-icon{
          font-size:32px;
          margin-bottom:18px;
        }

        .why-small-title{
          font-size:18px;
          color:rgba(255,255,255,0.9);
          margin-bottom:14px;
        }

        .why-small-desc{
          color:rgba(255,255,255,0.45);
          line-height:1.8;
          font-size:14px;
        }

        /* WORKFLOW */

        .workflow-section{
          padding:110px 7%;
        }

        .workflow-wrap{
          display:grid;
          grid-template-columns:repeat(7,1fr);
          align-items:center;
          gap:20px;
        }

        .workflow-step{
          text-align:center;
        }

        .workflow-number{
          font-size:54px;

          color:#c8a56e;

          font-family:'Cormorant Garamond',serif;

          margin-bottom:18px;
        }

        .workflow-name{
          color:rgba(255,255,255,0.9);

          font-size:18px;

          margin-bottom:12px;
        }

        .workflow-desc{
          color:rgba(255,255,255,0.45);

          font-size:14px;

          line-height:1.8;
        }

        .workflow-line{
          height:1px;
          background:rgba(255,255,255,0.08);
        }

        /* STATS */

        .stats-section{
          padding:20px 7% 120px;
        }

        .stats-grid{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:24px;
        }

        .stat-card{
          background:#111111;

          border:1px solid rgba(255,255,255,0.06);

          border-radius:24px;

          padding:42px;

          text-align:center;
        }

        .stat-number{
          font-size:48px;

          color:#c8a56e;

          font-family:'Cormorant Garamond',serif;

          margin-bottom:10px;
        }

        .stat-text{
          color:rgba(255,255,255,0.45);
          font-size:14px;
        }

        /* TESTIMONIAL */

        .testimonial-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:24px;
        }

        .testimonial-card{
          background:#111111;

          border:1px solid rgba(255,255,255,0.06);

          border-radius:28px;

          padding:34px;
        }

        .testimonial-text{
          color:rgba(255,255,255,0.65);

          line-height:2;

          margin-bottom:32px;

          font-size:15px;
        }

        .testimonial-user{
          display:flex;
          align-items:center;
          gap:14px;
        }

        .testimonial-avatar{
          width:48px;
          height:48px;

          border-radius:14px;

          background:linear-gradient(135deg,#c8a56e,#8a6230);

          display:flex;
          align-items:center;
          justify-content:center;

          color:#0d0d0d;

          font-weight:700;
        }

        .testimonial-name{
          color:rgba(255,255,255,0.86);
          margin-bottom:4px;
        }

        .testimonial-role{
          color:rgba(255,255,255,0.35);
          font-size:13px;
        }

        /* CTA */

        .cta{
          padding:120px 7%;
        }

        .cta-box{
          background:linear-gradient(
            180deg,
            rgba(200,165,110,0.08),
            rgba(17,17,17,1)
          );

          border:1px solid rgba(200,165,110,0.15);

          border-radius:36px;

          padding:90px 40px;

          text-align:center;
        }

        .cta-title{
          font-size:68px;

          line-height:1;

          font-family:'Cormorant Garamond',serif;

          margin-bottom:24px;
        }

        .cta-desc{
          max-width:700px;

          margin:auto;

          color:rgba(255,255,255,0.5);

          line-height:1.9;

          margin-bottom:36px;
        }

        /* FOOTER */

        .footer{
          padding:40px 7%;

          border-top:1px solid rgba(255,255,255,0.05);

          display:flex;
          justify-content:space-between;
          align-items:center;
          flex-wrap:wrap;
          gap:16px;
        }

        .footer-left{
          color:rgba(255,255,255,0.3);
          font-size:13px;
        }

        .footer-links{
          display:flex;
          gap:20px;
        }

        .footer-links span{
          color:rgba(255,255,255,0.4);
          cursor:pointer;
          font-size:13px;
        }

        .footer-links span:hover{
          color:white;
        }

        /* RESPONSIVE */

        @media(max-width:1100px){

          .hero{
            grid-template-columns:1fr;
          }

          .hero-title{
            font-size:62px;
          }

          .why-grid,
          .stats-grid,
          .testimonial-grid{
            grid-template-columns:1fr;
          }

          .why-card.large{
            grid-column:span 1;
          }

          .workflow-wrap{
            grid-template-columns:1fr;
          }

          .workflow-line{
            width:1px;
            height:50px;
            margin:auto;
          }

        }

        @media(max-width:768px){

          .navbar{
            padding:16px 5%;
          }

          .hero,
          .section,
          .workflow-section,
          .stats-section,
          .cta{
            padding-left:5%;
            padding-right:5%;
          }

          .hero-title{
            font-size:48px;
          }

          .section-title{
            font-size:44px;
          }

          .cta-title{
            font-size:46px;
          }

          .preview-body{
            grid-template-columns:1fr;
          }

          .preview-sidebar{
            display:none;
          }

          .footer{
            flex-direction:column;
            align-items:flex-start;
          }

        }

      `}</style>

      <div className="landing-root">

        {/* NAVBAR */}

        <div className="navbar">

          <div className="logo-wrap px-7">
            

            <div className="logo-text">
              CTMS
            </div>
          </div>

          <div className="nav-actions">

            <button
              className="btn btn-outline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="btn btn-gold"
              onClick={() => navigate("/register")}
            >
              Start Free
            </button>

          </div>

        </div>

        {/* HERO */}

        <section className="hero">

          <div>

            <div className="hero-badge">
              COMPANY OPERATING SYSTEM
            </div>

            <h1 className="hero-title">
              Run your entire company from
              <span> one workspace.</span>
            </h1>

            <p className="hero-desc">
              Real-time communication, task management,
              attendance tracking, leave systems,
              tickets, and collaboration tools —
              designed for modern organizations.
            </p>

            <div className="hero-actions">

              <button
                className="btn btn-gold hero-btn"
                onClick={() => navigate("/register")}
              >
                Start Free
              </button>

              <button
                className="btn btn-outline hero-btn"
                onClick={() => navigate("/login")}
              >
                Book Demo
              </button>

            </div>

          </div>

          {/* RIGHT */}

          <div className="preview-wrap">

            <div className="dashboard-preview">

              <div className="preview-top">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>

              <div className="preview-body">

                <div className="preview-sidebar">

                  <div className="preview-channel active">
                    # General
                  </div>

                  <div className="preview-channel">
                    # Development
                  </div>

                  <div className="preview-channel">
                    # HR
                  </div>

                  <div className="preview-channel">
                    # Tickets
                  </div>

                  <div className="preview-channel">
                    # Design
                  </div>

                </div>

                <div className="preview-chat">

                  <div className="chat-line">
                    <div className="avatar"></div>

                    <div className="bubble">
                      <div className="bubble-name">
                        Rahul Sharma
                      </div>

                      <div className="bubble-msg">
                        Production deployment completed successfully.
                        Monitoring and analytics are active now.
                      </div>
                    </div>
                  </div>

                  <div className="chat-line">
                    <div className="avatar"></div>

                    <div className="bubble">
                      <div className="bubble-name">
                        Priya Verma
                      </div>

                      <div className="bubble-msg">
                        UI improvements finished.
                        Mobile responsiveness optimized.
                      </div>
                    </div>
                  </div>

                  <div className="chat-line">
                    <div className="avatar"></div>

                    <div className="bubble">
                      <div className="bubble-name">
                        Aakash
                      </div>

                      <div className="bubble-msg">
                        Attendance reports and leave approval workflow
                        are now integrated into the dashboard.
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* FEATURES */}

        <section className="section">

          <div className="section-head">

            <h2 className="section-title">
              Everything your company needs
            </h2>

            <p className="section-desc">
              Replace disconnected tools with a centralized workspace
              built for communication, collaboration, productivity,
              and internal operations.
            </p>

          </div>

          <div className="feature-grid">

            {features.map((item,index) => (

              <div className="feature-card" key={index}>

                <div className="feature-icon">

                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c8a56e"
                    strokeWidth="1.7"
                  >
                    <path d="M12 2L19 6V12C19 17 15.5 21 12 22C8.5 21 5 17 5 12V6L12 2Z"/>
                  </svg>

                </div>

                <div className="feature-title">
                  {item.title}
                </div>

                <div className="feature-desc">
                  {item.desc}
                </div>

              </div>

            ))}

          </div>

        </section>

        {/* WHY US */}

        <section className="section">

          <div className="section-head">

            <h2 className="section-title">
              Why companies choose CTMS
            </h2>

            <p className="section-desc">
              Built for speed, productivity, collaboration,
              and scalable internal operations.
            </p>

          </div>

          <div className="why-grid">

            <div className="why-card large">

              <div className="why-badge">
                Unified Workspace
              </div>

              <div className="why-title">
                Stop switching between multiple tools.
              </div>

              <div className="why-desc">
                Chat, tasks, attendance, HR management,
                ticket systems, announcements,
                and collaboration tools —
                all connected inside one elegant platform.
              </div>

            </div>

            <div className="why-card">

              <div className="why-icon">
                ⚡
              </div>

              <div className="why-small-title">
                Real-Time Infrastructure
              </div>

              <div className="why-small-desc">
                Fast updates, live collaboration,
                synchronized workflows,
                and instant communication.
              </div>

            </div>

            <div className="why-card">

              <div className="why-icon">
                🔒
              </div>

              <div className="why-small-title">
                Enterprise Security
              </div>

              <div className="why-small-desc">
                Authentication, permissions,
                audit logs, secure workspaces,
                and protected collaboration.
              </div>

            </div>

            <div className="why-card">

              <div className="why-icon">
                📈
              </div>

              <div className="why-small-title">
                Productivity Analytics
              </div>

              <div className="why-small-desc">
                Understand employee activity,
                attendance, workflows,
                and operational performance.
              </div>

            </div>

            <div className="why-card">

              <div className="why-icon">
                🧩
              </div>

              <div className="why-small-title">
                Scalable Architecture
              </div>

              <div className="why-small-desc">
                Designed for startups,
                remote teams, agencies,
                and modern enterprises.
              </div>

            </div>

          </div>

        </section>

        {/* WORKFLOW */}

        <section className="workflow-section">

          <div className="section-head">

            <h2 className="section-title">
              Simplify your workflow
            </h2>

            <p className="section-desc">
              Manage communication, operations,
              attendance, and productivity
              inside one connected ecosystem.
            </p>

          </div>

          <div className="workflow-wrap">

            <div className="workflow-step">
              <div className="workflow-number">
                01
              </div>

              <div className="workflow-name">
                Create Workspace
              </div>

              <div className="workflow-desc">
                Set up your organization and invite team members.
              </div>
            </div>

            <div className="workflow-line"></div>

            <div className="workflow-step">
              <div className="workflow-number">
                02
              </div>

              <div className="workflow-name">
                Organize Teams
              </div>

              <div className="workflow-desc">
                Create departments, channels, and workflows.
              </div>
            </div>

            <div className="workflow-line"></div>

            <div className="workflow-step">
              <div className="workflow-number">
                03
              </div>

              <div className="workflow-name">
                Manage Operations
              </div>

              <div className="workflow-desc">
                Handle tasks, attendance, tickets, and collaboration.
              </div>
            </div>

            <div className="workflow-line"></div>

            <div className="workflow-step">
              <div className="workflow-number">
                04
              </div>

              <div className="workflow-name">
                Scale Faster
              </div>

              <div className="workflow-desc">
                Grow with centralized workflows and visibility.
              </div>
            </div>

          </div>

        </section>

        {/* STATS */}

        <section className="stats-section">

          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-number">
                99.9%
              </div>

              <div className="stat-text">
                Workspace uptime
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-number">
                10x
              </div>

              <div className="stat-text">
                Faster collaboration
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-number">
                All-In-One
              </div>

              <div className="stat-text">
                Company operating system
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-number">
                Secure
              </div>

              <div className="stat-text">
                Enterprise-grade infrastructure
              </div>
            </div>

          </div>

        </section>

        {/* TESTIMONIALS */}

        <section className="section">

          <div className="section-head">

            <h2 className="section-title">
              Teams love using CTMS
            </h2>

            <p className="section-desc">
              Elegant, modern, and built for efficient collaboration.
            </p>

          </div>

          <div className="testimonial-grid">

            <div className="testimonial-card">

              <div className="testimonial-text">
                “CTMS replaced multiple tools for our organization.
                Communication and workflows became dramatically easier.”
              </div>

              <div className="testimonial-user">

                <div className="testimonial-avatar">
                  RK
                </div>

                <div>
                  <div className="testimonial-name">
                    Rahul Kumar
                  </div>

                  <div className="testimonial-role">
                    Product Manager
                  </div>
                </div>

              </div>

            </div>

            <div className="testimonial-card">

              <div className="testimonial-text">
                “The interface feels premium and modern.
                Attendance and collaboration are finally centralized.”
              </div>

              <div className="testimonial-user">

                <div className="testimonial-avatar">
                  PS
                </div>

                <div>
                  <div className="testimonial-name">
                    Priya Sharma
                  </div>

                  <div className="testimonial-role">
                    HR Lead
                  </div>
                </div>

              </div>

            </div>

            <div className="testimonial-card">

              <div className="testimonial-text">
                “Fast, organized, and scalable.
                Our operations became much smoother after moving to CTMS.”
              </div>

              <div className="testimonial-user">

                <div className="testimonial-avatar">
                  AV
                </div>

                <div>
                  <div className="testimonial-name">
                    Aakash Verma
                  </div>

                  <div className="testimonial-role">
                    Founder
                  </div>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="cta">

          <div className="cta-box">

            <h2 className="cta-title">
              Everything your company needs.
              <br />
              One workspace.
            </h2>

            <p className="cta-desc">
              Centralize communication, employee management,
              attendance, collaboration, and productivity
              into a single elegant platform.
            </p>

            <button
              className="btn btn-gold hero-btn"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>

          </div>

        </section>

        {/* FOOTER */}

        <footer className="footer">

          <div className="footer-left">
            © 2026 CTMS workspace. All rights reserved.
          </div>

          <div className="footer-links">
            <span>Privacy</span>
            <span>Security</span>
            <span>Terms</span>
            <span>Support</span>
          </div>

        </footer>

      </div>
    </>
  );
}