document.addEventListener('DOMContentLoaded', () => {
    // Конвертируем цвет в rgb для градиентов
    const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary');
    document.documentElement.style.setProperty('--primary-rgb', 
        hexToRgb(primaryColor));

    // Генерация UUID
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Функция переключения темы
    function toggleTheme() {
        const isDark = document.documentElement.classList.contains('dark-theme');
        document.documentElement.classList.toggle('dark-theme', !isDark);
        document.documentElement.classList.toggle('light-theme', isDark);
        localStorage.setItem('theme', isDark ? 'light-theme' : 'dark-theme');
    }

    // Вспомогательная функция для цветов
    function hexToRgb(hex) {
        hex = hex.trim().replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    }

    // Элементы интерфейса
    const generateBtn = document.getElementById('generate-btn');
    const uuidDisplay = document.getElementById('uuid-display');
    const themeBtn = document.getElementById('theme-toggle');
    const glowText = generateBtn.querySelector('.glow-text');

    // Генерация и копирование UUID
    generateBtn.addEventListener('click', () => {
        const uuid = generateUUID();
        uuidDisplay.textContent = uuid;
        uuidDisplay.dataset.uuid = uuid;
        
        const originalText = glowText.textContent;
        
        // Копирование в буфер обмена
        navigator.clipboard.writeText(uuid).then(() => {
            glowText.textContent = 'COPIED!';
            generateBtn.classList.add('copied');
            uuidDisplay.classList.add('copied');
            
            setTimeout(() => {
                glowText.textContent = originalText;
                generateBtn.classList.remove('copied');
                uuidDisplay.classList.remove('copied');
            }, 2000);
        });
    });

    // Переключение темы
    themeBtn.addEventListener('click', toggleTheme);

    // Генерируем первый UUID при загрузке
    uuidDisplay.textContent = generateUUID();
});