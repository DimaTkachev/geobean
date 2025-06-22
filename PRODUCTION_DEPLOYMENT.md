# Production Развертывание GeoBean

## Команды для запуска

### Development режим

```bash
npm run start
```

Запускает приложение в development режиме с:

- Webpack dev server
- Hot reloading
- Источники для отладки

### Production режим

```bash
npm run start:prod
```

Запускает приложение в production режиме с:

- Оптимизированными и минифицированными файлами
- Сжатыми CSS и JS
- Оптимизированными изображениями
- Gzip сжатием статических файлов
- Кэшированием

## Особенности Production сборки

### Webpack оптимизации

- **Минификация JavaScript** - TerserPlugin с удалением console.log
- **Минификация CSS** - CssMinimizerPlugin
- **HTML минификация** - HtmlWebpackPlugin с полной оптимизацией
- **Code splitting** - разделение vendor и app кода
- **Asset optimization** - оптимизация изображений и статических файлов
- **Gzip сжатие** - автоматическое сжатие JS, CSS, HTML, SVG файлов

### Изображения

- Автоматическое встраивание малых изображений (<4KB) как base64
- Хэширование имен файлов для кэширования
- Копирование изображений в папку `images/`

### CSS

- Извлечение CSS в отдельные файлы
- Минификация и оптимизация
- Хэширование для кэширования

### JavaScript

- Разделение на chunks (vendor + app)
- Минификация с удалением неиспользуемого кода
- Source maps отключены в production

## Структура выходных файлов

После сборки в `frontend/dist/`:

```
dist/
├── index.html                           # Минифицированный HTML
├── main.[hash].js                       # Основной JavaScript
├── vendors.[hash].js                    # Vendor библиотеки
├── css/
│   └── main.[hash].css                  # Минифицированный CSS
├── images/
│   ├── logo.svg                         # SVG файлы
│   └── [name].[hash].[ext]             # Изображения с хэшем
├── fonts/                               # Шрифты (если есть)
└── *.gz                                 # Gzip версии файлов

```

## Команды управления

```bash
# Запуск в production
npm run start:prod

# Остановка всех сервисов
npm run stop

# Остановка только туннелей
npm run tunnel:stop

# Только сборка (без запуска)
cd frontend && npm run build
```

## Логи и мониторинг

```bash
# Логи production frontend сервера
tail -f /tmp/frontend-prod.log

# Логи backend
docker-compose logs -f backend

# Логи базы данных
docker-compose logs -f db
```

## Производительность

Production сборка включает:

- Minification всех ресурсов
- Tree shaking неиспользуемого кода
- Code splitting для лучшего кэширования
- Gzip сжатие (экономия ~70% размера)
- Оптимизация изображений
- Кэширование с использованием хэшей файлов

## Доступ к приложению

После запуска `npm run start:prod`:

- **Локально**: http://localhost:3000
- **Wi-Fi сеть**: http://[your-ip]:3000
- **Интернет**: через автоматически созданные туннели
- **Backend API**: http://localhost:5001
- **База данных**: http://localhost:8080 (root/password)

## Различия с Development

| Особенность   | Development        | Production        |
| ------------- | ------------------ | ----------------- |
| Сборка        | Webpack dev server | Статические файлы |
| Минификация   | Нет                | Да                |
| Source maps   | Да                 | Нет               |
| Gzip          | Нет                | Да                |
| Cache busting | Нет                | Да (хэши)         |
| Console.log   | Сохраняется        | Удаляется         |
| CSS           | Inline             | Отдельные файлы   |

## Troubleshooting

### Ошибки сборки

```bash
cd frontend
npm run build
# Проверьте ошибки в выводе
```

### Проблемы с сервером

```bash
# Проверьте логи
tail -f /tmp/frontend-prod.log

# Перезапустите
npm run stop
npm run start:prod
```

### Проблемы с изображениями

Убедитесь что изображения находятся в `frontend/public/images/`
