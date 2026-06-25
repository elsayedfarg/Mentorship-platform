---
name: Heritage Excellence
colors:
  surface: '#fcf9f6'
  surface-dim: '#dcdad7'
  surface-bright: '#fcf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f0'
  surface-container: '#f0edea'
  surface-container-high: '#eae8e5'
  surface-container-highest: '#e5e2df'
  on-surface: '#1c1c1a'
  on-surface-variant: '#50453e'
  inverse-surface: '#31302f'
  inverse-on-surface: '#f3f0ed'
  outline: '#82746d'
  outline-variant: '#d4c3ba'
  surface-tint: '#79573f'
  primary: '#553722'
  on-primary: '#ffffff'
  primary-container: '#6f4e37'
  on-primary-container: '#eec1a4'
  inverse-primary: '#eabda0'
  secondary: '#7b5900'
  on-secondary: '#ffffff'
  secondary-container: '#fcca66'
  on-secondary-container: '#755400'
  tertiary: '#50392b'
  on-tertiary: '#ffffff'
  tertiary-container: '#695041'
  on-tertiary-container: '#e6c4b0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc6'
  primary-fixed-dim: '#eabda0'
  on-primary-fixed: '#2d1604'
  on-primary-fixed-variant: '#5f402a'
  secondary-fixed: '#ffdea4'
  secondary-fixed-dim: '#f0bf5c'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4200'
  tertiary-fixed: '#ffdbc7'
  tertiary-fixed-dim: '#e1c0ac'
  on-tertiary-fixed: '#29170b'
  on-tertiary-fixed-variant: '#594233'
  background: '#fcf9f6'
  on-background: '#1c1c1a'
  surface-variant: '#e5e2df'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  top-nav-height: 72px
  sidebar-width: 280px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  base-unit: 8px
---

## Brand & Style
The design system is anchored in the concept of "Quiet Luxury"—a sophisticated, executive-level SaaS aesthetic that balances professional utility with the warmth of a high-end concierge service. It targets seasoned mentors and ambitious mentees who value wisdom, structure, and premium experiences. 

The design style is **Corporate Modern with Tactile Refinement**. It utilizes generous whitespace, a warm monochromatic palette, and subtle elevation to create an environment that feels stable, authoritative, and welcoming. The interface avoids aggressive digital trends in favor of timeless editorial layouts, ensuring the platform feels like a prestigious institution rather than just a tool.

## Colors
The palette is centered on a "Coffee and Cream" foundation to evoke a sense of grounding and focus.
- **Primary (#6F4E37):** Used for primary actions, brand headers, and structural emphasis.
- **Dark (#4A3426):** Reserved for deep contrast elements, primary text, and high-level navigation backgrounds if needed.
- **Light (#A67C52):** Used for secondary illustrations, supporting icons, and hover states.
- **Cream (#F8F5F2):** The primary canvas color. It provides a softer, more premium alternative to pure white, reducing eye strain.
- **Gold (#C89B3C):** A high-value accent used sparingly for achievement markers, premium features, and calls to discovery.
- **Neutral/Border (#DDD6CF):** A warm-grey used for structural hair lines and decorative dividers.

## Typography
The typography system pairs **Plus Jakarta Sans** (a modern, high-end alternative to Poppins with better screen legibility) for headlines with **Inter** for functional body text. 

Headlines should use a tighter letter-spacing to maintain a "prestige" look. Body text prioritizes readability with generous line heights. Labels and small metadata should utilize the medium or semi-bold weights of Inter to maintain hierarchy against the rich background colors.

## Layout & Spacing
This design system utilizes a **Fixed-Fluid Hybrid Grid**. The application frame is defined by a 280px sidebar and a 72px top navigation bar. The main content area lives within a max-width container of 1440px for dashboard views to ensure optimal line lengths for reading.

- **Desktop:** 12-column grid, 24px gutters, 40px outer margins within the content area.
- **Tablet:** 8-column grid, 20px gutters, 24px margins.
- **Mobile:** 4-column grid, 16px gutters, 16px margins.

Spacing follows an 8px geometric progression (8, 16, 24, 32, 48, 64) to maintain a rigorous visual rhythm.

## Elevation & Depth
Elevation is communicated through **Tonal Layering** and **Soft Ambient Shadows**. 

Instead of heavy black shadows, use tinted shadows (e.g., `rgba(74, 52, 38, 0.08)`) to maintain the warm aesthetic. 
- **Level 0 (Base):** Cream (#F8F5F2) background.
- **Level 1 (Cards):** Pure White (#FFFFFF) surface with a 1px border (#DDD6CF).
- **Level 2 (Dropdowns/Modals):** Pure White surface with a 12px blur, 4px Y-offset shadow.
- **Interactive Depth:** Use 1px inset borders on input fields to create a "pressed" look without using heavy skeuomorphism.

## Shapes
The shape language is "Soft Professional." A base radius of 4px is used for most UI components (buttons, inputs) to maintain a crisp, serious architectural feel, while larger containers (cards, modals) use 8px (rounded-lg) to soften the overall interface. Interactive elements should never be fully pill-shaped unless they are status tags/chips.

## Components
- **Top Navigation:** 72px height, #F8F5F2 background. Use a bottom-border of 1px #DDD6CF for definition.
- **Sidebar:** 280px width. Primary background is #F8F5F2. 
    - *Active State:* Background #EDE5DD with a 4px solid #6F4E37 left-aligned border. 
    - *Text:* Use Label-MD for nav items.
- **Buttons:**
    - *Primary:* #6F4E37 background, #FFFFFF text. No shadow on idle, subtle lift on hover.
    - *Secondary:* Transparent background, #6F4E37 border (1px), #6F4E37 text.
- **Cards:** White background, 1px #DDD6CF border, 4px border-radius. Padding should be 24px minimum.
- **Input Fields:** 1px #DDD6CF border, 4px radius, Inter 14px text. Focus state uses a 1px #6F4E37 border and a soft glow.
- **Iconography:** Use a custom "Discovery & Wealth" metaphor set.
    - **Compass:** Navigation/Explore.
    - **Telescope:** Strategic Planning/Vision.
    - **Coffee Bean:** Community/Energy/Base-level tasks.
    - **Lantern:** Guidance/Mentorship.
    - **Diamond:** High-value goals/Achievements.
    - **Spark:** Innovation/Insight.
    - *Style:* 2px stroke, "Outline" style, using #6F4E37 or #C89B3C for emphasis.