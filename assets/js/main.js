const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

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
