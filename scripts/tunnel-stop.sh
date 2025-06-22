#!/bin/bash

echo "🛑 Остановка туннелей LocalTunnel..."

# Убиваем все процессы LocalTunnel
pkill -f "lt --port" 2>/dev/null || true

# Очищаем временные файлы
rm -f /tmp/tunnel-*.log /tmp/tunnel-pids.txt 2>/dev/null || true

echo "✅ Все туннели остановлены!"
echo ""
echo "💡 Для запуска туннелей используйте: npm run tunnel:start" 