
/* ==========================================
   GMC MUMBAI
   SECTION 01: NAVIGATION JAVASCRIPT
========================================== */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const dropdowns = document.querySelectorAll(".has-dropdown");


/* ==========================================
   MOBILE MENU TOGGLE
========================================== */

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        const isOpen = navLinks.classList.toggle("show");

        menuToggle.setAttribute("aria-expanded", isOpen);

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

    });

}


/* ==========================================
   DROPDOWN MENU
========================================== */

dropdowns.forEach(function (dropdown) {

    const dropdownButton = dropdown.querySelector(".dropdown-toggle");

    if (!dropdownButton) return;

    dropdownButton.addEventListener("click", function () {

        const isOpen = dropdown.classList.toggle("open");

        dropdownButton.setAttribute("aria-expanded", isOpen);

    });

});


/* ==========================================
   CLOSE MENU ON ESCAPE
========================================== */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        dropdowns.forEach(function (dropdown) {

            dropdown.classList.remove("open");

            const button = dropdown.querySelector(".dropdown-toggle");

            if (button) {
                button.setAttribute("aria-expanded", "false");
            }

        });

        if (navLinks && menuToggle) {

            navLinks.classList.remove("show");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

            menuToggle.focus();

        }

    }

});


/* ==========================================
   CLOSE MOBILE MENU AFTER LINK CLICK
========================================== */

document.querySelectorAll(".nav-links a").forEach(function (link) {

    link.addEventListener("click", function () {

        if (window.innerWidth <= 767 && navLinks && menuToggle) {

            navLinks.classList.remove("show");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        }

    });

});



/* ==========================================
   SECTION 03: HERO SLIDER JAVASCRIPT
========================================== */

const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".hero-dot");

const heroPrev = document.getElementById("heroPrev");
const heroNext = document.getElementById("heroNext");

let currentHeroSlide = 0;
let heroInterval;

const reduceHeroMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/* Show selected slide */

function showHeroSlide(index) {

    if (!heroSlides.length) return;

    currentHeroSlide = (
        index + heroSlides.length
    ) % heroSlides.length;

    heroSlides.forEach(function (slide, i) {

        slide.classList.toggle(
            "active",
            i === currentHeroSlide
        );

        slide.setAttribute(
            "aria-hidden",
            i === currentHeroSlide ? "false" : "true"
        );

    });

    heroDots.forEach(function (dot, i) {

        dot.classList.toggle(
            "active",
            i === currentHeroSlide
        );

        if (i === currentHeroSlide) {
            dot.setAttribute("aria-current", "true");
        } else {
            dot.removeAttribute("aria-current");
        }

    });

}


/* Next slide */

function nextHeroSlide() {
    showHeroSlide(currentHeroSlide + 1);
}


/* Previous slide */

function previousHeroSlide() {
    showHeroSlide(currentHeroSlide - 1);
}


/* Automatic slide rotation */

function startHeroSlider() {

    if (reduceHeroMotion || heroSlides.length < 2) return;

    clearInterval(heroInterval);

    heroInterval = setInterval(function () {
        nextHeroSlide();
    }, 5000);

}


/* Arrow events */

if (heroNext && heroPrev) {

    heroNext.addEventListener("click", function () {
        nextHeroSlide();
        startHeroSlider();
    });

    heroPrev.addEventListener("click", function () {
        previousHeroSlide();
        startHeroSlider();
    });

}


/* Dot events */

heroDots.forEach(function (dot, index) {

    dot.addEventListener("click", function () {
        showHeroSlide(index);
        startHeroSlider();
    });

});


/* Initialise slider */

if (heroSlides.length) {

    showHeroSlide(0);
    startHeroSlider();

}



/* ==========================================
   SECTION 04: NOTICE BOARD TABS
========================================== */

const noticeTabs = document.querySelectorAll(".notice-tab");

const noticePanels = document.querySelectorAll(".notice-panel");

noticeTabs.forEach(function (tab) {

    tab.addEventListener("click", function () {

        const targetPanel = tab.getAttribute("aria-controls");

        noticeTabs.forEach(function (item) {
            item.classList.remove("active");
            item.setAttribute("aria-selected", "false");
            item.setAttribute("tabindex", "-1");
        });

        noticePanels.forEach(function (panel) {
            panel.classList.remove("active");
            panel.hidden = true;
        });

        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        tab.setAttribute("tabindex", "0");

        const selectedPanel = document.getElementById(targetPanel);

        if (selectedPanel) {
            selectedPanel.hidden = false;
            selectedPanel.classList.add("active");
        }

    });

});


/* Duplicate notice content for continuous scrolling */

document.querySelectorAll(".notice-track").forEach(function (track) {

    const originalGroup = track.querySelector(".notice-group");

    if (!originalGroup) return;

    const clone = originalGroup.cloneNode(true);

    clone.removeAttribute("id");
    clone.setAttribute("aria-hidden", "true");

    clone.querySelectorAll("a").forEach(function (link) {
        link.setAttribute("tabindex", "-1");
    });

    track.appendChild(clone);

});


/* Photo gallery carousel */

document.querySelectorAll(".photo-gallery-carousel").forEach(function (carousel) {

    const track = carousel.querySelector(".photo-gallery-track");
    const previousButton = carousel.querySelector(".photo-gallery-prev");
    const nextButton = carousel.querySelector(".photo-gallery-next");

    if (!track || !previousButton || !nextButton) return;

    const originalSlides = Array.from(track.children);
    const cloneCount = Math.min(3, originalSlides.length);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visibleSlides = 3;
    let currentSlide = 0;
    let autoplay;

    function getVisibleSlides() {
        if (window.innerWidth <= 767) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function setTrackPosition() {
        const firstSlide = track.querySelector(".photo-gallery-slide");
        const secondSlide = firstSlide.nextElementSibling;
        const slideStep = secondSlide.getBoundingClientRect().left - firstSlide.getBoundingClientRect().left;
        const position = (cloneCount + currentSlide) * slideStep;

        track.style.transform = "translateX(-" + position + "px)";
    }

    const leadingClones = originalSlides.slice(-cloneCount).map(function (slide) {
        const clone = slide.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.querySelector("img").setAttribute("alt", "");
        return clone;
    });

    leadingClones.reverse().forEach(function (clone) {
        track.insertBefore(clone, track.firstChild);
    });

    originalSlides.slice(0, cloneCount).forEach(function (slide) {
        const clone = slide.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.querySelector("img").setAttribute("alt", "");
        track.appendChild(clone);
    });

    function updateVisibleSlides(reset) {
        const nextVisibleSlides = getVisibleSlides();

        if (reset || nextVisibleSlides !== visibleSlides) {
            visibleSlides = nextVisibleSlides;
            currentSlide = 0;
            track.classList.add("is-resetting");
            setTrackPosition();
            window.requestAnimationFrame(function () {
                track.classList.remove("is-resetting");
            });
        } else {
            setTrackPosition();
        }
    }

    function moveToNextSlide() {
        currentSlide = reducedMotion.matches && currentSlide >= originalSlides.length - 1
            ? 0
            : currentSlide + 1;
        setTrackPosition();
    }

    function moveToPreviousSlide() {
        currentSlide = reducedMotion.matches && currentSlide <= 0
            ? originalSlides.length - 1
            : currentSlide - 1;
        setTrackPosition();
    }

    track.addEventListener("transitionend", function (event) {
        if (event.propertyName !== "transform") return;

        if (currentSlide >= originalSlides.length) {
            currentSlide = 0;
            track.classList.add("is-resetting");
            setTrackPosition();
            window.requestAnimationFrame(function () {
                track.classList.remove("is-resetting");
            });
        } else if (currentSlide < 0) {
            currentSlide = originalSlides.length - 1;
            track.classList.add("is-resetting");
            setTrackPosition();
            window.requestAnimationFrame(function () {
                track.classList.remove("is-resetting");
            });
        }
    });

    function startAutoplay() {
        if (reducedMotion.matches) return;
        window.clearInterval(autoplay);
        autoplay = window.setInterval(moveToNextSlide, 5000);
    }

    previousButton.addEventListener("click", function () {
        moveToPreviousSlide();
    });

    nextButton.addEventListener("click", function () {
        moveToNextSlide();
    });

    carousel.addEventListener("mouseenter", function () {
        window.clearInterval(autoplay);
    });

    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", function () {
        window.clearInterval(autoplay);
    });
    carousel.addEventListener("focusout", function (event) {
        if (!carousel.contains(event.relatedTarget)) startAutoplay();
    });
    window.addEventListener("resize", function () {
        updateVisibleSlides(false);
    });

    updateVisibleSlides(true);
    currentSlide = Math.min(5, originalSlides.length - 1);
    setTrackPosition();

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                startAutoplay();
            } else {
                window.clearInterval(autoplay);
            }
        }, { threshold: 0.2 });

        observer.observe(carousel);
    } else {
        startAutoplay();
    }

});

/* In the news carousel */

const newsStories = [
    {
        source: "Hindustan Times",
        title: "State sanctions ₹210 crore for new medical college hostel at GT Hospital",
        image: "https://gmcmumbai.org/wp-content/uploads/2025/08/hindustan-times-768x606.png",
        url: "https://www.hindustantimes.com/cities/mumbai-news/state-sanctions-210-crore-for-new-medical-college-hostel-at-gt-hospital-101753901719522.html"
    },
    {
        source: "TOI News",
        title: "Latest news and updates from Gokuldas Tejpal Hospital",
        image: "https://gmcmumbai.org/wp-content/uploads/2025/08/toinews-768x563.png",
        url: "https://gmcmumbai.org/"
    },
    {
        source: "Medical Dialogues",
        title: "Medical education and healthcare updates from Mumbai",
        image: "https://gmcmumbai.org/wp-content/uploads/2025/08/medical-dialogues-e1755458461692-768x598.png",
        url: "https://gmcmumbai.org/"
    },
    {
        source: "Hindustan Times",
        title: "GT Hospital and Government Medical College in the news",
        image: "https://gmcmumbai.org/wp-content/uploads/2025/08/hindustan-times-768x606.png",
        url: "https://gmcmumbai.org/"
    }
];

const newsContent = document.querySelector(".news-video-content");
const newsSource = document.querySelector(".news-source");
const newsStoryLink = document.querySelector(".news-story-link");
const newsPrevious = document.querySelector(".news-prev");
const newsNext = document.querySelector(".news-next");
let currentNewsStory = 0;

function showNewsStory(index) {

    if (!newsContent || !newsSource || !newsStoryLink) return;

    currentNewsStory = (index + newsStories.length) % newsStories.length;

    const story = newsStories[currentNewsStory];

    newsSource.textContent = story.source;
    newsStoryLink.href = story.url;
    newsStoryLink.querySelector("strong").textContent = story.title;
    newsContent.style.backgroundImage =
        "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.35)), url('" +
        story.image +
        "')";

}

if (newsPrevious && newsNext) {

    newsPrevious.addEventListener("click", function () {
        showNewsStory(currentNewsStory - 1);
    });

    newsNext.addEventListener("click", function () {
        showNewsStory(currentNewsStory + 1);
    });

    showNewsStory(currentNewsStory);

}
