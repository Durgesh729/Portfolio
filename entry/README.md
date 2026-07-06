# Portfolio Entry Project

This project serves as the animated **Entry Point** for my personal portfolio website. It is built with Next.js and features a unique, immersive opening sequence.

## Project Architecture & Purpose

The core purpose of this project is to provide a seamless, cinematic introduction before revealing the main portfolio content.

### **Entry Point (`app/page.tsx`)**
The `app/page.tsx` file is the master container for the application. It wraps the entire experience in the `ScrollExpansionHero` component.

### **Animation Flow**
The user experience is orchestrated in stages within `components/ui/scroll-expansion-hero.tsx`:

1.  **Laptop Phase**:
    *   A 3D laptop is displayed closed and then opens using CSS keyframe animations.
    *   This sets the stage, simulating the user "logging in" or opening a workspace.

2.  **Terminal Loader & Status Check**:
    *   Once the laptop opens, a **Terminal Loader** appears on the screen.
    *   This component (`.terminal-loader`) displays a "Status" check with a typing animation ("Welcome to portfolio"), adding a technical/developer aesthetic.

3.  **Expansion & Reveal**:
    *   After the intro sequence, the laptop screen "expands" to fill the user's viewport.
    *   This transition seamlessly bridges the gap between the 3D object and the 2D web page.
    *   **Architecture Note**: The actual "Portfolio Control" or main website content is intended to be injected or rendered here (currently the terminal loader stays, but this is the slot for the full site).

## Developer Notes

When moving this folder or opening it in a different environment, please note:

*   **`app/page.tsx`**: Is intentionally minimal. It delegates the layout and animation logic to the hero component.
*   **`components/ui/scroll-expansion-hero.tsx`**: Contains the complex animation logic (Framer Motion + CSS Modules) and the Terminal Loader HTML/CSS.
*   **Customization**: To add the main portfolio content (Projects, About, Contact), you should insert it as `children` into the `ScrollExpansionHero` in `page.tsx` or replace the terminal loader content in the `complete` phase of the animation.

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the animation sequence.
