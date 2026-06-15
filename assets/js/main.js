(() => {
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  const setNavState = (open) => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    nav.classList.toggle("open", open);
    body.classList.toggle("nav-open", open);
  };

  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setNavState(open);
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavState(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) setNavState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNavState(false);
  });

  window.addEventListener("pageshow", () => setNavState(false));

  window.addEventListener(
    "scroll",
    () => header?.classList.toggle("scrolled", window.scrollY > 8),
    { passive: true }
  );

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const revealItems = [...document.querySelectorAll(".reveal")];

  const showRevealItem = (item) => {
    item.classList.add("is-visible");
    item.classList.remove("reveal-pending");
  };

  const isNearViewport = (item) => {
    const rect = item.getBoundingClientRect();
    return rect.bottom >= -40 && rect.top <= window.innerHeight * 1.15;
  };

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          showRevealItem(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.04, rootMargin: "0px 0px 90px 0px" }
    );

    revealItems.forEach((item) => {
      if (isNearViewport(item)) {
        showRevealItem(item);
      } else {
        item.classList.add("reveal-pending");
        revealObserver.observe(item);
      }
    });

    /* Safari geri/ileri önbelleği veya sekme geri yüklemesinde güvenlik ağı. */
    const revealVisibleItems = () => {
      revealItems.forEach((item) => {
        if (isNearViewport(item)) showRevealItem(item);
      });
    };

    window.addEventListener("pageshow", revealVisibleItems);
    window.addEventListener("orientationchange", revealVisibleItems);
    setTimeout(revealVisibleItems, 700);
    setTimeout(revealVisibleItems, 1800);
  } else {
    revealItems.forEach(showRevealItem);
  }

  // Etkinlik filtreleri
  const filterButtons = document.querySelectorAll("[data-event-filter]");
  const eventCards = document.querySelectorAll("[data-branch]");
  const emptyState = document.querySelector("[data-event-empty]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.eventFilter;
      let visibleCount = 0;

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      eventCards.forEach((card) => {
        const visible = filter === "all" || card.dataset.branch === filter;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      if (emptyState) emptyState.hidden = visibleCount > 0;
    });
  });

  // Etkinlik butonlarından indirilebilir .ics takvim dosyaları oluşturur.
  const toast = document.querySelector("[data-toast]");
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  };

  const escapeICS = (value = "") =>
    value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");

  document.querySelectorAll("[data-calendar-title]").forEach((button) => {
    button.addEventListener("click", () => {
      const title = escapeICS(button.dataset.calendarTitle);
      const start = button.dataset.calendarStart;
      const end = button.dataset.calendarEnd;
      const location = escapeICS(button.dataset.calendarLocation);
      const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//kantin.//Events//TR",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `UID:${Date.now()}@kantin.pub`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${title}`,
        `LOCATION:${location}`,
        "DESCRIPTION:savor the sip\\, share the bite.",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${button.dataset.calendarTitle.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.ics`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showToast("Etkinlik takvim dosyası indirildi.");
    });
  });

  // Sayfa kaydırılırken etkin menü kategorisini belirler.
  const menuLinks = [...document.querySelectorAll(".menu-nav a")];
  const menuSections = [...document.querySelectorAll(".menu-category")];

  if (menuLinks.length && menuSections.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        menuLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.05, 0.2, 0.5] }
    );

    menuSections.forEach((section) => sectionObserver.observe(section));
  }
})();
