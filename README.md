# 💊 Farmacity – Sistema de Gestión para Farmacia

Aplicación web para la gestión de una farmacia, desarrollada como Trabajo Práctico N° 2 de **Programación III** (IES 9-023).

Permite administrar **medicamentos**, **categorías** y **empleados** a través de una arquitectura de tres capas: **frontend + backend + base de datos**.

## 👥 Integrantes

- Carolina Lopez
- Adriana Antunez

## 🛠️ Tecnologías utilizadas

| Capa | Tecnología |
|---|---|
| Frontend | ReactJS (con Vite), React Router, Axios |
| Backend | NestJS, TypeORM, class-validator |
| Base de datos | MySQL 8.0 |
| Infraestructura | Docker y Docker Compose |
| Control de versiones | Git y GitHub |
| Gestor de paquetes | Yarn |

## 🏗️ Arquitectura

```
[ Navegador ] → [ Frontend React ] → HTTP / JSON → [ Backend NestJS ] → TypeORM → [ MySQL en Docker ]
                  localhost:5173                     localhost:3000                  localhost:3306
```

- El **frontend** muestra las pantallas y consume la API REST del backend.
- El **backend** expone la API, valida los datos con DTOs y se comunica con la base de datos mediante TypeORM.
- La **base de datos** MySQL corre en un contenedor de Docker, definido en `docker-compose.yml`.

## 📁 Estructura del proyecto

```
farmacity/
├── backend/                  # API REST con NestJS
│   └── src/
│       ├── categorias/       # Módulo de categorías (entity, dto, controller, service)
│       ├── medicamentos/     # Módulo de medicamentos
│       ├── empleados/        # Módulo de empleados
│       ├── app.module.ts     # Configuración de TypeORM
│       └── main.ts           # Prefijo /api, CORS y validaciones
├── frontend/                 # Aplicación React
│   └── src/
│       ├── api/client.js     # Configuración de Axios
│       ├── pages/            # Dashboard, Medicamentos, Categorías, Empleados
│       └── App.jsx           # Menú y rutas
├── docker-compose.yml        # Base de datos MySQL
└── README.md
```

---

## ✅ Requisitos previos

Antes de ejecutar el proyecto, es necesario tener instalado:

- **Node.js 24.15.0 o superior** → https://nodejs.org (versión LTS)
- **Yarn** → `npm install -g yarn`
- **Docker Desktop** → https://www.docker.com/products/docker-desktop (en Windows requiere WSL 2)
- **Git** → https://git-scm.com

Para verificar las versiones:

```bash
node -v
yarn -v
docker -v
git -v
```

> ⚠️ Con versiones de Node anteriores a la 24.15.0, la instalación del backend falla con el error `The engine "node" is incompatible with this module`.

---

## 🚀 Cómo ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/CarooLopezz/farmacity.git
cd farmacity
```

### 2. Levantar la base de datos con Docker

Con **Docker Desktop abierto**, desde la raíz del proyecto:

```bash
docker compose up -d
```

Para verificar que el contenedor esté corriendo:

```bash
docker ps
```

Debe aparecer el contenedor `farmacia_mysql` con estado **Up**.

### 3. Ejecutar el backend

En una terminal:

```bash
cd backend
yarn
yarn start:dev
```

Cuando aparezca el mensaje `Nest application successfully started`, la API estará disponible en **http://localhost:3000/api**.

Las tablas se crean automáticamente al iniciar el backend (`synchronize: true` de TypeORM).

### 4. Ejecutar el frontend

En **otra** terminal (el backend tiene que seguir corriendo):

```bash
cd frontend
yarn
yarn dev
```

Abrir en el navegador: **http://localhost:5173**

### 5. Cargar datos de ejemplo (opcional)

Si el repositorio incluye el archivo `datos.sql`, se pueden importar los datos de ejemplo con el backend ya iniciado al menos una vez:

```bash
docker exec -i farmacia_mysql mysql -u farmacia -pfarmacia123 farmacia_db < datos.sql
```

Para exportar los datos propios a ese archivo:

```bash
docker exec farmacia_mysql mysqldump -u farmacia -pfarmacia123 --no-tablespaces farmacia_db > datos.sql
```

También se pueden cargar datos manualmente desde el frontend o con Postman (ver ejemplos en la sección de endpoints).

---

## 🐳 Configuración de la base de datos

Definida en `docker-compose.yml`:

| Parámetro | Valor |
|---|---|
| Imagen | `mysql:8.0` |
| Contenedor | `farmacia_mysql` |
| Host | `localhost` |
| Puerto | `3306` |
| Base de datos | `farmacia_db` |
| Usuario | `farmacia` |
| Contraseña | `farmacia123` |
| Contraseña de root | `root` |

Los datos se guardan en el volumen `mysql_data`, por lo que no se pierden al apagar el contenedor.

### Comandos útiles de Docker

| Comando | Descripción |
|---|---|
| `docker compose up -d` | Levanta la base de datos en segundo plano |
| `docker compose down` | Apaga el contenedor (los datos se conservan) |
| `docker compose down -v` | Apaga el contenedor y **borra todos los datos** |
| `docker ps` | Lista los contenedores en ejecución |
| `docker compose logs -f` | Muestra los logs de MySQL |
| `docker exec farmacia_mysql mysql -u farmacia -pfarmacia123 farmacia_db -e "SHOW TABLES;"` | Lista las tablas de la base |

---

## 📡 Documentación de endpoints

**URL base:** `http://localhost:3000/api`

Todas las peticiones y respuestas usan formato **JSON**. Para los métodos `POST` y `PATCH` se debe enviar el header `Content-Type: application/json`.

### Resumen

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/categorias` | Lista todas las categorías |
| GET | `/categorias/:id` | Obtiene una categoría por id |
| POST | `/categorias` | Crea una categoría |
| PATCH | `/categorias/:id` | Modifica una categoría |
| DELETE | `/categorias/:id` | Elimina una categoría |
| GET | `/medicamentos` | Lista todos los medicamentos (con su categoría) |
| GET | `/medicamentos/:id` | Obtiene un medicamento por id |
| POST | `/medicamentos` | Crea un medicamento |
| PATCH | `/medicamentos/:id` | Modifica un medicamento |
| DELETE | `/medicamentos/:id` | Elimina un medicamento |
| GET | `/empleados` | Lista todos los empleados |
| GET | `/empleados/:id` | Obtiene un empleado por id |
| POST | `/empleados` | Crea un empleado |
| PATCH | `/empleados/:id` | Modifica un empleado |
| DELETE | `/empleados/:id` | Elimina un empleado |

En `PATCH` solo es necesario enviar los campos que se quieren modificar.

### Códigos de respuesta

| Código | Significado |
|---|---|
| `200 OK` | Consulta, modificación o eliminación exitosa |
| `201 Created` | Registro creado correctamente |
| `400 Bad Request` | Datos inválidos (falla alguna validación del DTO) o id no numérico |
| `404 Not Found` | No existe un registro con ese id |
| `409 Conflict` | Dato duplicado o eliminación no permitida |

---

### 🏷️ Categorías

#### Campos

| Campo | Tipo | Obligatorio | Validaciones |
|---|---|---|---|
| `nombre` | string | Sí | Máximo 100 caracteres. No se puede repetir |
| `descripcion` | string | No | — |

#### `POST /api/categorias`

Request:

```json
{
  "nombre": "Analgésicos",
  "descripcion": "Para el dolor"
}
```

Respuesta `201 Created`:

```json
{
  "id": 1,
  "nombre": "Analgésicos",
  "descripcion": "Para el dolor"
}
```

#### `GET /api/categorias`

Respuesta `200 OK` (ordenadas alfabéticamente):

```json
[
  { "id": 1, "nombre": "Analgésicos", "descripcion": "Para el dolor" },
  { "id": 3, "nombre": "Antibióticos", "descripcion": "Tratamiento de infecciones bacterianas" }
]
```

#### `PATCH /api/categorias/1`

```json
{ "descripcion": "Medicamentos para aliviar el dolor" }
```

#### `DELETE /api/categorias/1`

Respuesta `200 OK`:

```json
{ "mensaje": "Categoría eliminada" }
```

#### Errores posibles

- `409` — `"Ya existe una categoría con ese nombre"`
- `409` — `"No se puede eliminar: la categoría tiene medicamentos asociados"`
- `404` — `"Categoría 99 no encontrada"`

---

### 💊 Medicamentos

Cada medicamento **pertenece a una categoría** (relación muchos a uno).

#### Campos

| Campo | Tipo | Obligatorio | Validaciones |
|---|---|---|---|
| `nombre` | string | Sí | Máximo 150 caracteres |
| `descripcion` | string | No | — |
| `precio` | number | Sí | Mayor a 0, hasta 2 decimales |
| `stock` | integer | Sí | Entero, mínimo 0 |
| `laboratorio` | string | Sí | Máximo 100 caracteres |
| `fechaVencimiento` | string | Sí | Formato `AAAA-MM-DD` |
| `categoriaId` | integer | Sí | Debe existir la categoría |

#### `POST /api/medicamentos`

Request:

```json
{
  "nombre": "Ibuprofeno 400mg",
  "descripcion": "Antiinflamatorio",
  "precio": 2500.50,
  "stock": 40,
  "laboratorio": "Bagó",
  "fechaVencimiento": "2027-08-15",
  "categoriaId": 1
}
```

Respuesta `201 Created` (incluye la categoría):

```json
{
  "id": 1,
  "nombre": "Ibuprofeno 400mg",
  "descripcion": "Antiinflamatorio",
  "precio": 2500.5,
  "stock": 40,
  "laboratorio": "Bagó",
  "fechaVencimiento": "2027-08-15",
  "categoriaId": 1,
  "categoria": {
    "id": 1,
    "nombre": "Analgésicos",
    "descripcion": "Para el dolor"
  }
}
```

#### `GET /api/medicamentos`

Devuelve la lista de medicamentos ordenada por nombre, cada uno con su objeto `categoria`.

#### `PATCH /api/medicamentos/1`

```json
{ "stock": 35, "precio": 2700 }
```

#### `DELETE /api/medicamentos/1`

Respuesta `200 OK`:

```json
{ "mensaje": "Medicamento eliminado" }
```

#### Errores posibles

- `400` — `"El precio debe ser mayor a 0"`
- `400` — `"El stock no puede ser negativo"`
- `400` — `"La fecha de vencimiento debe tener formato AAAA-MM-DD"`
- `400` — `"La categoría 99 no existe"`
- `404` — `"Medicamento 99 no encontrado"`

---

### 👤 Empleados

#### Campos

| Campo | Tipo | Obligatorio | Validaciones |
|---|---|---|---|
| `nombre` | string | Sí | Máximo 80 caracteres |
| `apellido` | string | Sí | Máximo 80 caracteres |
| `dni` | string | Sí | 7 u 8 dígitos, sin puntos. No se puede repetir |
| `email` | string | Sí | Formato de email válido. No se puede repetir |
| `telefono` | string | Sí | Solo números, espacios, `+` o `-` (6 a 20 caracteres) |
| `cargo` | string | Sí | Máximo 60 caracteres |
| `fechaIngreso` | string | Sí | Formato `AAAA-MM-DD` |

#### `POST /api/empleados`

Request:

```json
{
  "nombre": "Lucía",
  "apellido": "Gómez",
  "dni": "40123456",
  "email": "lucia@farmacia.com",
  "telefono": "261 555-1234",
  "cargo": "Farmacéutico/a",
  "fechaIngreso": "2024-03-01"
}
```

Respuesta `201 Created`:

```json
{
  "id": 1,
  "nombre": "Lucía",
  "apellido": "Gómez",
  "dni": "40123456",
  "email": "lucia@farmacia.com",
  "telefono": "261 555-1234",
  "cargo": "Farmacéutico/a",
  "fechaIngreso": "2024-03-01"
}
```

#### `GET /api/empleados`

Devuelve la lista de empleados ordenada por apellido y nombre.

#### `PATCH /api/empleados/1`

```json
{ "cargo": "Encargado/a", "telefono": "261 555-9999" }
```

#### `DELETE /api/empleados/1`

Respuesta `200 OK`:

```json
{ "mensaje": "Empleado eliminado" }
```

#### Errores posibles

- `400` — `"El DNI debe tener 7 u 8 dígitos, sin puntos"`
- `400` — `"El email no es válido"`
- `409` — `"Ya existe un empleado con ese DNI"`
- `409` — `"Ya existe un empleado con ese email"`
- `404` — `"Empleado 99 no encontrado"`

### Ejemplo de error de validación

`POST /api/medicamentos` con datos inválidos responde `400 Bad Request`:

```json
{
  "message": [
    "El precio debe ser mayor a 0",
    "El laboratorio es obligatorio"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 🖥️ Funcionalidades del frontend

| Pantalla | Ruta | Funcionalidades |
|---|---|---|
| Dashboard | `/` | Totales, valor del inventario, gráfico de medicamentos por categoría, alertas de stock bajo y vencimiento |
| Medicamentos | `/medicamentos` | CRUD completo, selector de categoría, búsqueda, etiquetas de stock bajo y vencimiento |
| Categorías | `/categorias` | CRUD completo |
| Empleados | `/empleados` | CRUD completo, búsqueda por nombre o DNI |

### ⭐ Funcionalidades opcionales implementadas

- ✅ **Búsqueda de medicamentos** por nombre o laboratorio (y de empleados por nombre o DNI).
- ✅ **Control de stock bajo**: se marcan los medicamentos con menos de 10 unidades.
- ✅ **Alertas de vencimiento**: medicamentos vencidos y que vencen en los próximos 30 días.
- ✅ **Gráficos en el dashboard**: cantidad de medicamentos por categoría.

---

## 🔧 Solución de problemas

| Problema | Solución |
|---|---|
| `The engine "node" is incompatible` | Actualizar Node a la versión 24.15.0 o superior |
| `docker daemon is not running` | Abrir Docker Desktop y esperar a que termine de iniciar |
| El puerto 3306 está ocupado | Hay otro MySQL instalado. Cambiar el puerto en `docker-compose.yml` a `"3307:3306"` y en `backend/src/app.module.ts` a `3307` |
| `ECONNREFUSED` al iniciar el backend | El contenedor de MySQL no está corriendo: ejecutar `docker compose up -d` |
| El frontend muestra "No se pudo conectar con el servidor" | Verificar que el backend esté corriendo en el puerto 3000 |
| Error de CORS en la consola del navegador | Verificar `app.enableCors({ origin: 'http://localhost:5173' })` en `backend/src/main.ts` |
| `the input device is not a TTY` en Git Bash | Usar `docker exec` sin la opción `-it` |
| La ejecución de scripts está deshabilitada (PowerShell) | Ejecutar `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |

---

## 🌿 Flujo de trabajo con Git

Cada tarea se desarrolla en una rama propia y se integra a `master` mediante Pull Request.

```bash
git checkout master
git pull
git checkout -b feature/FM-X
# ...cambios...
git add .
git commit -m "feat: descripción del cambio"
git push -u origin feature/FM-X
```

Luego se abre un **Pull Request** en GitHub para unir la rama a `master`.
