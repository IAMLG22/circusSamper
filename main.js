/* =============================================================
   SPAGHETTERÍA CIRCUS — main.js
   Patrón IIFE (sin módulos ES) para que funcione con doble clic,
   por FTP y en Hostinger sin configuración.
   Cada init va aislado en safe() para que un fallo no rompa el resto.
   ============================================================= */
(function () {
  "use strict";

  const data = window.__BRAND__ || {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Helpers ---------- */
  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  const escHTML = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }

  // Placeholder de foto reutilizable (mientras no haya imágenes reales)
  // Para sustituir por foto real: reemplaza este HTML por <img src="assets/img/xxx.webp" ...>
  function phImg(hint) {
    return `<div class="ph-img" role="img" aria-label="${escHTML(hint || "Foto pendiente")}">
      <span><span class="ph-ico" aria-hidden="true">◆</span><br>${escHTML(hint || "FOTO pendiente")}</span>
    </div>`;
  }

  /* =============================================================
     TELÓN de apertura (solo Home) — desactivable tras 1ª visita
     ============================================================= */
  function initTelon() {
    const telon = $("[data-telon]");
    if (!telon) return;

    // Si ya lo vio antes, o reduced-motion, no lo mostramos
    let visto = false;
    try { visto = localStorage.getItem("circus_telon") === "1"; } catch (_) {}
    if (visto || reduced) { telon.classList.add("is-done"); return; }

    // Abrir el telón tras un instante
    document.body.style.overflow = "hidden";
    setTimeout(() => telon.classList.add("is-open"), 900);
    // Retirarlo del flujo y desbloquear scroll
    setTimeout(() => {
      telon.classList.add("is-done");
      document.body.style.overflow = "";
      try { localStorage.setItem("circus_telon", "1"); } catch (_) {}
    }, 2200);

    // Seguridad: si algo falla, se retira igual
    setTimeout(() => {
      telon.classList.add("is-done");
      document.body.style.overflow = "";
    }, 4000);
  }

  /* =============================================================
     NAV móvil (hamburguesa) + sombra al hacer scroll
     ============================================================= */
  function initNav() {
    const nav = $("[data-nav]");
    const toggle = $("[data-nav-toggle]");
    const header = $(".site-header");

    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      // Cerrar al pulsar un enlace
      $$("a", nav).forEach(a => a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }));
    }

    if (header) {
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  /* =============================================================
     WIDGET "Abierto ahora / Cerrado" — calculado en vivo
     ============================================================= */
  function toMin(hhmm) { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; }

  function estadoAhora() {
    const hours = data.hours || {};
    const now = new Date();
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    const franjas = hours[day] || [];
    for (const [ini, fin] of franjas) {
      if (mins >= toMin(ini) && mins < toMin(fin)) {
        return { abierto: true, cierra: fin };
      }
    }
    // Buscar próxima apertura (hoy o siguientes días)
    for (let i = 0; i < 7; i++) {
      const d = (day + i) % 7;
      const fr = hours[d] || [];
      for (const [ini] of fr) {
        if (i === 0 && mins >= toMin(ini)) continue; // ya pasó hoy
        const nombres = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const cuando = i === 0 ? "hoy" : (i === 1 ? "mañana" : "el " + nombres[d]);
        return { abierto: false, abre: ini, cuando };
      }
    }
    return { abierto: false };
  }

  function initEstado() {
    const els = $$("[data-estado]");
    if (!els.length) return;
    const st = estadoAhora();
    els.forEach(el => {
      el.classList.toggle("is-abierto", st.abierto);
      el.classList.toggle("is-cerrado", !st.abierto);
      const txt = st.abierto
        ? `Abierto ahora · hasta las ${st.cierra}`
        : (st.abre ? `Cerrado · abre ${st.cuando} a las ${st.abre}` : "Cerrado ahora");
      el.innerHTML = `<span class="punto" aria-hidden="true"></span><span>${escHTML(txt)}</span>`;
    });
  }

  /* =============================================================
     MOUNT: platos estrella (Home) desde el manifest
     ============================================================= */
  function mountStars() {
    const target = $("[data-stars]");
    if (!target || target.dataset.mounted || !data.stars) return;
    target.dataset.mounted = "1";
    target.innerHTML = data.stars.map((p, i) => `
      <article class="plato-card reveal reveal-delay-${(i % 3) + 1}">
        <div class="plato-media">
          ${phImg(p.photoHint)}
          ${p.badge ? `<span class="plato-badge">${escHTML(p.badge)}</span>` : ""}
          <span class="plato-precio">${escHTML(p.price)} €</span>
        </div>
        <div class="plato-body">
          <h3>${escHTML(p.name)}</h3>
          <p>${escHTML(p.desc)}</p>
        </div>
      </article>
    `).join("");
    // Re-observamos los nuevos .reveal
    observeReveals(target);
  }

  /* =============================================================
     MOUNT: carta completa (carta.html) desde el manifest
     ============================================================= */
  function mountMenu() {
    const target = $("[data-menu]");
    if (!target || target.dataset.mounted || !data.menu) return;
    target.dataset.mounted = "1";
    const nums = ["I", "II", "III", "IV", "V"];
    target.innerHTML = data.menu.map((acto, ai) => {
      const items = acto.items.map(it => {
        const photo = it.star ? `<div class="menu-photo">${phImg(it.photoHint)}</div>` : "";
        return `
          <div class="menu-item ${it.star ? "has-photo" : ""}">
            ${photo}
            <h3>${escHTML(it.name)} ${it.star ? '<span class="star-mark" aria-hidden="true">★</span>' : ""}</h3>
            <span class="menu-price">${escHTML(it.price)} €</span>
            ${it.desc ? `<p class="menu-desc">${escHTML(it.desc)}</p>` : ""}
          </div>`;
      }).join("");
      return `
        <section class="acto reveal" data-acto>
          <button class="acto-toggle" data-acto-toggle aria-expanded="true">
            <span class="acto-head" style="flex:1">
              <span class="acto-num">${nums[ai] || (ai + 1)}</span>
              <span>
                <span class="h2" style="display:block;color:var(--granate)">${escHTML(acto.act)}</span>
                <span class="acto-sub">${escHTML(acto.subtitle || "")}</span>
              </span>
            </span>
            <span class="chevron" aria-hidden="true">▾</span>
          </button>
          <div class="menu-list" data-acto-panel>${items}</div>
        </section>`;
    }).join("");
    observeReveals(target);
    initAcordeon();
  }

  /* =============================================================
     ACORDEÓN de la carta (colapsable en móvil)
     ============================================================= */
  function initAcordeon() {
    // Acordeón dirigido por CSS: la clase .is-collapsed solo oculta el panel
    // en móvil (media query). En escritorio no tiene efecto visual, así que
    // el estado sobrevive a los cambios de tamaño de ventana.
    $$("[data-acto-toggle]").forEach((btn, i) => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = "1";
      const acto = btn.closest("[data-acto]") || btn.parentElement;
      // Estado inicial: colapsado salvo el primer acto (solo se nota en móvil)
      if (i !== 0) {
        acto.classList.add("is-collapsed");
        btn.setAttribute("aria-expanded", "false");
      }
      btn.addEventListener("click", () => {
        // Solo funciona como acordeón en móvil; en escritorio se ve todo
        if (!matchMedia("(max-width: 719px)").matches) return;
        const collapsed = acto.classList.toggle("is-collapsed");
        btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
      });
    });
  }

  /* =============================================================
     REVEAL on scroll (IntersectionObserver + red de seguridad)
     ============================================================= */
  let _io = null;
  function observeReveals(scope) {
    const els = $$(".reveal:not(.is-visible)", scope || document);
    if (!els.length) return;
    if (reduced) { els.forEach(el => el.classList.add("is-visible")); return; }
    if (!_io) {
      _io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add("is-visible"); _io.unobserve(e.target); }
        });
      }, { threshold: 0.04, rootMargin: "0px 0px -4% 0px" });
    }
    els.forEach(el => _io.observe(el));
  }
  function initReveals() {
    observeReveals(document);
    // Red de seguridad: a los 6s, revelar lo que siga oculto y esté en pantalla
    setTimeout(() => {
      $$(".reveal:not(.is-visible)").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.2) el.classList.add("is-visible");
      });
    }, 6000);
  }

  /* =============================================================
     SMOOTH SCROLL para anclas (#) con offset del header
     ============================================================= */
  function initSmoothScroll() {
    document.addEventListener("click", e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 72;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - navH - 12,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  /* =============================================================
     PARALLAX suave del hero (solo si hay GSAP)
     ============================================================= */
  function initHeroParallax() {
    const media = $(".hero-media");
    if (!media || reduced) return;
    gsap.to(media, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 }
    });
  }

  /* =============================================================
     Rellenar datos de contacto/horarios desde el manifest
     (footer y páginas). Marcados con data-fill.
     ============================================================= */
  function fillData() {
    const c = data.contact || {};
    const map = {
      "phone": c.phone,
      "email": c.email,
      "address": c.address,
      "city": c.city,
      "instagram": "@" + (c.instagram || "")
    };
    $$("[data-fill]").forEach(el => {
      const key = el.getAttribute("data-fill");
      if (map[key]) el.textContent = map[key];
    });
    // Prueba social (placeholder)
    const sp = data.social_proof || {};
    $$("[data-rating]").forEach(el => { el.textContent = sp.rating; });
    $$("[data-reviews]").forEach(el => { el.textContent = sp.reviews; });
  }

  /* =============================================================
     BOOT
     ============================================================= */
  function boot() {
    safe(fillData, "fillData");
    safe(mountStars, "mountStars");
    safe(mountMenu, "mountMenu");
    safe(initTelon, "initTelon");
    safe(initNav, "initNav");
    safe(initEstado, "initEstado");
    safe(initReveals, "initReveals");
    safe(initSmoothScroll, "initSmoothScroll");
    safe(initAcordeon, "initAcordeon");

    // Actualizar estado abierto/cerrado cada minuto
    setInterval(() => safe(initEstado, "initEstado"), 60000);

    // Inits que dependen de GSAP (si cargó)
    if (window.gsap && window.ScrollTrigger) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (_) {}
      safe(initHeroParallax, "initHeroParallax");
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  /* =============================================================
     ===== MÓDULOS EXPERIMENTALES (desactivados) =================
     Descomenta para activarlos. No deben estorbar la conversión.
     ============================================================= */

  /* --- (A) "¿No sabes qué pedir?" — tómbola que sortea un plato ---
  function initTombola() {
    const btn = $("[data-tombola]");
    const out = $("[data-tombola-out]");
    if (!btn || !out || !data.menu) return;
    const todos = data.menu.flatMap(a => a.items.filter(i => i.price));
    btn.addEventListener("click", () => {
      let ticks = 0;
      const spin = setInterval(() => {
        const p = todos[Math.floor(Math.random() * todos.length)];
        out.textContent = p.name;
        if (++ticks > 18) {
          clearInterval(spin);
          out.classList.add("is-final");
        }
      }, 80);
    });
  }
  safe(initTombola, "initTombola");
  */

  /* --- (B) Scroll narrativo 1997→hoy con parallax (La Casa) ---
  function initNarrativa() {
    if (!window.gsap || reduced) return;
    $$("[data-tl-parallax]").forEach(el => {
      gsap.from(el, {
        y: 60, opacity: 0,
        scrollTrigger: { trigger: el, start: "top 85%", end: "top 50%", scrub: true }
      });
    });
  }
  // if (window.gsap && window.ScrollTrigger) safe(initNarrativa, "initNarrativa");
  */

})();
