const segments = [0, 10.5, 21.5, 32.5, 43, 53.5, 65, 75.5, 86, 96.5, 107, 117]; // Интервалы в секундах
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
function startVideo() {
    startButton.style.display = 'none'; // Скрываем кнопку старта

    // Запуск буферизации в фоновом режиме
    videoPlayer.currentTime = 0;
    videoPlayer.addEventListener('canplaythrough', playCurrentSegment);

    // Загружаем данные для буферизации
    videoPlayer.load();
}

// Функция для воспроизведения текущего сегмента
function playCurrentSegment() {
    videoPlayer.removeEventListener('canplaythrough', playCurrentSegment); // Удаляем обработчик события
    videoPlayer.currentTime = segments[currentSegmentIndex];
    videoPlayer.play().then(() => {
        isPlaying = true;
        console.log('Воспроизведение началось.');
        requestAnimationFrame(updateVideo); // Запускаем обновление видео
    }).catch(error => {
        console.error("Ошибка при попытке воспроизведения видео:", error);
    });
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

    requestAnimationFrame(updateVideo); // Продолжаем обновление
}

// Переключение на следующий сегмент
function nextSegment() {
    currentSegmentIndex++;
    if (currentSegmentIndex >= segments.length) {
        currentSegmentIndex = 0; // Возвращаемся к началу массива, если достигнут конец
    }
    videoPlayer.currentTime = segments[currentSegmentIndex];
    videoPlayer.play().catch(error => {
        console.error("Ошибка при попытке воспроизведения видео:", error);
    });
}

// Переключение на предыдущий сегмент
function prevSegment() {
    currentSegmentIndex--;
    if (currentSegmentIndex < 0) {
        currentSegmentIndex = segments.length - 1; // Переходим к последнему сегменту, если достигнут начало
    }
    videoPlayer.currentTime = segments[currentSegmentIndex];
    videoPlayer.play().catch(error => {
        console.error("Ошибка при попытке воспроизведения видео:", error);
    });
}
