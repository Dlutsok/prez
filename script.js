const segments = [0, 10.5, 21.5, 32.5, 43, 53.5, 65, 75.5, 86, 96.5, 107, 117]; // Интервалы в секундах
let currentSegmentIndex = 0;
const videoPlayer = document.getElementById('videoPlayer');
const startButton = document.getElementById('startButton');

// При загрузке данных видео
videoPlayer.addEventListener('loadeddata', () => {
    console.log('Данные видео загружены.');
});

// Функция для старта воспроизведения видео
function startVideo() {
    videoPlayer.style.display = 'block'; // Показываем видео
    startButton.style.display = 'none'; // Скрываем кнопку старта
    playCurrentSegment(); // Запускаем воспроизведение текущего сегмента
}

// Функция для воспроизведения текущего сегмента
function playCurrentSegment() {
    if (videoPlayer.readyState >= 3) { // Проверяем, достаточно ли загружено видео
        videoPlayer.currentTime = segments[currentSegmentIndex];
        videoPlayer.play().then(() => {
            requestAnimationFrame(updateVideo); // Запускаем обновление видео
        }).catch(error => {
            console.error("Ошибка при попытке воспроизведения видео:", error);
        });
    }
}

// Функция для обновления состояния видео
function updateVideo() {
    const currentTime = videoPlayer.currentTime;
    const segmentEnd = segments[currentSegmentIndex + 1] || videoPlayer.duration;

    if (currentTime >= segmentEnd) {
        currentSegmentIndex = (currentSegmentIndex + 1) % segments.length;
        playCurrentSegment();
    }

    requestAnimationFrame(updateVideo); // Продолжаем обновление
}

// Переключение на следующий сегмент
function nextSegment() {
    currentSegmentIndex = (currentSegmentIndex + 1) % segments.length;
    playCurrentSegment();
}

// Переключение на предыдущий сегмент
function prevSegment() {
    currentSegmentIndex = (currentSegmentIndex - 1 + segments.length) % segments.length;
    playCurrentSegment();
}
