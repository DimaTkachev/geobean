# Система динамических тем GeoBean

## Описание

Система тем позволяет динамически изменять цветовую схему приложения в зависимости от выбранной кофейни. Каждая кофейня имеет свою тему: beige (бежевая), purple (фиолетовая) или blue (синяя).

## Файлы тем

- `beige.css` - бежевая/коричневая тема (по умолчанию)
- `purple.css` - фиолетовая тема
- `blue.css` - синяя тема
- `index.css` - импортирует все темы

## CSS переменные темы

```css
--theme-primary          /* Основной цвет */
--theme-secondary        /* Вторичный цвет */
--theme-accent           /* Акцентный цвет */
--theme-text             /* Основной текст */
--theme-text-secondary   /* Вторичный текст */
--theme-border           /* Цвет границ */
--theme-hover            /* Цвет при наведении */
--theme-background       /* Цвет фона */
--theme-card             /* Цвет карточек */
--theme-shadow           /* Тень */
--theme-button           /* Кнопки */
--theme-button-text      /* Текст кнопок */
--theme-gradient         /* Градиент */
```

## Использование

Тема автоматически применяется при смене кофейни через атрибут `data-theme` на `<html>` элементе.

### В компонентах

```tsx
import { useTheme } from '@hooks/useTheme';

// Тема устанавливается автоматически в ShopContext
// Но можно также установить вручную:
const { setTheme } = useTheme();
setTheme('purple');
```

### В CSS

```css
.myComponent {
    background: var(--theme-background);
    color: var(--theme-text);
    border: 1px solid var(--theme-border);
}
```

## Как работает

1. Пользователь выбирает кофейню с определенной темой
2. ShopContext вызывает `useTheme(currentShop?.theme)`
3. Хук устанавливает атрибут `data-theme` на `<html>`
4. CSS переменные темы автоматически применяются ко всем компонентам
