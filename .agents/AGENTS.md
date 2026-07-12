# Global UI Consistency & Design System Instructions

## Project Context
- **Enterprise AI-powered Document Generator** (RFP → SOW currently, expanding later).
- **Roles**: PMO, Reviewer.

## Highest Priority
- **100% UI consistency** across every screen.
- Same design patterns applied everywhere.
- Application is one connected design system.

## Design System
- Always refer to `docs/DESIGN-SYSTEM.md` and Brand Guidelines.
- Use existing components, tokens, spacing, typography, colors, and icons.
- Create new reusable components if needed, avoid one-offs.

## Consistency Rules
- **Layout**: Consistent width, grid, spacing, and responsive behavior.
- **Typography**: Consistent hierarchy for titles, labels, body text, etc.
- **Colors**: Strictly use design system tokens (Primary, Secondary, Neutral, Success, Warning, Danger, Information, Background, Surface, Border, Hover, Focus, Disabled). No hardcoding.
- **Buttons**: Consistent height, radius, font, padding. Same for loading, disabled, destructive.
- **Forms**: Consistent labels, indicators, placeholders, validation, helper text.
- **Tables**: Common design for headers, rows, hover, selection, empty/loading states, pagination, search, filters.
- **Cards**: Consistent radius, elevation, background, padding, layout.
- **Modals**: Consistent width, headers, close actions, footer buttons, overlay, animation.
- **Drawers**: One reusable drawer component.
- **Navigation**: Sidebar, Top Navigation, Breadcrumb, Tabs, Stepper must share visual language.
- **Empty States**: Illustration/icon, title, supporting text, primary action.
- **Loading States**: Skeletons, progress indicators, AI generation loaders, consistent across pages.
- **Notifications**: One system for Toasts, success/error/warning/info messages.

## Icons
- Use **one icon family**.
- Consistent size, stroke weight, alignment.

## AI Features
- Consistent interaction pattern for Generation, Regeneration, Suggestions, Confidence Score, Citations, Loading, Prompt Dialogs.

## Accessibility
- Keyboard navigation, visible focus states, proper contrast, accessible labels, tooltip consistency.

## Responsive Design
- Desktop, Tablet, Mobile should follow the same responsive behavior. Avoid custom screen-specific layouts.

## Reusable Components
- **Always reuse before creating new ones**: Button, Input, Select, Multi Select, Badge, Tag, Card, Table, Modal, Drawer, Stepper, Empty State, Skeleton, Upload Component, Rich Text Toolbar, Status Badge, Reviewer Avatar Group, Activity Timeline.
- Update all instances if a component changes.

## Implementation Rule
1. Review existing reusable components.
2. Check `DESIGN-SYSTEM.md`.
3. Follow existing spacing and typography.
4. Reuse existing layouts wherever possible.
5. Keep behavior consistent with previous screens.
6. Do not duplicate components.
7. Do not introduce new UI patterns without necessity.

## Future Development
- New features must follow the same design language.
- Aim: Premium enterprise application with a polished, scalable, maintainable, and highly consistent UX.
