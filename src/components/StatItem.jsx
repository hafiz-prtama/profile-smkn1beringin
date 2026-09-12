import React, { useState, useEffect, useRef } from "react";

// ─── Hook Number Counter (Animasi Angka) ───────────────────────────────────
export function useNumberCounter(endValue, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let observer;
    const target = parseInt(endValue.toString().replace(/\D/g, "")) || 0;

    if (target === 0) {
      setCount(endValue);
      return;
    }

    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const startAnimation = () => {
              let startTimestamp = null;
              const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                // easeOutQuart
                const easeProgress = 1 - Math.pow(1 - progress, 4);
                setCount(Math.floor(easeProgress * target));
                if (progress < 1) {
                  window.requestAnimationFrame(step);
                }
              };
              window.requestAnimationFrame(step);
            };

            const checkAndStart = () => {
              // Tunggu sampai preloader selesai (kelas intro-active hilang)
              if (document.body.classList.contains("intro-active")) {
                setTimeout(checkAndStart, 200);
              } else {
                // Beri sedikit jeda tambahan setelah animasi naik agar lebih pas
                setTimeout(startAnimation, 300);
              }
            };

            checkAndStart();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }
    }
    return () => observer?.disconnect();
  }, [endValue, duration]);

  const suffix = endValue.toString().replace(/[0-9.]/g, "");
  return {
    count: typeof count === "number" ? count.toLocaleString("id-ID") : count,
    suffix,
    ref,
  };
}

// ─── Komponen Stat Item (Angka Animasi) dengan Tailwind ─────────────────────
export default function StatItem({ icon, value, label }) {
  const { count, suffix, ref } = useNumberCounter(value);
  return (
    <div 
      className="flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-50 transition-transform duration-300 hover:-translate-y-1" 
      ref={ref}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4">
        {icon}
      </div>
      <div className="text-center">
        <strong className="block text-3xl font-extrabold text-slate-800 tracking-tight mb-1">
          {count}{suffix}
        </strong>
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
}
