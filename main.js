'use strict';

/*=============== CONTACT SETTINGS ===============*/

// بريد استقبال الرسائل. يفتح النموذج تطبيق البريد ولا يرسل من خادم.
const CONTACT_EMAIL = 'nooreldin20162007@gmail.com';

/*=============== SHARED SETTINGS ===============*/

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile = window.matchMedia('(max-width: 800px)');

/*=============== SHOW & CLOSE MOBILE MENU ===============*/

const menu = document.querySelector('#nav-menu');
const toggle = document.querySelector('#nav-toggle');
const navLinks = [...document.querySelectorAll('.nav__link')];

function setMenu(open, returnFocus = false) {
    menu.classList.toggle('show-menu', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    menu.inert = mobile.matches && !open;
    if (open) navLinks[0].focus();
    if (returnFocus) toggle.focus();
}

toggle.addEventListener('click', () =>
    setMenu(toggle.getAttribute('aria-expanded') !== 'true'),
);

navLinks.forEach((link) =>
    link.addEventListener('click', () => {
        setMenu(false);
        if (mobile.matches) {
            const target = document.querySelector(link.hash);
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        }
    }),
);
mobile.addEventListener('change', () => setMenu(false));
setMenu(false);

document.addEventListener('keydown', (event) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
        setMenu(false, true);
        return;
    }
    if (event.key === 'Tab') {
        const items = [toggle, ...navLinks];
        const first = items[0],
            last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
});

/*=============== HEADER / SCROLL UP / ACTIVE LINKS ===============*/

const header = document.querySelector('#header');
const scrollUp = document.querySelector('#scroll-up');
const sections = [...document.querySelectorAll('main section[id]')];
let scrollQueued = false;

function updateScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
    const visible = window.scrollY > 550;
    scrollUp.classList.toggle('visible', visible);
    scrollUp.tabIndex = visible ? 0 : -1;
    let current = sections[0].id;
    for (const section of sections)
        if (section.getBoundingClientRect().top <= 150) current = section.id;
    navLinks.forEach((link) => {
        const active = link.hash === '#' + current;
        link.classList.toggle('active-link', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });
    scrollQueued = false;
}

window.addEventListener(
    'scroll',
    () => {
        if (!scrollQueued) {
            requestAnimationFrame(updateScroll);
            scrollQueued = true;
        }
    },
    { passive: true },
);
updateScroll();
document.querySelector('#year').textContent = new Date().getFullYear();

/*=============== HOME TYPED TEXT ===============*/

const typed = document.querySelector('#home-typed');
const words = ['Web Developer', 'Freelancer', 'SEO Specialist'];
let wordIndex = 0,
    deleting = true,
    typeTimer;

function typeNext() {
    if (reducedMotion.matches) return;
    const word = words[wordIndex];
    let delay = deleting ? 45 : 95;
    if (deleting) {
        typed.textContent = typed.textContent.slice(0, -1);
        if (!typed.textContent) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 250;
        }
    } else {
        typed.textContent = word.slice(0, typed.textContent.length + 1);
        if (typed.textContent === word) {
            deleting = true;
            delay = 2600;
        }
    }
    typeTimer = setTimeout(typeNext, delay);
}

function setupTyping() {
    clearTimeout(typeTimer);
    typed.textContent = words[0];
    wordIndex = 0;
    deleting = true;
    if (!reducedMotion.matches) typeTimer = setTimeout(typeNext, 2600);
}

setupTyping();
reducedMotion.addEventListener('change', setupTyping);

/*=============== WORK CAROUSEL ===============*/

const track = document.querySelector('#work-track');
const previous = document.querySelector('#work-prev'),
    next = document.querySelector('#work-next');

function moveProjects(direction) {
    const step =
        track.querySelector('.work__card').getBoundingClientRect().width +
        parseFloat(getComputedStyle(track).gap);
    track.scrollBy({
        left: step * direction,
        behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
}

previous.addEventListener('click', () => moveProjects(-1));
next.addEventListener('click', () => moveProjects(1));
track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        moveProjects(event.key === 'ArrowRight' ? 1 : -1);
    }
});

function updateCarousel() {
    previous.disabled = track.scrollLeft <= 3;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 3;
}

track.addEventListener('scroll', updateCarousel, { passive: true });

window.addEventListener('resize', updateCarousel);
updateCarousel();

/*=============== SERVICES ACCORDION ===============*/

const serviceCards = [...document.querySelectorAll('.services__card')];

serviceCards.forEach((card) =>
    card.addEventListener('toggle', () => {
        if (card.open)
            serviceCards.forEach((other) => {
                if (other !== card) other.open = false;
            });
    }),
);

/*=============== SCROLL REVEAL ANIMATION ===============*/

if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(
        (entries) =>
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('reveal-pending');
                    observer.unobserve(entry.target);
                }
            }),
        { threshold: 0.06 },
    );
    document.querySelectorAll('.reveal').forEach((element) => {
        element.classList.add('reveal-pending');
        observer.observe(element);
    });
}

/*=============== PROJECT DATA ===============*/

// عدّل اسم المشروع ووصفه والتقنيات ومسار صورته والرابط المباشر هنا.
// liveUrl: اتركها فارغة للمشاريع التي لم تضف رابطها بعد.
const projects = [
    {
        title: 'iPower',
        image: 'assets/img/ipower.png',
        liveUrl: '',
        description:
            'A professional website for an IT company, using HTML, CSS, JavaScript, and database integration.',
        tags: ['HTML', 'CSS', 'JavaScript', 'Database'],
    },
    {
        title: 'Adly Chess Academy',
        image: 'assets/img/adly-chess.png',
        liveUrl: 'https://nour-eldin11.github.io/adly-chess-academy/',
        description:
            'A website for a chess academy, combining interface design, front-end development, motion, and database integration.',
        tags: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Figma', 'Database'],
    },
    {
        title: 'Twins Elmasrya',
        image: 'assets/img/twins-elmasrya.png',
        liveUrl: 'https://twins-almasrya.com/en/',
        description:
            'A professional website for an office furniture company, using HTML, CSS, JavaScript, and database integration.',
        tags: ['HTML', 'CSS', 'JavaScript', 'Database'],
    },
    {
        title: 'Kick Zone Sportswear',
        image: 'assets/img/kick-zone-sportswear.png',
        liveUrl: '',
        description:
            'A sportswear online store project, using HTML, CSS, JavaScript, and database integration.',
        tags: ['HTML', 'CSS', 'JavaScript', 'Database'],
    },
    {
        title: 'Verofax',
        image: 'assets/img/verofax.png',
        liveUrl: 'https://nour-eldin11.github.io/Verofax_Project/',
        description:
            'A corporate website project, using HTML, CSS, JavaScript, and database integration.',
        tags: ['HTML', 'CSS', 'JavaScript', 'Database'],
    },
    {
        title: 'PrimeCare Clinic',
        image: 'assets/img/primecare-clinic.svg',
        imageAlt: 'PrimeCare Clinic project cover',
        liveUrl: 'https://nour-eldin11.github.io/primecare-clinic-react-with-index/',
        description: 'A modern healthcare website built with React.',
        tags: ['React', 'JavaScript', 'CSS'],
    },
    {
        title: 'Offgrid Supply',
        image: 'assets/img/offgrid-supply.svg',
        imageAlt: 'Offgrid Supply project cover',
        liveUrl: 'https://nour-eldin11.github.io/Offgrid-Supply-Website-TypeScript/',
        description: 'A streetwear storefront built with TypeScript.',
        tags: ['TypeScript', 'HTML', 'CSS'],
    },
];

/*=============== PROJECT DETAILS DIALOG ===============*/

const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach((button) =>
    button.addEventListener('click', () => {
        const project = projects[Number(button.dataset.project)];
        document.querySelector('#project-title').textContent = project.title;
        const projectImage = document.querySelector('#project-image');
        projectImage.src = project.image;
        projectImage.alt = project.imageAlt || project.title + ' website screenshot';
        document.querySelector('#project-description').textContent = project.description;

        // إظهار زر الموقع فقط عندما يكون للمشروع رابط حقيقي.
        const liveLink = document.querySelector('#project-live-link');
        const projectNote = document.querySelector('#project-note');
        const hasLiveUrl = Boolean(project.liveUrl);

        liveLink.hidden = !hasLiveUrl;

        if (hasLiveUrl) {
            liveLink.href = project.liveUrl;
            liveLink.setAttribute(
                'aria-label',
                `Visit ${project.title} live site (opens in a new tab)`,
            );
            projectNote.textContent = 'Explore the live website in a new tab.';
        } else {
            liveLink.removeAttribute('href');
            liveLink.removeAttribute('aria-label');
            projectNote.textContent =
                'Website screenshot. The live project link will be added when available.';
        }

        const tags = document.querySelector('#project-tags');
        tags.replaceChildren();
        project.tags.forEach((tag) => {
            const item = document.createElement('span');
            item.textContent = tag;
            tags.append(item);
        });
        dialog.showModal();
        document.body.classList.add('dialog-open');
    }),
);
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
dialog.addEventListener('click', (event) => {
    const r = dialog.getBoundingClientRect();
    if (
        event.target === dialog &&
        (event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom)
    )
        dialog.close();
});

document.querySelector('#project-contact').addEventListener('click', () => {
    dialog.close();
    const contact = document.querySelector('#contact');
    contact.setAttribute('tabindex', '-1');
    contact.focus({ preventScroll: true });
});

/*=============== CONTACT FORM ===============*/

// الرسالة تفتح كمسودة؛ الزائر يراجعها ويرسلها بنفسه من تطبيق البريد.
const form = document.querySelector('#contact-form'),
    status = document.querySelector('#form-status');
if (CONTACT_EMAIL) {
    document.querySelector('#contact-submit').firstChild.textContent =
        'Open email draft ';
    document.querySelector('#form-note').textContent =
        'This opens a draft in your email app. Review and send it there.';
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim(),
        email = form.elements.email.value.trim(),
        message = form.elements.message.value.trim();
    if (!name || message.length < 10) {
        status.textContent =
            'Please add your name and at least 10 characters about your project.';
        return;
    }
    const brief = `PROJECT BRIEF\nFor: Nour EL Din\n\nName: ${name}\nEmail: ${email}\nService: ${form.elements.service.value}\n\nProject details:\n${message}\n`;
    if (CONTACT_EMAIL) {
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Project inquiry from ' + name)}&body=${encodeURIComponent(brief)}`;
        status.textContent =
            'Email draft requested. Please send it from your email app; this website has not sent a message.';
    } else {
        const url = URL.createObjectURL(
            new Blob([brief], { type: 'text/plain;charset=utf-8' }),
        );
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'project-brief.txt';
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        status.textContent =
            'Your project brief is ready to save. Nothing has been sent. Your details remain in this form.';
    }
});
