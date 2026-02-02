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
        }, 250)
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

/* Generate gallery */
const gallerydiv = document.getElementById('pictures-container');
const AMOUNT_OF_IMAGES = 390;
const nums = Array.from({length: AMOUNT_OF_IMAGES}, (v, k) => k + 1);
let originalOrder = [];
const excludedNums = []; // images to exclude from gallery
let data;

fetch('js/image_categories.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;

        // Randomly generate images and add them to the gallery
        while (nums.length > 0) {
            const i = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
            if (excludedNums.includes(i)) continue;

            const imageDiv = document.createElement('div');
            imageDiv.className = 'loadingGalleryImg';
            imageDiv.id = i;

            const image = document.createElement('img');
            src = `assets/gallery/${window.innerWidth < 768 ? `mobile/${i}m.jpg` : `${i}.jpg`}`
            image.setAttribute('data-src', src);
            image.className = 'galleryImg';
            const filename = `${i}.jpg`;
            const matched = data.find(item => item.filename === filename);
            if (matched) {
                image.dataset.category = matched.category;
                const aspectRatio = matched.width / matched.height;
                imageDiv.style.aspectRatio = aspectRatio;
                if (aspectRatio > 1.1) {
                    imageDiv.classList.add('landscapeGalleryImg');
                }
            }
            image.id = i;
            image.oncontextmenu = function() { return false; };

            // Add loading image
            const loadingImage = document.createElement('img');
            loadingImage.src = 'assets/loading.gif';
            loadingImage.className = 'loadingGif';
            setGridSpan(imageDiv);

            // Add image to the gallery
            image.onload = function() {
                this.parentNode.classList.add('loadedGalleryImg');
                this.parentNode.removeChild(this.parentNode.firstChild);
                // Call setBackgroundShadow after image is fully loaded
                setTimeout(() => setBackgroundShadow(this.parentNode), 0);
            };
            originalOrder.push(i);

            imageDiv.appendChild(loadingImage);
            imageDiv.appendChild(image);
            gallerydiv.appendChild(imageDiv);
        }

        // Unveil the images
        $("img").unveil(window.innerWidth < 768 ? 1000 : 500);
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
    if (!e.target.classList.contains('galleryImg')) return;
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
    let scale = 1.25;
    const aspectRatio = original.naturalWidth / original.naturalHeight;
    if (aspectRatio < 1.1 && aspectRatio > 0.9) {
        scale = 1.75;
    }
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
    const whiteFactor = 1.5;
    overlay.style.background = `linear-gradient(to right, rgba(${Math.min(imgRGB[0].r*whiteFactor, 200)}, ${Math.min(imgRGB[0].g*whiteFactor, 200)}, ${Math.min(imgRGB[0].b*whiteFactor, 200)}), rgba(${Math.min(imgRGB[1].r*whiteFactor, 200)}, ${Math.min(imgRGB[1].g*whiteFactor, 200)}, ${Math.min(imgRGB[1].b*whiteFactor, 200)}))`;
    clone.style.transition = 'left, right, opacity .25s ease-out';

    const closeButton = document.createElement('div');
    const closeIcon = document.createElement('span');
    closeIcon.id = 'close-icon';
    closeIcon.innerHTML = "&#10005";
    closeButton.appendChild(closeIcon);
    closeButton.id = 'close-button';
    closeButton.addEventListener('click', close);
    overlay.appendChild(closeButton);

    const imageDivs = document.querySelectorAll('.loadedGalleryImg:not([style*="display: none"]), .loadingGalleryImg:not([style*="display: none"])');
    console.log(imageDivs);
    var originalIndex = Array.from(imageDivs).indexOf(original.parentNode);
    console.log(originalIndex);
    if (imageDivs[originalIndex + 1]) {
        const nextButton = document.createElement('div');
        const nextIcon = document.createElement('img');
        nextIcon.src = 'assets/rightArrow.png';
        nextIcon.id = 'next-icon';
        nextButton.appendChild(nextIcon);
        nextButton.id = 'next-button';
        nextButton.addEventListener('click', next);
        overlay.appendChild(nextButton);
    }
    if (imageDivs[originalIndex - 1]) {
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
        if (originalIndex === imageDivs.length - 1) {return;}
        originalIndex += 1;
        original = imageDivs[originalIndex];
        original.scrollIntoView();
        originalImage = original.querySelector('img.galleryImg');
        $(originalImage).trigger('unveil');
        document.getElementById('fullscreen-img').src = originalImage.dataset.src;
        const imgRGB = getAverageRGBLeftRight(originalImage);
        overlay.style.background = `linear-gradient(to right, rgba(${imgRGB[0].r}, ${imgRGB[0].g}, ${imgRGB[0].b}), rgba(${imgRGB[1].r}, ${imgRGB[1].g}, ${imgRGB[1].b}))`;
        const aspectRatio = originalImage.naturalWidth / originalImage.naturalHeight;
        if (aspectRatio < 1.1 && aspectRatio > 0.9) {
            scale = 1.75;
        } else {
            scale = 1.25;
        }
        if (window.innerWidth <= 768) {
            clone.style.width = '90vw';
            clone.style.height = (0.90*window.innerWidth/aspectRatio) + 'px';
        } else {
            clone.style.maxWidth = 'none';
            clone.style.width = (originalImage.width * scale) + 'px';
            clone.style.height = (originalImage.width * scale / aspectRatio) + 'px';
        }
        if (imageDivs[originalIndex - 1] && originalIndex-1 === 0) {
            const prevButton = document.createElement('div');
            const prevIcon = document.createElement('img');
            prevIcon.src = 'assets/leftArrow.png';
            prevIcon.id = 'prev-icon';
            prevButton.appendChild(prevIcon);
            prevButton.id = 'prev-button';
            prevButton.addEventListener('click', prev);
            overlay.appendChild(prevButton);
        }
        if (originalIndex === imageDivs.length - 1) {
            const nextButton = document.getElementById('next-button');
            if (nextButton) {
                nextButton.remove();
            }
        }
    }

    function prev() {
        if (originalIndex === 0) {return;}
        originalIndex -= 1;
        original = imageDivs[originalIndex];
        original.scrollIntoView();
        originalImage = original.querySelector('img.galleryImg');
        $(originalImage).trigger('unveil');
        document.getElementById('fullscreen-img').src = originalImage.dataset.src;
        const imgRGB = getAverageRGBLeftRight(originalImage);
        overlay.style.background = `linear-gradient(to right, rgba(${imgRGB[0].r}, ${imgRGB[0].g}, ${imgRGB[0].b}), rgba(${imgRGB[1].r}, ${imgRGB[1].g}, ${imgRGB[1].b}))`;
        const aspectRatio = originalImage.naturalWidth / originalImage.naturalHeight;
        if (aspectRatio < 1.1 && aspectRatio > 0.9) {
            scale = 1.75;
        } else {
            scale = 1.25;
        }
        if (window.innerWidth <= 768) {
            clone.style.width = '90vw';
            clone.style.height = (0.90*window.innerWidth/aspectRatio) + 'px';
        } else {
            clone.style.maxWidth = 'none';
            clone.style.width = (originalImage.width * scale) + 'px';
            clone.style.height = (originalImage.width * scale / aspectRatio) + 'px';
        }
        if (imageDivs[originalIndex + 1] && originalIndex+1 === imageDivs.length - 1) {
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
// function updateBackgroundColorFromVisibleImage() {
//     const imageDivs = document.querySelectorAll('.loadedGalleryImg:not([style*="display: none"])');
//     for (let i = 0; i < imageDivs.length - 1; i++) {
//         const rect = imageDivs[i].getBoundingClientRect();
//         if (window.innerWidth >= 768 ? (rect.top >= 0) : (rect.bottom >= window.innerHeight*0.4 && rect.bottom <= window.innerHeight)) {
//             if (lastImage === imageDivs[i]) {
//                 break;
//             }
//             var rgb1, rgb2, rgb3;
//             if (window.innerWidth < 768) {
//                 const rgbLR = getAverageRGBLeftRight(imageDivs[i].querySelector('img'));
//                 rgb1 = rgbLR[0];
//                 rgb2 = rgbLR[1];
//             } else {
//                 rgb1 = getAverageRGB(imageDivs[i].querySelector('img'));
//                 rgb2 = getAverageRGB(imageDivs[i + 1].querySelector('img'));
//                 if (imageDivs[i].offsetWidth + imageDivs[i+1].offsetWidth + imageDivs[i+2].offsetWidth <= window.innerWidth * 0.8) {
//                     rgb3 = getAverageRGB(imageDivs[i + 2].querySelector('img'));
//                 }
//             }
//             bg1 = document.getElementById('gallery-bg1');
//             bg2 = document.getElementById('gallery-bg2');
//                 bg2.style.zIndex = -2;
//             }
//             // var activeBg = 1;
//             // var lastImage;
//             // function updateBackgroundColorFromVisibleImage() {
//             //     const imageDivs = document.querySelectorAll('.loadedGalleryImg:not([style*="display: none"])');
//             //     for (let i = 0; i < imageDivs.length - 1; i++) {
//             //         const rect = imageDivs[i].getBoundingClientRect();
//             //         if (window.innerWidth >= 768 ? (rect.top >= 0) : (rect.bottom >= window.innerHeight*0.4 && rect.bottom <= window.innerHeight)) {/* Lines 334-370 omitted */}
//             //     }
//             // }

//             // document.querySelector('#gallery-bg1').addEventListener('transitionend', () => {
//             //     bg2.style.transition = 'none';
//             //     bg2.style.opacity = 0;
//             //     activeBg = 1;
//             // })

//             // document.querySelector('#gallery-bg2').addEventListener('transitionend', () => {
//             //     bg1.style.transition = 'none';
//             //     bg1.style.opacity = 0;
//             //     activeBg = 2;
//             // })

//             // let lastScrollY = window.scrollY;
//             // let lastTime = Date.now();

//             // window.addEventListener('scroll', updateBackgroundColorFromVisibleImage);
//             // window.addEventListener('load', updateBackgroundColorFromVisibleImage);
//     }
// }

// document.querySelector('#gallery-bg2').addEventListener('transitionend', () => {
//     bg1.style.transition = 'none';
//     bg1.style.opacity = 0;
//     activeBg = 2;
// })

let lastScrollY = window.scrollY;
let lastTime = Date.now();

// Run on scroll and on load
// window.addEventListener('scroll', updateBackgroundColorFromVisibleImage);
// window.addEventListener('load', updateBackgroundColorFromVisibleImage);
// const checkboxes = ['#nature', '#portraits', '#city', '#other'];

// checkboxes.forEach(id => {
//     document.querySelector(id).addEventListener('change', checkboxTriggered);
// })

// document.querySelector('#recent').addEventListener('change', checkboxTriggered);

// function checkboxTriggered(event) {
//     const checkbox = document.getElementById(event.target.name + 'Text');
//     const checked = event.target.checked;

//     if (event.target.name === "recent") {
//         sortImages();
//     } else {
//         filterImages();
//     }

//     if (checked) {
//         checkbox.style.opacity = '0';
//         checkbox.style.transform = 'translateY(-100%)';
//         checkbox.style.transition = 'opacity .2s ease-in, transform .2s ease-in';
//         checkbox.style.opacity = '1';
//         checkbox.style.transform = 'translateY(0)';
//     } else {
//         checkbox.style.opacity = '0';
//         checkbox.style.transform = 'translateY(100%)';
//     }
// }

function filterImages() {
    const imageDivs = document.querySelectorAll('div.loadingGalleryImg, div.loadedGalleryImg');
    const checkedCategories = Array.from(checkboxes) //TODO
        .filter(checkbox => document.querySelector(checkbox).checked)
        .map(checkbox => checkbox.replace('#', ''));

    imageDivs.forEach(div => {
        const img = div.querySelector('img.galleryImg');
        if (!img) return;

        if (checkedCategories.includes(img.dataset.category)) {
            div.style.display = '';
        } else {
            div.style.display = 'none';
        }
    });
}

function sortImages() { //TODO
    const checked = document.querySelector('#recent').checked;
    while (gallerydiv.firstChild) {
        gallerydiv.removeChild(gallerydiv.firstChild);
    }

    let nums;
    if (checked) {
        nums = [];
        for (let i = AMOUNT_OF_IMAGES; i > 0; i--) {
            if (!excludedNums.includes(i)) nums.push(i);
        }
    } else {
        nums = [...originalOrder].filter(i => !excludedNums.includes(i));
    }

    nums.forEach(i => {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'loadingGalleryImg';
        imageDiv.id = i;

        const image = document.createElement('img');
        const src = `assets/gallery/${window.innerWidth < 768 ? `mobile/${i}m.jpg` : `${i}.jpg`}`;
        image.setAttribute('data-src', src);
        image.className = 'galleryImg';

        const filename = `${i}.jpg`;
        const matched = data.find(item => item.filename === filename);
        if (matched) {
            image.dataset.category = matched.category;
            imageDiv.style.aspectRatio = matched.width / matched.height;
            if (matched.width / matched.height > 1.1) {
                imageDiv.classList.add('landscapeGalleryImg');
            }
        }
        image.id = i;
        image.oncontextmenu = () => false;

        const loadingImage = document.createElement('img');
        loadingImage.src = 'assets/loading.gif';
        loadingImage.className = 'loadingGif';

        image.onload = function() {
            this.parentNode.className = 'loadedGalleryImg';
            this.parentNode.removeChild(this.parentNode.firstChild); // remove loading gif
            // adjust grid span
            setGridSpan(this.parentNode);
        };

        imageDiv.appendChild(loadingImage);
        imageDiv.appendChild(image);
        gallerydiv.appendChild(imageDiv);
    });

    filterImages();

    // Unveil images (lazy load)
    $("img").unveil(window.innerWidth < 768 ? 1000 : 500);
}

// Update loading logic for new structure
let loadedCount = 0;
const imageDivs = document.querySelectorAll('div.loadingGalleryImg, div.loadedGalleryImg');
imageDivs.forEach(div => {
    const img = div.querySelector('img.galleryImg');
    if (!img) return;

    if (img.complete) {
        loadedCount++;
        if (loadedCount >= 6) {
                document.body.classList.remove('loading');
                // compute grid spans once some images have loaded
                computeAllGridSpans();
        }
    } else {
        img.addEventListener('load', () => {
            loadedCount++;
            if (loadedCount >= 6) {
                document.body.classList.remove('loading');
                computeAllGridSpans();
            }
        });
        img.addEventListener('error', () => {
            loadedCount++;
            if (loadedCount >= 6) {
                document.body.classList.remove('loading');
                computeAllGridSpans();
            }
        });
    }
});

if (loadedCount === imageDivs.length) {
    document.body.classList.remove('loading');
    computeAllGridSpans();
}

// Calculate grid-row span for a grid item so varying aspect ratios fit together
function setGridSpan(item) {
    if (!item) return;
    const gallery = gallerydiv;
    const computed = getComputedStyle(gallery);
    const columnWidth = parseFloat(computed.getPropertyValue('grid-template-columns').split(' ')[0]);
    const aspectRatio = parseFloat(item.style.aspectRatio);
    console.log(aspectRatio);
    const rowHeight = parseFloat(computed.getPropertyValue('grid-auto-rows')) || 8;
    // 'gap' may return e.g. '16px' so parseFloat works
    const rowGap = parseFloat(computed.getPropertyValue('gap')) || 0;

    const img = item.querySelector('img.galleryImg');
    let itemHeight = columnWidth / aspectRatio;
    if (aspectRatio > 1.1) { // landscape
        itemHeight = (columnWidth * 2 + rowGap) / aspectRatio;
    }
    const span = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
    item.style.height = Math.floor(itemHeight) + 'px';
    item.style.gridRowEnd = `span ${span}`;
}

function computeAllGridSpans() {
    const items = gallerydiv.querySelectorAll('.loadingGalleryImg, .loadedGalleryImg');
    items.forEach(item => setGridSpan(item));
}

function setBackgroundShadow(item) {
    if (!item) return;
    const img = item.querySelector('img');
    if (!img || !img.complete) return;
    
    try {
        const rgb = getAverageRGB(img);
        const r = Math.min(rgb.r * 2, 255);
        const g = Math.min(rgb.g * 2, 255);
        const b = Math.min(rgb.b * 2, 255);
        
        const shadowDiv = document.createElement('div');
        shadowDiv.className = 'image-shadow';
        shadowDiv.style.boxShadow = `0px 0px 50px 10px rgba(${r}, ${g}, ${b})`;
        shadowDiv.style.zIndex = -1;
        item.appendChild(shadowDiv);
    } catch (e) {
        console.warn('Failed to set background shadow:', e);
    }
}

// Recompute spans on resize (debounced)
let _resizeTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(() => {
        computeAllGridSpans();
    }, 150);
});

const categories = document.getElementsByClassName('gallery-tab');

for (const category of categories) {
    category.addEventListener('click', function() {
        //TODO: filterImages(); (figure out how to sort by category)
        let categoryName = '';
        if (this.classList.contains('active-tab')) {
            categoryName = 'all';
            this.classList.remove('active-tab');
        } else {
            for (const cat of categories) {
                cat.classList.remove('active-tab');
            }
            this.classList.add('active-tab');
            categoryName = this.id.slice(0,-4); // remove '-tab' suffix
        }
        const imageDivs = document.querySelectorAll('div.loadingGalleryImg, div.loadedGalleryImg');
        imageDivs.forEach(div => {
            const img = div.querySelector('img.galleryImg');
            if (img.dataset.category != categoryName && categoryName != 'all') {
                div.style.display = 'none';
            } else {
                div.style.display = '';
            }
        });
    });
}

window.onload = function() {
    setTimeout(function() {
        window.scrollTo(0, -100);
    }, 0);
    this.document.oncontextmenu = function() { return false; };
}