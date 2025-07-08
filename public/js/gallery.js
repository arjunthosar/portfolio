/* Get menu toggle element */
const toggle = document.getElementById('toggle');
/* Get nav element */
const nav = document.getElementById('nav');

/* Add event listener to menu toggle */
toggle.addEventListener('click', () => {
    /* Toggle active class on nav */
    nav.classList.toggle('active');
});

/* Generate gallery */
const gallerydiv = document.getElementById('gallery-container');
const nums = Array.from({length: 176}, (v, k) => k + 1);
while (nums.length > 0) {
    const i = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
    const image = document.createElement('img');
    image.src = 'assets/gallery/gallery' + i + '.jpg';
    image.className = 'galleryimg';
    gallerydiv.appendChild(image);
}

/* set background color based on current image */
function getAverageRGB(imgEl) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const width = canvas.width = imgEl.naturalWidth || imgEl.width;
    const height = canvas.height = imgEl.naturalHeight || imgEl.height;

    context.drawImage(imgEl, 0, 0, width, height);
    let data;
    try {
        data = context.getImageData(0, 0, width, height);
    } catch (e) {
        return { r: 0, g: 0, b: 0 };
    }

    const pixels = data.data;
    let r = 0, g = 0, b = 0, count = 0;

    const step = 5 * 4;
    for (let i = 0; i < pixels.length; i += step) {
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
        count++;
    }

    return {
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count)
    };
}

function getAverageRGBLeftRight(imgEl) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const width = canvas.width = imgEl.naturalWidth || imgEl.width;
    const height = canvas.height = imgEl.naturalHeight || imgEl.height;

    context.drawImage(imgEl, 0, 0, width, height);
    let data;
    try {
        data = context.getImageData(0, 0, width, height);
    } catch (e) {
        return [{ r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 }];
    }

    const pixels = data.data;
    let r1 = 0, g1 = 0, b1 = 0, count1 = 0;
    let r2 = 0, g2 = 0, b2 = 0, count2 = 0;

    const step = 5 * 4;
    for (let i = 0; i < pixels.length; i += step) {
        if (i < pixels.length / 2) {
            r1 += pixels[i];
            g1 += pixels[i + 1];
            b1 += pixels[i + 2];
            count1++;
        } else {
            r2 += pixels[i];
            g2 += pixels[i + 1];
            b2 += pixels[i + 2];
            count2++;
        }
    }

    return [{
        r: Math.round(r1 / count1),
        g: Math.round(g1 / count1),
        b: Math.round(b1 / count1)
    }, {
        r: Math.round(r2 / count2),
        g: Math.round(g2 / count2),
        b: Math.round(b2 / count2)
    }];
}

var activeBg = 0;
var lastImage;
function updateBackgroundColorFromVisibleImage() {
    const images = document.querySelectorAll('img.galleryimg');
    for (let i = 0; i < images.length - 1; i++) {
        const rect = images[i].getBoundingClientRect();
        if (rect.top >= window.innerHeight*.2 && rect.bottom <= window.innerHeight) {
            if (lastImage === images[i]) {
                break;
            }
            var rgb1, rgb2;
            if (window.innerWidth < 768) {
                const rgbLR = getAverageRGBLeftRight(images[i]);
                rgb1 = rgbLR[0];
                rgb2 = rgbLR[1];
            } else {
                rgb1 = getAverageRGB(images[i]);
                rgb2 = getAverageRGB(images[i + 1]);
            }
            bg1 = document.getElementById('gallery-bg1');
            bg2 = document.getElementById('gallery-bg2');
            if (activeBg === 1) {
                bg2.style.background = `linear-gradient(to right, rgb(${rgb1.r}, ${rgb1.g}, ${rgb1.b}), rgb(${rgb2.r}, ${rgb2.g}, ${rgb2.b}))`;
                bg1.style.opacity = 0;
                bg2.style.opacity = 1;
                activeBg = 2;
            } else {
                bg1.style.background = `linear-gradient(to right, rgb(${rgb1.r}, ${rgb1.g}, ${rgb1.b}), rgb(${rgb2.r}, ${rgb2.g}, ${rgb2.b}))`;
                bg1.style.opacity = 1;
                bg2.style.opacity = 0;
                activeBg = 1;
            }
            lastImage = images[i];
            break;
        }
    }
}

let lastScrollY = window.scrollY;
let lastTime = Date.now();

// scroll speed threshold (pixels per ms)
const SPEED_THRESHOLD = 1.5;

// Debounce timer to avoid spamming
let scrollTimeout;

function handleScroll() {
    const now = Date.now();
    const currentScrollY = window.scrollY;

    const deltaY = Math.abs(currentScrollY - lastScrollY);
    const deltaTime = now - lastTime;

    const speed = deltaY / deltaTime;

    lastScrollY = currentScrollY;
    lastTime = now;

    if (speed < SPEED_THRESHOLD) {
        // only trigger if scroll is "slow"
        updateBackgroundColorFromVisibleImage();
    }
}

// Run on scroll and on load
window.addEventListener('scroll', handleScroll);
window.addEventListener('load', updateBackgroundColorFromVisibleImage);