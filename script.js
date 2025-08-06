
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

