const sections = document.querySelectorAll('.hero, .section');

sections.forEach((section) => section.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

sections.forEach((section) => observer.observe(section));
