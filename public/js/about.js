//Fade in / Fade out
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('fade-in');
})
const links = document.querySelectorAll('nav a');
links.forEach(link => {
    link.addEventListener('click', () => {
        event.preventDefault();
        document.body.classList.remove('fade-in');
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = link.href;
        }, 500)
    });
});

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

document.querySelectorAll('.about-image-left, .about-image-right, .about-text-left, .about-text-right, .about-text-container, .about-title-left, .about-title-right').forEach(el => {
    observer.observe(el);
});

function shuffle(array) { //(shameless copy paste of Fisher-Yates shuffle)
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

let backgrounds = []
fetch('js/image_categories.json')
    .then(response => response.json())
    .then(jsonData => {
        const landscapeImageObjects = jsonData.filter(item => (item.width / item.height > 1.1) && (item.category === 'nature' || item.category === 'city'));
        backgrounds = landscapeImageObjects.map(item => `assets/gallery/${item.filename}`);
        backgrounds = shuffle(backgrounds);
        startBackgroundRotation();
    })


let index = 0;
let showingBg1 = true;

const bg1 = document.getElementById('bg1');
const bg2 = document.getElementById('bg2');


bg1.style.opacity = 1;
bg2.style.opacity = 0;

currentTime = Date.now();

document.querySelector('#bg1').addEventListener('transitionend', () => {
    bg2.style.transition = 'none';
    bg2.style.opacity = 0;
})

document.querySelector('#bg2').addEventListener('transitionend', () => {
    bg1.style.transition = 'none';
    bg1.style.opacity = 0;
})

function startBackgroundRotation() {
    bg1.src = backgrounds[0];
    setInterval(() => {
        index = (index + 1) % backgrounds.length; //(0,1,2,3)
        const nextBackground = backgrounds[index];

        const newTime = Date.now();
        if (newTime >= currentTime+5000) {
            currentTime = newTime;
            if (showingBg1) {
                bg2.src = nextBackground;
                bg2.style.zIndex = -1;
                bg1.style.zIndex = -2;
                bg2.style.transition = 'opacity 1s ease';
                bg2.style.opacity = 1;
                showingBg1 = false;
            } else {
                bg1.src = nextBackground;
                bg1.style.zIndex = -1;
                bg2.style.zIndex = -2;
                bg1.style.transition = 'opacity 1s ease';
                bg1.style.opacity = 1;
                showingBg1 = true;
            }
        }
    }, 6000)
}