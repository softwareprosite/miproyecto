# 🚀 Inicio Rápido

## 5 Minutos para tener el backend ejecutándose

### Con Docker (Recomendado)

```bash
# 1. Descargar y extraer
unzip backend-complete.zip
cd backend-complete

# 2. Iniciar
docker-compose up -d

# 3. Esperar 30 segundos
sleep 30

# 4. ¡Listo! Backend disponible en:
# http://localhost:3000
# http://localhost:3000/health
```

### Sin Docker

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env
cp .env.example .env

# 3. Configurar PostgreSQL
# Editar .env con tus credenciales

# 4. Iniciar
npm run start:dev

# Backend en http://localhost:3000
```

## ✅ Verificar que funciona

```bash
# En tu navegador o Postman
GET http://localhost:3000/api/health

# Respuesta esperada:
{
  "status": "ok",
  "timestamp": "2024-05-30T...",
  "uptime": 123.45
}
```

## 🔐 Login de Prueba

```
POST http://localhost:3000/api/auth/login

{
  "email": "admin@bolivia-tours.com",
  "password": "Admin123!@"
}
```

## 📊 Cargar datos de ejemplo

Los datos de ejemplo se cargan automáticamente al iniciar.

## 🛑 Detener

```bash
# Con Docker
docker-compose down

# Local
Ctrl + C
```

## 📞 Problemas?

Ver README.md para troubleshooting detallado.

---

**Tiempo estimado:** 5 minutos ⏱️
