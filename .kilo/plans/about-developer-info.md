# Plan: Add Developer Info to About Us Page

## Goal
Add a "Developer Info" section at the bottom of the existing About page (`src/app/about/page.tsx`) so users can learn about the developer (Sheikh Md Sazzad Hossain), with social links and tech stack. Preserve all existing About page content and UI conventions.

## Critical Constraints (verified from codebase)

| Item | Finding | Required Adaptation |
|------|---------|---------------------|
| `react-icons` version | `^5.7.0` (not v6) | Use `react-icons/fa`, `react-icons/si`, `react-icons/vsc` — NOT `react-icons/fa6` |
| `FaXTwitter` | Doesn't exist in v5 | Use `FaX` from `react-icons/fa` |
| `FaCss3Alt` | Doesn't exist in v5 | Use `FaCss3` from `react-icons/fa` |
| `Bi` component | Doesn't exist anywhere | Create new `src/Components/Bi/Bi.tsx` |
| Profile/backdrop images | Only `expensely_logo_cutout2.png` exists in `src/assets/` | No local profile/backdrop assets; omit images or reuse logo — note as out of scope |
| About page conventions | Uses `Panel`, `panelTitle`, `panelSubtitle`, `bg-app`/`text-ink`/`text-muted` | Match existing dark semantic colors and Panel wrapper |
| i18n | No translation system exists | `Bi` shows English (`en`) by default; Bengali (`bn`) available via prop for future toggle |

## Files to Modify / Create

| File | Action |
|------|--------|
| `src/Components/Bi/Bi.tsx` | **Create** — small bilingual text component accepting `en` and `bn` props, renders `en` by default |
| `src/app/about/page.tsx` | **Modify** — append a developer info section at the bottom, after the existing "Built with" Panel, using existing `Panel` + `panelTitle`/`panelSubtitle` conventions |

## Developer Info Section Design (adapted to project conventions)

Use the project's existing patterns, not the user's standalone dark-gradient design:

- Wrap in `Panel` (matches existing About page cards)
- Heading via `panelTitle`, subtitle via `panelSubtitle`
- Colors: `text-ink`, `text-muted`, `bg-card`, `border-line`, `bg-accent` for interactive elements
- Profile section: name + role (Web Developer / CSE Student / Future Software Engineer) + short bio + two primary action links (Get In Touch email, View GitHub)
- Social links: GitHub, LinkedIn, Facebook, Instagram, X, Email — each as an icon button using `react-icons/fa` icons, styled with `bg-surface`/`border-line`/`text-ink` and hover `bg-accent`/`text-white`
- Tech stack: grid of tech icons with names, using `react-icons/fa` + `react-icons/si` + `react-icons/vsc`, styled as small rounded badges with hover accent color
- Footer: copyright line "© {year} Sheikh Md Sazzad Hossain — Built with Next.js & Tailwind CSS"

## SOCIAL_LINKS Data (adapted icons for v5)

| Name | v5 Icon | Link |
|------|---------|------|
| GitHub | FaGithub | https://github.com/sm-sazzad |
| LinkedIn | FaLinkedin | https://www.linkedin.com/in/sm-sazzad/ |
| Facebook | FaFacebook | https://www.facebook.com/sazzad.hossain.5758 |
| Instagram | FaInstagram | https://www.instagram.com/sazzad_hossain5758/ |
| X | FaX | https://x.com/sm_sazzad58 |
| Email | FaEnvelope | https://mail.google.com/mail/?view=cm&fs=1&to=sazzadhossain5758@gmail.com |

## TECH_STACK Data (adapted icons for v5)

HTML (FaHtml5), CSS (FaCss3), JavaScript (FaJs), TypeScript (SiTypescript), React (FaReact), Next.js (SiNextdotjs), Node.js (FaNode), Express.js (SiExpress), Tailwind CSS (SiTailwindcss), Better Auth (SiBetterauth), C (SiC), C++ (SiCplusplus), Java (FaJava), Python (FaPython), MongoDB (SiMongodb), Git (FaGitAlt), GitHub (FaGithubAlt), VS Code (VscVscode), Vercel (SiVercel), Netlify (SiNetlify)

## Implementation Notes

- `Bi` component: `<Bi en="English text" bn="বাংলা লেখা" />` renders `en` by default. Add `className` prop passthrough.
- Social icons: circular buttons, `h-10 w-10` (matching existing icon button scale in the project)
- Tech stack: `h-10 w-10` rounded badges in a `flex flex-wrap gap-2` grid
- No new dependencies needed (react-icons v5 already installed)
- No image assets — omit profile photo; use text-only profile card. Note in plan that images can be added later if assets are placed in `src/assets/`

## Validation

- `tsc --noEmit`: 0 errors
- `npm run lint`: 0 errors, 0 warnings
- `npm run build`: compiles successfully
- About page still shows existing "About Expensely" content unchanged
- New developer info section renders at bottom with social links and tech stack
- All social links open in new tab with `rel="noopener noreferrer"`

## Out of Scope

- Adding profile/backdrop image assets (none exist in `src/assets/`)
- Bengali language toggle / i18n system
- Redesigning the existing About page cards
