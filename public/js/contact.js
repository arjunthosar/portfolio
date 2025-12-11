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

let data;
const row1 = document.getElementById('row1');
const row2 = document.getElementById('row2');
fetch('js/image_categories.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;

        const portraits = data.filter(item => item.category === 'portraits').map(item => item.filename);
        for (let i = portraits.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [portraits[i], portraits[j]] = [portraits[j], portraits[i]];
        }

        for (let i = 0; i < 20; i++) {
            const image = document.createElement('img');
            image.src = 'assets/gallery/' + portraits[i];
            image.className = 'contactimg';
            // image.id = portraits[i].split('.')[0];
            if (i < 10) {
                row1.appendChild(image);
            } else if (window.innerWidth >= 768) {
                row2.appendChild(image);
            } else {
                row1.appendChild(image);
            }
        }
        const row1Length = row1.children.length;
        for (let i = 0; i < row1Length * 2; i++) {
            const clone = row1.children[i % row1Length].cloneNode(true);
            row1.appendChild(clone);
        }
        if (window.innerWidth >= 768) {
            const row2Length = row2.children.length;
            for (let i = 0; i < row2Length * 2; i++) {
                const clone = row2.children[i % row2Length].cloneNode(true);
                row2.appendChild(clone);
            }
        }
        row1.style.animation = window.innerWidth >= 768 ? 'scrollUp 60s linear infinite' : 'scrollUp 80s linear infinite'
        window.innerWidth >= 768 ? row2.style.animation = 'scrollDown 60s linear infinite' : null

    })
    .catch(error => console.error('Error loading JSON:', error));

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