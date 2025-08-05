// Gallery Slideshow Logic

const galleryPath = 'public/gallery/';
const galleryImageElement = document.getElementById('gallery-image');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let galleryImages = [];
let currentImage = 0;

// Fetch image list from gallery.json (must be maintained in /public/gallery/)
async function fetchGalleryImages() {
    try {
        const res = await fetch(`${galleryPath}gallery.json`);
        if (res.ok) {
            galleryImages = await res.json();
        }
    } catch {
        // Fallback to hardcoded
        galleryImages = ['img1.jpg', 'img2.jpg'];
    }
    if (galleryImages.length === 0) {
        galleryImageElement.style.display = 'none';
        return;
    }
    showGalleryImage(currentImage);
}

function showGalleryImage(idx) {
    if (!galleryImages.length) return;
    currentImage = (idx + galleryImages.length) % galleryImages.length;
    galleryImageElement.src = `${galleryPath}${galleryImages[currentImage]}`;
}

prevBtn.onclick = () => showGalleryImage(currentImage - 1);
nextBtn.onclick = () => showGalleryImage(currentImage + 1);

let slideshowInterval = setInterval(() => showGalleryImage(currentImage + 1), 4000);
galleryImageElement.addEventListener('mouseenter', () => clearInterval(slideshowInterval));
galleryImageElement.addEventListener('mouseleave', () => {
    slideshowInterval = setInterval(() => showGalleryImage(currentImage + 1), 4000);
});

fetchGalleryImages();
