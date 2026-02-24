# Job Notification App - Design System

Premium B2C SaaS Design Foundation

## Design Philosophy

Calm, intentional, coherent, confident. This is a serious product for professionals, not a student project or hackathon demo.

## Core Principles

- No gradients
- No glassmorphism
- No neon colors
- No animation noise
- No flashy effects
- No playful elements

## Color System

Maximum 4 colors across entire UI:

- **Background**: `#F7F6F3` (off-white, warm)
- **Primary Text**: `#111111` (near black)
- **Accent**: `#8B0000` (deep red)
- **Success**: `#2D5016` (muted green)
- **Warning**: `#8B6914` (muted amber)

## Typography

### Fonts
- **Headings**: Serif (Georgia) - large, confident, generous spacing
- **Body**: Sans-serif (System fonts) - 18px base size
- **Line Height**: 1.7 for body text, 1.2 for headings

### Sizes
- Heading XL: 48px
- Heading LG: 32px
- Heading MD: 24px
- Body: 18px
- Small: 16px

### Constraints
- Max width for text blocks: 720px
- No decorative fonts
- No random sizes

## Spacing System

Only use these values:
- `8px` (xs)
- `16px` (sm)
- `24px` (md)
- `40px` (lg)
- `64px` (xl)

Never use random values like 13px or 27px.

## Global Layout Structure

Every page follows this structure:

```
[Top Bar]
[Context Header]
[Primary Workspace (70%)] + [Secondary Panel (30%)]
[Proof Footer]
```

### Top Bar
- Left: App name
- Center: Progress indicator (Step X / Y)
- Right: Status badge

### Context Header
- Large serif headline
- One-line subtext
- Clear purpose

### Primary Workspace
- Clean cards
- Predictable components
- Subtle borders
- No heavy shadows

### Secondary Panel
- Step explanation
- Copyable prompt box
- Consistent buttons

### Proof Footer
Checklist format:
- □ UI Built
- □ Logic Working
- □ Test Passed
- □ Deployed

## Components

### Buttons
- **Primary**: Solid deep red (#8B0000)
- **Secondary**: Outlined with border
- Same border radius everywhere (4px)

### Inputs
- Clean borders
- Clear focus state (accent color)
- Consistent padding

### Cards
- Subtle border
- No drop shadows
- White background

### Badges
- Small, contained
- Color-coded by status
- Consistent sizing

## Interaction Rules

- **Transitions**: 150-200ms
- **Timing**: ease-in-out
- **No bounce effects**
- **No parallax**

## Error & Empty States

### Errors
- Clearly explain what went wrong
- Provide actionable fix
- Never blame the user

### Empty States
- Guide next action
- Never leave blank screens
- Provide clear call-to-action

## Usage

1. Include `design-system.css` in your HTML
2. Use semantic class names
3. Follow the layout structure
4. Stick to the spacing system
5. Maintain consistency

## Files

- `design-system.css` - Complete design system stylesheet
- `example.html` - Reference implementation
- `README.md` - This documentation
