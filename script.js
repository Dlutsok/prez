const segments = [0, 10.5, 21.5, 32.5, 43, 53.5, 65, 75.5, 86, 96.5, 107, 117];
let currentSegmentIndex = 0;
const videoPlayer = document.getElementById('videoPlayer');
const startButton = document.getElementById('startButton');
const loadingText = document.getElementById('loadingText');

let isPlaying = false;

// При загрузке данных видео
videoPlayer.addEventListener('loadeddata', () => {
    console.log('Данные видео загружены.');
    videoPlayer.classList.add('video-visible');
});

// Функция для старта воспроизведения видео
async function startVideo() {
    startButton.style.display = 'none'; // Скрываем кнопку старта

    // Устанавливаем начальное время и загружаем данные
    videoPlayer.currentTime = 0;

    // Ждем, пока видео загрузится и станет готовым для воспроизведения
    await new Promise(resolve => {
        videoPlayer.addEventListener('canplaythrough', resolve, { once: true });
    });

    playCurrentSegment();
}

// Функция для воспроизведения текущего сегмента
async function playCurrentSegment() {
    try {
        videoPlayer.currentTime = segments[currentSegmentIndex];
        await videoPlayer.play();
        isPlaying = true;
        console.log('Воспроизведение началось.');
        requestAnimationFrame(updateVideo);
    } catch (error) {
        console.error("Ошибка при попытке воспроизведения видео:", error);
    }
}

// Функция для обновления состояния видео
function updateVideo() {
    if (!isPlaying) return;

    const currentTime = videoPlayer.currentTime;
    const segmentEnd = segments[currentSegmentIndex + 1] || videoPlayer.duration;

    if (currentTime >= segmentEnd) {
        // Переход к следующему сегменту или возврат к началу
        currentSegmentIndex = (currentSegmentIndex + 1) % segments.length;
        videoPlayer.currentTime = segments[currentSegmentIndex];
        videoPlayer.play().catch(error => {
            console.error("Ошибка при попытке воспроизведения видео:", error);
        });
    }

    requestAnimationFrame(updateVideo);
}

// Переключение на следующий сегмент
async function nextSegment() {
    currentSegmentIndex = (currentSegmentIndex + 1) % segments.length;
    videoPlayer.currentTime = segments[currentSegmentIndex];
    try {
        await videoPlayer.play();
    } catch (error) {
        console.error("Ошибка при попытке воспроизведения видео:", error);
    }
}

// Переключение на предыдущий сегмент
async function prevSegment() {
    currentSegmentIndex = (currentSegmentIndex - 1 + segments.length) % segments.length;
    videoPlayer.currentTime = segments[currentSegmentIndex];
    try {
        await videoPlayer.play();
    } catch (error) {
        console.error("Ошибка при попытке воспроизведения видео:", error);
    }
}
