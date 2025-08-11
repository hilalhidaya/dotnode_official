import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  const menu   = document.querySelector(".menu");
  const wrap   = document.querySelector(".menu-img");
  const images = document.querySelectorAll(".menu-img img");
  if (!wrap || images.length === 0) return;

  // Mantén centrado sin sobreescribir translate(-50%,-50%)
  gsap.set(images, { xPercent: -50, yPercent: -50, willChange: "transform" });

  // Perspectiva SOLO en el bloque visual
  gsap.set(wrap, { transformStyle: "preserve-3d" });
  // Si quieres más profundidad, puedes aplicar perspective aquí (no en .menu):
  // gsap.set(wrap, { transformPerspective: 1000 });

  // Escalas por capa (como el original)
  const scales = [0.81, 0.84, 0.87, 0.9];

  let cx = 0, cy = 0;
  let mx = 0, my = 0;
  let raf = null;

  function measureCenter() {
    const r = wrap.getBoundingClientRect();
    cx = r.left + r.width  / 2;
    cy = r.top  + r.height / 2;
  }
  measureCenter();

  const render = () => {
    raf = null;
    if (!menu.classList.contains("menu--open")) return;

    const dx = mx - cx;
    const dy = my - cy;

    const nx = dx / (wrap.clientWidth  / 2 || 1);
    const ny = dy / (wrap.clientHeight / 2 || 1);

    // Tilt suave del contenedor
    gsap.to(wrap, {
      rotationX: -ny * 10,
      rotationY:  nx * 10,
      duration: 0.6,
      ease: "power3.out",
      transformOrigin: "50% 50%",
      overwrite: "auto",
      force3D: true
    });

    // Parallax por capa
    images.forEach((img, i) => {
      const parallaxX = -(dx * (i + 1)) / 100;
      const parallaxY = -(dy * (i + 1)) / 100;
      gsap.to(img, {
        x: parallaxX,
        y: parallaxY,
        scale: scales[i] || 1,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
        force3D: true
      });
    });
  };

  // Cambiar "mousemove" y "pointermove" por "touchmove" para móviles
  const onMove = (e) => {
    const ev = e.touches ? e.touches[0] : e; // Cambiar a "touchmove" para dispositivos táctiles
    mx = ev.clientX;
    my = ev.clientY;
    if (!raf) raf = requestAnimationFrame(render);
  };

  // Reemplazamos "mousemove" y "pointermove" por "touchmove" para dispositivos táctiles
  document.addEventListener("mousemove", onMove,   { passive: true });
  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("touchmove", onMove, { passive: true }); // Agregar touchmove para iPhone

  window.addEventListener("resize", measureCenter);
  window.addEventListener("menu:opened", () => setTimeout(measureCenter, 50));
  window.addEventListener("menu:closed", () => {
    // Vuelve a su sitio al cerrar
    gsap.to(wrap, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power3.out" });
    images.forEach((img, i) => {
      gsap.to(img, { x: 0, y: 0, scale: scales[i] || 1, duration: 0.6, ease: "power3.out" });
    });
  });
});
