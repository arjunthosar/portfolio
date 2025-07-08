
/* Get menu toggle element */
const toggle = document.getElementById('toggle');
/* Get nav element */
const nav = document.getElementById('nav');

/* Add event listener to menu toggle */
toggle.addEventListener('click', () => {
    /* Toggle active class on nav */
    nav.classList.toggle('active');
});

/* animation on scroll */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate once

    }
    });
}, {
    threshold: 0.2 // Trigger when 20% visible
});

document.querySelectorAll('.about-image-container-left, .about-image-container-right').forEach(el => {
    observer.observe(el);
});

const backgrounds = [
    'assets/aboutBackground.webp',
    'assets/DSC01962.webp',
    'assets/aboutBackground2.webp',
    'assets/DSC05319.webp'
]

let index = 0;
let showingBg1 = true;

const bg1 = document.getElementById('bg1');
const bg2 = document.getElementById('bg2');

bg1.src = backgrounds[0];
bg1.style.opacity = 1;
bg2.style.opacity = 0;

setInterval(() => {
    index = (index + 1) % backgrounds.length;
    const nextBackground = backgrounds[index];

    if (showingBg1) {
        bg2.src = nextBackground;
        bg2.style.opacity = 1;
        bg1.style.opacity = 0;
        showingBg1 = false;
    } else {
        bg1.src = nextBackground;
        bg1.style.opacity = 1;
        bg2.style.opacity = 0;
        showingBg1 = true;
    }
}, 5000)
