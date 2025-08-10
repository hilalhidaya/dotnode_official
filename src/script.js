import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
// usa **una** de estas dos según el paquete que tengas instalado:
// import Lenis from "@studio-freight/lenis";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

const lenis = new Lenis({ autoRaf: true, smoothWheel: true, smoothTouch: true });
lenis.on("scroll", () => ScrollTrigger.update());



document.addEventListener("DOMContentLoaded", () => {
  const tl = gsap.timeline({
    delay: 0.3,
    defaults: {
      ease: "hop",
    },
  });

  const counts = document.querySelectorAll(".count");

  counts.forEach((count, index) => {
    const digits = count.querySelectorAll(".digit h1");

    tl.to(
      digits,
      {
        y: "0%",
        duration: 1,
        stagger: 0.075,
      },
      index * 1
    );

    if (index < counts.length) {
      tl.to(
        digits,
        {
          y: "-100%",
          duration: 1,
          stagger: 0.075,
        },
        index * 1 + 1
      );
    }
  });

  tl.to(".spinner", {
    opacity: 0,
    duration: 0.3,
  });

  tl.to(
    ".word h1",
    {
      y: "0%",
      duration: 1,
    },
    "<"
  );

  tl.to(".divider", {
    scaleY: "100%",
    duration: 1,
    onComplete: () =>
      gsap.to(".divider", { opacity: 0, duration: 0.3, delay: 0.3 }),
  });

  tl.to("#word-1 h1", {
    y: "100%",
    duration: 1,
    delay: 0.3,
  });

  tl.to(
    "#word-2 h1",
    {
      y: "-100%",
      duration: 1,
    },
    "<"
  );

  tl.to(
    ".block",
    {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1,
      stagger: 0.1,
      delay: 0.75,
      onStart: () =>
        gsap.to(".hero-img", { scale: 1, duration: 2, ease: "hop" }),
    },
    "<"
  );

  tl.to(
    [".nav", ".line h1", ".line p"],
    {
      y: "0%",
      duration: 1.5,
      stagger: 0.2,
    },
    "<"
  );

  tl.to(
    [".cta", ".cta-icon"],
    {
      scale: 1,
      duration: 1.5,
      stagger: 0.75,
      delay: 0.75,
    },
    "<"
  );

  tl.to(
    ".cta-label p",
    {
      y: "0%",
      duration: 1.5,
      delay: 0.5,

    },
    "<"
  );
  tl.to(".loader", {
    opacity: 0,
    duration: 0.5,
    delay: 0.5,
    onComplete: () => {
      document.querySelector(".loader").style.display = "none";
      document.body.style.overflow = "auto";
    },
  });

});

document.addEventListener("DOMContentLoaded", () => {
  const cards = gsap.utils.toArray(".card");
  if (!cards.length) return;

  const first = cards[0];
  const last  = cards[cards.length - 1];

  // Pin del bloque .intro durante el recorrido de las cards
  ScrollTrigger.create({
    trigger: first,
    start: "top 35%",
    endTrigger: last,
    end: "top 30%",
    pin: ".intro",
    pinSpacing: false,
  });

  // Efectos por card
  cards.forEach((card, index) => {
    const isLastCard = index === cards.length - 1;
    if (isLastCard) return;

    const cardInner = card.querySelector(".card-inner");
    if (!cardInner) return;

    ScrollTrigger.create({
      trigger: card,
      start: "top 35%",
      endTrigger: ".outro",
      end: "top 65%",
      pin: true,
      pinSpacing: false,
    });

    gsap.to(cardInner, {
      y: `-${(cards.length - index) * 14}vh`,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top 35%",
        endTrigger: ".outro",
        end: "top 65%",
        scrub: true,
      },
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const mm = gsap.matchMedia();

  // ===== DESKTOP (>= 769px): animación suave con pin y snap =====
  mm.add("(min-width: 769px)", () => {
    const cards = gsap.utils.toArray(".issues_card");
    const totalCards = cards.length;
    const reversedCards = [...cards].reverse();

    // Resetea estilos de mobile SOLO en esta sección
    gsap.set(cards, { clearProps: "all" });
    gsap.set(".issues_final", { clearProps: "all" });

    // Estética inicial – abanico
    reversedCards.forEach((card, index) => {
      const angle = index * -10;
      gsap.set(card, { rotate: angle, zIndex: totalCards - index });
    });

    // Duración total en función del número de tarjetas
    // (ajusta los factores si quieres más/menos recorrido)
    const perCardVh = 300; // como tu original
    const extraTailVh = 100; // cola para que la salida no sea abrupta
    const endDistance = (totalCards * perCardVh + extraTailVh) + "vh";

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        id: "issues-desktop",
        trigger: ".issues_area",
        start: "top top",
        end: "+=" + endDistance,
        scrub: 0.8,            // suaviza arrastre
        pin: true,
        anticipatePin: 1,      // evita salto al fijar
        // Snap por segmentos: nº de tarjetas + 1 (la parada final)
        snap: {
          snapTo: (value) => {
            const segments = totalCards + 1;
            return Math.round(value * segments) / segments;
          },
          duration: 0.4,
          ease: "power1.out"
        }
        // pinSpacing por defecto true: deja espacio para salida natural
      }
    });

    // Animación por tarjeta (igual que la tuya, timings idénticos)
    reversedCards.forEach((card, index) => {
      const stepStart = index * 1.5;

      // 1) Enderezar
      tl.to(card, { rotation: 0, ease: "power2.out", duration: 0.2 }, stepStart);

      // 2) Al centro
      tl.to(card, { y: "0vh", ease: "power1.out", duration: 0.5 }, stepStart + 0.2);

      // 3) Pausa de lectura
      tl.to({}, { duration: 0.5 }, stepStart + 0.7);

      // 4) Salida hacia arriba con giro
      tl.to(
        card,
        {
          y: "-120vh",
          rotation: -48,
          transformOrigin: "bottom left",
          ease: "power2.inOut",
          duration: 0.8
        },
        stepStart + 1.2
      );

      // Empuja la final un poco (como tu original)
      tl.to(".issues_final", { y: "-100vh", ease: "none" }, "+=0.5");
    });

    // Pequeña cola para asegurar la liberación suave antes de salir del pin
    tl.to({}, { duration: 0.2 });

    // Limpieza SOLO de lo creado aquí, si cambias de breakpoint
    return () => {
      tl.kill();
      const st = ScrollTrigger.getById("issues-desktop");
      st && st.kill();
      gsap.set(cards, { clearProps: "all" });
      gsap.set(".issues_final", { clearProps: "all" });
    };
  });

  // ===== MOBILE (<= 768px): carrusel horizontal, sin GSAP en esta sección =====
  mm.add("(max-width: 768px)", () => {
    const cards = gsap.utils.toArray(".issues_card");

    // Mata SOLO nuestro trigger de desktop si existiera
    const st = ScrollTrigger.getById("issues-desktop");
    st && st.kill();

    // Limpia transformaciones inline para que funcione el CSS horizontal
    gsap.set(cards, { clearProps: "all" });
    gsap.set(".issues_final", { clearProps: "all" });

    // No hay animación JS en mobile; todo lo maneja tu CSS (scroll-snap)
    return () => {};
  });
});





document.addEventListener("DOMContentLoaded", () => {
  // Inicializar Lenis
  const lenis = new Lenis({
    smooth: true,
    lerp: 1,
    duration: 1.2,
    smoothTouch: false,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  gsap.registerPlugin(ScrollTrigger);

  // SECCIÓN DE PASOS
  const pasosSection = document.querySelector(".pasos_section");
  const pasosHeader = document.querySelector(".pasos_header");
  const pasosCards = document.querySelectorAll(".pasos_card");
  const stickyHeight = window.innerHeight * 5;

  const transforms = [
    [[10, 25, 0, 5], [10, 0, -15, 5]],
    [[0, 20, 0, 5], [-15, 10, -25, 10]],
    [[0, 25, 0, 0], [5, -5, -15, 15]],
    [[0, 15, 15, -10], [10, -5, 15, 0]],
    [[0, 25, 0, 15], [15, -10, 20, 25]],
  ];

  ScrollTrigger.create({
    trigger: pasosSection,
    start: "top top",
    end: `+=${stickyHeight}px`,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      const progress = self.progress;

      const maxTranslate = pasosHeader.offsetWidth - window.innerWidth;
      const translateX = -progress * maxTranslate;
      gsap.set(pasosHeader, { x: translateX });

      pasosCards.forEach((card, index) => {
        const delay = index * 0.1125;
        const cardProgress = Math.max(0, Math.min((progress - delay) * 1.7, 1));

        if (cardProgress > 0) {
          const cardStartX = 25;
          const cardEndX = -650;
          const yPos = transforms[index][0];
          const rotations = transforms[index][1];

          const cardX = gsap.utils.interpolate(
            cardStartX,
            cardEndX,
            cardProgress
          );

          const yProgress = cardProgress * 3;
          const yIndex = Math.min(Math.floor(yProgress), yPos.length - 2);
          const yInterpolation = yProgress - yIndex;
          const cardY = gsap.utils.interpolate(
            yPos[yIndex],
            yPos[yIndex + 1],
            yInterpolation
          );

          const cardRotation = gsap.utils.interpolate(
            rotations[yIndex],
            rotations[yIndex + 1],
            yInterpolation
          );

          gsap.set(card, {
            xPercent: cardX,
            yPercent: cardY,
            rotation: cardRotation,
            opacity: 1,
          });
        } else {
          gsap.set(card, { opacity: 0 });
        }
      });
    },
  });
});


// ANIMACION CATEGORIAS 
document.addEventListener("DOMContentLoaded", () => {
  const categories = document.querySelectorAll(".category");

  categories.forEach((category, i) => {
    // Animación de entrada (cuando aparecen)
    gsap.from(category, {
      scrollTrigger: {
        trigger: category,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: i * 0.1,
      ease: "power2.out",
    });

    // Movimiento constante posterior (floating)
    gsap.to(category, {
      y: "-=10",
      repeat: -1,
      yoyo: true,
      duration: 2 + Math.random(), // variación para que no todas vayan sincronizadas
      ease: "sine.inOut",
    });
  });
});
 
// COLOR DE HOVER CATEGORY 

document.querySelectorAll('.category').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = x - centerX;
    const deltaY = y - centerY;

    const glowColor = getComputedStyle(card).getPropertyValue('--glow-color');

    card.style.boxShadow = `${-deltaX * 0.1}px ${-deltaY * 0.1}px 30px ${glowColor}`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = 'none';
  });
});


// CURSOR PARA ISSUES 
(() => {
  const section = document.querySelector('.issues_final');
  const cursor  = document.querySelector('.issues_cursor');
  if (!section || !cursor) return;

  const RADIUS = 70; // tamaño del círculo (ajusta a tu gusto)

  section.addEventListener('mousemove', (e) => {
    cursor.style.opacity = '1';
    cursor.style.clipPath = `circle(${RADIUS}px at ${e.clientX}px ${e.clientY}px)`;
  });

  section.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });

  section.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
})();


// CURSOR LANDING 
(() => {
  const section = document.querySelector('.section_landing');
  const glow = document.querySelector('.landing-glow');
  if (!section || !glow) return;

  let tx = innerWidth/2, ty = innerHeight/2;
  let x = tx, y = ty;
  const ease = 0.18;

  function loop(){
    x += (tx - x) * ease;
    y += (ty - y) * ease;
    // elemento 1x1: no restamos “-50%”
    glow.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  const show = () => glow.style.opacity = getComputedStyle(document.documentElement).getPropertyValue('--glow-opacity');
  const hide = () => glow.style.opacity = '0';

  section.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; show(); });
  section.addEventListener('mouseenter', show);
  section.addEventListener('mouseleave', hide);
})();

// ANIMACION DE APARICION 

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".fade_in_scroll, .fade_in_right, .fade_in_left");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
});


// TEXTO MAQUINA DE ESCRIBIR 
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".typewriter");

  // Prepara cada elemento
  elements.forEach(el => {
    const text = el.getAttribute("data-text") ?? "";
    el.textContent = "";                 // evita duplicados
    el.dataset.fullText = text;          // guarda el texto definitivo
    // Permite velocidad personalizada por elemento: <h2 class="typewriter" data-text="..." data-speed="40">
    if (!el.dataset.speed) el.dataset.speed = "40";
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      if (el.dataset.started === "1" || el.classList.contains("done")) {
        // ya empezó o terminó -> no repetir
        obs.unobserve(el);
        return;
      }

      el.dataset.started = "1";      // bandera: evita múltiples bucles
      obs.unobserve(el);             // no volver a disparar

      const text = el.dataset.fullText || "";
      const speed = parseInt(el.dataset.speed, 10) || 40;
      let i = 0;

      const type = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          el.classList.add("done");  // marca como completado
        }
      };

      type();
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
});


// CALL TO ACTION 

  document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(".cta_ending_section");
    const mascot  = section?.querySelector(".cta_mascot");
    const cursor  = section?.querySelector(".cta_cursor");
    if (!section || !mascot || !cursor) return;

    /* ===== Cursor solo en esta sección (igual que ya tenías) ===== */
    let targetX = 0, targetY = 0, currX = innerWidth/2, currY = innerHeight/2, rafId = null;
    const lerp = (a,b,t)=>a+(b-a)*t;
    const moveLoop = () => {
      currX = lerp(currX, targetX, 0.18);
      currY = lerp(currY, targetY, 0.18);
      cursor.style.transform = `translate(${currX}px, ${currY}px)`;
      rafId = requestAnimationFrame(moveLoop);
    };
    section.addEventListener("mouseenter", () => {
      section.classList.add("cursor_active");
      if (!rafId) rafId = requestAnimationFrame(moveLoop);
    });
    section.addEventListener("mouseleave", () => {
      section.classList.remove("cursor_active");
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    });
    section.addEventListener("mousemove", (e) => {
      targetX = e.clientX; targetY = e.clientY;
    });

    /* ===== Flotación suave permanente ===== */
    const floatTween = gsap.to(mascot, {
      y: "-=8",
      duration: 2.6,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

    let pathTl = null;

    function buildMascotTimeline() {
      if (pathTl) pathTl.kill();

      const sectionW = section.clientWidth;
      const mascotW  = mascot.clientWidth || 40; // fallback por si aún no mide

      // Recorrido dentro del 90% central
      const usable = sectionW * 0.90;
      const offset = (sectionW - usable) / 2;

      // Márgenes laterales extra para no “besar” el borde
      const pad = Math.max(8, mascotW * 0.15);

      const minX = Math.max(0, offset + pad);
      const maxX = Math.max(minX, offset + usable - pad - mascotW);
      const midX = (minX + maxX) / 2;

      // arranca en minX
      gsap.set(mascot, { x: minX, rotation: 0, scaleX: 1, transformOrigin: "50% 50%" });

      pathTl = gsap.timeline({ repeat: -1, defaults: { ease: "power1.inOut" } });

      pathTl
        // Hacia el centro, lento
        .to(mascot, { x: midX, duration: 4.8, ease: "power2.out" })

        // Mirar lados (ligero translate y rotación para más “vida”)
        .to(mascot, { rotation: 6, x: `+=6`, duration: 0.5 }, "+=0.2")
        .to(mascot, { rotation: -6, x: `-=10`, duration: 0.6 })
        .to(mascot, { rotation: 0, x: `+=4`, duration: 0.4 })
        .to(mascot, { scaleX: -1, duration: 0.25, ease: "power1.inOut" }, "<") // darse la vuelta

        // Pausa flotando
        .to(mascot, { y: "+=5", duration: 1.1, yoyo: true, repeat: 1, ease: "sine.inOut" })

        // Hacia el extremo derecho (sin salirse)
        .to(mascot, { x: maxX, duration: 5.8, ease: "power2.inOut" })

        // Miradas otra vez y preparar vuelta
        .to(mascot, { rotation: -5, x: `-=6`, duration: 0.5 }, "+=0.2")
        .to(mascot, { rotation: 5, x: `+=10`, duration: 0.6 })
        .to(mascot, { rotation: 0, x: `-=4`, duration: 0.4 })
        .to(mascot, { scaleX: 1, duration: 0.25, ease: "power1.inOut" }, "<")

        // Pausa flotando y volver a inicio (sin salirse)
        .to(mascot, { y: "-=5", duration: 1.1, yoyo: true, repeat: 1, ease: "sine.inOut" })
        .to(mascot, { x: minX, duration: 6.0, ease: "power2.inOut" });
    }

    function init() {
      buildMascotTimeline();
      // Pausa/reanuda si la sección no es visible
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { floatTween.play(); pathTl?.play(); }
          else { floatTween.pause(); pathTl?.pause(); }
        });
      }, { threshold: 0.1 });
      io.observe(section);
    }

    // Asegúrate de medir el ancho real del logo
    if (mascot.complete) {
      init();
    } else {
      mascot.addEventListener("load", init, { once: true });
    }

    // Recalcula límites al redimensionar
    window.addEventListener("resize", () => {
      buildMascotTimeline();
    });
  });

// // ===== Imports =====
// // =====================
// // src/main.js (Vite)
// // =====================

// // 1) Imports
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";
// import CustomEase from "gsap/CustomEase";
// import Lenis from "@studio-freight/lenis";

// gsap.registerPlugin(ScrollTrigger, CustomEase);
// CustomEase.create("hop", "0.9, 0, 0.1, 1");

// // ✅ Arranque simple: Lenis se auto–tiquea
// const lenis = new Lenis({
//   autoRaf: true,          // <— activado
//   smoothWheel: true,
//   smoothTouch: true,
//   gestureOrientation: "vertical",
// });

// lenis.on("scroll", () => ScrollTrigger.update());

// // (quita estas 2 líneas mientras pruebas)
// // gsap.ticker.add((t) => lenis.raf(t * 1000));
// // gsap.ticker.lagSmoothing(0);

// // opcional: útil para depurar en consola
// window.lenis = lenis;


// // 4) Utilidad DOM
// const $ = (sel, ctx = document) => ctx.querySelector(sel);
// const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// // 5) Loader + reveal inicial
// function initLoaderReveal() {
//   const loader = $(".loader");
//   if (!loader) return;

//   const tl = gsap.timeline({ delay: 0.3, defaults: { ease: "hop" } });

//   const counts = $$(".count");
//   counts.forEach((count, i) => {
//     const digits = $$(".digit h1", count);
//     tl.to(digits, { y: "0%", duration: 1, stagger: 0.075 }, i * 1);
//     if (i < counts.length) {
//       tl.to(digits, { y: "-100%", duration: 1, stagger: 0.075 }, i * 1 + 1);
//     }
//   });

//   tl.to(".spinner", { opacity: 0, duration: 0.3 });
//   tl.to(".word h1", { y: "0%", duration: 1 }, "<");
//   tl.to(".divider", {
//     scaleY: "100%",
//     duration: 1,
//     onComplete: () => gsap.to(".divider", { opacity: 0, duration: 0.3, delay: 0.3 }),
//   });
//   tl.to("#word-1 h1", { y: "100%", duration: 1, delay: 0.3 });
//   tl.to("#word-2 h1", { y: "-100%", duration: 1 }, "<");

//   tl.to(".block", {
//     clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
//     duration: 1,
//     stagger: 0.1,
//     delay: 0.75,
//     onStart: () => gsap.to(".hero-img", { scale: 1, duration: 2, ease: "hop" }),
//   }, "<");

//   tl.to([".nav", ".line h1", ".line p"], { y: "0%", duration: 1.5, stagger: 0.2 }, "<");
//   tl.to([".cta", ".cta-icon"], { scale: 1, duration: 1.5, stagger: 0.75, delay: 0.75 }, "<");
//   tl.to(".cta-label p", { y: "0%", duration: 1.5, delay: 0.5 }, "<");

//   tl.to(loader, {
//     opacity: 0,
//     duration: 0.5,
//     delay: 0.5,
//     onComplete: () => {
//       loader.style.display = "none";           // fuera de escena
//       document.body.style.overflowY = "auto";  // por si quedó bloqueado
//       ScrollTrigger.refresh();                  // recalc de posiciones
//     },
//   });
// }

// // 6) Sección “cards” con pins seguros
// function initCardsPins() {
//   const cards = $$(".card");
//   if (!cards.length) return;

//   // Pin de .intro a lo largo de las cards
//   ScrollTrigger.create({
//     trigger: ".intro",         // el propio elemento que vamos a pinear
//     start: "top top",
//     endTrigger: ".outro",
//     end: "top 30%",
//     pin: true,
//     pinSpacing: true,          // deja espacio (evita colapsar altura)
//     anticipatePin: 1,
//   });

//   // Por-card
//   cards.forEach((card, i) => {
//     const isLast = i === cards.length - 1;
//     if (isLast) return;

//     const cardInner = $(".card-inner", card);
//     if (!cardInner) return;

//     ScrollTrigger.create({
//       trigger: card,
//       start: "top 35%",
//       endTrigger: ".outro",
//       end: "top 65%",
//       pin: true,
//       pinSpacing: true,
//       anticipatePin: 1,
//     });

//     gsap.to(cardInner, {
//       y: `-${(cards.length - i) * 14}vh`,
//       ease: "none",
//       scrollTrigger: {
//         trigger: card,
//         start: "top 35%",
//         endTrigger: ".outro",
//         end: "top 65%",
//         scrub: true,
//       },
//     });
//   });
// }

// // 7) ISSUES (desktop pin + snap / mobile limpio)
// function initIssues() {
//   const mm = gsap.matchMedia();

//   // ===== DESKTOP (>= 769px)
//   mm.add("(min-width: 769px)", () => {
//     const cards = $$(".issues_card");
//     if (!cards.length) return;

//     const total = cards.length;
//     const rev = [...cards].reverse();

//     // 🔧 Asegura que el contenedor pinneado aporte altura (sin sticky/abs internos)
//     gsap.set(".issues_area", { clearProps: "all", display: "block", height: "auto" });
//     gsap.set([".issues_left", ".issues_right"], { position: "static", height: "auto", overflow: "visible" });
//     gsap.set(".issues_card", { position: "relative", top: "auto", left: "auto", transform: "none" });
//     gsap.set(".issues_final", { position: "relative", top: "auto", height: "auto", clearProps: "transform" });

//     // Reset estético inicial (abanico)
//     gsap.set(cards, { clearProps: "all" });
//     rev.forEach((card, i) => {
//       gsap.set(card, { rotate: i * -10, zIndex: total - i });
//     });

//     // Distancia total de scroll
//     const perCardVh = 300;
//     const extraTailVh = 100;
//     const endDistance = (total * perCardVh + extraTailVh) + "vh";

//     const tl = gsap.timeline({
//       defaults: { ease: "none" },
//       scrollTrigger: {
//         id: "issues-desktop",
//         trigger: ".issues_area",
//         start: "top top",
//         end: "+=" + endDistance,
//         scrub: 0.8,
//         pin: true,              // ✅ pin con espacio
//         pinSpacing: true,       // (explícito por claridad)
//         anticipatePin: 1,
//         snap: {
//           snapTo: (v) => {
//             const seg = total + 1;
//             return Math.round(v * seg) / seg;
//           },
//           duration: 0.4,
//           ease: "power1.out",
//         },
//       },
//     });

//     // Animación por tarjeta
//     rev.forEach((card, i) => {
//       const s = i * 1.5;
//       tl.to(card, { rotation: 0, ease: "power2.out", duration: 0.2 }, s);
//       tl.to(card, { y: "0vh",   ease: "power1.out", duration: 0.5 }, s + 0.2);
//       tl.to({},    { duration: 0.5 }, s + 0.7);
//       tl.to(card, {
//         y: "-120vh",
//         rotation: -48,
//         transformOrigin: "bottom left",
//         ease: "power2.inOut",
//         duration: 0.8
//       }, s + 1.2);

//       tl.to(".issues_final", { y: "-100vh", ease: "none" }, "+=0.5");
//     });

//     tl.to({}, { duration: 0.2 });

//     // Limpieza al salir del breakpoint
//     return () => {
//       tl.kill();
//       ScrollTrigger.getById("issues-desktop")?.kill();
//       gsap.set(cards, { clearProps: "all" });
//       gsap.set(".issues_final", { clearProps: "all" });
//     };
//   });

//   // ===== MOBILE (<= 768px) — tu carrusel horizontal sin GSAP
//   mm.add("(max-width: 768px)", () => {
//     const cards = $$(".issues_card");
//     ScrollTrigger.getById("issues-desktop")?.kill();
//     gsap.set(cards, { clearProps: "all" });
//     gsap.set(".issues_final", { clearProps: "all" });
//   });
// }


// // 8) PASOS (stick + transform)
// function initPasos() {
//   const pasosSection = $(".pasos_section");
//   if (!pasosSection) return;

//   const pasosHeader = $(".pasos_header");
//   const pasosCards  = $$(".pasos_card");
//   const stickyHeight = window.innerHeight * 5;

//   const transforms = [
//     [[10, 25, 0, 5], [10, 0, -15, 5]],
//     [[0, 20, 0, 5],  [-15, 10, -25, 10]],
//     [[0, 25, 0, 0],  [5, -5, -15, 15]],
//     [[0, 15, 15, -10],[10, -5, 15, 0]],
//     [[0, 25, 0, 15], [15, -10, 20, 25]],
//   ];

//   ScrollTrigger.create({
//     trigger: pasosSection,
//     start: "top top",
//     end: `+=${stickyHeight}px`,
//     pin: true,
//     pinSpacing: true,
//     onUpdate: (self) => {
//       const progress = self.progress;
//       const maxTranslate = (pasosHeader?.offsetWidth || 0) - window.innerWidth;
//       const translateX = -progress * Math.max(0, maxTranslate);
//       if (pasosHeader) gsap.set(pasosHeader, { x: translateX });

//       pasosCards.forEach((card, index) => {
//         const delay = index * 0.1125;
//         const cardProgress = Math.max(0, Math.min((progress - delay) * 1.7, 1));
//         if (cardProgress > 0) {
//           const cardStartX = 25, cardEndX = -650;
//           const yPos = transforms[index][0];
//           const rotations = transforms[index][1];

//           const cardX = gsap.utils.interpolate(cardStartX, cardEndX, cardProgress);
//           const yProg = cardProgress * 3;
//           const yIdx = Math.min(Math.floor(yProg), yPos.length - 2);
//           const yItp = yProg - yIdx;
//           const cardY = gsap.utils.interpolate(yPos[yIdx], yPos[yIdx + 1], yItp);
//           const cardR = gsap.utils.interpolate(rotations[yIdx], rotations[yIdx + 1], yItp);

//           gsap.set(card, { xPercent: cardX, yPercent: cardY, rotation: cardR, opacity: 1 });
//         } else {
//           gsap.set(card, { opacity: 0 });
//         }
//       });
//     },
//   });
// }

// // 9) Categories + floats
// function initCategories() {
//   const categories = $$(".category");
//   categories.forEach((category, i) => {
//     gsap.from(category, {
//       scrollTrigger: { trigger: category, start: "top 85%", toggleActions: "play none none none" },
//       opacity: 0, y: 50, duration: 0.8, delay: i * 0.1, ease: "power2.out",
//     });
//     gsap.to(category, { y: "-=10", repeat: -1, yoyo: true, duration: 2 + Math.random(), ease: "sine.inOut" });
//   });

//   // Hover glow
//   $$(".category").forEach((card) => {
//     card.addEventListener("mousemove", (e) => {
//       const rect = card.getBoundingClientRect();
//       const x = e.clientX - rect.left, y = e.clientY - rect.top;
//       const cx = rect.width / 2, cy = rect.height / 2;
//       const dx = x - cx, dy = y - cy;
//       const glowColor = getComputedStyle(card).getPropertyValue("--glow-color");
//       card.style.boxShadow = `${-dx * 0.1}px ${-dy * 0.1}px 30px ${glowColor}`;
//     });
//     card.addEventListener("mouseleave", () => { card.style.boxShadow = "none"; });
//   });
// }

// // 10) Cursors y efectos ligeros
// function initCursors() {
//   // issues cursor
//   (() => {
//     const section = $(".issues_final");
//     const cursor  = $(".issues_cursor");
//     if (!section || !cursor) return;
//     const RADIUS = 70;
//     section.addEventListener("mousemove", (e) => {
//       cursor.style.opacity = "1";
//       cursor.style.clipPath = `circle(${RADIUS}px at ${e.clientX}px ${e.clientY}px)`;
//     });
//     section.addEventListener("mouseenter", () => (cursor.style.opacity = "1"));
//     section.addEventListener("mouseleave", () => (cursor.style.opacity = "0"));
//   })();

//   // landing glow (no cursor en mobile)
//   (() => {
//     const section = $(".section_landing");
//     const glow = $(".landing-glow");
//     if (!section || !glow) return;
//     let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty;
//     const ease = 0.18;
//     function loop() { x += (tx - x) * ease; y += (ty - y) * ease; glow.style.transform = `translate(${x}px, ${y}px)`; requestAnimationFrame(loop); }
//     requestAnimationFrame(loop);
//     const show = () => glow.style.opacity = getComputedStyle(document.documentElement).getPropertyValue("--glow-opacity");
//     const hide = () => glow.style.opacity = "0";
//     section.addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; show(); });
//     section.addEventListener("mouseenter", show);
//     section.addEventListener("mouseleave", hide);
//   })();
// }

// // 11) Fade-in + Typewriter
// function initAppearAndTypewriter() {
//   // fade-in
//   const els = $$(".fade_in_scroll, .fade_in_right, .fade_in_left");
//   const io = new IntersectionObserver((entries) => {
//     entries.forEach((en) => {
//       if (en.isIntersecting) en.target.classList.add("visible");
//       else en.target.classList.remove("visible");
//     });
//   }, { threshold: 0.1 });
//   els.forEach((el) => io.observe(el));

//   // typewriter
//   const writers = $$(".typewriter");
//   writers.forEach((el) => {
//     const text = el.getAttribute("data-text") ?? "";
//     el.textContent = "";
//     el.dataset.fullText = text;
//     if (!el.dataset.speed) el.dataset.speed = "40";
//   });
//   const io2 = new IntersectionObserver((entries, obs) => {
//     entries.forEach((entry) => {
//       if (!entry.isIntersecting) return;
//       const el = entry.target;
//       if (el.dataset.started === "1" || el.classList.contains("done")) { obs.unobserve(el); return; }
//       el.dataset.started = "1"; obs.unobserve(el);
//       const text = el.dataset.fullText || "";
//       const speed = parseInt(el.dataset.speed, 10) || 40;
//       let i = 0;
//       (function type() {
//         if (i < text.length) { el.textContent += text.charAt(i++); setTimeout(type, speed); }
//         else { el.classList.add("done"); }
//       })();
//     });
//   }, { threshold: 0.1 });
//   writers.forEach((el) => io2.observe(el));
// }

// // 12) CTA cursor + recorrido de logo
// function initCTA() {
//   const section = $(".cta_ending_section");
//   const mascot  = section?.querySelector(".cta_mascot");
//   const cursor  = section?.querySelector(".cta_cursor");
//   if (!section || !mascot || !cursor) return;

//   let tx = 0, ty = 0, x = innerWidth/2, y = innerHeight/2, rafId = null;
//   const lerp = (a,b,t)=>a+(b-a)*t;
//   const loop = () => { x = lerp(x, tx, 0.18); y = lerp(y, ty, 0.18); cursor.style.transform = `translate(${x}px, ${y}px)`; rafId = requestAnimationFrame(loop); };
//   section.addEventListener("mouseenter", () => { section.classList.add("cursor_active"); if (!rafId) rafId = requestAnimationFrame(loop); });
//   section.addEventListener("mouseleave", () => { section.classList.remove("cursor_active"); if (rafId) cancelAnimationFrame(rafId); rafId = null; });
//   section.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });

//   const floatTween = gsap.to(mascot, { y: "-=8", duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });

//   let pathTl = null;
//   function buildMascotTimeline() {
//     if (pathTl) pathTl.kill();
//     const sectionW = section.clientWidth;
//     const mascotW  = mascot.clientWidth || 40;
//     const usable = sectionW * 0.90;
//     const offset = (sectionW - usable) / 2;
//     const pad = Math.max(8, mascotW * 0.15);
//     const minX = Math.max(0, offset + pad);
//     const maxX = Math.max(minX, offset + usable - pad - mascotW);
//     const midX = (minX + maxX) / 2;
//     gsap.set(mascot, { x: minX, rotation: 0, scaleX: 1, transformOrigin: "50% 50%" });
//     pathTl = gsap.timeline({ repeat: -1, defaults: { ease: "power1.inOut" } });
//     pathTl
//       .to(mascot, { x: midX, duration: 4.8, ease: "power2.out" })
//       .to(mascot, { rotation: 6, x: `+=6`, duration: 0.5 }, "+=0.2")
//       .to(mascot, { rotation: -6, x: `-=10`, duration: 0.6 })
//       .to(mascot, { rotation: 0, x: `+=4`, duration: 0.4 })
//       .to(mascot, { scaleX: -1, duration: 0.25 }, "<")
//       .to(mascot, { y: "+=5", duration: 1.1, yoyo: true, repeat: 1, ease: "sine.inOut" })
//       .to(mascot, { x: maxX, duration: 5.8 })
//       .to(mascot, { rotation: -5, x: `-=6`, duration: 0.5 }, "+=0.2")
//       .to(mascot, { rotation: 5,  x: `+=10`, duration: 0.6 })
//       .to(mascot, { rotation: 0,  x: `-=4`,  duration: 0.4 })
//       .to(mascot, { scaleX: 1,   duration: 0.25 }, "<")
//       .to(mascot, { y: "-=5", duration: 1.1, yoyo: true, repeat: 1, ease: "sine.inOut" })
//       .to(mascot, { x: minX, duration: 6.0 });
//   }
//   function init() {
//     buildMascotTimeline();
//     const io = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) { floatTween.play(); pathTl?.play(); }
//         else { floatTween.pause(); pathTl?.pause(); }
//       });
//     }, { threshold: 0.1 });
//     io.observe(section);
//   }
//   if (mascot.complete) init(); else mascot.addEventListener("load", init, { once: true });
//   window.addEventListener("resize", buildMascotTimeline);
// }

// // 13) Init de todo cuando el DOM está listo
// document.addEventListener("DOMContentLoaded", () => {
//   initLoaderReveal();
//   initCardsPins();
//   initIssues();
//   initPasos();
//   initCategories();
//   initCursors();
//   initAppearAndTypewriter();
//   initCTA();
// });

// // 14) Refresh final cuando todo cargó (imágenes, fuentes)
// window.addEventListener("load", () => {
//   ScrollTrigger.refresh();
// });
