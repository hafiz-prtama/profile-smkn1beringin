import React, { useEffect, useRef, useState } from "react";

/**
 * Animasi elemen saat masuk viewport.
 * once=true membuat animasi hanya berjalan sekali agar halaman terasa stabil.
 */
export default function ScrollReveal({
  children,
  animation = "up",
  delay = 0,
  duration,
  threshold = 0.16,
  className = "",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  const style = {
    "--reveal-delay": `${delay}ms`,
    ...(duration ? { "--reveal-duration": `${duration}ms` } : {}),
  };

  return (
    <div
      ref={ref}
      className={`scroll-reveal scroll-reveal--${animation} ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}
