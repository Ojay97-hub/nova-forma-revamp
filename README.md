# Nova Forma Designs

Premium single-page studio site. React + TypeScript + Tailwind CSS + GSAP (ScrollTrigger) + React Three Fiber, smooth-scrolled with Lenis.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # serve the production build
```

## Structure

```
src/
  App.tsx                     Lenis <-> ScrollTrigger sync, page layout
  lib/animations.ts           Shared GSAP reveal helpers (word masks, fade-ups)
  hooks/usePrefersReducedMotion.ts
  components/
    Navbar.tsx                Sticky glass nav, hides on scroll-down
    Hero.tsx                  Headline choreography + parallax 3D form
    About.tsx                 Studio pillars, parallax wordmark
    Services.tsx              Spotlight hover cards
    Work.tsx                  Clip-reveal case studies (CSS-generated covers)
    Process.tsx               Pinned horizontal timeline (vertical on mobile)
    FormStudy.tsx             Lazy-mounted interactive 3D section
    Contact.tsx               Form (wire onSubmit to your handler on deploy)
    Footer.tsx
    MagneticButton.tsx        rAF-lerped magnetic CTA
    three/HeroScene.tsx       Chrome torus knot, orchid rim light
    three/OrbitalScene.tsx    Gyroscope rings + wireframe core
```

## Notes

- All motion (GSAP, Lenis, Three.js loops) is gated behind `prefers-reduced-motion`.
- Both canvases clamp `dpr` to 1.75 and the second one lazy-mounts near the viewport.
- No external assets: covers, grain and glows are generated in CSS/SVG; fonts load from Google Fonts.
- The contact form currently shows a local success state — point `onSubmit` at Brevo/Resend/Formspree before going live.
