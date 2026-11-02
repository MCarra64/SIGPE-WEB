---
name: Liquid Community
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#404751'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#707882'
  outline-variant: '#c0c7d3'
  surface-tint: '#0062a1'
  primary: '#005e9a'
  on-primary: '#ffffff'
  primary-container: '#0077c2'
  on-primary-container: '#f9faff'
  inverse-primary: '#9ccaff'
  secondary: '#006e1c'
  on-secondary: '#ffffff'
  secondary-container: '#91f78e'
  on-secondary-container: '#00731e'
  tertiary: '#006378'
  on-tertiary: '#ffffff'
  tertiary-container: '#007e98'
  on-tertiary-container: '#f4fcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d0e4ff'
  primary-fixed-dim: '#9ccaff'
  on-primary-fixed: '#001d35'
  on-primary-fixed-variant: '#00497b'
  secondary-fixed: '#94f990'
  secondary-fixed-dim: '#78dc77'
  on-secondary-fixed: '#002204'
  on-secondary-fixed-variant: '#005313'
  tertiary-fixed: '#b3ebff'
  tertiary-fixed-dim: '#4cd6fb'
  on-tertiary-fixed: '#001f27'
  on-tertiary-fixed-variant: '#004e5f'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  label-md:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Work Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

This design system centers on trust, transparency, and communal stewardship of a vital resource. The personality is **Modern Corporate**, leaning into a friendly, approachable aesthetic that removes the friction often associated with utility management.

The style utilizes a **Clean Minimalist** approach with a **Tactile** edge. It features generous whitespace to reduce cognitive load for community members of varying technical literacy. Visual elements use soft, organic curves to mimic the fluid nature of water, while structural elements remain grounded in a systematic grid to convey professional reliability. 

The emotional response should be one of "calm clarity"—users should feel that their data is secure, their payments are straightforward, and their local environment is being well-tended.

## Colors

The palette is inspired by the natural water cycle and healthy ecosystems. 

*   **Primary (Deep Water Blue):** Used for navigation, primary actions, and branding. It represents depth, stability, and professionalism.
*   **Secondary (Leaf Green):** Dedicated to positive states, "Paid" status badges, and sustainability initiatives. 
*   **Tertiary (Fresh Stream):** A lighter, vibrant blue used for secondary buttons, data visualizations, and highlighting active states.
*   **Neutral (Slate Gray):** A sophisticated gray scale used for text, borders, and subtle backgrounds to ensure high legibility and a soft visual rhythm.
*   **Status Tones:** Use a warm amber (#F59E0B) for "Pending" and a soft crimson (#E11D48) for "Overdue" to ensure immediate recognition without causing undue alarm.

## Typography

The typographic strategy focuses on extreme clarity and a "human" touch. 

**Plus Jakarta Sans** is used for headings. Its soft, rounded terminals provide a friendly and optimistic welcome to the user, breaking the stiffness of typical utility software.

**Work Sans** is the workhorse for all body text and data tables. It is chosen for its exceptional readability at small sizes and its professional, neutral character, which is essential for presenting financial and consumption data accurately.

*   Use `headline-lg` for dashboard titles.
*   Use `body-md` for standard descriptions and form instructions.
*   Use `label-md` in all-caps for table headers and status badges to differentiate them from interactive content.

## Layout & Spacing

The design system employs a **Fluid Grid** model with strict maximum constraints to maintain readability on ultra-wide monitors.

*   **Desktop:** 12-column grid, 24px gutters, and 48px side margins. 
*   **Tablet:** 8-column grid, 16px gutters, and 24px side margins.
*   **Mobile:** 4-column grid, 16px gutters, and 16px side margins.

The spacing rhythm is based on an 8px base unit. Vertical rhythm should be generous—especially between sections of a data table or different payment history entries—to ensure the interface feels "breathable" and easy to navigate for users who may be less comfortable with dense information displays.

## Elevation & Depth

To maintain the "friendly" and "modern" aesthetic, this design system avoids heavy shadows. Instead, it uses **Tonal Layers** and **Ambient Shadows**.

1.  **Level 0 (Base):** The main background uses a very subtle off-white or extremely light blue tint (#F8FAFC).
2.  **Level 1 (Cards/Containers):** Pure white surfaces with a very soft, diffused shadow (0px 4px 12px, 5% opacity primary color tint). This makes the content "float" gently above the background.
3.  **Level 2 (Modals/Dropdowns):** A more defined shadow (0px 8px 24px, 10% opacity) to indicate clear separation for interactive overlays.

Low-contrast outlines (1px solid #E2E8F0) are used for form inputs and table borders to maintain structure without adding visual noise.

## Shapes

The shape language is consistently **Rounded**. 

*   **Standard Elements (Buttons, Inputs):** 0.5rem (8px) radius. This provides a soft, approachable feel while maintaining a professional edge.
*   **Large Elements (Cards, Modals):** 1rem (16px) radius.
*   **Badges/Chips:** Full pill-shaped (rounded-full) to distinguish them from clickable buttons.

Icons should follow a "Line-art" style with rounded caps and corners to match the UI's geometry.

## Components

### Buttons
*   **Primary:** Solid Primary Blue with white text. High emphasis for "Pay Now" or "Submit Report."
*   **Secondary:** Ghost style (Primary Blue border and text) for "Cancel" or "View Details."
*   **Tertiary:** Green background with white text, used exclusively for "Payment Successful" or "Add New User."

### Status Badges
Badges use a "Soft Fill" style: a light background version of the status color with high-contrast text.
*   **Paid:** Light Green background / Dark Green text.
*   **Pending:** Light Amber background / Dark Amber text.
*   **Overdue:** Light Red background / Dark Red text.

### Data Tables
Tables are clean and borderless where possible. 
*   Use a subtle background fill (#F1F5F9) on the header row.
*   Rows should have a 1px bottom border only.
*   Numeric data (water consumption, amounts) must be tabular-lined (monospaced numbers) for easy comparison.

### Input Fields
*   Focus states must use a 2px Primary Blue ring with a 2px offset to ensure accessibility.
*   Include clear, persistent labels above the field; do not rely on placeholder text alone.

### Cards
*   Use white backgrounds.
*   Include a subtle "Secondary Blue" top-border (2px) on cards that contain critical consumption metrics to add a "water-like" accent.