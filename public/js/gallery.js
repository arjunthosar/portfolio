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
const AMOUNT_OF_IMAGES = 280;
const nums = Array.from({length: AMOUNT_OF_IMAGES}, (v, k) => k + 1);
let originalOrder = [];
const excludedNums = [234, 232, 231]
let data;
fetch('js/image_categories.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;

        while (nums.length > 0) {
            const i = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
            if (excludedNums.includes(i)) continue;
            const image = document.createElement('img');
            image.src = 'assets/gallery/' + i + '.jpg';
            const filename = i + '.jpg';
            const matched = data.find(item => item.filename === filename);
            if (matched) {
                image.dataset.category = matched.category;
            }
            image.className = 'galleryimg';
            image.id = i;
            originalOrder.push(i);
            gallerydiv.appendChild(image);
        }
    })
    .catch(error => console.error('Error loading JSON:', error));

/* set background color based on current image */
function getAverageRGB(imgEl) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const targetSize = 20; // much smaller than full size
    canvas.width = targetSize;
    canvas.height = targetSize;

    // Draw scaled down image
    context.drawImage(imgEl, 0, 0, targetSize, targetSize);

    let data;
    try {
        data = context.getImageData(0, 0, targetSize, targetSize).data;
    } catch {
        return { r: 0, g: 0, b: 0 };
    }

    let r = 0, g = 0, b = 0;
    const totalPixels = targetSize * targetSize;

    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }

    return {
        r: Math.round(r / totalPixels),
        g: Math.round(g / totalPixels),
        b: Math.round(b / totalPixels)
    };
}

function getAverageRGBLeftRight(imgEl) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const targetSize = 20;
    canvas.width = targetSize;
    canvas.height = targetSize;
    context.drawImage(imgEl, 0, 0, targetSize, targetSize);

    let data;
    try {
        data = context.getImageData(0, 0, targetSize, targetSize).data;
    } catch {
        return [{ r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 }];
    }

    let r1 = 0, g1 = 0, b1 = 0, count1 = 0;
    let r2 = 0, g2 = 0, b2 = 0, count2 = 0;

    for (let y = 0; y < targetSize; y++) {
        for (let x = 0; x < targetSize; x++) {
            const idx = (y * targetSize + x) * 4;
            if (x < targetSize / 2) {
                r1 += data[idx];
                g1 += data[idx + 1];
                b1 += data[idx + 2];
                count1++;
            } else {
                r2 += data[idx];
                g2 += data[idx + 1];
                b2 += data[idx + 2];
                count2++;
            }
        }
    }

    return [
        { r: Math.round(r1 / count1), g: Math.round(g1 / count1), b: Math.round(b1 / count1) },
        { r: Math.round(r2 / count2), g: Math.round(g2 / count2), b: Math.round(b2 / count2) }
    ];
}

document.addEventListener('click', function(e) {
    if (!e.target.classList.contains('galleryimg')) return;
    document.body.style.overflowY = 'hidden';
    var original = e.target;
    const rect = original.getBoundingClientRect();

    const clone = original.cloneNode();
    clone.id = 'fullscreen-img'
    clone.style.top = rect.top + 'px';
    clone.style.left = rect.left + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';

    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';
    document.body.appendChild(overlay);
    document.body.appendChild(clone);

    void clone.offsetWidth;

    //Animate to center
    clone.style.transform = 'translate(-50%, -50%)';
    clone.style.top = '50%';
    clone.style.left = '50%';
    const scale = 1.5;
    const aspectRatio = original.naturalWidth / original.naturalHeight;
    if (window.innerWidth <= 768) {
        clone.style.width = '90vw';
        clone.style.height = (0.90*window.innerWidth/aspectRatio) + 'px';
    } else {
        clone.style.maxWidth = 'none';
        clone.style.width = (original.width * scale) + 'px';
        clone.style.height = (original.width * scale / aspectRatio) + 'px';
    }
    clone.style.maxHeight = 'none';

    overlay.style.opacity = 1;
    const imgRGB = getAverageRGBLeftRight(original);
    overlay.style.background = `linear-gradient(to right, rgba(${imgRGB[0].r}, ${imgRGB[0].g}, ${imgRGB[0].b}), rgba(${imgRGB[1].r}, ${imgRGB[1].g}, ${imgRGB[1].b}))`;
    clone.style.transition = 'left, right, opacity .25s ease-out';

    const closeButton = document.createElement('div');
    const closeIcon = document.createElement('img');
    closeIcon.src = 'assets/closeIcon.png';
    closeIcon.id = 'close-icon';
    closeButton.appendChild(closeIcon);
    closeButton.id = 'close-button';
    closeButton.addEventListener('click', close);
    overlay.appendChild(closeButton);

    const images = document.querySelectorAll('img.galleryimg:not([style*="display: none"])');
    var originalIndex = Array.from(images).indexOf(original);
    if (images[originalIndex + 1]) {
        const nextButton = document.createElement('div');
        const nextIcon = document.createElement('img');
        nextIcon.src = 'assets/rightArrow.png';
        nextIcon.id = 'next-icon';
        nextButton.appendChild(nextIcon);
        nextButton.id = 'next-button';
        nextButton.addEventListener('click', next);
        overlay.appendChild(nextButton);
    }
    if (images[originalIndex - 1]) {
        const prevButton = document.createElement('div');
        const prevIcon = document.createElement('img');
        prevIcon.src = 'assets/leftArrow.png';
        prevIcon.id = 'prev-icon';
        prevButton.appendChild(prevIcon);
        prevButton.id = 'prev-button';
        prevButton.addEventListener('click', prev);
        overlay.appendChild(prevButton);
    }

    function close() {
        document.body.style.overflow = 'auto';
        overlay.style.opacity = 0;
        clone.style.transform = 'translate(-50%, -50%) scale(0.8)';
        clone.style.opacity = 0;
        closeButton.style.opacity = 0;
        setTimeout(() => {
            clone.remove();
            overlay.remove();
            closeButton.remove();
        }, 300);
    }

    function next() {
        if (originalIndex === images.length - 1) {return;}
        originalIndex += 1;
        original = images[originalIndex];
        document.getElementById('fullscreen-img').src = original.src;
        const imgRGB = getAverageRGBLeftRight(original);
        overlay.style.background = `linear-gradient(to right, rgba(${imgRGB[0].r}, ${imgRGB[0].g}, ${imgRGB[0].b}), rgba(${imgRGB[1].r}, ${imgRGB[1].g}, ${imgRGB[1].b}))`;
        const aspectRatio = original.naturalWidth / original.naturalHeight;
        if (window.innerWidth <= 768) {
            clone.style.width = '90vw';
            clone.style.height = (0.90*window.innerWidth/aspectRatio) + 'px';
        } else {
            clone.style.maxWidth = 'none';
            clone.style.width = (original.width * scale) + 'px';
            clone.style.height = (original.width * scale / aspectRatio) + 'px';
        }
        if (images[originalIndex - 1] && originalIndex-1 === 0) {
            const prevButton = document.createElement('div');
            const prevIcon = document.createElement('img');
            prevIcon.src = 'assets/leftArrow.png';
            prevIcon.id = 'prev-icon';
            prevButton.appendChild(prevIcon);
            prevButton.id = 'prev-button';
            prevButton.addEventListener('click', prev);
            overlay.appendChild(prevButton);
        }
        if (originalIndex === images.length - 1) {
            const nextButton = document.getElementById('next-button');
            if (nextButton) {
                nextButton.remove();
            }
        }
    }

    function prev() {
        if (originalIndex === 0) {return;}
        originalIndex -= 1;
        original = images[originalIndex];
        document.getElementById('fullscreen-img').src = original.src;
        const imgRGB = getAverageRGBLeftRight(original);
        overlay.style.background = `linear-gradient(to right, rgba(${imgRGB[0].r}, ${imgRGB[0].g}, ${imgRGB[0].b}), rgba(${imgRGB[1].r}, ${imgRGB[1].g}, ${imgRGB[1].b}))`;
        const aspectRatio = original.naturalWidth / original.naturalHeight;
        if (window.innerWidth <= 768) {
            clone.style.width = '90vw';
            clone.style.height = (0.90*window.innerWidth/aspectRatio) + 'px';
        } else {
            clone.style.maxWidth = 'none';
            clone.style.width = (original.width * scale) + 'px';
            clone.style.height = (original.width * scale / aspectRatio) + 'px';
        }
        if (images[originalIndex + 1] && originalIndex+1 === images.length - 1) {
            const nextButton = document.createElement('div');
            const nextIcon = document.createElement('img');
            nextIcon.src = 'assets/rightArrow.png';
            nextIcon.id = 'next-icon';
            nextButton.appendChild(nextIcon);
            nextButton.id = 'next-button';
            nextButton.addEventListener('click', next);
            overlay.appendChild(nextButton);
        }
        if (originalIndex === 0) {
            const prevButton = document.getElementById('prev-button');
            if (prevButton) {
                prevButton.remove();
            }
        }
    }
})

var activeBg = 1;
var lastImage;
function updateBackgroundColorFromVisibleImage() {
    const images = document.querySelectorAll('img.galleryimg:not([style*="display: none"])');
    for (let i = 0; i < images.length - 1; i++) {
        const rect = images[i].getBoundingClientRect();
        if (window.innerWidth >= 768 ? (rect.top >= 0) : (rect.top >= window.innerHeight*0.2 && rect.bottom <= window.innerHeight)) {
            if (lastImage === images[i]) {
                break;
            }
            var rgb1, rgb2, rgb3;
            if (window.innerWidth < 768) {
                const rgbLR = getAverageRGBLeftRight(images[i]);
                rgb1 = rgbLR[0];
                rgb2 = rgbLR[1];
            } else {
                rgb1 = getAverageRGB(images[i]);
                rgb2 = getAverageRGB(images[i + 1]);
                if (images[i].width + images[i+1].width + images[i+2].width <= window.innerWidth * 0.8) {
                    rgb3 = getAverageRGB(images[i + 2]);
                }
            }
            bg1 = document.getElementById('gallery-bg1');
            bg2 = document.getElementById('gallery-bg2');
            if (activeBg === 1) {
                bg2.style.zIndex = -1;
                bg1.style.zIndex = -2;
                bg2.style.background = `linear-gradient(to right, rgb(${rgb1.r}, ${rgb1.g}, ${rgb1.b}), rgb(${rgb2.r}, ${rgb2.g}, ${rgb2.b})` + (rgb3 ? `, rgb(${rgb3.r}, ${rgb3.g}, ${rgb3.b})` : '') + ')';
                bg2.style.transition = 'opacity .2s ease-in';
                bg2.style.opacity = 1;

                activeBg = 0;
            } else if (activeBg === 2) {
                bg1.style.zIndex = -1;
                bg2.style.zIndex = -2;
                bg1.style.background = `linear-gradient(to right, rgb(${rgb1.r}, ${rgb1.g}, ${rgb1.b}), rgb(${rgb2.r}, ${rgb2.g}, ${rgb2.b})` + (rgb3 ? `, rgb(${rgb3.r}, ${rgb3.g}, ${rgb3.b})` : '') + ')';
                bg1.style.transition = 'opacity .2s ease-in';
                bg1.style.opacity = 1;

                activeBg = 0;
            }
            lastImage = images[i];
            break;
        }
    }
}

document.querySelector('#gallery-bg1').addEventListener('transitionend', () => {
    bg2.style.transition = 'none';
    bg2.style.opacity = 0;
    activeBg = 1;
})

document.querySelector('#gallery-bg2').addEventListener('transitionend', () => {
    bg1.style.transition = 'none';
    bg1.style.opacity = 0;
    activeBg = 2;
})

let lastScrollY = window.scrollY;
let lastTime = Date.now();

// Run on scroll and on load
window.addEventListener('scroll', updateBackgroundColorFromVisibleImage);
window.addEventListener('load', updateBackgroundColorFromVisibleImage);
const checkboxes = ['#nature', '#portraits', '#macro', '#city', '#other'];

checkboxes.forEach(id => {
    document.querySelector(id).addEventListener('change', filterImages);
})

document.querySelector('#recent').addEventListener('change', sortImages);

function filterImages() {
    const images = document.querySelectorAll('img.galleryimg');
    const checkedCategories = Array.from(checkboxes)
        .filter(checkbox => document.querySelector(checkbox).checked)
        .map(checkbox => checkbox.replace('#', ''));
    images.forEach(img => {
        const imgCategory = img.dataset.category;
        if (checkedCategories.includes(imgCategory)) {
            img.style.display = '';
        } else {
            img.style.display = 'none';
        }
    });
}

function sortImages() {
    const checked = document.querySelector('#recent').checked;
    if (checked) {
        while (gallerydiv.firstChild) {
            gallerydiv.removeChild(gallerydiv.firstChild);
        }
        for (i = AMOUNT_OF_IMAGES; i > 0; i--) {
            if (excludedNums.includes(i)) continue;
            const image = document.createElement('img');
            image.src = 'assets/gallery/' + i + '.jpg';
            const filename = i + '.jpg';
            const matched = data.find(item => item.filename === filename);
            if (matched) {
                image.dataset.category = matched.category;
            }
            image.className = 'galleryimg';
            image.id = i;
            gallerydiv.appendChild(image);
        }
    } else {
        const nums = [...originalOrder]; 
        while (gallerydiv.firstChild) {
            gallerydiv.removeChild(gallerydiv.firstChild);
        }
        while (nums.length > 0) {
            nums.forEach(i => {
                if (excludedNums.includes(i)) return;
                const image = document.createElement('img');
                image.src = 'assets/gallery/' + i + '.jpg';
                const filename = i + '.jpg';
                const matched = data.find(item => item.filename === filename);
                if (matched) {
                    image.dataset.category = matched.category;
                }
                image.className = 'galleryimg';
                image.id = i;
                gallerydiv.appendChild(image);
                nums.splice(nums.indexOf(i), 1);
            });
        }
        filterImages();
    }
}


let loadedCount = 0;
const images = document.querySelectorAll('img.galleryimg');
images.forEach(img => {
    if (img.complete) {
        loadedCount++;
        if (loadedCount >= 6) {
            document.body.classList.remove('loading');
            updateBackgroundColorFromVisibleImage();
        }
    } else {
        img.addEventListener('load', () => {
            loadedCount++;
            if (loadedCount >= 6) {
                document.body.classList.remove('loading');
                updateBackgroundColorFromVisibleImage();
            }
        });
        img.addEventListener('error', () => {
            loadedCount++;
            if (loadedCount >= 6) {
                document.body.classList.remove('loading');
                updateBackgroundColorFromVisibleImage();
            }
        });
    }
});

if (loadedCount === images.length) {
    document.body.classList.remove('loading');
}

