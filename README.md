# 🌍 Zero-Impact: Monitor de Huella de Carbono

![Zero Impact Banner](https://img.shields.io/badge/Zero-Impact-Green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google-bard)

**Zero-Impact** es una aplicación web progresiva (PWA) diseñada para ayudar a los usuarios a medir, entender y reducir su huella de carbono personal. Mediante el registro de actividades diarias y el uso de Inteligencia Artificial, la plataforma ofrece recomendaciones personalizadas para fomentar un estilo de vida más sostenible.

🔗 **[Ver Demo en Vercel](https://zero-impact.vercel.app/)** 

---

## 🚀 Características Principales

* **📊 Dashboard Interactivo:** Visualización de datos en tiempo real con gráficas animadas (Chart.js) que comparan tus emisiones vs. el promedio nacional.
* **📝 Registro de Actividades:** Interfaz intuitiva para registrar transporte, alimentación, uso de energía y consumo. Soporta fechas pasadas y futuras.
* **🤖 Consejos con IA (Gemini):** Integración con Google Gemini 3 PRO para analizar tus patrones de consumo y generar consejos personalizados y urgentes.
* **🏆 Gamificación:** Sistema de insignias (Badges) que se desbloquean automáticamente al cumplir metas sostenibles.
* **📚 Centro de Aprendizaje Inteligente:** Recomendación de documentales y artículos curados por IA basados en tus hábitos más críticos.
* **🔒 Autenticación Segura:** Gestión de usuarios y sesiones mediante **Clerk** (Google Login).
* **📱 Diseño Responsivo:** Interfaz totalmente adaptada a dispositivos móviles y escritorio.

---

## 🛠️ Stack Tecnológico

* **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons.
* **Backend:** Next.js API Routes (Serverless).
* **Base de Datos:** MongoDB Atlas (Mongoose ODM).
* **Inteligencia Artificial:** Google Generative AI SDK (Gemini 3.0 PRO).
* **Autenticación:** Clerk Auth.
* **Gráficos:** Chart.js & React-Chartjs-2.
* **Despliegue:** Vercel.

---

## ⚙️ Instalación y Configuración Local

Sigue estos pasos para correr el proyecto en tu computadora:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/S4ntiNPC/zero-impact.git](https://github.com/S4ntiNPC/zero-impact.git)
    cd zero-impact
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y agrega las siguientes claves:

    ```env
    # Conexión a Base de Datos
    MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/zero-impact

    # Autenticación (Clerk)
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

    # Inteligencia Artificial (Google AI Studio)
    GOOGLE_API_KEY=AIzaSy...
    ```

4.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

5.  Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🧠 Cómo funciona la IA

El proyecto utiliza un sistema híbrido para garantizar que el usuario siempre reciba consejos:

1.  **Análisis de Datos:** El backend recopila el historial de actividades del usuario y calcula qué categoría (Transporte, Energía, etc.) tiene el mayor impacto en CO2eq.
2.  **Consulta a Gemini:** Se envía un *prompt* estructurado a la API de Google Gemini solicitando consejos específicos y recursos educativos en formato JSON.
3.  **Sistema de Caché:** Las respuestas de la IA se guardan en MongoDB para evitar tiempos de carga en visitas futuras y ahorrar cuota de API.
4.  **Plan de Respaldo (Fallback):** Si la conexión con la IA falla o el límite de cuota se excede, el sistema activa automáticamente un algoritmo local que selecciona consejos predefinidos de una base de datos interna.

---

## 👥 Equipo de Desarrollo

Proyecto desarrollado de manera independiente

* **Santiago Marquez Baeza**

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.