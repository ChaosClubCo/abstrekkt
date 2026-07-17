# Architecture Reference Document (ARD) - INT Inc. Website

## 1. System Overview
The INT Inc. website is a Single Page Application (SPA) built with React and Vite. It leverages modern frontend libraries for 3D rendering, animations, and routing.

## 2. Technology Stack
- **Frontend Library**: React 19
- **Build Tool**: Vite 6
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS (Utility-first)
- **Routing**: React Router 7
- **Animations**: Framer Motion 12
- **3D Rendering**: React Three Fiber / Three.js
- **Icons**: Lucide React

## 3. Component Architecture

### 3.1. Core Components
- `App.tsx`: Root component handling the `BrowserRouter` and high-level routing.
- `Home.tsx`: Main landing page component, composed of multiple sections (Hero, Services, Testimonials, Contact).
- `About.tsx`: Dedicated page for company background, case studies, and detailed value propositions.

### 3.2. Specialized Components
- `components/QuantumScene.tsx`: Handles Three.js/R3F logic for background visuals.
- `components/Diagrams.tsx`: Contains SVG-based diagrams for technical process visualization (Invelo Pipeline, etc.).

## 4. Design Patterns

### 4.1. Routing Pattern
The application uses a standard SPA routing pattern. Internal links use the `Link` component from `react-router-dom` to avoid full page reloads.

### 4.2. Styling Pattern
Tailwind CSS is used for all styling. Custom colors and themes are defined in `index.html` (via Tailwind's `@theme` or standard CSS variables) to maintain brand consistency.

### 4.3. Animation Pattern
Framer Motion is used for:
- **Page Transitions**: Subtle fades or slide-ins.
- **Interactive Elements**: The Case Study carousel in `About.tsx` uses `AnimatePresence` for smooth slide transitions.

## 5. Data Flow
Currently, the application is primarily static with a client-side contact form.
- **Form Handling**: Local state manages form inputs. Submission triggers a mock success alert (to be replaced with a backend API call in production).

## 6. Performance Considerations
- **3D Rendering**: R3F scenes are optimized to run in the background without blocking the main UI thread.
- **Asset Loading**: Images are loaded with `referrerPolicy="no-referrer"` and utilize CDNs (Picsum for placeholders).

## 7. Security & Compliance
- **SOC 2 Focus**: The website highlights INT Inc.'s commitment to SOC 2 compliance.
- **Input Validation**: Client-side validation is implemented on the contact form to ensure data integrity.
