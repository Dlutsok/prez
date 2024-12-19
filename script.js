const segments = [0, 24, 28, 33, 37.5, 42, 46.5, 52, 57, 63, 69, 75, 80, 97, 126, 137, 163 ];
let currentSegmentIndex = 0;

const videoPlayer = document.getElementById('videoPlayer');
const progressBar = document.getElementById('progressBar');
const startButton = document.getElementById('startButton');
const loadingText = document.getElementById('loadingText');
const progressContainer = document.getElementById('progressContainer');
const nextButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');

let buttonDisplayed = false;
let videoStarted = false;
let isPaused = false;

function updateProgress() {
    if (videoPlayer.buffered.length > 0) {
        const bufferedEnd = videoPlayer.buffered.end(videoPlayer.buffered.length - 1);
        const duration = videoPlayer.duration;
        if (duration > 0) {
            const percentBuffered = (bufferedEnd / duration) * 100;
            progressBar.style.width = percentBuffered + '%';
            console.log(`Буферизация: ${percentBuffered}%`);
            if (bufferedEnd >= 20 && !videoStarted) {
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
    startButton.style.display = 'none'; // Скрываем кнопку сразу после нажатия
    videoStarted = true; // Устанавливаем флаг, что видео началось
    videoPlayer.currentTime = segments[currentSegmentIndex]; // Переходим к текущему сегменту
    videoPlayer.play().then(() => {
        requestAnimationFrame(updateVideo);
    }).catch(error => {
        console.error("Ошибка при попытке воспроизведения видео:", error);
    });
}

function updateVideo() {
    if (!videoStarted || isPaused) return;

    const currentTime = videoPlayer.currentTime;
    const segmentEnd = segments[currentSegmentIndex + 1] || videoPlayer.duration;

    // Проверка на окончание сегмента
    if (currentTime >= segmentEnd) {
        pauseVideo();
        return; // Завершаем выполнение, чтобы избежать продолжения воспроизведения
    }

    requestAnimationFrame(updateVideo);
}

function pauseVideo() {
    isPaused = true;
    videoPlayer.pause();
    nextButton.style.display = 'block';
    prevButton.style.display = 'block';
}

function resumeVideo() {
    isPaused = false;
    videoPlayer.play().catch(error => {
        console.error("Ошибка при попытке воспроизведения видео:", error);
    });
    nextButton.style.display = 'none';
    prevButton.style.display = 'none';
}

function nextSegment() {
    currentSegmentIndex++;
    if (currentSegmentIndex >= segments.length) {
        currentSegmentIndex = 0;
    }
    videoPlayer.currentTime = segments[currentSegmentIndex];
    isPaused = false; // Сбрасываем флаг паузы
    updateVideo(); // Запускаем отслеживание сегмента
    resumeVideo();
}

function prevSegment() {
    currentSegmentIndex--;
    if (currentSegmentIndex < 0) {
        currentSegmentIndex = segments.length - 1;
    }
    videoPlayer.currentTime = segments[currentSegmentIndex];
    isPaused = false; // Сбрасываем флаг паузы
    updateVideo(); // Запускаем отслеживание сегмента
    resumeVideo();
}

function handleOrientationChange() {
    if (window.innerHeight > window.innerWidth) {
        // Портретная ориентация
        videoPlayer.style.width = '100%';
        videoPlayer.style.height = 'auto';
    } else {
        // Альбомная ориентация
        videoPlayer.style.width = 'auto';
        videoPlayer.style.height = '93%';
    }
}

// Initial check and setup event listeners
document.addEventListener('DOMContentLoaded', () => {
    handleOrientationChange();
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    nextButton.addEventListener('click', nextSegment);
    prevButton.addEventListener('click', prevSegment);
    startButton.addEventListener('click', startVideo);
});


