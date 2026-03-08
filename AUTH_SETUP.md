# Configuración de Autenticación

## Overview

Se ha implementado un sistema de autenticación basado en API que utiliza el esquema de waiters existente en la base de datos MongoDB.

## Cambios Realizados

### 1. API Endpoints

- **POST /api/auth/login**: Autentica usuarios usando username y password
- **POST /api/auth/hash**: Utilidad para hashear contraseñas (solo para desarrollo)

### 2. Servicio de Autenticación

- **src/app/services/auth.ts**: Maneja las llamadas a la API de autenticación
- **src/app/context/AuthContext.tsx**: Actualizado para usar la API en lugar de simulación

### 3. Flujo de Autenticación

1. El usuario ingresa credenciales en LoginScreen
2. AuthContext llama a authService.login()
3. Se hace POST a /api/auth/login
4. La API busca el waiter en MongoDB por username y active: true
5. Compara el password usando bcryptjs
6. Retorna el usuario si es válido

## Configuración de Waiters en la Base de Datos

Los waiters deben tener la siguiente estructura:

```javascript
{
  _id: ObjectId,
  name: "Nombre del Mesero",
  username: "usuario", // único
  password: "$2a$10$...", // hash de bcryptjs
  active: true
}
```

## Hashear Contraseñas

### Método 1: Usando el endpoint de API

```bash
curl -X POST http://localhost:3000/api/auth/hash \
  -H "Content-Type: application/json" \
  -d '{"password": "1234"}'
```

### Método 2: Usando el script

```bash
cd /Users/pepealvarezc23/Documents/Projects/interaccionmx/japymenu
node scripts/hash-password.js 1234
```

### Método 3: Código JavaScript

```javascript
const { hash } = require('bcryptjs');
const hashedPassword = await hash('1234', 10);
```

## Ejemplo de Configuración

Para crear un waiter de prueba:

1. Hashea la contraseña:
   ```bash
   node scripts/hash-password.js 1234
   ```

2. Inserta en MongoDB:
   ```javascript
   db.waiters.insertOne({
     name: "Mesero de Prueba",
     username: "mesero1",
     password: "$2a$10$...", // hash del paso 1
     active: true
   });
   ```

## Consideraciones de Seguridad

- Las contraseñas están hasheadas con bcryptjs (salt rounds: 10)
- Solo se permiten waiters con active: true
- La API no retorna el password en la respuesta
- Los errores son genéricos para no revelar información sensible

## Pruebas

Puedes probar la autenticación con:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "mesero1", "password": "1234"}'
```

## Depuración

- Revisa la consola del servidor para errores
- Verifica que el waiter exista y esté active: true
- Confirma que el password esté correctamente hasheado
- Usa el endpoint /api/auth/hash para generar nuevos hashes
