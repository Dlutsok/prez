const segments = [0, 10.5, 21.5, 32.5, 43, 53.5, 65, 75.5, 86, 96.5, 107, 117]; // Интервалы в секундах
let currentSegmentIndex = 0;
const videoPlayer = document.getElementById('videoPlayer');
const progressBar = document.getElementById('progressBar');
const startButton = document.getElementById('startButton');
const loadingText = document.getElementById('loadingText');
const progressContainer = document.getElementById('progressContainer');

// Переменная для отслеживания отображения ползунка
let isProgressContainerVisible = false;

// Функция для обновления ползунка загрузки
function updateProgress() {
    if (videoPlayer.buffered.length > 0) {
        const bufferedEnd = videoPlayer.buffered.end(videoPlayer.buffered.length - 1);
        const duration = videoPlayer.duration;
        if (duration > 0) {
            const percentBuffered = (bufferedEnd / duration) * 100;
            progressBar.style.width = percentBuffered + '%';
            console.log(`Буферизация: ${percentBuffered}%`);
            if (bufferedEnd >= 20) { // Если загружено 20 секунд
                if (isProgressContainerVisible) {
                    progressContainer.style.display = 'none'; // Скрываем ползунок
                    isProgressContainerVisible = false; // Обновляем состояние, что ползунок скрыт
                }
            }
        }
    }
    if (videoPlayer.readyState >= 3) {
        requestAnimationFrame(updateProgress); // Продолжаем обновление ползунка
    }
}

// При загрузке данных видео
videoPlayer.addEventListener('loadeddata', () => {
    console.log('Данные видео загружены.');
    videoPlayer.classList.add('video-visible'); // Делаем видео видимым
    startButton.style.display = 'block'; // Показываем кнопку воспроизведения
    progressContainer.style.display = 'none'; // Ползунок скрыт до нажатия кнопки
});

// Функция для старта воспроизведения видео
function startVideo() {
    startButton.style.display = 'none'; // Скрываем кнопку старта после начала воспроизведения
    progressContainer.style.display = 'block'; // Показываем ползунок загрузки
    isProgressContainerVisible = true; // Устанавливаем флаг, что ползунок видим
    videoPlayer.play().then(() => {
        requestAnimationFrame(updateProgress); // Запускаем обновление ползунка
    }).catch(error => {
        console.error("Ошибка при попытке воспроизведения видео:", error);
    });
}

// Функция для обновления состояния видео
function updateVideo() {
    const currentTime = videoPlayer.currentTime;
    const segmentEnd = segments[currentSegmentIndex] + (segments[currentSegmentIndex + 1] ? segments[currentSegmentIndex + 1] - segments[currentSegmentIndex] : videoPlayer.duration);
    
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
