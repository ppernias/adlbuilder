#!/bin/bash
set -e

# Detener cualquier instancia previa del servidor (backend y frontend)
echo "Deteniendo instancias previas del servidor..."
pkill -f uvicorn || true
pkill -f vite || true
pkill -f react-scripts || true
sleep 2

# Iniciar el backend en segundo plano
echo "Iniciando el backend..."
cd /root/adlbuilder
. venv/bin/activate
nohup uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

# Esperar a que el backend esté listo
echo "Esperando a que el backend esté listo..."
sleep 3

# Iniciar el frontend en modo accesible por red local
cd /root/adlbuilder/frontend
echo "Iniciando el frontend..."
nohup npm run dev -- --host 0.0.0.0 --port 5173 --strictPort > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

# Función para manejar la señal de interrupción
function cleanup {
  echo "Deteniendo servidores..."
  pkill -f uvicorn || true
  pkill -f vite || true
  pkill -f react-scripts || true
  exit 0
}

# Capturar señal de interrupción (Ctrl+C)
trap cleanup SIGINT

# Mantener el script en ejecución
echo "Aplicación iniciada. Presiona Ctrl+C para detener."
echo "Backend: http://<tu-ip-local>:8000"
echo "Frontend: http://<tu-ip-local>:5173"
wait
