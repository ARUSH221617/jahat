# Project Design Architecture

This document describes the design system, aesthetics, typography, styling configuration, and UX guidelines applied across the Jahat Educational Institute portal and AI agent interface.

---

## 1. Design System and Colors

The project leverages **Tailwind CSS v4** utilizing **OKLCH** color values. The OKLCH color space provides uniform perceptual brightness control and richer colors.

### 1.1 Color Palette Mapping
CSS custom variables are defined inside [globals.css](file:///D:/arush/jahat/src/app/globals.css) and exposed under `@theme inline` mapping to standard Tailwind utility classes:

| Color Token | Light Mode Value (OKLCH) | Dark Mode Value (OKLCH) | Description |
| :--- | :--- | :--- | :--- |
| `--background` | `oklch(0.99 0.005 225)` | `oklch(0.12 0.02 225)` | Body background color |
| `--foreground` | `oklch(0.18 0.03 225)` | `oklch(0.98 0.005 225)` | Primary text color |
| `--primary` | `oklch(0.63 0.14 225)` (`#25a0bd`) | `oklch(0.70 0.12 225)` | Highlight and primary buttons |
| `--secondary` | `oklch(1 0 0)` (`#ffffff`) | `oklch(1 0 0)` | Secondary elements and pills |
| `--muted` | `oklch(0.96 0.015 225)` | `oklch(0.18 0.02 225)` | Subtle backdrops / placeholders |
| `--muted-foreground`| `oklch(0.5 0.03 225)` | `oklch(0.65 0.02 225)` | Inactive states / labels |
| `--accent` | `oklch(0.69 0.20 71)` (`#fb8500`) | `oklch(0.72 0.20 71)` | Hover accent backgrounds / awards |
| `--destructive` | `oklch(0.55 0.18 25)` | `oklch(0.48 0.15 25)` | Errors / Delete actions |
| `--border` | `oklch(0.91 0.015 225)` | `oklch(0.22 0.02 225)` | Borders with light transparency |

### 1.2 Layout & Borders
*   **Border Radius**: Controlled via `--radius: 0.625rem`. Responsive modifiers compute:
    *   `rounded-sm` -> `calc(var(--radius) - 4px)` (6px)
    *   `rounded-md` -> `calc(var(--radius) - 2px)` (8px)
    *   `rounded-lg` -> `var(--radius)` (10px)
    *   `rounded-xl` -> `calc(var(--radius) + 4px)` (14px)
*   **Shadows and Glows**: Tailwind CSS shadows are layered to offer premium card elevations without adding heavy borders.

---

## 2. Typography

The layout relies on **Geist Mono** and **Geist Sans** font families via Next.js Font Optimization:
*   **Sans font**: `var(--font-geist-sans)` used for titles, paragraphs, navigation, and regular interface controls.
*   **Mono font**: `var(--font-geist-mono)` used for syntax-highlighted code blocks, spreadsheets, logs, and technical variables.

---

## 3. Aesthetic Themes and Animations

The user interface implements several high-end interactive visual styles:

### 3.1 Custom Animations
Animations are defined natively inside [globals.css](file:///D:/arush/jahat/src/app/globals.css) layer utilities:
*   **Fade In (`.animate-fade-in`)**: Animates opacity from 0 to 1 and moves content upwards by `20px` over `0.8s`.
*   **Fade In Delay (`.animate-fade-in-delay`)**: Introduces a `0.3s` staggered delay for multi-step content reveals, providing a smooth entry transition.

### 3.2 Glassmorphism & Micro-Interactions
*   **Translucent Navigation**: The headers and toolbars employ backing filters (`backdrop-blur-md`) overlaid on semi-transparent background colors.
*   **Hover states**: UI icons and buttons use swift hover transitions (`transition-all duration-200`) and slight scaling changes.

---

## 4. Layout Layouts & UX Architecture

### 4.1 Split-Screen Canvas (Artifacts)
The chat interface features an asymmetric layout that adapts in real-time:
*   **Single-Pane Chat**: By default, the interface is centered, optimized for direct dialogue.
*   **Split Pane (50/50)**: When a document or script is generated, the layout shifts to host the conversation in the left pane and the **Artifact Viewer** in the right pane.
*   **Artifact Toolbar**: Includes control utilities (e.g., zoom/fit, copy content, code execution, console output, and diff view).

### 4.2 Admin Panel Layout
*   **Navigation Shell**: Uses a collapsible grid system consisting of a sticky side sidebar and a responsive top header for mobile access.
*   **Data Presentation**: Multi-column responsive table interfaces containing custom search query filters, pagination steps, and inline action items.

### 4.3 Public-Facing Landing Page
*   **Hero Section**: Uses a modern gradient background layout (`bg-linear-to-br from-blue-50 to-indigo-100`) combined with high-contrast text layout hierarchy.
*   **Course Catalog grid**: Responsive list items using `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` which house custom thumbnail placeholders, level badges, and course parameters.

### 4.4 Right-to-Left (RTL) Support
*   **Persian (fa) Optimization**: Document directionality is set to `dir="rtl"` and page locale to `lang="fa"` across all root layout definitions.
*   **Tailwind Logical Properties**: Uses bidirectional logical classes (like `ms-*`, `pe-*`, `start-*`, `end-*`) to automatically mirror padding, margins, borders, and position coordinates based on text direction.
