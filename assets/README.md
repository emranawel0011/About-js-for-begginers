# Web Developer Student Portfolio

A cutting-edge, interactive, and responsive portfolio designed for web development students and junior developers.

## 🌟 Highlights & Dynamics Included
- **Dark / Light Theme Toggle**: Auto-detects system preferences and persists user preference in `localStorage`.
- **Interactive Particle Constellation Canvas**: Physics-based HTML5 canvas with mouse repulsion and dynamic node connections.
- **Embedded Developer CLI Terminal**: Functional command-line emulator with commands (`about`, `skills`, `projects`, `contact`, `cat resume`, `theme`, `matrix`, `clear`).
- **Dynamic Typing Headline**: Smooth typing effect highlighting multiple developer roles and specializations.
- **3D Interactive Tilt Profile Card**: Mouse-aware parallax tilt on the hero card.
- **Interactive Skills Matrix**: Animated skill proficiency meters with scroll trigger (IntersectionObserver).
- **Dynamic Project Gallery & Quick View Modal**: Category filtering (Full-Stack, Frontend, Apps) with full modal dialog containing architectural details and tech stack tags.
- **Interactive CSS Sandbox Playground**: Real-time slider controls for component styling with 1-click CSS copying.
- **Validated Contact Form**: Real-time validation, dynamic loading spinner, and toast notifications.
- **Live Local Time Widget**: Digital clock synced with real-time seconds.
- **Smooth Custom Cursor & Follower**: Fluid cursor tracking with expansion on hoverable elements.

---

## 🚀 How to Run Locally

Simply double click `index.html` to open it in any modern browser, or use VS Code Live Server / Python HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js npx serve
npx serve .
```

Then visit `http://localhost:8000`.

---

## 🎨 How to Customize

1. **Personal Information & Bio**:
   - Open `index.html` and edit your name, titles, bio, and social links in the `#hero`, `#about`, and `#contact` sections.
2. **Projects**:
   - Open `js/projects.js` and edit the `projectsData` array to add your own project screenshots, titles, descriptions, live demo links, and GitHub repositories.
3. **Skills & Progress Bars**:
   - Open `index.html` under `<section id="skills">` and modify the skill names and `data-level="85%"` attributes.
4. **Color Palette & Themes**:
   - Open `css/style.css` and adjust the CSS variables under `:root` and `[data-theme="light"]` to match your personal aesthetic.

---

## 🚢 Free Deployment

- **GitHub Pages**: Push this repository to GitHub, go to **Settings > Pages**, and choose the `main` branch root.
- **Vercel**: Run `vercel` in this folder or connect your GitHub repository for instantaneous zero-config deployment.
- **Netlify**: Drag and drop this folder directly into [Netlify Drop](https://app.netlify.com/drop).
