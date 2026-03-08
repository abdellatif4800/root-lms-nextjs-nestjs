"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import "@repo/ui/styles.css";

export default function Home() {
  const [text, setText] = useState("");
  const [showCards, setShowCards] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const fullText = "WELCOME_TO_ROOT_LMS...";

  // Typewriter
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowCards(true), 300);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Random glitch bursts on the title
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 150);
      }
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="home-root" style={{ background: "transparent" }}>

      {/* Ambient glow orbs */}
      <div className="home-orb home-orb-teal" />
      <div className="home-orb home-orb-emerald" />

      <div className="home-content">

        {/* Header */}
        <div className="home-header">
          <div className="home-title-wrap">
            <h1 className={`home-title text-center${glitch ? " is-glitch" : ""}`}>
              {/* On small screens the title splits into two lines at the underscore before LMS */}
              <span className="inline sm:hidden">
                {text.slice(0, 11)}
                {text.length > 11 && <br />}
                {text.slice(11)}
              </span>
              <span className="hidden sm:inline">
                {text}
              </span>
              <span className="home-cursor" />
            </h1>
          </div>
        </div>

        {/* Cards */}
        <div className={`home-cards-grid${showCards ? " is-visible" : ""}`}>

          {/* Free Tutorials */}
          <Link href="/tutorials/list" style={{ textDecoration: "none" }}>
            <div className="home-card home-card-teal">
              <div className="home-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M8 7h6" /><path d="M8 11h8" />
                </svg>
              </div>
              <h2 className="home-card-title">Free Tutorials</h2>
              <p className="home-card-desc">Open Source<br />Knowledge Base</p>
              <div className="home-card-progress">
                <div className="home-card-progress-fill" />
              </div>
              <button className="home-card-btn">Initialize_Access</button>
            </div>
          </Link>

          {/* Roadmaps */}
          <Link href="/roadmaps" style={{ textDecoration: "none" }}>
            <div className="home-card home-card-emerald">
              <div className="home-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 17l4-8 4 4 4-6 4 10" />
                  <path d="M3 21h18" />
                </svg>
              </div>
              <h2 className="home-card-title">Roadmaps</h2>
              <p className="home-card-desc">System Career<br />Paths</p>
              <div className="home-card-progress">
                <div className="home-card-progress-fill" />
              </div>
              <button className="home-card-btn">Execute_Path</button>
            </div>
          </Link>

        </div>

        {/* Stats Bar */}
        <div className="home-stats">
          <div className="home-stat-item">
            <span className="home-stat-val">248</span>
            <span className="home-stat-label">Modules</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat-item">
            <span className="home-stat-val home-stat-val-emerald">12</span>
            <span className="home-stat-label">Roadmaps</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat-item">
            <span className="home-stat-val">FREE</span>
            <span className="home-stat-label">Access</span>
          </div>
        </div>

      </div>
    </div>
  );
}
