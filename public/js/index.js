/* Get menu toggle element */
const toggle = document.getElementById('toggle');
/* Get nav element */
const nav = document.getElementById('nav');

/* Add event listener to menu toggle */
toggle.addEventListener('click', () => {
    /* Toggle active class on nav */
    nav.classList.toggle('active');
});
window.addEventListener('load', () => {
const images = document.querySelectorAll('.slide img');
let loadedCount = 0;

images.forEach((img) => {
if (img.complete) {
    loadedCount++;
} else {
    img.addEventListener('load', () => {
    loadedCount++;
    if (loadedCount === images.length) {
        startAnimation();
    }
    });
    img.addEventListener('error', () => {
    loadedCount++;
    if (loadedCount === images.length) {
        startAnimation();
    }
    });
}
});

// If all images were already cached and loaded
if (loadedCount === images.length) {
    startAnimation();
}

function startAnimation() {
    const track = document.querySelector('.slide-track');
    track.style.animation = 'scroll 60s linear infinite';
}
});