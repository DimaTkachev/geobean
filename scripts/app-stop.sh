#!/bin/bash

echo "🛑 Полная остановка приложения GeoBean..."

# Останавливаем туннели
echo "📡 Остановка туннелей..."
pkill -f "lt --port" 2>/dev/null || true

# Останавливаем frontend (webpack dev server)
echo "🌐 Остановка Frontend сервера..."
if [ -f /tmp/frontend-pid.txt ]; then
    FRONTEND_PID=$(cat /tmp/frontend-pid.txt)
    kill $FRONTEND_PID 2>/dev/null || true
    rm -f /tmp/frontend-pid.txt
fi
pkill -f "webpack serve" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Останавливаем Docker контейнеры
echo "🐳 Остановка Backend и базы данных..."
docker-compose down

# Очищаем временные файлы
rm -f /tmp/tunnel-*.log /tmp/tunnel-pids.txt 2>/dev/null || true

echo ""
echo "✅ Приложение полностью остановлено!"
echo ""
echo "💡 Для запуска используйте:"
echo "   docker-compose up -d     # Backend и БД"
echo "   cd frontend && npm start # Frontend"
echo "   npm run tunnel:start     # Интернет доступ" 