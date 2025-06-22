#!/bin/bash

echo "🚀 Запуск туннелей LocalTunnel..."

# Убиваем старые туннели
pkill -f "lt --port" 2>/dev/null || true

# Запускаем туннели в фоне
echo "📡 Запуск туннеля для Backend API (порт 5001)..."
lt --port 5001 --subdomain geobean-api > /tmp/tunnel-api.log 2>&1 &
API_PID=$!

echo "🌐 Запуск туннеля для Frontend (порт 3000)..."
lt --port 3000 > /tmp/tunnel-frontend.log 2>&1 &
FRONTEND_PID=$!

# Ждем запуска туннелей
sleep 3

# Получаем URLs
echo ""
echo "✅ Туннели запущены!"
echo ""
echo "📋 Доступные адреса:"
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
        echo "🌐 Frontend:     $FRONTEND_URL"
    else
        echo "🌐 Frontend:     (запускается...)"
    fi
else
    echo "🌐 Frontend:     (запускается...)"
fi

echo "🏠 Локально:     http://localhost:3000"
echo "📱 Wi-Fi:        http://$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}'):3000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔑 Пароль для туннелей:"
EXTERNAL_IP=$(curl -4 -s -m 5 ipinfo.io/ip 2>/dev/null || curl -4 -s -m 5 ifconfig.me 2>/dev/null || echo "Получается...")
echo "   Пароль: $EXTERNAL_IP"
echo "   (ваш внешний IPv4 адрес)"
echo ""
echo "💡 Для остановки туннелей используйте: npm run tunnel:stop"
echo "💡 Для остановки всего приложения: npm run stop"
echo ""

# Сохраняем PIDs для остановки
echo "$API_PID,$FRONTEND_PID" > /tmp/tunnel-pids.txt 