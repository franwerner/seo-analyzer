#!/bin/sh



echo "=============================="
echo "Levantando el contenedor de SERVER..."
echo "=============================="
docker-compose -f repo/server/docker-compose.yml up -d
echo "✅ Server levantado correctamente"
echo ""

echo "=============================="
echo "Levantando el contenedor de WEB..."
echo "=============================="
docker-compose -f repo/web/docker-compose.yml up -d
echo "✅ Web levantado correctamente"
echo ""

echo "=============================="
echo "Levantando el contenedor de EXTENSION..."
echo "=============================="
docker-compose -f repo/extension/docker-compose.yml up -d
echo "✅ Extension levantado correctamente"
echo ""

echo "=============================="
echo "Estado actual de los contenedores:"
docker ps
echo "=============================="