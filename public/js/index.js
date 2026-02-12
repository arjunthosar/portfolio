//Fade in / Fade out
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('fade-in');
})
const links = document.querySelectorAll('nav a');
const pageButtons = document.querySelectorAll('.nav-button .big-nav-button');
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
pageButtons.forEach(button => {
    button.addEventListener('click', () => {
        event.preventDefault();
        document.body.classList.remove('fade-in');
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = button.parentElement.href;
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

const mobileSlide = document.getElementById('mobile-slide')
const slideImages = [
    {filename: '351.jpg', aspectRatio: 3/2},
    {filename: '353.jpg', aspectRatio: 3/2},
    {filename: '356.jpg', aspectRatio: 3/2},
    {filename: '358.jpg', aspectRatio: 3/2},
    {filename: '360.jpg', aspectRatio: 3/2},
    {filename: '366.jpg', aspectRatio: 3/2},
    {filename: '367.jpg', aspectRatio: 2/3},
    {filename: '369.jpg', aspectRatio: 1},
    {filename: '373.jpg', aspectRatio: 3/2},
    {filename: '375.jpg', aspectRatio: 1}
]

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

function updateMobileSlider(forward) {
    if (forward) {
        currentIndex++;
        mobileSlide.src = `assets/gallery/${slideImages[currentIndex].filename}`;
        mobileSlide.style.height = (window.innerWidth * 0.9 - 20) / slideImages[currentIndex].aspectRatio + 'px';
    } else {
        currentIndex--;
        mobileSlide.src = `assets/gallery/${slideImages[currentIndex].filename}`;
        mobileSlide.style.height = (window.innerWidth * 0.9 - 20) / slideImages[currentIndex].aspectRatio + 'px';
    }
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
}

window.addEventListener('load', () => {
    if (window.innerWidth <= 768) {
        mobileSlide.style.height = (window.innerWidth * 0.9 - 20) / slideImages[0].aspectRatio + 'px';
    }
});

// Move forward one image
nextButton.addEventListener('click', () => {
    // if (currentIndex >= slideCount) {
    //     currentIndex = 0; // wrap around
    // }
    if (window.innerWidth <= 768) {
        updateMobileSlider(true);
    } else {
        updateSlider(true);
    }
});

// Move backward one image
prevButton.addEventListener('click', () => {
    // if (currentIndex < 0) {
    //     currentIndex = slideCount - 1; // wrap to last
    // }
    if (window.innerWidth <= 768) {
        updateMobileSlider(false);
    } else {
        updateSlider(false);
    }
});