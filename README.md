## Conectar con Firebase

Pasos rápidos para conectar este proyecto con Firebase (Firestore / Auth / Storage):

1. Crear un proyecto en https://console.firebase.google.com/ y registrar una app web.
2. Instalar la dependencia oficial de Firebase:

```powershell
npm install firebase
```

3. Añadir las variables de entorno a un archivo `.env.local` en la raíz del proyecto (no comitees este archivo). Ejemplo:

```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

4. Reinicia el servidor de desarrollo (`npm run dev`) para que Vite cargue las nuevas variables.

5. Uso desde el código: importa los helpers que agregamos en `src/lib/firebase.js` y `src/lib/firestoreService.js`.

Ejemplo simple (guardar un avance):

```js
import { addAvance } from '../lib/firestoreService';

await addAvance({ proyecto: 'Fragata F-110', swbs: 'SWB-001', actividad: 'Ejemplo', horasInvertidas: 10, avanceMm: 50, totalMm: 100, estado: 'En progreso', userId: uid });
```

Notas:
- Usamos el prefijo `VITE_` en las variables de entorno para que Vite las exponga en `import.meta.env`.
- El módulo `src/lib/firebase.js` inicializa Firebase y exporta `auth`, `db` y `storage`.
- El módulo `src/lib/firestoreService.js` incluye helpers para operaciones comunes (añadir/get).
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
