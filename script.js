import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

// === Three.js "Cosmic Dust" Scene ===
let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;
const container = document.getElementById('canvas-container');

function init3D() {
    if (!container) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const particleCount = 7000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 15;
        positions[i3 + 1] = (Math.random() - 0.5) * 15;
        positions[i3 + 2] = (Math.random() - 0.5) * 15;

        // A mix of blue and white for a vibrant feel
        const randomColor = Math.random();
        if (randomColor < 0.2) {
            color.set(0x5DADE2); // Light Blue
        } else if (randomColor < 0.3) {
            color.set(0x2E86C1); // Darker Blue
        }
        else {
            color.set(0xffffff); // white
        }
        color.toArray(colors, i3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.01,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
}


function onWindowResize() {
    if (!renderer || !camera) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - (window.innerWidth / 2)) / (window.innerWidth / 2);
    mouseY = (event.clientY - (window.innerHeight / 2)) / (window.innerHeight / 2);
}

function animate3D() {
    if (!particles || !camera || !scene || !renderer) return;
    requestAnimationFrame(animate3D);

    const time = Date.now() * 0.0001;
    particles.rotation.y = time * 0.2;
    particles.rotation.x = time * 0.1;


    camera.position.x += (mouseX - camera.position.x) * 0.02;
    camera.position.y += (-mouseY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}


// === Standard Page Logic (Menu, Scroll Animations, Modal, etc.) ===
document.addEventListener('DOMContentLoaded', () => {
    init3D();
    animate3D();
    setupMobileMenu();
    setupScrollAnimations();
    setupHeaderScroll();
    setupBetModal();
    setupPageTransitions();
});

// --- Helper Functions ---

function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const openIcon = document.getElementById('menu-icon-open');
    const closeIcon = document.getElementById('menu-icon-close');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            openIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                openIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        });
    }
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

function setupHeaderScroll() {
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('glass-effect', window.scrollY > 20);
            header.classList.toggle('shadow-lg', window.scrollY > 20);
        });
    }
}

function setupBetModal() {
    const betCards = document.querySelectorAll('.bet-card');
    const modal = document.getElementById('bet-modal');
    if (!betCards.length || !modal) return;
    
    const modalOverlay = document.getElementById('modal-overlay');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalOdds = document.getElementById('modal-odds');
    const modalStatus = document.getElementById('modal-status');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    const showModal = (card) => {
        if(modalImage) modalImage.src = card.querySelector('.bet-image')?.src || '';
        if(modalTitle) modalTitle.innerText = card.querySelector('.bet-title')?.innerText || 'N/A';
        if(modalDesc) modalDesc.innerText = card.querySelector('.bet-desc')?.innerText || 'N/A';
        if(modalOdds) modalOdds.innerText = card.querySelector('.bet-odds')?.innerText || '';
        if(modalStatus) modalStatus.innerText = card.querySelector('.bet-status')?.innerText || '';
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('visible'), 10);
        document.body.style.overflow = 'hidden';
    };

    const hideModal = () => {
        modal.classList.remove('visible');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    };

    betCards.forEach(card => card.addEventListener('click', () => showModal(card)));
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideModal);
    if (modalOverlay) modalOverlay.addEventListener('click', hideModal);
}

function setupPageTransitions() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const hidePreloader = () => preloader.classList.add('preloader-hidden');

    window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 3000); // Failsafe to ensure it always hides

    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        const isLocalLink = !link.target && href && !href.startsWith('#') && (link.href.includes(window.location.hostname) || !href.startsWith('http'));
        if (isLocalLink) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                preloader.classList.remove('preloader-hidden');
                setTimeout(() => window.location.href = link.href, 500);
            });
        }
    });
}