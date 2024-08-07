const segments = [0, 10.5, 21.5, 32.5, 43, 53.5, 65, 75.5, 86, 96.5, 107, 117];
let currentSegmentIndex = 0;
const videoPlayer = document.getElementById('videoPlayer');
const progressBar = document.getElementById('progressBar');
const startButton = document.getElementById('startButton');
const loadingText = document.getElementById('loadingText');
const progressContainer = document.getElementById('progressContainer');

let buttonDisplayed = false;

function updateProgress() {
    if (videoPlayer.buffered.length > 0) {
        const bufferedEnd = videoPlayer.buffered.end(videoPlayer.buffered.length - 1);
        const duration = videoPlayer.duration;
        if (duration > 0) {
            const percentBuffered = (bufferedEnd / duration) * 100;
            progressBar.style.width = percentBuffered + '%';
            console.log(`Буферизация: ${percentBuffered}%`);
            if (bufferedEnd >= 20) {
                if (!buttonDisplayed) {
                    startButton.style.display = 'block';
                    loadingText.style.display = 'none';
                    progressContainer.style.display = 'none';
                    buttonDisplayed = true;
                }
            }
        }
    }
    requestAnimationFrame(updateProgress);
}

videoPlayer.addEventListener('loadeddata', () => {
    console.log('Данные видео загружены.');
    videoPlayer.classList.add('video-visible');
    requestAnimationFrame(updateProgress);
});

function startVideo() {
    videoPlayer.play().then(() => {
        startButton.style.display = 'none';
        requestAnimationFrame(updateVideo);
    }).catch(error => {
        console.error("Ошибка при попытке воспроизведения видео:", error);
    });
}

function updateVideo() {
    const currentTime = videoPlayer.currentTime;
    const segmentEnd = segments[currentSegmentIndex] + (segments[currentSegmentIndex + 1] ? segments[currentSegmentIndex + 1] - segments[currentSegmentIndex] : videoPlayer.duration);
    
    if (currentTime >= segmentEnd) {
        currentSegmentIndex = (currentSegmentIndex + 1) % segments.length;
        videoPlayer.currentTime = segments[currentSegmentIndex];
        videoPlayer.play().catch(error => {
            console.error("Ошибка при попытке воспроизведения видео:", error);
        });
    }
    
    requestAnimationFrame(updateVideo);
}

function nextSegment() {
    currentSegmentIndex++;
    if (currentSegmentIndex >= segments.length) {
        currentSegmentIndex = 0;
    }
    videoPlayer.currentTime = segments[currentSegmentIndex];
    videoPlayer.play().catch(error => {
        console.error("Ошибка при попытке воспроизведения видео:", error);
    });
}

function prevSegment() {
    currentSegmentIndex--;
    if (currentSegmentIndex < 0) {
        currentSegmentIndex = segments.length - 1;
    }
    videoPlayer.currentTime = segments[currentSegmentIndex];
    videoPlayer.play().catch(error => {
        console.error("Ошибка при попытке воспроизведения видео:", error);
    });
}

// Обработка изменений ориентации экрана
window.addEventListener('orientationchange', () => {
    if (window.innerHeight > window.innerWidth) {
        // Портретная ориентация
        videoPlayer.style.width = '100%';
        videoPlayer.style.height = 'auto';
    } else {
        // Альбомная ориентация
        videoPlayer.style.width = '100%';
        videoPlayer.style.height = 'auto';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('videoPlayer');

    function handleOrientationChange() {
        if (window.innerHeight > window.innerWidth) {
            // Portrait orientation
            videoPlayer.style.width = '100%';
            videoPlayer.style.height = 'auto';
        } else {
            // Landscape orientation
            videoPlayer.style.width = 'auto';
            videoPlayer.style.height = '93%';
        }
    }

    // Initial check
    handleOrientationChange();

    // Listen for orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
});