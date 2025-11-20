document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const generateBtn = document.getElementById('generate-btn');
  const output = document.getElementById('uuid-output');
  const formWrapper = document.querySelector(".form-wrapper");

  // --- Точная реализация подсветки как в Windows Defender ---
  const proximity = 90; // расстояние чувствительности
  let isActive = false;

  document.addEventListener("mousemove", (e) => {
    const rect = formWrapper.getBoundingClientRect();

    const cx = e.clientX;
    const cy = e.clientY;

    // ближайшая точка к границе
    const nx = Math.max(rect.left, Math.min(cx, rect.right));
    const ny = Math.max(rect.top, Math.min(cy, rect.bottom));

    const dx = cx - nx;
    const dy = cy - ny;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // положение света внутри блока
    const localX = nx - rect.left;
    const localY = ny - rect.top;

    formWrapper.style.setProperty("--glow-x", `${localX}px`);
    formWrapper.style.setProperty("--glow-y", `${localY}px`);

    if (distance < proximity) {
      if (!isActive) {
        isActive = true;
        formWrapper.classList.add("glow-active");
      }
    } else {
      if (isActive) {
        isActive = false;
        formWrapper.classList.remove("glow-active");
      }
    }
  });

  // Функция для определения темы по времени
  function getPreferredTheme() {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6 ? 'dark' : 'light';
  }

  // Получаем сохраненную тему из localStorage или используем автоматическую
  function getInitialTheme() {
    const savedTheme = localStorage.getItem('userTheme');
    // Если пользователь уже выбирал тему - используем её
    if (savedTheme) {
      return savedTheme;
    }
    // Иначе используем автоматическую по времени
    return getPreferredTheme();
  }

  // Установка начальной темы
  const initialTheme = getInitialTheme();
  body.setAttribute('data-theme', initialTheme);

  // Переключение темы с сохранением выбора
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Устанавливаем новую тему
    body.setAttribute('data-theme', newTheme);
    
    // Сохраняем выбор пользователя
    localStorage.setItem('userTheme', newTheme);
  });

  // Генерация UUID v4
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Флаг для отслеживания первой генерации
  let isFirstGeneration = true;

  // Добавляем пульсацию при первой загрузке
  if (isFirstGeneration) {
    generateBtn.classList.add('pulse');
  }

  // Функция генерации UUID
  function generateAndDisplay() {
    const uuid = generateUUID();
    output.textContent = uuid;

    // Копирование в буфер обмена
    navigator.clipboard.writeText(uuid).catch(err => {
      console.warn('Не удалось скопировать в буфер:', err);
    });
  }

  // Кнопка генерации
  generateBtn.addEventListener('click', () => {
    // Показываем состояние "Скопировано"
    generateBtn.classList.add('copied');

    // Убираем пульсацию после первой генерации
    if (isFirstGeneration) {
      isFirstGeneration = false;
      generateBtn.classList.remove('pulse');
    }

    // Генерируем UUID
    generateAndDisplay();

    // Возвращаем обычное состояние через 1 секунду
    setTimeout(() => {
      generateBtn.classList.remove('copied');
    }, 1000);
  });

  // При загрузке сразу генерируем UUID
  generateAndDisplay();

  // Автоматическая смена темы только если пользователь не выбирал тему вручную
  function checkTimeAndSetTheme() {
    const userSelectedTheme = localStorage.getItem('userTheme');
    
    // Если пользователь не выбирал тему вручную - меняем автоматически
    if (!userSelectedTheme) {
      const currentHour = new Date().getHours();
      const currentTheme = body.getAttribute('data-theme');
      const expectedTheme = getPreferredTheme();

      if (currentTheme !== expectedTheme) {
        setTimeout(() => {
          body.setAttribute('data-theme', expectedTheme);
        }, 300);
      }
    }
  }

  // Проверяем время каждые 60 секунд (только для автоматического режима)
  setInterval(checkTimeAndSetTheme, 60000);
});
