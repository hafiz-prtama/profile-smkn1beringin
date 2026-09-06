"use client";

import React, { useState, useEffect, useRef } from "react";

export default function IntroPreloader({ onComplete, onStartReveal }) {
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState("counting"); // 'counting' | 'shifting' | 'complete'
  const hasTriggeredReveal = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onStartRevealRef = useRef(onStartReveal);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onStartRevealRef.current = onStartReveal;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("intro-active");

    let animationFrameId;
    let startTime = null;
    const duration = 1800; // 1.8 detik untuk hitungan 0 - 100% yang jelas, dramatis, dan memukau

    // Kurva easing quadratik untuk percepatan yang mulus
    const easeOutQuad = (t) => t * (2 - t);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(rawProgress);
      const currentVal = Math.floor(easedProgress * 100);

      setPercent(currentVal);

      if (rawProgress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setPercent(100);
        setPhase("shifting");
        document.body.classList.add("intro-revealed");

        if (!hasTriggeredReveal.current) {
          hasTriggeredReveal.current = true;
          if (onStartRevealRef.current) onStartRevealRef.current();
        }

        // Durasi transisi elemen meluncur naik dan tirai terangkat
        setTimeout(() => {
          setPhase("complete");
          document.body.style.overflow = originalOverflow;
          document.body.classList.remove("intro-active");
          document.body.classList.remove("intro-revealed");
          if (onCompleteRef.current) onCompleteRef.current();
        }, 950);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove("intro-active");
      document.body.classList.remove("intro-revealed");
    };
  }, []);

  const handleSkip = () => {
    if (phase === "complete") return;
    setPercent(100);
    setPhase("shifting");
    document.body.classList.add("intro-revealed");
    if (!hasTriggeredReveal.current) {
      hasTriggeredReveal.current = true;
      if (onStartRevealRef.current) onStartRevealRef.current();
    }
    setTimeout(() => {
      setPhase("complete");
      document.body.style.overflow = "";
      document.body.classList.remove("intro-active");
      document.body.classList.remove("intro-revealed");
      if (onCompleteRef.current) onCompleteRef.current();
    }, 400);
  };

  if (phase === "complete") return null;

  const brandWords = ["SMKN", "1", "BERINGIN"];

  return (
    <div
      className={`intro-preloader ${
        phase === "shifting" ? "intro-preloader--shifting" : ""
      }`}
      aria-hidden={phase === "complete"}
    >
      {/* Tirai penutup atas dan bawah */}
      <div className="intro-curtain intro-curtain--bg" />
      <div className="intro-curtain intro-curtain--accent" />

      {/* Grid Pattern */}
      <div className="intro-grid-pattern" />

      <div className="intro-stage">
        {/* Bar atas */}
        <div className="intro-header-bar">
          <div className="intro-pill">
            <span className="intro-pulse-dot" />
            <span className="intro-pill-text">SMK PUSAT KEUNGGULAN</span>
          </div>
          <div className="intro-loc-text">DELI SERDANG · SUMATERA UTARA</div>
        </div>

        {/* Brand besar di tengah yang akan meluncur naik saat 100% */}
        <div className="intro-hero-logo-box">
          <div className="intro-emblem-wrap">
            <img
              src="/logo-smk.png"
              alt="Logo SMK Negeri 1 Beringin"
              className="intro-emblem-img"
            />
          </div>
          <div className="intro-huge-title">
            {brandWords.map((word, wIdx) => (
              <span key={wIdx} className="intro-word">
                {word.split("").map((char, cIdx) => (
                  <span
                    key={cIdx}
                    className="intro-char"
                    style={{ animationDelay: `${(wIdx * 4 + cIdx) * 0.035}s` }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </div>
          <p className="intro-sub-line">
            MEMBANGUN GENERASI UNGGUL UNTUK MASA DEPAN
          </p>
        </div>

        {/* Counter besar 0 - 100% di tengah yang sangat jelas */}
        <div className="intro-center-counter">
          <div className="intro-number-row">
            <span className="intro-big-number">{percent}</span>
            <span className="intro-percent-symbol">%</span>
          </div>
          <div className="intro-line-track">
            <div
              className="intro-line-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Footer info preloader */}
        <div className="intro-footer-bar">
          <span className="intro-status-msg">
            {percent < 100
              ? "MEMPERSIAPKAN PENGALAMAN DIGITAL..."
              : "SISTEM SIAP · MEMBUKA HALAMAN"}
          </span>
        </div>
      </div>
    </div>
  );
}
