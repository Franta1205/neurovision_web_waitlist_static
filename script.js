// ============================================
// Toast notifications
// ============================================
function showToast(message, type = "loading") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  return toast;
}

function removeToast(toast) {
  toast.classList.add("toast-out");
  setTimeout(() => toast.remove(), 300);
}

// ============================================
// Form handling (mocked)
// ============================================
const form = document.getElementById("waitlist-form");
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const submitBtn = document.getElementById("submit-btn");
const btnText = document.getElementById("btn-text");
const investorCheckbox = document.getElementById("investor-checkbox");

if (investorCheckbox) {
  investorCheckbox.addEventListener("change", function () {
    btnText.textContent = this.checked ? "Reach Out" : "Join Waitlist!";
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (form) form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) {
    const t = showToast("Please fill in all fields 😠", "error");
    setTimeout(() => removeToast(t), 3000);
    return;
  }

  if (!isValidEmail(email)) {
    const t = showToast("Please enter a valid email address 😠", "error");
    setTimeout(() => removeToast(t), 3000);
    return;
  }

  const isInvestor = investorCheckbox && investorCheckbox.checked;

  // Disable form
  submitBtn.disabled = true;
  btnText.textContent = "Loading...";

  const loadingToast = showToast("Getting you on the waitlist... 🚀", "loading");

  try {
    await fetch("https://script.google.com/macros/s/AKfycbwwWPhuBU9MykFVRIyBtIhV5Yqk-gOI40AKq3b4kr_2qPEOs3wWYmCGHhmS9zAZs5ACrg/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ name, email, investor: isInvestor }),
    });

    removeToast(loadingToast);
    const t = showToast("Thank you for joining the waitlist 🎉", "success");
    setTimeout(() => removeToast(t), 3000);

    nameInput.value = "";
    emailInput.value = "";
  } catch (err) {
    removeToast(loadingToast);
    const t = showToast("An error occurred. Please try again 😢.", "error");
    setTimeout(() => removeToast(t), 3000);
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = isInvestor ? "Reach Out" : "Join Waitlist!";
  }
});

// ============================================
// Slider
// ============================================
(function () {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".slider-prev");
  const nextBtn = document.querySelector(".slider-next");

  if (!slides.length) return;

  let current = 0;
  const total = slides.length;

  function goTo(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (index + total) % total;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      goTo(parseInt(this.dataset.slide, 10));
    });
  });

  // Auto-advance every 5s, pause on hover
  let autoplay = setInterval(function () { goTo(current + 1); }, 5000);
  var slider = document.querySelector(".slider");
  if (slider) {
    slider.addEventListener("mouseenter", function () { clearInterval(autoplay); });
    slider.addEventListener("mouseleave", function () {
      autoplay = setInterval(function () { goTo(current + 1); }, 5000);
    });
  }
})();

// ============================================
// Scroll fade-in (Intersection Observer)
// ============================================
(function () {
  var els = document.querySelectorAll(".fade-in-scroll");
  if (!els.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(function (el) { observer.observe(el); });
})();

// ============================================
// Particles
// ============================================
(function () {
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const color = [247, 255, 155]; // #F7FF9B
  const ease = 80;
  const size = 0.4;

  let w, h;
  let circles = [];
  let mouse = { x: 0, y: 0 };
  let quantity = window.innerWidth < 768 ? 100 : 350;
  let animId;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);
    quantity = w < 768 ? 100 : 350;
    circles = [];
    for (let i = 0; i < quantity; i++) {
      circles.push(createCircle());
    }
  }

  function createCircle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      tx: 0,
      ty: 0,
      size: Math.floor(Math.random() * 2) + size,
      alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
    };
  }

  function remap(value, s1, e1, s2, e2) {
    const r = ((value - s1) * (e2 - s2)) / (e1 - s1) + s2;
    return r > 0 ? r : 0;
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    for (let i = circles.length - 1; i >= 0; i--) {
      const c = circles[i];
      const edges = [
        c.x + c.tx - c.size,
        w - c.x - c.tx - c.size,
        c.y + c.ty - c.size,
        h - c.y - c.ty - c.size,
      ];
      const closest = Math.min(...edges);
      const edgeAlpha = parseFloat(remap(closest, 0, 20, 0, 1).toFixed(2));

      if (edgeAlpha > 1) {
        c.alpha += 0.02;
        if (c.alpha > c.targetAlpha) c.alpha = c.targetAlpha;
      } else {
        c.alpha = c.targetAlpha * edgeAlpha;
      }

      c.x += c.dx;
      c.y += c.dy;
      c.tx += (mouse.x / (50 / c.magnetism) - c.tx) / ease;
      c.ty += (mouse.y / (50 / c.magnetism) - c.ty) / ease;

      ctx.translate(c.tx, c.ty);
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${c.alpha})`;
      ctx.fill();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (
        c.x < -c.size ||
        c.x > w + c.size ||
        c.y < -c.size ||
        c.y > h + c.size
      ) {
        circles.splice(i, 1);
        circles.push(createCircle());
      }
    }
    animId = requestAnimationFrame(animate);
  }

  window.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left - w / 2;
    mouse.y = e.clientY - rect.top - h / 2;
  });

  window.addEventListener("resize", function () {
    cancelAnimationFrame(animId);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    resize();
    animate();
  });

  resize();
  animate();
})();
