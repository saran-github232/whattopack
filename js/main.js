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
})();
