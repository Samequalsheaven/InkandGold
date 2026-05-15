// Initialize Lucide Icons
lucide.createIcons();

// DOM Elements
const bgm = document.getElementById('audio-bgm');
const narration = document.getElementById('audio-narration');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const statusText = document.getElementById('status-text');
const statusIndicator = document.getElementById('status-indicator');

const bgmSlider = document.getElementById('bgm-slider');
const narrationSlider = document.getElementById('narration-slider');
const bgmVal = document.getElementById('bgm-val');
const narVal = document.getElementById('nar-val');

const videoPanel = document.getElementById('video-panel');
const heroContent = document.getElementById('hero-content');
const heroBg = document.getElementById('hero-bg');
const progressBar = document.getElementById('progress-bar');
const navbar = document.getElementById('navbar');

// State
let isPlaying = false;

// --- 1. Audio Logic ---

bgm.volume = bgmSlider.value;
narration.volume = narrationSlider.value;

function togglePlayback() {
    if (isPlaying) {
        bgm.pause();
        narration.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        statusText.innerText = "Paused";
        statusIndicator.classList.remove('bg-green-500', 'animate-pulse');
        statusIndicator.classList.add('bg-stone-600');
        isPlaying = false;
    } else {
        bgm.play().catch(e => console.log("BGM Error:", e));
        narration.play().catch(e => console.log("Narration Error:", e));
        
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        statusText.innerText = "Now Playing";
        statusIndicator.classList.remove('bg-stone-600');
        statusIndicator.classList.add('bg-green-500', 'animate-pulse');
        isPlaying = true;
    }
}

bgmSlider.addEventListener('input', (e) => {
    bgm.volume = e.target.value;
    bgmVal.innerText = Math.round(e.target.value * 100) + '%';
});

narrationSlider.addEventListener('input', (e) => {
    narration.volume = e.target.value;
    narVal.innerText = Math.round(e.target.value * 100) + '%';
});

// --- 2. Video Panel Logic ---
function toggleVideoPanel() {
    videoPanel.classList.toggle('translate-x-full');
    const video = videoPanel.querySelector('video');
    if(videoPanel.classList.contains('translate-x-full') && video) {
        video.pause();
    }
}

// --- 3. Intersection Observer (Reveal on Scroll) ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before element is fully in view
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

// --- 4. Scroll Effects (Progress, Parallax, Navbar) ---
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    
    // Progress Bar
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';

    // Parallax Hero
    if (scrollTop < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollTop * 0.4}px) scale(${1 + scrollTop * 0.0005})`;
    }

    // Navbar Transparency
    if (scrollTop > 50) {
        navbar.classList.add('bg-stone-900/90', 'backdrop-blur-md', 'shadow-md');
        navbar.classList.remove('bg-gradient-to-b');
    } else {
        navbar.classList.remove('bg-stone-900/90', 'backdrop-blur-md', 'shadow-md');
        navbar.classList.add('bg-gradient-to-b');
    }
});

// --- 5. Interactive Ink Blots ---
document.addEventListener('click', (e) => {
    // Ignore clicks on buttons/inputs/video panel
    if(e.target.closest('button') || e.target.closest('input') || e.target.closest('#video-panel') || e.target.closest('#audio-dock')) return;

    const blot = document.createElement('div');
    blot.classList.add('ink-blot');
    
    // Randomize size slightly
    const size = Math.random() * 60 + 40; 
    
    blot.style.width = size + 'px';
    blot.style.height = size + 'px';
    blot.style.left = (e.pageX - size/2) + 'px';
    blot.style.top = (e.pageY - size/2) + 'px';
    
    document.body.appendChild(blot);
    
    // Cleanup
    setTimeout(() => blot.remove(), 2000);
});

// --- 6. Typewriter Effect ---
const textToType = '"We are not flesh, but brushstrokes. We are not blood, but water."';
const typeWriterElement = document.getElementById('typewriter-text');
let charIndex = 0;

function typeWriter() {
    if (charIndex < textToType.length) {
        typeWriterElement.innerHTML += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 50); // Speed of typing
    }
}

// --- 7. Initial Load Animations ---
window.addEventListener('load', () => {
    heroContent.classList.remove('opacity-0', 'translate-y-10');
    setTimeout(typeWriter, 800); // Start typing after hero loads
});

function scrollToStory() {
    document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
}
