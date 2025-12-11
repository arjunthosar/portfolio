//Fade in / Fade out
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('fade-in');
})
const links = document.querySelectorAll('nav a, .button-container a');
links.forEach(link => {
    link.addEventListener('click', () => {
        event.preventDefault();
        document.body.classList.remove('fade-in');
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = link.href;
        }, 299)
    });
});

window.addEventListener('popstate', () => {
    document.body.classList.remove('fade-out');
    document.body.classList.add('fade-in');    
})
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
    
    // Update background-darkener height to match home-container
    const homeContainer = document.querySelector('.home-container');
    const backgroundDarkener = document.querySelector('.background-darkener');
    // Set the darkener element to the container's scrollHeight so it
    // covers the banner and the slider once the slider images are loaded.
    backgroundDarkener.style.height = homeContainer.scrollHeight + 'px';
}
});