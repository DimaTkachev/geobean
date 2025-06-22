#!/bin/bash

echo "🚀 Запуск приложения GeoBean в Production режиме..."
echo ""

# Проверяем Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker Desktop."
    exit 1
fi

# Запускаем Backend и базу данных
echo "🐳 Запуск Backend и базы данных..."
docker-compose up -d --build

# Ждем готовности базы данных
echo "⏳ Ожидание готовности базы данных..."
sleep 10

# Проверяем что backend запустился
echo "🔍 Проверка Backend API..."
for i in {1..30}; do
    if curl -s http://localhost:5001/health > /dev/null 2>&1; then
        echo "✅ Backend API запущен!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend API не отвечает. Проверьте логи:"
        echo "   docker-compose logs backend"
        exit 1
    fi
    sleep 2
done

# Проверяем зависимости frontend
echo "📦 Проверка зависимостей Frontend..."
if [ ! -d "frontend/node_modules" ]; then
    echo "   Установка зависимостей..."
    cd frontend && npm install && cd ..
fi

# Собираем Frontend для production
echo "🔧 Сборка Frontend для Production..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Ошибка при сборке Frontend"
    exit 1
fi
cd ..

# Проверяем что папка dist существует
if [ ! -d "frontend/dist" ]; then
    echo "❌ Папка dist не найдена. Проверьте сборку."
    exit 1
fi

# Запускаем простой HTTP сервер для статических файлов
echo "🌐 Запуск Production сервера..."

# Проверяем наличие serve
if ! command -v npx &> /dev/null; then
    echo "❌ npx не установлен. Установите Node.js."
    exit 1
fi

# Запускаем serve в фоне
cd frontend/dist
npx serve -s . -p 3000 -n > /tmp/frontend-prod.log 2>&1 &
FRONTEND_PID=$!
cd ../..

# Ждем запуска Frontend
echo "⏳ Ожидание запуска Production сервера..."
sleep 5

# Проверяем что Frontend запустился
for i in {1..15}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Production сервер запущен!"
        break
    fi
    if [ $i -eq 15 ]; then
        echo "❌ Production сервер не запустился. Проверьте логи:"
        echo "   tail -f /tmp/frontend-prod.log"
        exit 1
    fi
    sleep 2
done

# Получаем IP адрес
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

echo ""
echo "🎉 Приложение успешно запущено в Production режиме!"
echo ""
echo "📋 Доступные адреса:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏠 Локально:     http://localhost:3000"
echo "📱 Wi-Fi сеть:   http://$LOCAL_IP:3000"
echo "🔧 Backend API:  http://localhost:5001"
echo "🗄️  База данных: http://localhost:8080 (root/password)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Запуск туннелей для интернет доступа..."

# Убираем старые туннели
pkill -f "lt --port" 2>/dev/null || true

# Запускаем туннели в фоне
lt --port 5001 --subdomain geobean-api > /tmp/tunnel-api.log 2>&1 &
API_TUNNEL_PID=$!

lt --port 3000 > /tmp/tunnel-frontend.log 2>&1 &
FRONTEND_TUNNEL_PID=$!

# Ждем запуска туннелей
sleep 3

# Получаем IPv4 адрес (LocalTunnel требует IPv4)
EXTERNAL_IP=$(curl -4 -s -m 5 ipinfo.io/ip 2>/dev/null || curl -4 -s -m 5 ifconfig.me 2>/dev/null || echo "Получается...")

echo ""
echo "🎉 Production приложение полностью запущено с интернет доступом!"
echo ""
echo "📋 Все доступные адреса:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Backend API URL
if [ -f /tmp/tunnel-api.log ]; then
    API_URL=$(grep "your url is:" /tmp/tunnel-api.log | awk '{print $4}' | head -1)
    if [ ! -z "$API_URL" ]; then
        echo "🔧 Backend API:  $API_URL"
    else
        echo "🔧 Backend API:  https://geobean-api.loca.lt"
    fi
else
    echo "🔧 Backend API:  https://geobean-api.loca.lt"
fi

# Frontend URL
if [ -f /tmp/tunnel-frontend.log ]; then
    FRONTEND_URL=$(grep "your url is:" /tmp/tunnel-frontend.log | awk '{print $4}' | head -1)
    if [ ! -z "$FRONTEND_URL" ]; then
        echo "🌐 Интернет:     $FRONTEND_URL"
    else
        echo "🌐 Интернет:     (запускается...)"
    fi
else
    echo "🌐 Интернет:     (запускается...)"
fi

echo "🏠 Локально:     http://localhost:3000"
echo "📱 Wi-Fi сеть:   http://$LOCAL_IP:3000"
echo "🗄️  База данных: http://localhost:8080 (root/password)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔑 Пароль для интернет туннелей: $EXTERNAL_IP"
echo "   (ваш внешний IP адрес)"
echo ""
echo "💡 Команды управления:"
echo "   npm run tunnel:stop   # Закрыть только интернет доступ"
echo "   npm run stop          # Остановить все приложение"
echo ""
echo "📊 Логи Production сервера: tail -f /tmp/frontend-prod.log"
echo "📊 Логи Backend:            docker-compose logs -f backend"
echo ""
echo "✨ Особенности Production режима:"
echo "   • Оптимизированные и сжатые файлы"
echo "   • Оптимизированные изображения"
echo "   • CSS и JS минификация"
echo "   • Кэширование статических ресурсов"
echo ""

# Сохраняем PIDs для остановки
echo "$FRONTEND_PID" > /tmp/frontend-prod-pid.txt
echo "$API_TUNNEL_PID,$FRONTEND_TUNNEL_PID" > /tmp/tunnel-pids.txt 