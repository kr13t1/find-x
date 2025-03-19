// Получаем элементы DOM
const startScreen = document.getElementById('start-screen');
const startGameButton = document.getElementById('start-game-button');
const gameContainer = document.getElementById('game-container');
const targetNumberDisplay = document.getElementById('target-number');
const gameArea = document.getElementById('game-area');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart-button');
const settingsIcon = document.getElementById('settings-icon');
const settingsTooltip = document.getElementById('settings-tooltip');
const backButton = document.getElementById('back-button');

// Игровые переменные
let numbers = [];
let targetNumber;
let score = 0;
let time = 0;
let timerInterval;
let gameStarted = false;

const numberOfNumbers = 50;
const gameDuration = 60;

// Функция начала игры
function startGame() {
    gameStarted = true;
    score = 0;
    time = 0;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;

    generateNumbers();
    setTargetNumber();
    startTimer();
}

// Генерация чисел
function generateNumbers() {
    gameArea.innerHTML = '';
    numbers = [];

    const usedNumbers = new Set();
    const numberElements = [];

    while (numbers.length < numberOfNumbers) {
        let number = Math.floor(Math.random() * 100) + 1;

        if (usedNumbers.has(number)) {
            continue;
        }

        usedNumbers.add(number);
        numbers.push(number);

        const numberElement = document.createElement('div');
        numberElement.textContent = number;
        numberElement.classList.add('number');

        let positionValid = false;
        let left, top;
        let rotation;

        let attempts = 0;

        while (!positionValid && attempts < 100) {
            left = Math.random() * (gameArea.offsetWidth - 50);
            top = Math.random() * (gameArea.offsetHeight - 30);
            rotation = Math.random() * 360 - 180;

            positionValid = true;
            for (const existingElement of numberElements) {
                const rect1 = {
                    x: left,
                    y: top,
                    width: 50,
                    height: 30
                };
                const rect2 = {
                    x: existingElement.offsetLeft,
                    y: existingElement.offsetTop,
                    width: 50,
                    height: 30
                };

                if (rectIntersect(rect1, rect2)) {
                    positionValid = false;
                    break;
                }
            }
            attempts++;
        }

        if (positionValid) {
            numberElement.style.left = left + 'px';
            numberElement.style.top = top + 'px';
            numberElement.style.transform = `rotate(${rotation}deg)`;
            numberElements.push(numberElement);
        } else {
            console.warn("Не удалось найти место для числа ", number);
            usedNumbers.delete(number);
            numbers.pop();
            continue;
        }

        numberElement.addEventListener('click', () => {
            if (gameStarted && number === targetNumber) {
                score++;
                scoreDisplay.textContent = score;
                setTargetNumber();
                numberElement.remove();
                numbers.splice(numbers.indexOf(number), 1);
            }
        });

        gameArea.appendChild(numberElement);
    }
}

// Проверка пересечения прямоугольников
function rectIntersect(rect1, rect2) {
    return !(rect2.x > (rect1.x + rect1.width) ||
             rect2.x + rect2.width < rect1.x ||
             rect2.y > (rect1.y + rect1.height) ||
             rect2.y + rect2.height < rect1.y);
}

// Установка целевого числа
function setTargetNumber() {
    if (numbers.length === 0) {
        endGame();
        return;
    }
    targetNumber = numbers[Math.floor(Math.random() * numbers.length)];
    targetNumberDisplay.textContent = targetNumber;
}

// Запуск таймера
function startTimer() {
    timerInterval = setInterval(() => {
        time++;
        timeDisplay.textContent = time;

        if (time >= gameDuration) {
            endGame();
        }
    }, 1000);
}

// Завершение игры
function endGame() {
    gameStarted = false;
    clearInterval(timerInterval);
    targetNumberDisplay.textContent = "Игра окончена! Ваш счет: " + score;
    gameArea.innerHTML = '';
    timeDisplay.textContent = time;

    // Показываем начальный экран через 3 секунды
    setTimeout(() => {
        startScreen.style.display = 'block';
        gameContainer.style.display = 'none';
    }, 3000);
}

// Обработчик для кнопки "Начать игру"
startGameButton.addEventListener('click', () => {
    startScreen.style.display = 'none'; // Скрываем начальный экран
    gameContainer.style.display = 'block'; // Показываем игровое поле
    startGame(); // Запускаем игру
});

// Обработчик для кнопки "Начать заново"
restartButton.addEventListener('click', () => {
    endGame(); // Останавливаем текущую игру
    startGame(); // Начинаем игру заново
});

// Обработчик для кнопки "Назад"
backButton.addEventListener('click', () => {
    window.history.back(); // Возврат на предыдущую страницу
});

// Управление значком настроек и подсказкой
settingsIcon.addEventListener('click', () => {
    if (settingsTooltip.style.display === 'block') {
        settingsTooltip.style.display = 'none'; // Скрываем подсказку
    } else {
        settingsTooltip.style.display = 'block'; // Показываем подсказку
    }
});

// Скрываем подсказку при клике вне её области
document.addEventListener('click', (event) => {
    if (event.target !== settingsIcon && event.target !== settingsTooltip) {
        settingsTooltip.style.display = 'none';
    }
});
