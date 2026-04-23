function getLinks() {
    return document.querySelectorAll('.nav-link');
}

function removeActiveClass() {
    getLinks().forEach((link) => link.classList.remove('active'));
}

function activateLinkBySection(sectionId) {
    const currentLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (!currentLink) {
        return;
    }

    removeActiveClass();
    currentLink.classList.add('active');
}

function observeSections() {
    const sections = document.querySelectorAll('.observe-section');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    activateLinkBySection(entry.target.id);
                }
            });
        },
        {
            threshold: 0.35
        }
    );

    sections.forEach((section) => observer.observe(section));
}

function addClickEvents() {
    getLinks().forEach((link) => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('href')?.replace('#', '');

            if (targetId) {
                activateLinkBySection(targetId);
            }
        });
    });
}

export function initNavigation() {
    observeSections();
    addClickEvents();
}