// Gallery Slideshow Logic

const galleryPath = '/gallery/';
const galleryImageElement = document.getElementById('gallery-image');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let galleryImages = [];
let currentImage = 0;

// Fetch image list from gallery.json (must be maintained in /gallery/)
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

// Video Section Logic

const videosPath = '/videos/';
const videoListElement = document.getElementById('video-list');
const videoPlayerElement = document.getElementById('video-player');
const videoSourceElement = document.getElementById('video-source');
const videoTitleElement = document.getElementById('video-title');

let videosList = [];
let currentVideoIndex = 0;

// Fetch videos list from videos.json
async function fetchVideos() {
    try {
        const res = await fetch(`${videosPath}videos.json`);
        if (res.ok) {
            videosList = await res.json();
        }
    } catch {
        // Fallback to empty array
        videosList = [];
    }
    if (videosList.length === 0) {
        videoListElement.innerHTML = '<p style="text-align: center; color: #888;">No videos available at the moment.</p>';
        return;
    }
    renderVideoList();
    loadVideo(0); // Load the first video by default
}

function renderVideoList() {
    videoListElement.innerHTML = '';
    videosList.forEach((video, index) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        if (index === currentVideoIndex) {
            videoItem.classList.add('active');
        }
        
        const thumbnail = document.createElement('div');
        thumbnail.className = 'video-thumbnail';
        thumbnail.style.backgroundImage = video.thumbnail ? `url(${videosPath}${video.thumbnail})` : 'none';
        thumbnail.style.backgroundColor = video.thumbnail ? 'transparent' : '#225a94';
        
        if (!video.thumbnail) {
            const playIcon = document.createElement('span');
            playIcon.innerHTML = '&#9658;';
            playIcon.style.fontSize = '2rem';
            playIcon.style.color = '#fff';
            thumbnail.appendChild(playIcon);
        }
        
        const title = document.createElement('div');
        title.className = 'video-item-title';
        title.textContent = video.title;
        
        videoItem.appendChild(thumbnail);
        videoItem.appendChild(title);
        
        videoItem.addEventListener('click', () => loadVideo(index));
        
        videoListElement.appendChild(videoItem);
    });
}

function loadVideo(index) {
    currentVideoIndex = index;
    const video = videosList[index];
    
    videoSourceElement.src = `${videosPath}${video.url}`;
    videoTitleElement.textContent = video.title;
    videoPlayerElement.load();
    
    // Update active state in video list
    document.querySelectorAll('.video-item').forEach((item, idx) => {
        if (idx === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

fetchVideos();
