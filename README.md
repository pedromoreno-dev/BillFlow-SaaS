# 🚀 BillFlow SaaS | Plataforma de Facturación Disruptiva

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4fc08d?style=for-the-badge&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178c6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8?style=for-the-badge&logo=tailwind-css)
![Status](https://img.shields.io/badge/Status-In_Development-orange?style=for-the-badge)
[![Frontend Check](https://img.shields.io/github/actions/workflow/status/pedromoreno-dev/BillFlow-SaaS/frontend-check.yml?style=for-the-badge)](https://github.com/pedromoreno-dev/BillFlow-SaaS/actions/workflows/frontend-check.yml)
[![Snyk Vulnerabilidades](https://snyk.io/test/github/pedromoreno-dev/BillFlow-SaaS/badge.svg)](https://app.snyk.io/org/pcmoreno11/project/203594a2-4c52-4a38-ad33-2e123f0a8fc5)

**BillFlow** es una solución SaaS de facturación multi-inquilino (B2B) diseñada con un enfoque disruptivo, priorizando la experiencia de usuario (UX) y la escalabilidad técnica. 

---

## ✨ Características Destacadas (Frontend Core)

* **Diseño Rompedor:** Interfaz basada en *Bento Grid* y estética moderna para una gestión financiera visual y eficiente.
* **Arquitectura Full-Typed:** Desarrollado íntegramente con **TypeScript** para garantizar la robustez de los datos.
* **Multilenguaje (i18n):** Soporte nativo para múltiples idiomas, con **Español** como lengua principal.
* **Reactividad Avanzada:** Generador de facturas dinámico con cálculos de impuestos y totales en tiempo real.
* **Componentización:** Biblioteca de componentes reutilizables y modulares.

---

## 🛠️ Stack Tecnológico

### Frontend (En Desarrollo 🚧)
* **Framework:** Vue 3 (Composition API).
* **Estilos:** Tailwind CSS (Diseño responsivo y personalizado).
* **Estado:** Pinia (Gestión de estados globales de facturación).
* **Iconografía:** Lucide Icons.
* **Herramientas:** Vite + TypeScript.

### Backend (En Desarrollo 🚧)
* **Lenguaje:** Java 21.
* **Framework:** Spring Boot 3.x.
* **Seguridad:** Spring Security + JWT (Multi-tenancy isolation).
* **Base de Datos:** PostgreSQL.

---

## 🗺️ Roadmap de Desarrollo

Este proyecto se encuentra en una fase de despliegue progresivo:

- [x] **Fase 1:** Diseño de UI/UX Disruptivo y Prototipado en Vue 3.
- [ ] **Fase 2:** Implementación de Lógica Frontend y Sistema i18n.
- [ ] **Fase 3:** Desarrollo del Core API en Java (Spring Boot).
- [ ] **Fase 4:** Integración de Persistencia de Datos y Multi-tenancy.
- [ ] **Fase 5:** Generación automática de PDF y envío por Email.

---

## 🚀 Instalación y Uso (Frontend)

Si quieres explorar la interfaz actual:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/pedromoreno-dev/BillFlow-SaaS.git
   ```
2. Navega al directorio del frontend:
   ```bash
   cd BillFlow-SaaS/frontend
   ```
3. Instala las dependencias y arranca el servidor local:
   ```bash
   npm install
   npm run dev
   ```