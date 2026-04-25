/* Om Gupta — portfolio v2026 · vanilla JS */

(() => {
  // Year stamp
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ----------------------------------------------------------
     Reveal on scroll
  ---------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    ".section, .hero__title, .hero__sub, .terminal, .hero__ctas, .stats, .project, .timeline__item, .bento__card, .card"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ----------------------------------------------------------
     Animated stat counters
  ---------------------------------------------------------- */
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animateNum = (el) => {
    const target = parseInt(el.dataset.target || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1300;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      const current = Math.floor(target * eased);
      el.textContent = current.toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString() + suffix;
    };
    requestAnimationFrame(tick);
  };

  const numEls = document.querySelectorAll(".stats__num");
  if ("IntersectionObserver" in window) {
    const numIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNum(entry.target);
            numIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    numEls.forEach((el) => numIO.observe(el));
  } else {
    numEls.forEach((el) => animateNum(el));
  }

  /* ----------------------------------------------------------
     Rotating "currently" line in the terminal
  ---------------------------------------------------------- */
  const rotator = document.querySelector(".rotator");
  if (rotator) {
    let words = [];
    try {
      words = JSON.parse(rotator.dataset.words || "[]");
    } catch (e) {
      words = [];
    }
    if (words.length > 1) {
      let i = 0;
      let phase = "type";
      let chars = words[0].length;

      const tick = () => {
        const word = words[i];
        if (phase === "type") {
          chars = Math.min(word.length, chars + 1);
          rotator.textContent = word.slice(0, chars);
          if (chars === word.length) {
            phase = "hold";
            return setTimeout(tick, 1800);
          }
          return setTimeout(tick, 38);
        }
        if (phase === "hold") {
          phase = "delete";
          return setTimeout(tick, 30);
        }
        // delete
        chars = Math.max(0, chars - 1);
        rotator.textContent = word.slice(0, chars);
        if (chars === 0) {
          i = (i + 1) % words.length;
          phase = "type";
          return setTimeout(tick, 200);
        }
        return setTimeout(tick, 22);
      };

      // Kick off after a short pause so the initial word is readable.
      setTimeout(() => {
        phase = "delete";
        tick();
      }, 1600);
    }
  }

  /* ----------------------------------------------------------
     Spotlight cursor on project cards
  ---------------------------------------------------------- */
  document.querySelectorAll(".project").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });
  });

  /* ----------------------------------------------------------
     Smooth scroll for in-page anchors (respects reduced motion)
  ---------------------------------------------------------- */
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });
})();
