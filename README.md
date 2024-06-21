# Prueba Técnica para el Puesto de Líder Técnico

Bienvenido a la prueba técnica para el puesto de Líder Técnico en nuestro negocio de préstamos. Esta prueba tiene como objetivo evaluar tu capacidad para diseñar e implementar un producto mínimo viable (MVP) de backend que simule un sistema de gestión de préstamos.

## Instrucciones

Debes crear una aplicación backend con las siguientes funcionalidades:

### Requisitos Funcionales

#### Crear un Usuario

- **Endpoint:** POST /usuarios
- **Descripción:** Este endpoint debe permitir la creación de un nuevo usuario en el sistema.
- **Define el Request Body y Response**

Request Body:

```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "telefono": "123456",
  "email": "a@mail.com",
  "contrasena": "Testing1234"
}
```

Response:

```json
{
  "success": true,
  "token": "dcdhftyh"
}
```

#### Crear Ofertas para un Usuario

- **Endpoint:** POST /usuarios/{userId}/ofertas
- **Descripción:** Este endpoint debe permitir la creación de un conjunto de ofertas de préstamo para un usuario específico. Las ofertas pueden variar en montos, plazos, etc. Deben crearse al menos 2 ofertas por usuario. Las ofertas solo pueden ser creadas por un administrador.
- **Define el Request Body y Response**

Request Body:

```json
{
  "titulo": "prueba1",
  "monto": 1000,
  "plazo": "SEMANAL",
  "quotas": 12
}
```

Response:

```json
{
  "success": true,
  "offer": {
    "id": 1,
    "titulo": "prueba1",
    "monto": 1000,
    "plazo": "SEMANAL",
    "quotas": 12,
    "userId": 1
  }
}
```

#### Crear un Préstamo Basado en la Oferta Seleccionada

- **Endpoint:** POST /usuarios/{userId}/prestamos
- **Descripción:** Este endpoint debe permitir la creación de un préstamo basado en una oferta seleccionada para un usuario. El préstamo debe incluir un calendario de pagos, por ejemplo, si el préstamo es a 4 semanas, se deben crear 4 entradas donde cada una corresponde a un pago esperado.
- **Define el Request Body y Response**

Request Body:

```json
{
  "ofertaId": 1
}
```

Response:

```json
{
  "success": true,
  "cuotas": {
    "count": 12
  }
}
```

#### Aplicar un Pago

- **Endpoint:** POST /prestamos/{loanId}/pagos
- **Descripción:** Este endpoint debe permitir la aplicación de un pago a un préstamo existente. Al llegar al último pago, el préstamo debe marcarse como pagado. Nota: Un punto extra podría ser considerar pagos parciales. Por ejemplo, si el pago esperado es de 250 y solo se pagan 100, deben quedar 150 restantes, pero el pago sigue como pendiente.
- **Define el Request Body y Response**

Request Body:

```json
{
  "monto": 100
}
```

Response:

```json
{
  "success": true,
  "cuotas": [
    {
      "id": 1,
      "descripcion": "Cuota 1 - Prestamo 1",
      "fecha_pago": "2024-06-28T19:17:36.153Z",
      "monto_inicial": 83.33,
      "monto_pagado": 83.33,
      "pendiente": false,
      "prestamoId": 1,
      "restante": 83.33
    },
    {
      "id": 2,
      "descripcion": "Cuota 2 - Prestamo 1",
      "fecha_pago": "2024-07-05T19:17:36.153Z",
      "monto_inicial": 83.33,
      "monto_pagado": 33.34,
      "pendiente": true,
      "prestamoId": 1
    }
  ]
}
```

### Puntos Extra

#### Agregar Autenticación a los Endpoints

Implementa un mecanismo de autenticación para todos los endpoints. Puedes usar autenticación basada en tokens (por ejemplo, JWT).

#### Crear un Endpoint para Revertir un Pago

- **Endpoint:** POST /pagos/{paymentId}/revertir
- **Descripción:** Este endpoint debe permitir la reversión de un pago aplicado anteriormente, incluyendo toda la lógica que ello conlleva.
- **Define el Request Body y Response**

Request Body: no necesita body.

Response:

```json
{
  "success": true,
  "cuota": {
    "id": 1,
    "descripcion": "Cuota 1 - Prestamo 1",
    "fecha_pago": "2024-06-28T19:17:36.153Z",
    "monto_inicial": 83.33,
    "monto_pagado": 0,
    "pendiente": true,
    "prestamoId": 1
  }
}
```

### Definición de Oferta

Una oferta se entiende como el conjunto de opciones o variantes del préstamo. Por ejemplo, si decimos que un usuario tiene 2 ofertas, esto significa que tiene 2 configuraciones diferentes de préstamo, como montos y plazos distintos.

### Esquema de la Base de Datos

Debes proponer los esquemas de la base de datos para el sistema. Puedes usar SQLite y subir el archivo de la base de datos en tu entrega. Asegúrate de que tu esquema pueda manejar las funcionalidades requeridas de manera efectiva.

### Para informacion sobre la base de datos pueden revisar el documento ERD.md

### Usuarios

Debes crear dos tipos de usuarios:

1. **Administrador**: Puede crear ofertas para los usuarios.
2. **Usuario**: Puede ver las ofertas y seleccionar una para crear un préstamo.

### Tiempo Esperado

El tiempo esperado para completar esta prueba es de 10 horas. Por favor, planifica tu trabajo en consecuencia.

### Pautas de Entrega

Tu código debe estar escrito en un lenguaje backend de tu elección, idealmente Node.js. Si eliges otro lenguaje, proporciona instrucciones claras sobre cómo ejecutar tu proyecto.
Haz un fork de este proyecto.
Al concluir, envíanos la liga de tu fork para poder probarlo.

¡Buena Suerte!
¡Gracias por tu participación!

### Instrucciones de uso

## 1. Agrega un .env en la raíz del proyecto con las siguientes variables de entorno

```
PORT = 3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="secret_key"
```

## 2. Instala las dependencias

```
npm install
```

## 3. Prisma Generate

Si deseas utilizar la base de Sqlite que se encuentra en el repositorio, ejecuta el siguiente comando para generar los modelos de la base de datos.

```
prisma generate --schema=./src/prisma/schema.prisma
```

De lo contrario, si deseas utilizar tu propia base de datos, modifica el archivo schema.prisma y ejecuta el siguiente comando.

```
prisma generate
prisma migrate dev
```

Esto generará la nueva base y hará el seed del ussuario administrador.

## 4. Corre el proyecto

```
npm run dev
```

## Comentarios adicionales

Para utilizar el usuario administrador que se crea en la base en el seed puede utilizar estas credenciales:

correo: admin@mail.com
contraseña: admin

En el archivo ERD.md se encuentra el diagrama de la base de datos y el detalle de cada tabla y columna de la base.