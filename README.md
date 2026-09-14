<div align="center">

  # 🚀 Durgesh Padwal | AI & Full-Stack Engineer Portfolio

  <p align="center">
    <b>A high-performance, interactive 3D Canvas & WebGL portfolio built with React, Vite, TypeScript, GSAP, and Tailwind CSS.</b>
  </p>

  [![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![GSAP](https://img.shields.io/badge/GSAP-3.x-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

  [✨ Features](#-key-features) • [🛠️ Tech Stack](#%EF%B8%8F-tech-stack--ecosystem) • [📂 Architecture](#-project-architecture) • [🚀 Projects](#-featured-projects) • [⚡ Quick Start](#-getting-started) • [📬 Contact](#-connect--contact)

</div>

---

## 🌟 Overview

Welcome to my personal developer portfolio! This repository showcases an immersive, modern web experience designed to highlight my expertise across **Artificial Intelligence, Machine Learning, Data Science, and Full-Stack Engineering**.

It features real-time **Canvas 2D scroll-driven frame animations**, smooth scroll physics, custom UI micro-interactions, decrypted text effects, and interactive project cards.

---

## ✨ Key Features

- **🎨 112-Frame Canvas Animation**: Smooth 60FPS scroll-bound canvas rendering loop with retina DPR scaling & reduced motion support.
- **⚡ Ultra-Fast Performance**: Built on Vite with lazy-loaded, code-split sections for instant load times.
- **📜 Physics-Based Smooth Scroll**: Integrated with `@studio-freight/lenis` and GSAP `ScrollTrigger`.
- **🎭 Dynamic UI Components**:
  - Interactive Flip Cards & Profile Cards
  - Cyberpunk Decrypted Text & Fuzzy Text components
  - Floating Pill Navigation bar
  - Scroll-stacked project cards reveal
- **🛡️ Built-in Resilience**: Global error boundaries, idle state handling, accessibility controls, and responsive scaling across desktop & mobile.
- **💼 Comprehensive Showcase**: Features dedicated sections for About, Interactive Skills Matrix, Featured Projects, Education Timeline, and Interactive Contact Form.

---

## 🛠️ Tech Stack & Ecosystem

| Category | Technology / Library |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite 5 |
| **Styling & UI Components** | Tailwind CSS, Shadcn UI, Radix UI Primitives, Lucide Icons |
| **Animations & FX** | GSAP & ScrollTrigger, Framer Motion, Lenis Smooth Scroll, Canvas 2D |
| **State & Data Management** | TanStack React Query, React Hook Form, Zod Schema Validation |
| **AI & Data Science (Projects)**| Python, PyTorch, Scikit-Learn, Pandas, NumPy, Plotly, Seaborn |

---

## 📂 Project Architecture

```
durgesh-s-ai-portfolio/
├── public/                 # Static assets, resume.pdf, frame sequence images
├── src/
│   ├── components/         # Modular UI components
│   │   ├── ui/             # Reusable Shadcn UI primitives & lazy wrappers
│   │   ├── AboutSection.tsx # GSAP animated about section with bio & traits
│   │   ├── HeroSection.tsx  # 112-Frame canvas scroll engine
│   │   ├── ProjectsSection.tsx # Interactive stackable project cards
│   │   ├── SkillsSection.tsx   # Skill matrix & badge grid
│   │   ├── EducationSection.tsx# Interactive timeline & education cards
│   │   ├── ContactSection.tsx  # Validated contact form & social links
│   │   └── DecryptedText.tsx   # Cyberpunk text decoding animation
│   ├── hooks/              # Custom React hooks (useIdle, useScroll, etc.)
│   ├── pages/              # Route pages (Index, NotFound)
│   ├── App.tsx             # Main application wrapper & context providers
│   └── main.tsx            # Application entry point
├── package.json            # Node.js dependencies & custom scripts
├── tailwind.config.ts      # Theme extensions, keyframe animations, & colors
└── vite.config.ts          # Vite build & alias configuration
```

---

## 🚀 Featured Projects

Here are key projects showcased in this portfolio codebase:

| Project | Description | Tech Stack | Repository |
| :--- | :--- | :--- | :--- |
| **Dataset Poisoning Detection** | ML security tool to detect malicious data injection into model training sets. | Python, PyTorch, Scikit-learn | [🔗 GitHub](https://github.com/Durgesh729/AI-that-detect-Dataset-Poisoning.git) |
| **Loan Approval Predictor** | Machine learning web application for automated applicant risk & approval evaluation. | Python, FastAPI, Scikit-learn, React | [🔗 GitHub](https://github.com/Durgesh729/Loan-Approval.git) |
| **Academic Workflow with RBAC** | Multi-tier portal for mentors, mentees, and HODs featuring role-based access control. | React, PostgreSQL, REST APIs | [🔗 GitHub](https://github.com/Durgesh729/Multi-Tier-Academic-Workflow-with-RBAC.git) |
| **Smart Business Analytics** | Automated analytics platform generating visual sales insights from uploaded dataset files. | Python, Pandas, Plotly, Seaborn | [🔗 GitHub](https://github.com/Durgesh729/Smart-Buisiness-Analytics.git) |

---

## ⚡ Getting Started

### Prerequisites

Ensure you have the following installed locally:
- **Node.js** (v18.x or higher recommended)
- **npm** (v9.x or higher) or **bun**

### Quick Start Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Durgesh729/Portfolio.git
   cd Portfolio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Launch Development Server**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:8080` (or your local port shown in terminal).

4. **Build for Production**
   ```bash
   npm run build
   ```
   The production-ready bundle will be compiled into the `dist/` folder.

---

## ⚙️ Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs development servers (Vite + auxiliary processes) |
| `npm run dev:vite` | Runs Vite development server standalone |
| `npm run build` | Builds optimized production bundle |
| `npm run preview` | Locally preview production build |
| `npm run lint` | Runs ESLint for syntax checks & code consistency |

---

## 🎨 Customization Guide

To adapt this portfolio template for your own developer profile:

1. **Bio & Experience**: Modify personal details and resume trigger in `src/components/AboutSection.tsx`.
2. **Projects List**: Update project metadata and GitHub URLs in `src/components/ProjectsSection.tsx`.
3. **Skills Matrix**: Modify categories & icons in `src/components/SkillsSection.tsx`.
4. **Hero Canvas Animation**: Replace frame sequence files located in the `public/` directory.

---

## 📬 Connect & Contact

<div align="center">

**Durgesh Padwal**  
*AI & Full-Stack Engineer*

[![GitHub](https://img.shields.io/badge/GitHub-Durgesh729-181717?style=for-the-badge&logo=github)](https://github.com/Durgesh729)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/durgesh-padwal)
[![Email](https://img.shields.io/badge/Email-Contact_Me-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:durgeshpadwal@gmail.com)

---

⭐ **If you find this repository helpful or inspiring, feel free to give it a star!** ⭐

</div>

