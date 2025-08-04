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
fetch('js/image_categories.json')
    .then(response => response.json())
    .then(jsonData => {
        const data = jsonData;

        while (nums.length > 0) {
            const i = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
            const image = document.createElement('img');
            image.src = 'assets/gallery/' + i + '.jpg';
            const filename = i + '.jpg';
            const matched = data.find(item => item.filename === filename);
            if (matched) {
                image.dataset.category = matched.category;
            }
            image.className = 'galleryimg';
            gallerydiv.appendChild(image);
        }
    })
    .catch(error => console.error('Error loading JSON:', error));

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
    console.log(originalIndex);
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
            console.log(images[originalIndex], aspectRatio, clone.width, clone.height);
        }
    }

    function prev() {
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
            console.log(images[originalIndex], aspectRatio, clone.width, clone.height);
        }
    }

    //copy pasted generic swipe detection code
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;                                                        
    var yDown = null;

    function getTouches(evt) {
    return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }                                                     
                                                                            
    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                
                                                                            
    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
                                                                            
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                prev(); 
            } else {
                next();
            }                       
        } else {
            if ( yDiff > 0 ) {
                /* down swipe */ 
            } else { 
                /* up swipe */
            }                                                                 
        }
        /* reset values */
        xDown = null;
        yDown = null;                                             
    };
})

var activeBg = 1;
var lastImage;
function updateBackgroundColorFromVisibleImage() {
    const images = document.querySelectorAll('img.galleryimg:not([style*="display: none"])');
    for (let i = 0; i < images.length - 1; i++) {
        const rect = images[i].getBoundingClientRect();
        if (window.innerWidth >= 768 ? (rect.top >= 0) : (rect.top >= window.innerHeight*0.15) && rect.bottom <= window.innerHeight) {
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
                if (images[i].width + images[i+1].width + images[i+2].width <= window.innerWidth * 0.74) {
                    rgb3 = getAverageRGB(images[i + 2]);
                }
            }
            bg1 = document.getElementById('gallery-bg1');
            bg2 = document.getElementById('gallery-bg2');
            if (activeBg === 1) {
                bg2.style.zIndex = -1;
                bg1.style.zIndex = -2;
                bg2.style.background = `linear-gradient(to right, rgb(${rgb1.r}, ${rgb1.g}, ${rgb1.b}), rgb(${rgb2.r}, ${rgb2.g}, ${rgb2.b})` + (rgb3 ? `, rgb(${rgb3.r}, ${rgb3.g}, ${rgb3.b})` : '') + ')';
                bg2.style.transition = 'opacity .25s ease-in';
                bg2.style.opacity = 1;

                activeBg = 0;
            } else if (activeBg === 2) {
                bg1.style.zIndex = -1;
                bg2.style.zIndex = -2;
                bg1.style.background = `linear-gradient(to right, rgb(${rgb1.r}, ${rgb1.g}, ${rgb1.b}), rgb(${rgb2.r}, ${rgb2.g}, ${rgb2.b})` + (rgb3 ? `, rgb(${rgb3.r}, ${rgb3.g}, ${rgb3.b})` : '') + ')';
                bg1.style.transition = 'opacity .25s ease-in';
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
const checkboxes = ['#random', '#nature', '#portraits', '#macro', '#city', '#other'];

checkboxes.forEach(id => {
    document.querySelector(id).addEventListener('change', filterImages);
})

function filterImages() {
    const images = document.querySelectorAll('img.galleryimg');
    const checkedCategories = Array.from(checkboxes)
        .filter(checkbox => document.querySelector(checkbox).checked)
        .map(checkbox => checkbox.replace('#', ''));
    images.forEach(img => {
        const imgCategory = img.dataset.category;
        if (checkedCategories.includes('random') || checkedCategories.includes(imgCategory)) {
            img.style.display = '';
        } else {
            img.style.display = 'none';
        }
    });
}

document.querySelector('#random').addEventListener('change', function() {
    if (this.checked) {
        checkboxes.forEach(id => {
            if (id !== '#random') {
                document.querySelector(id).checked = true;
            }
        });
    }
});

checkboxes.forEach(id => {
    if (id !== '#random') {
        document.querySelector(id).addEventListener('change', function() {
            if (!this.checked) {
                document.querySelector('#random').checked = false;
            }
        });
    }
});



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

