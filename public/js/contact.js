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

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

if (getUrlParameter('submitted') === 'true') {
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('success-message').style.display = 'block';
}


function getAverageRGB(imgSource) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const targetSize = 20; // much smaller than full size
    canvas.width = targetSize;
    canvas.height = targetSize;

    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            // Draw scaled down image
            context.drawImage(img, 0, 0, targetSize, targetSize);

            let data;
            try {
                data = context.getImageData(0, 0, targetSize, targetSize).data;
            } catch {
                resolve({ r: 0, g: 0, b: 0 });
                return;
            }

            let r = 0, g = 0, b = 0;
            const totalPixels = targetSize * targetSize;

            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
            }

            resolve({
                r: Math.round(r / totalPixels),
                g: Math.round(g / totalPixels),
                b: Math.round(b / totalPixels)
            });
        };
        img.src = imgSource;
    });
}

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
        const squareImageObjects = jsonData.filter(item => ((item.width / item.height > 0.9)) && (item.category === 'portraits' || item.category === 'other'));
        backgrounds = squareImageObjects.map(item => `assets/gallery/${item.filename}`);
        backgrounds = shuffle(backgrounds);
        startBackgroundRotation();
    })


let index = 0;
let showingBg1 = true;

const bg1 = document.getElementById('bg1');
const bg2 = document.getElementById('bg2');
const mainBg = document.getElementById('contactMainBackground');

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
    mainBg.style.transition = '';
    getAverageRGB(backgrounds[0]).then(avgColor => {
        mainBg.style.backgroundColor = `rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b})`;
    });
    mainBg.style.transition = 'background-color 0.5s ease';
    setInterval(() => {
        index = (index + 1) % backgrounds.length;
        const nextBackground = backgrounds[index];
        const newTime = Date.now();
        if (newTime >= currentTime+5000) {
            currentTime = newTime;
            if (showingBg1) {
                bg2.src = nextBackground;
                getAverageRGB(nextBackground).then(avgColor => {
                    mainBg.style.backgroundColor = `rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b})`;
                });
                bg2.style.zIndex = -1;
                bg1.style.zIndex = -2;
                bg2.style.transition = 'opacity 1s ease';
                bg2.style.opacity = 1;
                showingBg1 = false;
            } else {
                bg1.src = nextBackground;
                getAverageRGB(nextBackground).then(avgColor => {
                    mainBg.style.backgroundColor = `rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b})`;
                });
                bg1.style.zIndex = -1;
                bg2.style.zIndex = -2;
                bg1.style.transition = 'opacity 1s ease';
                bg1.style.opacity = 1;
                showingBg1 = true;
            }
        }
    }, 6000)
}
