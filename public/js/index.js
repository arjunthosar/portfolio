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
});

function startAnimation() {
    // const slider = document.querySelector('.slider');
    // slider.style.animationPlayState = 'running';
}

// listen to recent-works button presses, move to next pic/last pic
const images = document.querySelectorAll('#recent-works-slideshow .slide');
const slider = document.querySelector('#recent-works-slideshow .slider');
const prevButton = document.getElementById('recent-prev-button');
const nextButton = document.getElementById('recent-next-button');
let currentIndex = 0;
let combWidths = 0;
const slideCount = images.length;

function updateSlider(forward) {
    let slideWidth;
    if (forward) {
        slideWidth = images[currentIndex].clientWidth;
        combWidths += slideWidth;
        currentIndex++;
    } else {
        slideWidth = images[currentIndex-1].clientWidth;
        combWidths -= slideWidth;
        currentIndex--;
    }
    console.log(currentIndex);
    if (currentIndex == slideCount - 1) {
        nextButton.style.display = 'none';
    } else {
        nextButton.style.display = 'flex';
    }
    if (currentIndex == 0) {
        prevButton.style.display = 'none';
    } else {
        prevButton.style.display = 'flex';
    }
    const marginAdjustment = 10 * currentIndex; // 10px margin between slides
    const translateAmount = combWidths + marginAdjustment;
    const sliderWidth = slider.offsetWidth;
    const slideTrackWidth = slider.parentElement.offsetWidth;
    if (currentIndex == slideCount - 1) {
        slider.style.transform = `translateX(-${translateAmount-(translateAmount+slideTrackWidth-sliderWidth)}px)`;
        return;
    }
    slider.style.transform = `translateX(-${translateAmount}px)`;
}

// Move forward one image
nextButton.addEventListener('click', () => {
    // if (currentIndex >= slideCount) {
    //     currentIndex = 0; // wrap around
    // }
    updateSlider(true);
});

// Move backward one image
prevButton.addEventListener('click', () => {
    // if (currentIndex < 0) {
    //     currentIndex = slideCount - 1; // wrap to last
    // }
    updateSlider(false);
});