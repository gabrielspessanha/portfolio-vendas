# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at localhost:4200 (hot reload)
npm run build      # Production build → dist/portfolio-vendas/
npm run watch      # Watch mode build
npm test           # Karma + Jasmine tests with coverage
```

## Architecture

Angular 19 SPA using **standalone components** (no NgModules). Entry point is [src/main.ts](src/main.ts), bootstrap config in [src/app/app.config.ts](src/app/app.config.ts).

**Component structure:**
- [src/app/components/header/](src/app/components/header/) — fixed header with logo, nav links, contact button
- [src/app/components/hero/](src/app/components/hero/) — split-screen hero with diagonal layout and project placeholders
- [src/app/app.component.ts](src/app/app.component.ts) — root shell, imports Header + Hero, uses inline template

**Styling:**
- SCSS variables live in [src/styles/_variables.scss](src/styles/_variables.scss) — brand colours, gradients, radii, transitions
- `angular.json` sets `stylePreprocessorOptions.includePaths: ["src/styles"]` so every component SCSS can `@use 'variables' as *;` without a relative path
- Tailwind CSS v3 is configured via [tailwind.config.js](tailwind.config.js); directives (`@tailwind base/components/utilities`) are in [src/styles.scss](src/styles.scss)
- The hero diagonal cut is pure CSS: `clip-path: polygon(...)` on `.bg-dark-panel` (absolute, right-aligned, z-index 0) with content on z-index 1

**Angular Animations:**
- `provideAnimationsAsync()` is registered in [src/app/app.config.ts](src/app/app.config.ts)
- `HeroComponent` uses a `fadeSlideUp` trigger with `params: { duration, delay }` to stagger each text element on page load
- `HeaderComponent` uses a `contactHover` state machine (default ↔ hovered) for the CTA button glow

**Key conventions:**
- Standalone components only — do not introduce NgModules
- Strict TypeScript (`strict`, `noImplicitOverride`, `noFallthroughCasesInSwitch`)
- New Angular control flow (`@for`, `@if`, `@switch`), not structural directives
- Component selector prefix: `app-`
- Font: Inter (400/500/700/900) loaded from Google Fonts in [src/index.html](src/index.html)

**Responsive breakpoints:**
- `>1024px` — full split-screen diagonal layout
- `768–1024px` — split maintained, scaled proportions
- `<768px` — stacked vertically (light on top, dark below), no diagonal
