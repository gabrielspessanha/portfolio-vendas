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

Angular 19 SPA using **standalone components** (no NgModules). Entry point is [src/main.ts](src/main.ts), bootstrap config in [src/app/app.config.ts](src/app/app.config.ts). Root shell is [src/app/app.component.ts](src/app/app.component.ts) — inline template that composes all page sections in order.

**Implemented sections (in render order):**
1. `app-header` — fixed header with logo, nav links, "ORÇAMENTO GRÁTIS" CTA
2. `app-hero` — split-screen diagonal layout, headline, mockups image
3. `app-services` — vertical tabs (desktop) / accordion (mobile), 5 services, WhatsApp CTA per service
4. `app-how-it-works` — 4-step process timeline, horizontal desktop / vertical mobile, single scroll-reveal animation

**Styling:**
- SCSS variables in [src/styles/_variables.scss](src/styles/_variables.scss) — all brand colours, gradients, card surfaces, layout tokens, transitions
- Every component SCSS uses `@use 'variables' as *;` without a relative path (configured via `stylePreprocessorOptions.includePaths` in `angular.json`)
- Tailwind CSS v3 directives are in [src/styles.scss](src/styles.scss); both Tailwind utilities and custom SCSS coexist
- The hero diagonal cut is `clip-path: polygon(...)` on `.bg-dark-panel` (absolute, right-aligned, z-index 0) with content on z-index 1

**Angular Animations:**
- `provideAnimationsAsync()` registered in [src/app/app.config.ts](src/app/app.config.ts)
- `HeroComponent` — `fadeSlideUp` trigger with `params: { duration, delay }` for staggered page-load entrance
- `HeaderComponent` — `contactHover` state machine (default ↔ hovered) on the CTA button
- `ServicesComponent` — `revealOnScroll` (IntersectionObserver triggers hidden→visible), `contentSwitch` (tab content fade+slide), `accordionContent` (height 0↔* for mobile), `chevronRotate` (icon flip)

**ServicesComponent specifics:**
- `whatsappNumber` constant at the top of [src/app/components/services/services.component.ts](src/app/components/services/services.component.ts) — replace `'SEUNUMERO'` before deploying
- SVG icons are inlined via `DomSanitizer.bypassSecurityTrustHtml()` — the `getIconSvg(icon, size)` method owns all icon markup
- ARIA tablist keyboard navigation implemented: arrow keys move focus between tabs

**Key conventions:**
- Standalone components only — do not introduce NgModules
- Strict TypeScript (`strict`, `noImplicitOverride`, `noFallthroughCasesInSwitch`)
- New Angular control flow (`@for`, `@if`, `@switch`), not structural directives (`*ngFor`, `*ngIf`)
- Component selector prefix: `app-`
- Font: Inter (400/500/700/900) loaded from Google Fonts in [src/index.html](src/index.html)

**Responsive breakpoints:**
- `>1024px` — full split-screen diagonal layout
- `768–1024px` — split maintained, scaled proportions
- `<768px` — stacked vertically (light on top, dark below), no diagonal; services section switches to accordion

**Constraints:**
- Do not install new npm packages without asking
- Animations must be optimised for mobile (prefer `transform`/`opacity`, avoid layout-triggering properties)
- Always include `aria-label` / `alt` text on interactive elements and images