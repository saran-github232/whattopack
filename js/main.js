(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header scroll state
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile drawer
  const navToggle = document.getElementById("navToggle");
  const drawer = document.getElementById("mobileDrawer");
  const closeDrawer = () => {
    drawer.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
  };
  navToggle.addEventListener("click", () => {
    const open = drawer.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    drawer.setAttribute("aria-hidden", String(!open));
  });
  drawer.setAttribute("aria-hidden", "true");
  drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  // Scroll reveal
  if ("IntersectionObserver" in window && !reducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    window.setTimeout(() => {
      document.querySelectorAll("[data-reveal]:not(.in-view)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.1) el.classList.add("in-view");
      });
    }, 250);
  } else {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("in-view"));
  }

  // Screens showcase tabs
  const tabs = document.querySelectorAll("#showcaseTabs .showcase-tab");
  const screens = document.querySelectorAll(".showcase-phone img");
  const previousButton = document.getElementById("showcasePrev");
  const nextButton = document.getElementById("showcaseNext");
  const showcaseCount = document.getElementById("showcaseCount");
  let activeScreenIndex = 0;
  const selectScreen = (index) => {
    activeScreenIndex = (index + tabs.length) % tabs.length;
    const selectedTab = tabs[activeScreenIndex];
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === activeScreenIndex;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    screens.forEach((img) => {
      const active = img.dataset.screen === selectedTab.dataset.target;
      img.classList.toggle("active", active);
      img.setAttribute("aria-hidden", String(!active));
    });
    if (showcaseCount) showcaseCount.textContent = `${String(activeScreenIndex + 1).padStart(2, "0")} / ${String(tabs.length).padStart(2, "0")}`;
  };
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => selectScreen([...tabs].indexOf(tab)));
  });
  previousButton?.addEventListener("click", () => selectScreen(activeScreenIndex - 1));
  nextButton?.addEventListener("click", () => selectScreen(activeScreenIndex + 1));
  let touchStartX = null;
  const showcasePhone = document.querySelector(".showcase-phone");
  showcasePhone?.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });
  showcasePhone?.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 40) selectScreen(activeScreenIndex + (distance < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });
  selectScreen(0);

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    btn.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", String(!isOpen));
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  // Magnetic primary CTA (desktop pointer only)
  const magnetic = document.getElementById("magneticBtn");
  if (magnetic && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion) {
    magnetic.addEventListener("mousemove", (e) => {
      const rect = magnetic.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      magnetic.style.setProperty("--mx", `${x * 0.18}px`);
      magnetic.style.setProperty("--my", `${y * 0.35}px`);
    });
    magnetic.addEventListener("mouseleave", () => {
      magnetic.style.setProperty("--mx", "0px");
      magnetic.style.setProperty("--my", "0px");
    });
  }

  // Depth parallax on the hero scene (desktop pointer only)
  const heroScene = document.querySelector(".hero");
  if (heroScene && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion) {
    const layers = heroScene.querySelectorAll("[data-depth]");
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    heroScene.addEventListener("mousemove", (e) => {
      const rect = heroScene.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
    });
    heroScene.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;
    });
    const drift = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth) || 0;
        layer.style.transform = `translate3d(${(-currentX * depth).toFixed(2)}px, ${(-currentY * depth).toFixed(2)}px, 0)`;
      });
      requestAnimationFrame(drift);
    };
    drift();
  }

  // Typewriter loop on the checklist card destination (starts when scrolled into view)
  const twLine = document.querySelector(".tw-line");
  const twText = document.querySelector(".tw-text");
  if (twLine && twText && !reducedMotion && "IntersectionObserver" in window) {
    const phrases = ["Goa · 4 days", "Tokyo · 8 days", "Reykjavík · 5 days"];
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const runTypewriter = async () => {
      for (let p = 0; ; p++) {
        const phrase = phrases[p % phrases.length];
        twLine.classList.add("typing");
        for (let i = 1; i <= phrase.length; i++) {
          twText.textContent = phrase.slice(0, i);
          await sleep(62 * (phrase[i - 1] === " " ? 1.7 : 1) * (0.6 + Math.random() * 0.8));
        }
        twLine.classList.remove("typing");
        await sleep(2100);
        twLine.classList.add("typing");
        for (let i = phrase.length - 1; i >= 0; i--) {
          twText.textContent = phrase.slice(0, i);
          await sleep(26);
        }
      }
    };
    const twIo = new IntersectionObserver((entries, obs) => {
      if (entries.some((e) => e.isIntersecting)) {
        obs.disconnect();
        runTypewriter();
      }
    }, { threshold: 0.4 });
    twIo.observe(twLine.closest(".checklist-card"));
  }
})();
