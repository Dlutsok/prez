const segments = [0, 10.5, 21.5, 32.5, 43, 53.5, 65, 75.5, 86, 96.5, 107, 117]; // Временные метки для сегментов
const preloadDuration = 60; // Количество секунд для предварительной загрузки (1 минута)
let currentSegmentIndex = 0;
const videoPlayer = document.getElementById('videoPlayer');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
let isPlaying = false;
let isPreloading = false;

// Событие, когда данные видео загружены
videoPlayer.addEventListener('loadeddata', () => {
    console.log('Данные видео загружены.');
    progressContainer.style.display = 'none'; // Скрываем прогресс-бар
    videoPlayer.classList.add('video-visible'); // Делаем видео видимым
    playVideo(); // Начинаем воспроизведение видео
});

// Событие, когда видео начинает воспроизводиться
videoPlayer.addEventListener('play', () => {
    isPlaying = true;
    console.log('Видео воспроизводится.');
});

// Событие, когда видео приостанавливается
videoPlayer.addEventListener('pause', () => {
    isPlaying = false;
    console.log('Видео приостановлено.');
});

// Событие, когда обновляется буферизация
videoPlayer.addEventListener('progress', () => {
    if (videoPlayer.buffered.length > 0) {
        const bufferedEnd = videoPlayer.buffered.end(videoPlayer.buffered.length - 1);
        const duration = videoPlayer.duration;
        if (duration > 0) {
            const percentBuffered = (bufferedEnd / duration) * 100;
            progressBar.style.width = percentBuffered + '%';
            console.log(`Буферизация: ${percentBuffered}%`);
        }
    }
});

// Событие, когда видео буферизируется
videoPlayer.addEventListener('waiting', () => {
    console.log('Видео буферизируется...');
});

// Событие, когда видео начинает воспроизводиться
videoPlayer.addEventListener('playing', () => {
    console.log('Видео воспроизводится.');
});

// Событие ошибки
videoPlayer.addEventListener('error', (e) => {
    console.error('Произошла ошибка:', e);
});

// Функция для предварительной загрузки видео
function preloadVideo() {
    if (isPreloading) return; // Если уже происходит предварительная загрузка, ничего не делать
    isPreloading = true;

    // Определяем следующий сегмент, который нужно загрузить
    const nextSegmentIndex = currentSegmentIndex + 1;
    if (nextSegmentIndex < segments.length) {
        const nextSegmentStart = segments[nextSegmentIndex];
        videoPlayer.currentTime = nextSegmentStart; // Устанавливаем время на начало следующего сегмента
        videoPlayer.play().catch(error => {
            console.error("Ошибка при попытке воспроизведения видео:", error);
        });

        videoPlayer.addEventListener('timeupdate', function onTimeUpdate() {
            if (videoPlayer.currentTime >= nextSegmentStart + preloadDuration) {
                videoPlayer.pause();
                videoPlayer.removeEventListener('timeupdate', onTimeUpdate);
                videoPlayer.currentTime = segments[currentSegmentIndex]; // Устанавливаем текущее время на начало текущего сегмента
                videoPlayer.play().catch(error => {
                    console.error("Ошибка при попытке воспроизведения видео:", error);
                });
                isPreloading = false;
            }
        });
    } else {
        isPreloading = false;
    }
}

// Функция для начала воспроизведения видео
function playVideo() {
    if (videoPlayer.readyState >= 3) { // Проверяем, достаточно ли загружено видео
        preloadVideo(); // Предварительная загрузка видео
        videoPlayer.currentTime = segments[currentSegmentIndex]; // Устанавливаем время начала сегмента
        videoPlayer.play().catch(error => {
            console.error("Ошибка при попытке воспроизведения видео:", error);
        });
        isPlaying = true;
    }
}

// Функция для переключения на следующий сегмент
function nextSegment() {
    currentSegmentIndex++;
    if (currentSegmentIndex >= segments.length) {
        currentSegmentIndex = segments.length - 1; // Не позволяем уходить за конец массива
    }
    updateSegment(); // Обновляем сегмент
}

// Функция для переключения на предыдущий сегмент
function prevSegment() {
    currentSegmentIndex--;
    if (currentSegmentIndex < 0) {
        currentSegmentIndex = 0; // Не позволяем уходить за начало массива
    }
    updateSegment(); // Обновляем сегмент
}

// Функция для обновления текущего сегмента
function updateSegment() {
    const segmentStart = segments[currentSegmentIndex];
    videoPlayer.currentTime = segmentStart; // Устанавливаем текущее время на начало сегмента
    if (isPlaying) {
        videoPlayer.play().catch(error => {
            console.error("Ошибка при попытке воспроизведения видео:", error);
        });
    }
}

// Функция для проверки и обновления состояния видео
function updateVideo() {
    if (isPlaying) {
        const currentTime = videoPlayer.currentTime;
        const segmentEnd = segments[currentSegmentIndex] + (segments[currentSegmentIndex + 1] ? segments[currentSegmentIndex + 1] - segments[currentSegmentIndex] : videoPlayer.duration);
        if (currentTime >= segmentEnd) {
            videoPlayer.currentTime = segments[currentSegmentIndex]; // Перематываем видео к началу сегмента
            videoPlayer.play().catch(error => {
                console.error("Ошибка при попытке воспроизведения видео:", error);
            });
        }
    }
    requestAnimationFrame(updateVideo); // Запускаем следующий цикл проверки
}

// Запускаем обновление состояния видео
updateVideo();
