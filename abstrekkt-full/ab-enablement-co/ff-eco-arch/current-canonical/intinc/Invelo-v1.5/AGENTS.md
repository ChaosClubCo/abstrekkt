# Project Context: INT Inc. Website

## Project Overview
INT Inc. is an AI services company. This project is a professional website showcasing their "InVelo" service line.

## Core Conventions
- **Routing**: Use `react-router-dom`. The root is `App.tsx`, homepage is `Home.tsx`, and about page is `About.tsx`.
- **Styling**: Use Tailwind CSS with the brand palette (Navy, Gold, Teal, Cream).
- **Icons**: Use `lucide-react`.
- **Animations**: Use `framer-motion`.
- **3D**: Background visuals use `react-three-fiber`.

## Brand Colors
- Navy: `#0A192F` (Primary)
- Gold: `#C5A059` (Accent)
- Teal: `#2D5A5A` (Secondary Accent)
- Cream: `#F9F8F4` (Background)

## Documentation
- PRD, ARD, and Best Practices are located in the `/docs` directory.
- Always update these documents when making significant architectural or feature changes.

## Development Rules
1. **No Mock Data for Real Requests**: If the user asks for real integrations (e.g., a real contact form backend), implement it rather than mocking.
2. **Responsive First**: Ensure all new sections work on mobile.
3. **Accessibility**: Maintain semantic HTML and ARIA labels.
