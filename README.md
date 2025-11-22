# Guía Completa del Proyecto Full‑Stack CRUD (React + Node.js + PostgreSQL)

En este documento te voy a mostrar **cómo construir una aplicación llamada control flota full‑stack completa**, paso por paso.

Vamos a trabajar con:

- **Frontend:** React.js + Vite + TailwindCSS + DaisyUI
- **Backend:** Node.js + Express + PostgreSQL
- **HTTP Client:** Axios

Implementaremos:

- Crear registros ✔️
- Leer registros ✔️
- Editar registros ✔️
- Eliminar registros (cambio de estado, no borrado físico) ✔️
- Búsqueda avanzada ✔️
- Selects dinámicos ✔️
- API completa con controladores, servicios y rutas ✔️

# **Configuración del Proyecto Frontend**

## 1. Instalar Node.js

Asegúrate de tener Node.js instalado en tu máquina. Para verificar:

```
node -v
```

---

## 2. Crear proyecto con Vite

```
npm create vite@latest
```

Selecciona **React** + **JavaScript**.

---

## 3. Instalar TailwindCSS

Sigue la guía oficial: [https://tailwindcss.com/docs/guides/vite](https://tailwindcss.com/docs/guides/vite)

---

## 4. Instalar DaisyUI

En la sección **ESM** de su documentación:

```
npm i -D daisyui
```

Agrega en `tailwind.config.js`:

```js
plugins: [require("daisyui")],
daisyui: { themes: ["night"] }
```

---

## 5. Crear estructura del proyecto

```
src/
 └── components/
      ├── Navbar.jsx
      ├── TableList.jsx
      ├── ModalForm.jsx
      ├── Select.jsx
```

---

# **Componentes del Frontend**

## 🔹 Navbar

Ubicación:

```
src/components/Navbar.jsx
```

Incluye:

- Input de búsqueda
- Botón **Añadir Registro** que abre el modal en modo `add`

Referencia de diseño: DaisyUI Navbar, Input y Button.

---

## 🔹 Tabla (TableList)

Referencia de tabla: [https://daisyui.com/components/table/](https://daisyui.com/components/table/)

Incluye:

- Mostrar registros
- Botón **Editar** por fila
- Botón **Eliminar** por fila (cambia estado a false)
- Columna **Estado** con badge dinámico

---

## 🔹 Modal Form

Referencia: [https://daisyui.com/components/modal/](https://daisyui.com/components/modal/)

Estados usados:

- `isOpen` → controlar visibilidad
- `mode` → "add" o "edit"
- `selectedRow` → datos cuando se edita

Funciones:

- `handleOpen()`
- `handleSubmit()`

---

## 🔹 Context

Ubicación:

```
src/context/
```

Incluye:

- VehiculoProvider.jsx
- RegisroProvider.jsx
- VehiculoContext.jsx
- RegistroContext.jsx
- Gestiona el estado el estado de los registros mediante *la obtención, adición, actualización y eliminación de datos desde los endpoints de la API, tanto para salidas como entradas* 

---

# 🛠️ **Backend – Node.js + Express**

## 1. Crear carpeta del backend

```
mkdir crud-backend
cd crud-backend
```

---

## 2. Crear archivo base

```
index.js
```

---

## 3. Inicializar proyecto

```
npm init -y
```

---

## 4. Instalar dependencias

```
npm install express cors pg dotenv
npm install --save-dev nodemon
```

Configurar `package.json`:

```json
"type": "module",
"scripts": {
  "dev": "nodemon index.js"
}
```

---

# ⚙️ **Estructura del Backend**

```
src/
 ├── db.js
 ├── index.js
 ├── controllers/
 │     └── salidaController.js
 ├── services/
 │     └── salidaService.js
 └── routes/
       └── salidaRoutes.js
```

---

\`\`\`js // db.js import pkg from 'pg'; import dotenv from 'dotenv'; dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({ connectionString: process.env.DATABASE\_URL, });

export const query = (text, params) => pool.query(text, params); \`\`\`

---

# 🧠 **Controladores y Servicios**

### 📌 Servicio: salidaService.js

\`\`\`js import { query } from '../db.js';

export const getAll = async () => { const { rows } = await query( `SELECT s.id, s.nombre_motorista, v.modelo AS vehiculo,                 s.fecha_salida, s.fecha_entrada, s.estado          FROM salidas_td s          JOIN vehiculos_td v ON v.id = s.id_vehiculo_fk          WHERE s.estado = true` ); return rows; }; \`\`\`

---

### 📌 Controlador: salidaController.js

\`\`\`js import \* as service from '../services/salidaService.js';

export const getSalidas = async (req, res) => { const data = await service.getAll(); res.json(data); }; \`\`\`

---

### 📌 Rutas: salidaRoutes.js

\`\`\`js import { Router } from 'express'; import { getSalidas } from '../controllers/salidaController.js';

const router = Router(); router.get('/', getSalidas); export default router; \`\`\`

---

# 🌐 **Servidor principal (index.js)**

\`\`\`js import express from 'express'; import cors from 'cors'; import salidaRoutes from './routes/salidaRoutes.js';

const app = express(); app.use(cors()); app.use(express.json());

app.use('/api/salidas', salidaRoutes);

app.listen(3000, () => console.log('Servidor ejecutándose en [http://localhost:3000](http://localhost:3000)') ); \`\`\`

---

# 🗄️ **Base de Datos PostgreSQL**

## Crear tabla vehículos

\`\`\`sql CREATE TABLE vehiculos\_td ( id SERIAL PRIMARY KEY, modelo VARCHAR(150) NOT NULL, placa VARCHAR(20) UNIQUE NOT NULL ); \`\`\`

---

## Crear tabla salidas

\`\`\`sql CREATE TABLE salidas\_td ( id SERIAL PRIMARY KEY, id\_vehiculo\_fk INTEGER REFERENCES vehiculos\_td(id), nombre\_motorista VARCHAR(100) NOT NULL, fecha\_salida TIMESTAMP DEFAULT NOW(), fecha\_entrada TIMESTAMP, estado BOOLEAN DEFAULT TRUE ); \`\`\`

---

# 🔄 API COMPLETA

### GET – obtener registros

```
GET /api/salidas
```

### POST – crear salida

### PUT – editar salida

### PATCH – cambiar estado

(Agrega aquí tus endpoints reales si quieres que los documente también.)

---

# 🔗 **Consumir API en React con Axios**

\`\`\`js useEffect(() => { const fetchData = async () => { const res = await axios.get('/api/salidas'); setData(res.data); }; fetchData(); }, []); \`\`\`

---

# 🧪 **Probando API con Postman**

1. Abrir Postman
2. Crear request POST:

```
http://localhost:5000/api/salidas
```

3. En Body → raw → JSON:

```json
{
  "id_vehiculo_fk": 1,
  "nombre_motorista": "Pedro Lopez"
}
```

4. Probar GET, PUT, PATCH
5. Repositorio GitHub.

Github Repositorio backend: [https://github.com/bricode96/vehiculo-registro](https://github.com/bricode96/vehiculo-registro)

Github Repositorio frontend: [https://github.com/bricode96/registro-frontend](https://github.com/bricode96/registro-frontend)

Pagina Netlify: [**tufrontend.netlify.app**](https://tufrontend.netlify.app/)
