(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("yr").textContent = new Date().getFullYear();

  // 1. Split the hero title into letters that rise in one by one
  document.querySelectorAll("[data-split]").forEach(el => {
    el.setAttribute("aria-label", el.dataset.split);
    el.innerHTML = [...el.dataset.split].map((ch, i) =>
      `<span class="ch" aria-hidden="true" style="animation-delay:${0.15 + i * 0.07}s">${ch}</span>`
    ).join("");
  });

  // 2. Floating petals
  if (!reduce) {
    const layer = document.querySelector(".petals");
    const count = window.innerWidth < 760 ? 10 : 20;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "petal";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 14 + Math.random() * 16 + "s";
      p.style.animationDelay = -Math.random() * 20 + "s";
      p.style.transform = `scale(${0.5 + Math.random() * 0.9})`;
      layer.appendChild(p);
    }
  }

  // 3. Scroll reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 0.08 + "s";
    io.observe(el);
  });

  // 4. Tilt on hover for tiles and the paper panel
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".tile, .paper").forEach(card => {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });

    // 5. Cursor glow follows the mouse
    const glow = document.querySelector(".cursor-glow");
    window.addEventListener("pointermove", e => {
      glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    });
  }

  // 6. Gallery filters
  const buttons = document.querySelectorAll(".filters button");
  const tiles = document.querySelectorAll(".tile");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      tiles.forEach(t => t.classList.toggle("hidden", f !== "all" && t.dataset.cat !== f));
    });
  });

  // 7. Contact form: show a thank-you message without leaving the page
  const form = document.querySelector(".form");
  form.addEventListener("submit", async e => {
    if (form.action.includes("YOUR_FORM_ID")) {
      e.preventDefault();
      alert("Set your Formspree form ID in index.html first.");
      return;
    }
    e.preventDefault();
    const res = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    form.innerHTML = res.ok
      ? "<p class='script'>thank you, your message is on its way 🦋</p>"
      : "<p class='muted'>Something went wrong. Please try again.</p>";
  });
})();
