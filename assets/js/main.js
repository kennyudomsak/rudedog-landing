// .reveal is now a layout marker only; CSS keeps it visible by default
// so content can never get stuck hidden. We previously had a fade-in
// animation driven by IntersectionObserver, but on instant/programmatic
// scrolls the observer would miss elements and leave sections blank.

document.querySelectorAll('a[href*="shopee"]').forEach((link) => {
  link.addEventListener("click", () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "rudedog_shopee_click",
      label: link.textContent.trim(),
      url: link.href
    });
  });
});

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = form.querySelector("textarea")?.value.trim();
    const body = message || "สวัสดีครับ สนใจติดต่อ RUDEDOG";
    const subject = "ติดต่อ RUDEDOG จากเว็บไซต์";
    const mailto = new URL("mailto:Ken.udomsak@rdbox.co");

    mailto.searchParams.set("subject", subject);
    mailto.searchParams.set("body", body);
    window.location.href = mailto.toString();
  });
});

document.querySelectorAll("[data-instagram-feed]").forEach(async (feed) => {
  const sources = [feed.dataset.feedSrc, feed.dataset.feedFallbackSrc].filter(Boolean);
  const image = feed.querySelector("[data-ig-image]");
  const link = feed.querySelector("[data-ig-link]");
  const tag = feed.querySelector("[data-ig-tag]");
  const title = feed.querySelector("[data-ig-title]");
  const caption = feed.querySelector("[data-ig-caption]");
  const thumbs = feed.querySelector("[data-ig-thumbs]");
  let items = [];
  let activeIndex = 0;

  const setActive = (index) => {
    if (!items.length) return;

    activeIndex = index % items.length;
    const item = items[activeIndex];

    image.src = item.image;
    image.alt = item.alt || item.title || "#rudedog";
    link.href = item.url || "https://www.instagram.com/explore/tags/rudedog/";
    tag.textContent = item.tag || "#rudedog";
    title.textContent = item.title || "RUDEDOG LIVE";
    caption.textContent = item.caption || "ภาพล่าสุดจากคนในแพ็ก";

    thumbs.querySelectorAll(".ig-thumb").forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === activeIndex);
    });
  };

  for (const source of sources) {
    try {
      const response = await fetch(source, { cache: "no-store" });
      if (!response.ok) continue;

      const data = await response.json();
      items = (data.items || []).filter((item) => item.image);
      if (items.length) break;
    } catch (error) {
      items = [];
    }
  }

  if (!items.length) return;

  thumbs.innerHTML = items.slice(0, 4).map((item, index) => `
    <button class="ig-thumb" type="button" aria-label="ดูภาพ ${item.title || "#rudedog"}" data-ig-index="${index}">
      <img src="${item.image}" alt="${item.alt || item.title || "#rudedog"}">
    </button>
  `).join("");

  thumbs.querySelectorAll("[data-ig-index]").forEach((button) => {
    button.addEventListener("click", () => {
      setActive(Number(button.dataset.igIndex));
    });
  });

  setActive(0);
  window.setInterval(() => setActive(activeIndex + 1), 5600);
});

(() => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "เปิดเมนู");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  const open = () => {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "ปิดเมนู");
    nav.classList.add("is-open");
    document.body.classList.add("nav-open");
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    expanded ? close() : open();
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => close());
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  const mq = window.matchMedia("(min-width: 901px)");
  mq.addEventListener("change", (e) => {
    if (e.matches) close();
  });
})();

(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;
  const threshold = 6;
  const topZone = 80;

  const update = () => {
    const y = window.scrollY;
    const delta = y - lastY;

    if (y <= topZone) {
      header.classList.remove("is-hidden");
      header.classList.remove("is-pinned");
    } else {
      header.classList.add("is-pinned");
      if (document.body.classList.contains("nav-open")) {
        // never hide while drawer is open
      } else if (delta > threshold) {
        header.classList.add("is-hidden");
      } else if (delta < -threshold) {
        header.classList.remove("is-hidden");
      }
    }

    lastY = y;
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();
