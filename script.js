
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";


gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

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
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const cards = gsap.utils.toArray(".card");

  ScrollTrigger.create({
    trigger: cards[0],
    start: "top 35%",
    endTrigger: cards[cards.length - 1],
    end: "top 30%",
    pin: ".intro",
    pinSpacing: false,
  });

  cards.forEach((card, index) => {
    const isLastCard = index === cards.length - 1;
    const cardInner = card.querySelector(".card-inner");

    if (!isLastCard) {
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
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cards = gsap.utils.toArray(".issues_card");
  const totalCards = cards.length;
  const reversedCards = [...cards].reverse();

  // ESTÉTICA INICIAL – abanico
  reversedCards.forEach((card, index) => {
    const angle = index * -10;
    gsap.set(card, {
      rotate: angle,
      zIndex: totalCards - index,
    });
  });

  // TIMELINE PRINCIPAL CON SCROLLTRIGGER
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".issues_area",
      start: "top top",
      end: `+=${totalCards * 300}vh`, // más duración por tarjeta
      scrub: true,
      pin: true,
    },
  });

  // ANIMACIÓN POR TARJETA
  reversedCards.forEach((card, index) => {
    const stepStart = index * 1.5;

    // 1. Enderezar antes de estar visible
    tl.to(
      card,
      {
        rotation: 0,
        ease: "power2.out",
        duration: 0.2,
      },
      stepStart
    );

    // 2. Moverla suavemente a centro (y mantenerla recta)
    tl.to(
      card,
      {
        y: "0vh",
        ease: "power1.out",
        duration: 0.5,
      },
      stepStart + 0.2
    );

    // 3. Espera “en el centro” mientras ya está recta (tiempo para leer)
    tl.to(
      {},
      {
        duration: 0.5,
      },
      stepStart + 0.7
    );

    // 4. Salida: hacia arriba y con rotación final
    tl.to(
      card,
      {
        y: "-120vh",
        rotation: -48,
        transformOrigin: "bottom left",
        ease: "power2.inOut",
        duration: 0.8,
      },
      stepStart + 1.2
    );

    tl.to(
      ".issues_final",
      {
        y: "-100vh",
        ease: "none",
      },
      "+=0.5"
    );

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


// TEXTO MAQUINA DE ESCRIBI 
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".typewriter");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains("done")) {
        const el = entry.target;
        const text = el.getAttribute("data-text");
        let i = 0;

        const type = () => {
          if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50); // velocidad de escritura
          } else {
            el.classList.add("done"); // evita que se repita
          }
        };

        type();
      }
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





