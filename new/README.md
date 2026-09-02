# 🖥️ Front End Learning Project

A hands-on front-end learning workspace containing two sub-projects: an **interactive JavaScript learning hub** for beginners, and a **real-world web application** built with vanilla HTML, CSS, and JavaScript.

---

## 📁 Repository Structure

```
front end/
├── assets/
│   └── README.md               ← You are here
├── learn-js-hub/               ← Beginner JavaScript playground
│   ├── index.html              ← Main interactive hub page
│   ├── guide.html              ← Printable beginner's reference guide
│   ├── app.js                  ← All JavaScript logic for mini-apps
│   ├── style.css               ← Styling with dark/light theme support
│   └── JS_LEARNING_GUIDE.md   ← Written educational guide
└── project/                    ← PawHaven — a real-world SPA project
    ├── index.html              ← App entry point
    ├── css/
    │   └── main.css
    └── js/
        ├── app.js              ← App initialisation
        ├── router.js           ← Client-side routing
        ├── state.js            ← Global state management
        ├── data.js             ← App data layer
        ├── audio.js            ← Sound effects
        └── components/         ← Page components (home, adopt, shop…)
```

---

## 🧪 Project 1 — `learn-js-hub/` (JavaScript Learning Hub)

A self-contained, browser-based playground that teaches JavaScript by **doing** rather than just reading. No frameworks, no installs — just open a file and start learning.

### ✨ What's Inside

| Feature | Details |
|---|---|
| ⚡ **12 Interactive Mini-Apps** | Hands-on demos of real JavaScript concepts |
| 📝 **5 Class Works & Challenges** | Coding exercises with guided solutions |
| 🎓 **15-Question Quiz Bank** | Test your knowledge interactively |
| 📖 **PDF-Ready Handbook** | A clean, printable reference guide |
| 🌙 **Dark / Light Theme** | Toggle between themes with one click |
| 🔍 **Debounced Search Bar** | Find any lesson instantly as you type |

### 🔢 The 12 Mini-Apps

1. **⏰ Live Clock & Stopwatch** — `setInterval`, `Date`, timers
2. **🔢 Interactive Counter** — State variables, event handlers, DOM updates
3. **✍️ Real-Time Text Analyzer** — `input` events, string methods, word/character counts
4. **🎨 Random Color Generator** — `Math.random()`, clipboard API
5. **📝 Smart To-Do List** — Full CRUD, `localStorage`, JSON serialization
6. **🎓 JavaScript Quiz** — Array of objects, scoring logic, index tracking
7. **💾 Browser Storage Inspector** — Read and clear `localStorage` in real time
8. **🎛️ Toggle & Save Handlers** — `ontoggle` events, `Ctrl+S` keyboard interception
9. **🔒 Password Validator** — RegExp, input validation, visibility toggle
10. **🔄 Array Transformation Lab** — `.map()`, `.filter()`, `.reduce()`
11. **🌐 Async / Fetch API** — `fetch()`, `async/await`, `Promise`, `try/catch`
12. **📦 ES6 Classes & OOP** — `class`, `constructor`, `this`, methods

### 📂 File Breakdown

#### `index.html`
The main dashboard of the learning hub. Contains:
- Hero banner with quick stats
- Tabbed navigation: **Interactive Apps**, **Class Works**, **Practice Questions**
- A debounced search bar to filter lessons as you type
- All 12 mini-app cards rendered inline

#### `app.js`
The engine of the hub (~62 KB). Contains all JavaScript logic including:
- Event listeners for every button, input, and form
- Timer logic for clocks and stopwatches (`setInterval` / `clearInterval`)
- Quiz engine with scoring and answer feedback
- To-do list with localStorage persistence
- Debounce utility for the search bar
- Async fetch demo with mock data

#### `style.css`
The visual layer of the hub (~38 KB). Features:
- CSS custom properties (variables) for theming
- Dark and light mode toggled via `data-theme` attribute on `<html>`
- Card-based responsive grid layout
- Syntax-highlighted code snippets
- Mobile-friendly breakpoints

#### `guide.html`
A standalone, printer-friendly version of the learning reference. Useful for:
- Printing a physical cheat sheet
- Sharing a cleaner reading view without the interactive UI

#### `JS_LEARNING_GUIDE.md`
A detailed written guide (~10 KB) covering:
- How JavaScript connects to HTML and CSS
- Core concepts: variables, functions, arrays, objects, events
- DOM manipulation with code examples
- Timers, localStorage, async/await
- Line-by-line explanations of every mini-app
- 5 practice coding challenges with solutions

---

## 🐾 Project 2 — `project/` (PawHaven Web App)

**PawHaven** is a full-featured, single-page pet hub application built with vanilla JavaScript and a custom client-side router. It demonstrates how real-world applications are structured without any frameworks.

### Pages & Features

| Section | Description |
|---|---|
| 🏠 Home | Landing page with hero content |
| 🐶 Adopt | Browse and adopt pets |
| 🛍️ Shop | Pet products with shopping cart |
| 🩺 Vet | Vet booking and information |
| 🧩 Quiz | Interactive pet quiz |
| 📡 Lost & Found | Report or find lost pets |
| 📸 Community | Community photo feed |
| 📋 Dashboard | Personal user dashboard |

### Architecture

- **`router.js`** — Hash-based client-side router that injects page components dynamically
- **`state.js`** — Centralized global state shared across all components
- **`data.js`** — Static data layer (pet listings, products, etc.)
- **`audio.js`** — Sound effect utilities
- **`components/`** — Each page is its own self-contained rendering module

---

## 🚀 How to Run

Both projects run **entirely in the browser** — no build step, no server, no dependencies to install.

### Run the JS Learning Hub

```
Open: learn-js-hub/index.html   (in any modern browser)
```

For the printable handbook:
```
Open: learn-js-hub/guide.html
```

### Run PawHaven

```
Open: project/index.html   (in any modern browser)
```

> **Tip:** Use the **Live Server** extension in VS Code for the best experience, as it auto-refreshes the page when you save a file.

---

## 🛠️ Technologies Used

- **HTML5** — Semantic structure and accessibility
- **CSS3** — Custom properties, Flexbox, Grid, responsive design
- **Vanilla JavaScript (ES6+)** — No libraries or frameworks
- **Font Awesome** — Icons
- **Google Fonts** — `Plus Jakarta Sans` & `Fira Code`
- **Web APIs** — `localStorage`, `Clipboard API`, `Fetch API`, `Date`

---

## 🎯 Who This Is For

- Beginners learning JavaScript for the first time
- Students looking for practical, interactive coding exercises
- Anyone who wants to understand how DOM manipulation and browser APIs work without a framework

