/**
 * ==============================================================================
 * 🌟 JAVASCRIPT LEARNING LAB - MAIN APPLICATION (app.js)
 * ==============================================================================
 * 
 * Welcome to JavaScript!
 * This script is written to be as clear, readable, and well-documented as possible.
 * 
 * TABLE OF CONTENTS:
 * ------------------------------------------------------------------------------
 *  1. Helper Utilities (Toast Notifications, Storage Inspector Sync, Debounce)
 *  2. Hub Tab Navigation (Apps, Class Works, Question Bank, Cheat Sheet)
 *  3. Debounced Search & Filter Bar (Filtering on Typing Pause)
 *  4. Theme Switcher (Dark / Light Mode + LocalStorage)
 *  5. Live Clock & Stopwatch (Date Object, Timers with setInterval)
 *  6. Interactive Counter (Variables, State, Conditions, Event Listeners)
 *  7. Live Text Analyzer (Input Events, String Methods: split, trim, length)
 *  8. Random Color Generator & Clipboard (Math.random, Hex Math, Clipboard API)
 *  9. Smart To-Do List (Arrays, Objects, CRUD, Array.filter, LocalStorage)
 * 10. Interactive Quiz Game (Mini card on tab 1)
 * 11. Handlers: ontoggle & onsave (Element toggles, Ctrl+S, Custom Events)
 * 12. Password & Form Validator (RegExp testing, Strength Meter, Visibility Toggle)
 * 13. Array Transformation Lab (.map, .filter, .reduce, .reverse)
 * 14. Async / Fetch API Studio (fetch, async/await, Promises, Loaders)
 * 15. ES6 Classes & OOP Studio (class, constructor, methods, instantiate)
 * 16. Class Works & Practice Coding Challenges (Interactive Runners & Solutions)
 * 17. Comprehensive 15-Question Exam Bank (Tab 3)
 * 18. "Inspect JS" Modal System (Interactive Code Viewer for Beginners)
 * ==============================================================================
 */

// We wait for the HTML document to be fully loaded before running any script
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 JavaScript Learning Hub is initialized and ready!");

  // Initialize all individual modules
  initTheme();
  initHubTabs();
  initSearchFilter();
  initClockAndStopwatch();
  initCounter();
  initTextAnalyzer();
  initColorGenerator();
  initTodoList();
  initQuiz();
  initToggleAndSaveHandlers();
  initPasswordValidator();
  initArrayLab();
  initAsyncFetch();
  initClassesOOP();
  initClassworks();
  initExamQuestionBank();
  initCodeInspector();
  updateStorageInspector(); // Initial sync of storage preview
});


/* ==============================================================================
   SECTION 1: HELPER UTILITIES & DEBOUNCE FUNCTION
   ============================================================================== */

/**
 * 🌟 DEBOUNCE UTILITY FUNCTION:
 * Delays the execution of a function until after the user has PAUSED (taken a break)
 * from typing for a specified number of milliseconds.
 * 
 * @param {Function} func - The function to execute after the pause
 * @param {number} delay - The break duration in milliseconds (e.g. 350ms)
 */
function debounce(func, delay = 350) {
  let timerId = null;

  return function (...args) {
    // 1. Clear any existing timer from previous keystroke
    if (timerId) clearTimeout(timerId);

    // 2. Start a new timer
    timerId = setTimeout(() => {
      func.apply(this, args);
      timerId = null;
    }, delay);
  };
}

/**
 * Shows a friendly popup message (toast) at the bottom-right of the screen.
 * @param {string} message - Text to display to the user
 */
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2500);
}

/**
 * Updates the "Browser Storage Inspector" card on screen.
 */
function updateStorageInspector() {
  const themeVal = localStorage.getItem("js_hub_theme") || "light";
  const todoVal = localStorage.getItem("js_hub_todos") || "[]";
  const quizVal = localStorage.getItem("js_hub_quiz_highscore") || "0";

  const storageThemeEl = document.getElementById("storageThemeVal");
  const storageTodoEl = document.getElementById("storageTodoVal");
  const storageQuizEl = document.getElementById("storageQuizVal");

  if (storageThemeEl) storageThemeEl.textContent = `"${themeVal}"`;
  if (storageTodoEl) storageTodoEl.textContent = todoVal;
  if (storageQuizEl) storageQuizEl.textContent = quizVal;
}


/* ==============================================================================
   SECTION 2: HUB TAB NAVIGATION
   ============================================================================== */
function initHubTabs() {
  const navTabs = document.querySelectorAll(".nav-tab");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const searchToolbar = document.getElementById("searchToolbar");

  navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // 1. Update active tab styling
      navTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // 2. Switch tab content
      const targetId = tab.getAttribute("data-tab");
      tabPanes.forEach((pane) => {
        if (pane.id === targetId) {
          pane.classList.remove("hidden");
        } else {
          pane.classList.add("hidden");
        }
      });

      // Hide or show search toolbar on tabs
      if (searchToolbar) {
        if (targetId === "tab-apps") {
          searchToolbar.style.display = "";
        } else {
          searchToolbar.style.display = "none";
        }
      }
    });
  });
}


/* ==============================================================================
   SECTION 3: DEBOUNCED SEARCH & FILTER BAR (FILTER ON TYPING PAUSE)
   ============================================================================== */
function initSearchFilter() {
  const searchInput = document.getElementById("lessonSearchInput");
  const btnClearSearch = document.getElementById("btnClearSearch");
  const filterChips = document.querySelectorAll(".chip-btn");
  const searchResultCount = document.getElementById("searchResultCount");
  const noResultsMsg = document.getElementById("noResultsMsg");
  const noResultsQueryText = document.getElementById("noResultsQueryText");
  const btnResetSearchNoResults = document.getElementById("btnResetSearchNoResults");
  const debounceBadge = document.getElementById("searchDebounceBadge");
  const debounceDelaySelect = document.getElementById("debounceDelaySelect");
  const cards = document.querySelectorAll("#appsGrid .card");

  let currentQuery = "";
  let currentCategory = "all";
  let activeDebounceDelay = 350;

  if (debounceDelaySelect) {
    debounceDelaySelect.addEventListener("change", () => {
      activeDebounceDelay = parseInt(debounceDelaySelect.value, 10);
      showToast(`Search pause break set to ${activeDebounceDelay}ms`);
    });
  }

  /**
   * The core filter execution that runs when the user stops typing
   */
  function executeFilter() {
    const query = currentQuery.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const title = card.querySelector("h3") ? card.querySelector("h3").textContent.toLowerCase() : "";
      const desc = card.querySelector(".card-desc") ? card.querySelector(".card-desc").textContent.toLowerCase() : "";
      const tags = card.querySelector(".concept-tags") ? card.querySelector(".concept-tags").textContent.toLowerCase() : "";
      const keywords = (card.getAttribute("data-keywords") || "").toLowerCase();
      const cardCategory = (card.getAttribute("data-category") || "").toLowerCase();

      const fullSearchableText = `${title} ${desc} ${tags} ${keywords}`;

      const matchesCategory = (currentCategory === "all") || cardCategory.includes(currentCategory);
      const matchesQuery = (query === "") || fullSearchableText.includes(query);

      if (matchesCategory && matchesQuery) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // Update Status Badge: Filter complete
    if (debounceBadge) {
      debounceBadge.className = "debounce-badge ready";
      debounceBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Filtered!`;
    }

    // Update UI count
    if (visibleCount === 0) {
      noResultsMsg.classList.remove("hidden");
      if (noResultsQueryText) noResultsQueryText.textContent = currentQuery || currentCategory;
      searchResultCount.innerHTML = `<span style="color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> 0 matching apps found</span>`;
    } else {
      noResultsMsg.classList.add("hidden");
      if (query !== "" || currentCategory !== "all") {
        searchResultCount.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> Showing <strong>${visibleCount}</strong> of ${cards.length} apps matching filter`;
      } else {
        searchResultCount.innerHTML = `<i class="fa-solid fa-layer-group"></i> Showing all <strong>${cards.length}</strong> interactive apps`;
      }
    }

    if (searchInput.value.trim() !== "") {
      btnClearSearch.classList.remove("hidden");
    } else {
      btnClearSearch.classList.add("hidden");
    }
  }

  // Create our debounced wrapper
  let debouncedFilter = debounce(executeFilter, activeDebounceDelay);

  // Listen to input keystrokes
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      currentQuery = searchInput.value;

      // Update badge to indicate waiting for a break
      if (debounceBadge) {
        debounceBadge.className = "debounce-badge waiting";
        debounceBadge.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> Waiting for typing break...`;
      }

      // Run debounced filter
      debouncedFilter();
    });
  }

  // Clear Search button
  if (btnClearSearch) {
    btnClearSearch.addEventListener("click", () => {
      searchInput.value = "";
      currentQuery = "";
      executeFilter();
      searchInput.focus();
    });
  }

  // Category Filter Chips
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentCategory = chip.getAttribute("data-filter");
      executeFilter(); // Immediate on chip click
    });
  });

  // Reset button in "No Results" placeholder
  if (btnResetSearchNoResults) {
    btnResetSearchNoResults.addEventListener("click", () => {
      searchInput.value = "";
      currentQuery = "";
      currentCategory = "all";

      filterChips.forEach((c) => c.classList.remove("active"));
      const allChip = document.querySelector('.chip-btn[data-filter="all"]');
      if (allChip) allChip.classList.add("active");

      executeFilter();
      searchInput.focus();
    });
  }
}


/* ==============================================================================
   SECTION 4: THEME SWITCHER (DARK / LIGHT MODE)
   ============================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeIcon = document.getElementById("themeIcon");

  const savedTheme = localStorage.getItem("js_hub_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("js_hub_theme", newTheme);

    updateThemeIcon(newTheme);
    updateStorageInspector();
    showToast(`Switched to ${newTheme} theme!`);
  });

  function updateThemeIcon(theme) {
    if (theme === "dark") {
      themeIcon.className = "fa-solid fa-sun";
      themeIcon.style.color = "#fbbf24";
    } else {
      themeIcon.className = "fa-solid fa-moon";
      themeIcon.style.color = "";
    }
  }
}


/* ==============================================================================
   SECTION 5: LIVE CLOCK & STOPWATCH
   ============================================================================== */
function initClockAndStopwatch() {
  const liveTimeEl = document.getElementById("liveTime");
  const liveDateEl = document.getElementById("liveDate");

  function updateLiveClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    liveTimeEl.textContent = `${hours}:${minutes}:${seconds}`;

    const options = { weekday: "long", year: "numeric", month: "short", day: "numeric" };
    liveDateEl.textContent = now.toLocaleDateString(undefined, options);
  }

  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  const swDisplay = document.getElementById("stopwatchDisplay");
  const swStartBtn = document.getElementById("swStartBtn");
  const swPauseBtn = document.getElementById("swPauseBtn");
  const swResetBtn = document.getElementById("swResetBtn");

  let stopwatchTimer = null;
  let elapsedMilliseconds = 0;

  function formatStopwatchTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 100);

    const formattedMins = String(minutes).padStart(2, "0");
    const formattedSecs = String(seconds).padStart(2, "0");
    return `${formattedMins}:${formattedSecs}.${tenths}`;
  }

  swStartBtn.addEventListener("click", () => {
    if (stopwatchTimer !== null) return;
    swStartBtn.disabled = true;
    swPauseBtn.disabled = false;

    stopwatchTimer = setInterval(() => {
      elapsedMilliseconds += 100;
      swDisplay.textContent = formatStopwatchTime(elapsedMilliseconds);
    }, 100);
  });

  swPauseBtn.addEventListener("click", () => {
    clearInterval(stopwatchTimer);
    stopwatchTimer = null;
    swStartBtn.disabled = false;
    swPauseBtn.disabled = true;
  });

  swResetBtn.addEventListener("click", () => {
    clearInterval(stopwatchTimer);
    stopwatchTimer = null;
    elapsedMilliseconds = 0;
    swDisplay.textContent = "00:00.0";
    swStartBtn.disabled = false;
    swPauseBtn.disabled = true;
  });
}


/* ==============================================================================
   SECTION 6: INTERACTIVE COUNTER & STEP CONTROLLER
   ============================================================================== */
function initCounter() {
  const counterValueEl = document.getElementById("counterValue");
  const counterStepSelect = document.getElementById("counterStep");
  const btnIncrement = document.getElementById("btnIncrement");
  const btnDecrement = document.getElementById("btnDecrement");
  const btnResetCounter = document.getElementById("btnResetCounter");

  let count = 0;

  function renderCounter() {
    counterValueEl.textContent = count;
    counterValueEl.classList.remove("positive", "negative", "zero");

    if (count > 0) {
      counterValueEl.classList.add("positive");
    } else if (count < 0) {
      counterValueEl.classList.add("negative");
    } else {
      counterValueEl.classList.add("zero");
    }
  }

  btnIncrement.addEventListener("click", () => {
    const step = parseInt(counterStepSelect.value, 10);
    count += step;
    renderCounter();
  });

  btnDecrement.addEventListener("click", () => {
    const step = parseInt(counterStepSelect.value, 10);
    count -= step;
    renderCounter();
  });

  btnResetCounter.addEventListener("click", () => {
    count = 0;
    renderCounter();
    showToast("Counter reset to 0");
  });
}


/* ==============================================================================
   SECTION 7: REAL-TIME TEXT & WORD ANALYZER
   ============================================================================== */
function initTextAnalyzer() {
  const analyzerInput = document.getElementById("analyzerInput");
  const charCountEl = document.getElementById("charCount");
  const wordCountEl = document.getElementById("wordCount");
  const sentenceCountEl = document.getElementById("sentenceCount");
  const readingTimeEl = document.getElementById("readingTime");

  const btnUpperCase = document.getElementById("btnUpperCase");
  const btnLowerCase = document.getElementById("btnLowerCase");
  const btnClearText = document.getElementById("btnClearText");

  function analyzeText() {
    const text = analyzerInput.value;
    const charCount = text.length;
    charCountEl.textContent = charCount;

    const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
    const wordCount = text.trim() === "" ? 0 : words.length;
    wordCountEl.textContent = wordCount;

    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    sentenceCountEl.textContent = sentences.length;

    const readTimeSeconds = Math.ceil((wordCount / 200) * 60);
    readingTimeEl.textContent = readTimeSeconds < 60 ? `${readTimeSeconds}s` : `${Math.ceil(readTimeSeconds / 60)}m`;
  }

  analyzerInput.addEventListener("input", analyzeText);

  btnUpperCase.addEventListener("click", () => {
    analyzerInput.value = analyzerInput.value.toUpperCase();
    analyzeText();
  });

  btnLowerCase.addEventListener("click", () => {
    analyzerInput.value = analyzerInput.value.toLowerCase();
    analyzeText();
  });

  btnClearText.addEventListener("click", () => {
    analyzerInput.value = "";
    analyzeText();
    showToast("Text cleared");
  });
}


/* ==============================================================================
   SECTION 8: RANDOM COLOR GENERATOR & CLIPBOARD
   ============================================================================== */
function initColorGenerator() {
  const colorPreview = document.getElementById("colorPreview");
  const colorHexText = document.getElementById("colorHexText");
  const paletteContainer = document.getElementById("paletteContainer");
  const btnGenerateColor = document.getElementById("btnGenerateColor");
  const btnGeneratePalette = document.getElementById("btnGeneratePalette");

  function getRandomHexColor() {
    const hexCharacters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * 16);
      color += hexCharacters[randomIndex];
    }
    return color;
  }

  function applyColor(hex) {
    colorPreview.style.backgroundColor = hex;
    colorHexText.textContent = hex;
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied ${text} to clipboard! 📋`);
    } catch (err) {
      showToast(`Selected: ${text}`);
    }
  }

  colorPreview.addEventListener("click", () => {
    copyToClipboard(colorHexText.textContent);
  });

  btnGenerateColor.addEventListener("click", () => {
    const newColor = getRandomHexColor();
    applyColor(newColor);
  });

  function generatePalette() {
    paletteContainer.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      const hex = getRandomHexColor();
      const swatch = document.createElement("div");
      swatch.className = "palette-swatch";
      swatch.style.backgroundColor = hex;
      swatch.title = `Click to copy ${hex}`;

      swatch.addEventListener("click", () => {
        applyColor(hex);
        copyToClipboard(hex);
      });

      paletteContainer.appendChild(swatch);
    }
  }

  btnGeneratePalette.addEventListener("click", generatePalette);
  generatePalette();
}


/* ==============================================================================
   SECTION 9: SMART TO-DO LIST (CRUD)
   ============================================================================== */
function initTodoList() {
  const todoForm = document.getElementById("todoForm");
  const todoInput = document.getElementById("todoInput");
  const todoList = document.getElementById("todoList");
  const todoRemainingText = document.getElementById("todoRemainingText");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let todos = [];
  let currentFilter = "all";

  const savedTodos = localStorage.getItem("js_hub_todos");
  if (savedTodos) {
    try {
      todos = JSON.parse(savedTodos);
    } catch (e) {
      todos = [];
    }
  } else {
    todos = [
      { id: 1, text: "Learn JavaScript Variables & Functions", completed: true },
      { id: 2, text: "Understand DOM Event Listeners & Handlers", completed: false },
      { id: 3, text: "Explore Async, Promises & ES6 Classes", completed: false }
    ];
    saveTodosToStorage();
  }

  function saveTodosToStorage() {
    localStorage.setItem("js_hub_todos", JSON.stringify(todos));
    updateStorageInspector();
  }

  function renderTodos() {
    todoList.innerHTML = "";

    const filteredTodos = todos.filter((todo) => {
      if (currentFilter === "active") return !todo.completed;
      if (currentFilter === "completed") return todo.completed;
      return true;
    });

    if (filteredTodos.length === 0) {
      todoList.innerHTML = `<li class="empty-todo-msg">No ${currentFilter !== "all" ? currentFilter : ""} tasks found. Add one above!</li>`;
    } else {
      filteredTodos.forEach((todo) => {
        const li = document.createElement("li");
        li.className = `todo-item ${todo.completed ? "completed" : ""}`;

        li.innerHTML = `
          <div class="todo-left">
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? "checked" : ""}>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
          </div>
          <button class="todo-delete-btn" title="Delete Task">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        `;

        const checkbox = li.querySelector(".todo-checkbox");
        checkbox.addEventListener("change", () => {
          todo.completed = checkbox.checked;
          saveTodosToStorage();
          renderTodos();
        });

        const textSpan = li.querySelector(".todo-text");
        textSpan.addEventListener("click", () => {
          todo.completed = !todo.completed;
          saveTodosToStorage();
          renderTodos();
        });

        const deleteBtn = li.querySelector(".todo-delete-btn");
        deleteBtn.addEventListener("click", () => {
          todos = todos.filter((t) => t.id !== todo.id);
          saveTodosToStorage();
          renderTodos();
          showToast("Task deleted");
        });

        todoList.appendChild(li);
      });
    }

    const activeCount = todos.filter((t) => !t.completed).length;
    todoRemainingText.textContent = `${activeCount} item${activeCount === 1 ? "" : "s"} remaining`;
  }

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text === "") return;

    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false
    };

    todos.unshift(newTodo);
    saveTodosToStorage();
    renderTodos();

    todoInput.value = "";
    showToast("New task added! 🎯");
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      renderTodos();
    });
  });

  renderTodos();

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[m]));
  }
}


/* ==============================================================================
   SECTION 10: INTERACTIVE QUIZ (TAB 1 MINI-APP)
   ============================================================================== */
function initQuiz() {
  const quizProgressFill = document.getElementById("quizProgressFill");
  const quizQuestionNumber = document.getElementById("quizQuestionNumber");
  const quizScoreText = document.getElementById("quizScoreText");
  const quizQuestionText = document.getElementById("quizQuestionText");
  const quizOptionsContainer = document.getElementById("quizOptionsContainer");
  const quizFeedback = document.getElementById("quizFeedback");
  const quizNextBtn = document.getElementById("quizNextBtn");

  const questions = [
    {
      question: "Which keyword declares a variable that can be changed later?",
      options: ["const", "let", "static", "fixed"],
      correct: 1,
      explanation: "'let' allows reassignment, while 'const' creates a constant reference."
    },
    {
      question: "How do you select an element by its ID in JavaScript?",
      options: [
        "document.select('#id')",
        "document.getElementById('id')",
        "document.findId('id')",
        "document.element('id')"
      ],
      correct: 1,
      explanation: "document.getElementById('id') or document.querySelector('#id') are standard methods."
    },
    {
      question: "What does 'localStorage.setItem()' do?",
      options: [
        "Sends data to a cloud database",
        "Saves data directly in the user's browser memory",
        "Deletes all cookies",
        "Refreshes the webpage"
      ],
      correct: 1,
      explanation: "localStorage saves key-value string data permanently in the user's browser."
    },
    {
      question: "What is debouncing in JavaScript?",
      options: [
        "A way to reverse strings",
        "Delaying function execution until after user pauses an action",
        "Deleting HTML tags",
        "An animation method"
      ],
      correct: 1,
      explanation: "Debouncing waits until a burst of events (like typing) stops before executing the code."
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;
  let hasAnswered = false;

  function loadQuestion() {
    hasAnswered = false;
    quizFeedback.className = "quiz-feedback hidden";
    quizNextBtn.classList.add("hidden");

    const q = questions[currentQuestionIndex];
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
    quizProgressFill.style.width = `${progressPercent}%`;
    quizQuestionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    quizScoreText.textContent = `Score: ${score}`;
    quizQuestionText.textContent = q.question;

    quizOptionsContainer.innerHTML = "";
    q.options.forEach((optionText, idx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option-btn";
      btn.innerHTML = `<span><strong>${String.fromCharCode(65 + idx)}.</strong> ${optionText}</span>`;

      btn.addEventListener("click", () => handleSelectOption(idx, btn));
      quizOptionsContainer.appendChild(btn);
    });
  }

  function handleSelectOption(selectedIndex, selectedBtn) {
    if (hasAnswered) return;
    hasAnswered = true;

    const q = questions[currentQuestionIndex];
    const optionButtons = quizOptionsContainer.querySelectorAll(".quiz-option-btn");

    optionButtons.forEach((b) => b.disabled = true);

    if (selectedIndex === q.correct) {
      score += 10;
      selectedBtn.classList.add("correct");
      selectedBtn.innerHTML += ` <i class="fa-solid fa-check"></i>`;
      quizFeedback.className = "quiz-feedback correct";
      quizFeedback.innerHTML = `🎉 <strong>Correct!</strong> ${q.explanation}`;
    } else {
      selectedBtn.classList.add("wrong");
      selectedBtn.innerHTML += ` <i class="fa-solid fa-xmark"></i>`;
      optionButtons[q.correct].classList.add("correct");
      quizFeedback.className = "quiz-feedback wrong";
      quizFeedback.innerHTML = `❌ <strong>Not quite.</strong> ${q.explanation}`;
    }

    quizScoreText.textContent = `Score: ${score}`;
    quizNextBtn.classList.remove("hidden");

    const currentHigh = parseInt(localStorage.getItem("js_hub_quiz_highscore") || "0", 10);
    if (score > currentHigh) {
      localStorage.setItem("js_hub_quiz_highscore", score.toString());
      updateStorageInspector();
    }
  }

  quizNextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      loadQuestion();
    } else {
      showQuizResults();
    }
  });

  function showQuizResults() {
    quizProgressFill.style.width = "100%";
    quizQuestionText.textContent = "🏆 Mini Quiz Completed!";
    quizFeedback.className = "quiz-feedback correct";
    quizFeedback.innerHTML = `Great work! You scored <strong>${score} points</strong>! Check Tab 3 for the Full 15-Question Exam!`;

    quizOptionsContainer.innerHTML = `
      <div class="text-center" style="padding: 16px 0;">
        <button id="btnRestartQuiz" class="btn btn-primary"><i class="fa-solid fa-rotate-left"></i> Restart Quiz</button>
      </div>
    `;

    quizNextBtn.classList.add("hidden");

    document.getElementById("btnRestartQuiz").addEventListener("click", () => {
      currentQuestionIndex = 0;
      score = 0;
      loadQuestion();
    });
  }

  const btnClearStorage = document.getElementById("btnClearStorage");
  if (btnClearStorage) {
    btnClearStorage.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your saved JavaScript storage?")) {
        localStorage.clear();
        updateStorageInspector();
        showToast("Storage cleared! Reloading page...");
        setTimeout(() => window.location.reload(), 800);
      }
    });
  }

  loadQuestion();
}


/* ==============================================================================
   SECTION 11: HANDLERS (ontoggle & onsave)
   ============================================================================== */
function initToggleAndSaveHandlers() {
  const lessonDetails = document.getElementById("lessonDetails");
  const toggleStatusBadge = document.getElementById("toggleStatusBadge");
  const quickNotesInput = document.getElementById("quickNotesInput");
  const saveStatusBadge = document.getElementById("saveStatusBadge");
  const btnTriggerSave = document.getElementById("btnTriggerSave");
  const btnAutoSaveToggle = document.getElementById("btnAutoSaveToggle");
  const autoSaveState = document.getElementById("autoSaveState");

  if (lessonDetails && toggleStatusBadge) {
    lessonDetails.addEventListener("toggle", () => {
      if (lessonDetails.open) {
        toggleStatusBadge.textContent = "Open";
        toggleStatusBadge.className = "badge-status open";
        showToast("ontoggle event: Details opened! 📂");
      } else {
        toggleStatusBadge.textContent = "Closed";
        toggleStatusBadge.className = "badge-status closed";
        showToast("ontoggle event: Details closed! 📁");
      }
    });
  }

  const savedNote = localStorage.getItem("js_hub_quick_note");
  if (savedNote && quickNotesInput) {
    quickNotesInput.value = savedNote;
  }

  let isAutoSaveEnabled = true;
  let autoSaveTimeout = null;

  function handleSave() {
    if (!quickNotesInput) return;
    const noteText = quickNotesInput.value;
    localStorage.setItem("js_hub_quick_note", noteText);

    if (saveStatusBadge) {
      saveStatusBadge.textContent = "Saved";
      saveStatusBadge.className = "badge-status saved";
    }

    const saveEvent = new CustomEvent("app:save", {
      detail: {
        timestamp: new Date().toLocaleTimeString(),
        contentLength: noteText.length
      }
    });
    document.dispatchEvent(saveEvent);

    showToast("onsave handler executed: Note saved! 💾");
  }

  if (btnTriggerSave) {
    btnTriggerSave.addEventListener("click", handleSave);
  }

  if (quickNotesInput) {
    quickNotesInput.addEventListener("input", () => {
      if (saveStatusBadge) {
        saveStatusBadge.textContent = "Unsaved";
        saveStatusBadge.className = "badge-status unsaved";
      }

      if (isAutoSaveEnabled) {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
          handleSave();
        }, 1000);
      }
    });

    quickNotesInput.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    });
  }

  if (btnAutoSaveToggle) {
    btnAutoSaveToggle.addEventListener("click", () => {
      isAutoSaveEnabled = !isAutoSaveEnabled;
      autoSaveState.textContent = isAutoSaveEnabled ? "ON" : "OFF";
      btnAutoSaveToggle.className = isAutoSaveEnabled
        ? "btn btn-outline btn-sm"
        : "btn btn-secondary btn-sm";
      showToast(`Auto-save turned ${isAutoSaveEnabled ? "ON" : "OFF"}`);
    });
  }
}


/* ==============================================================================
   SECTION 12: APP 9 - PASSWORD & FORM VALIDATOR
   ============================================================================== */
function initPasswordValidator() {
  const passwordInput = document.getElementById("passwordInput");
  const btnTogglePasswordVisibility = document.getElementById("btnTogglePasswordVisibility");
  const passwordEyeIcon = document.getElementById("passwordEyeIcon");
  const strengthBarFill = document.getElementById("strengthBarFill");
  const strengthText = document.getElementById("strengthText");
  const ruleLength = document.getElementById("ruleLength");
  const ruleNumber = document.getElementById("ruleNumber");
  const ruleSpecial = document.getElementById("ruleSpecial");

  if (!passwordInput) return;

  // Toggle eye visibility
  btnTogglePasswordVisibility.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    passwordEyeIcon.className = isPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
  });

  // Evaluate password strength with Regular Expressions
  passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;

    const hasLength = val.length >= 8;
    const hasNumber = /\d/.test(val);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(val);

    updateRule(ruleLength, hasLength);
    updateRule(ruleNumber, hasNumber);
    updateRule(ruleSpecial, hasSpecial);

    let score = 0;
    if (hasLength) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    if (val.length === 0) {
      strengthBarFill.style.width = "0%";
      strengthText.textContent = "None";
      strengthText.style.color = "var(--text-muted)";
    } else if (score === 1) {
      strengthBarFill.style.width = "33%";
      strengthBarFill.style.backgroundColor = "var(--danger)";
      strengthText.textContent = "Weak";
      strengthText.style.color = "var(--danger)";
    } else if (score === 2) {
      strengthBarFill.style.width = "66%";
      strengthBarFill.style.backgroundColor = "var(--warning)";
      strengthText.textContent = "Medium";
      strengthText.style.color = "var(--warning)";
    } else if (score === 3) {
      strengthBarFill.style.width = "100%";
      strengthBarFill.style.backgroundColor = "var(--success)";
      strengthText.textContent = "Strong! 🔒";
      strengthText.style.color = "var(--success)";
    }
  });

  function updateRule(el, isValid) {
    if (isValid) {
      el.className = "valid";
      el.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${el.textContent.trim()}`;
    } else {
      el.className = "invalid";
      el.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${el.textContent.trim()}`;
    }
  }
}


/* ==============================================================================
   SECTION 13: APP 10 - ARRAY TRANSFORMATION LAB (.map, .filter, .reduce)
   ============================================================================== */
function initArrayLab() {
  const original = [10, 25, 30, 45, 50];
  const arrayResultLabel = document.getElementById("arrayResultLabel");
  const arrayResultDisplay = document.getElementById("arrayResultDisplay");
  const arrayExplanation = document.getElementById("arrayExplanation");
  const opButtons = document.querySelectorAll(".btn-array-op");

  if (!arrayResultDisplay) return;

  opButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      opButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const op = btn.getAttribute("data-op");

      if (op === "map") {
        const res = original.map((x) => x * 2);
        arrayResultLabel.textContent = "Result of .map(x => x * 2):";
        arrayResultDisplay.textContent = `[ ${res.join(", ")} ]`;
        arrayExplanation.textContent = "Multiplies every number by 2 and returns a new transformed array.";
      } else if (op === "filter") {
        const res = original.filter((x) => x > 25);
        arrayResultLabel.textContent = "Result of .filter(x => x > 25):";
        arrayResultDisplay.textContent = `[ ${res.join(", ")} ]`;
        arrayExplanation.textContent = "Keeps only the numbers greater than 25 and filters out the rest.";
      } else if (op === "reduce") {
        const sum = original.reduce((acc, curr) => acc + curr, 0);
        arrayResultLabel.textContent = "Result of .reduce((acc, curr) => acc + curr, 0):";
        arrayResultDisplay.textContent = `${sum} (Single Number)`;
        arrayExplanation.textContent = "Combines all numbers in the array into a single accumulated total sum.";
      } else if (op === "reverse") {
        const res = [...original].reverse();
        arrayResultLabel.textContent = "Result of .reverse():";
        arrayResultDisplay.textContent = `[ ${res.join(", ")} ]`;
        arrayExplanation.textContent = "Reverses the order of elements in place.";
      }
    });
  });
}


/* ==============================================================================
   SECTION 14: APP 11 - ASYNC / FETCH API & MOCK STUDIO
   ============================================================================== */
function initAsyncFetch() {
  const placeholder = document.getElementById("asyncPlaceholder");
  const spinner = document.getElementById("asyncLoadingSpinner");
  const result = document.getElementById("asyncResultContent");
  const title = document.getElementById("asyncTitle");
  const body = document.getElementById("asyncBody");
  const meta = document.getElementById("asyncMeta");

  const btnFetchQuote = document.getElementById("btnFetchQuote");
  const btnFetchUser = document.getElementById("btnFetchUser");

  if (!btnFetchQuote) return;

  const mockQuotes = [
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "Programming" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", category: "Design" },
    { text: "JavaScript is the language that powers the web.", author: "Brendan Eich", category: "Web Tech" }
  ];

  const mockUsers = [
    { name: "Sarah Chen", role: "Frontend Engineer", location: "San Francisco, CA" },
    { name: "Liam O'Connor", role: "Full Stack Developer", location: "Dublin, Ireland" },
    { name: "Amina Yusuf", role: "UI/UX Developer", location: "Nairobi, Kenya" }
  ];

  async function simulateFetch(type) {
    placeholder.classList.add("hidden");
    result.classList.add("hidden");
    spinner.classList.remove("hidden");

    // Simulate network delay (600ms) with Promise
    await new Promise((resolve) => setTimeout(resolve, 600));

    spinner.classList.add("hidden");
    result.classList.remove("hidden");

    if (type === "quote") {
      const q = mockQuotes[Math.floor(Math.random() * mockQuotes.length)];
      title.textContent = `"${q.text}"`;
      body.textContent = `— ${q.author}`;
      meta.textContent = `Category: ${q.category} | Async Promise Resolved`;
    } else {
      const u = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      title.textContent = `User: ${u.name}`;
      body.textContent = `Role: ${u.role} • ${u.location}`;
      meta.textContent = `HTTP 200 OK | JSON Parsed`;
    }
  }

  btnFetchQuote.addEventListener("click", () => simulateFetch("quote"));
  btnFetchUser.addEventListener("click", () => simulateFetch("user"));
}


/* ==============================================================================
   SECTION 15: APP 12 - ES6 CLASSES & OOP STUDIO
   ============================================================================== */
function initClassesOOP() {
  const heroNameEl = document.getElementById("heroName");
  const heroHealthEl = document.getElementById("heroHealth");
  const heroScoreEl = document.getElementById("heroScore");

  const btnHeroTrain = document.getElementById("btnHeroTrain");
  const btnHeroHeal = document.getElementById("btnHeroHeal");
  const btnHeroReset = document.getElementById("btnHeroReset");

  if (!btnHeroTrain) return;

  /**
   * ES6 Class Definition
   */
  class HeroCharacter {
    constructor(name) {
      this.name = name;
      this.level = 1;
      this.health = 100;
      this.score = 0;
    }

    train() {
      this.score += 10;
      this.level = Math.floor(this.score / 30) + 1;
      return `${this.name} trained! Score is now ${this.score}.`;
    }

    heal() {
      this.health = Math.min(100, this.health + 20);
      return `${this.name} healed! Health is now ${this.health} HP.`;
    }
  }

  let currentHero = new HeroCharacter("Nova");

  function updateHeroUI() {
    heroNameEl.textContent = `Hero: ${currentHero.name} (Level ${currentHero.level})`;
    heroHealthEl.textContent = `${currentHero.health} HP`;
    heroScoreEl.textContent = `${currentHero.score} pts`;
  }

  btnHeroTrain.addEventListener("click", () => {
    const msg = currentHero.train();
    updateHeroUI();
    showToast(msg);
  });

  btnHeroHeal.addEventListener("click", () => {
    const msg = currentHero.heal();
    updateHeroUI();
    showToast(msg);
  });

  btnHeroReset.addEventListener("click", () => {
    currentHero = new HeroCharacter("Nova");
    updateHeroUI();
    showToast("new HeroCharacter('Nova') created!");
  });
}


/* ==============================================================================
   SECTION 16: CLASS WORKS & CODING CHALLENGES RUNNER
   ============================================================================== */
function initClassworks() {
  // Challenge 1: Reverse String
  const cwStringInput = document.getElementById("cwStringInput");
  const btnRunReverse = document.getElementById("btnRunReverse");
  const cwReverseOutput = document.getElementById("cwReverseOutput");
  const btnToggleSol1 = document.getElementById("btnToggleSol1");
  const cwSol1 = document.getElementById("cwSol1");

  if (btnRunReverse) {
    btnRunReverse.addEventListener("click", () => {
      const val = cwStringInput.value;
      const reversed = val.split("").reverse().join("");
      cwReverseOutput.textContent = reversed;
      showToast("String reversed! 🔄");
    });
  }

  if (btnToggleSol1) {
    btnToggleSol1.addEventListener("click", () => {
      cwSol1.classList.toggle("hidden");
      btnToggleSol1.innerHTML = cwSol1.classList.contains("hidden")
        ? '<i class="fa-solid fa-eye"></i> Show Solution'
        : '<i class="fa-solid fa-eye-slash"></i> Hide Solution';
    });
  }

  // Challenge 2: FizzBuzz
  const cwFizzBuzzCount = document.getElementById("cwFizzBuzzCount");
  const btnRunFizzBuzz = document.getElementById("btnRunFizzBuzz");
  const cwFizzBuzzOutput = document.getElementById("cwFizzBuzzOutput");
  const btnToggleSol2 = document.getElementById("btnToggleSol2");
  const cwSol2 = document.getElementById("cwSol2");

  function renderFizzBuzz() {
    if (!cwFizzBuzzCount || !cwFizzBuzzOutput) return;
    const n = Math.min(50, Math.max(1, parseInt(cwFizzBuzzCount.value, 10) || 15));
    cwFizzBuzzOutput.innerHTML = "";

    for (let i = 1; i <= n; i++) {
      const tag = document.createElement("span");
      if (i % 3 === 0 && i % 5 === 0) {
        tag.className = "fizzbuzz-tag fizzbuzz";
        tag.textContent = `${i}: FizzBuzz`;
      } else if (i % 3 === 0) {
        tag.className = "fizzbuzz-tag fizz";
        tag.textContent = `${i}: Fizz`;
      } else if (i % 5 === 0) {
        tag.className = "fizzbuzz-tag buzz";
        tag.textContent = `${i}: Buzz`;
      } else {
        tag.className = "fizzbuzz-tag";
        tag.textContent = i;
      }
      cwFizzBuzzOutput.appendChild(tag);
    }
  }

  if (btnRunFizzBuzz) {
    btnRunFizzBuzz.addEventListener("click", () => {
      renderFizzBuzz();
      showToast("FizzBuzz generated! ⚡");
    });
    renderFizzBuzz(); // initial
  }

  if (btnToggleSol2) {
    btnToggleSol2.addEventListener("click", () => {
      cwSol2.classList.toggle("hidden");
      btnToggleSol2.innerHTML = cwSol2.classList.contains("hidden")
        ? '<i class="fa-solid fa-eye"></i> Show Solution'
        : '<i class="fa-solid fa-eye-slash"></i> Hide Solution';
    });
  }

  // Challenge 3: Palindrome
  const cwPalindromeInput = document.getElementById("cwPalindromeInput");
  const btnRunPalindrome = document.getElementById("btnRunPalindrome");
  const cwPalindromeOutput = document.getElementById("cwPalindromeOutput");
  const btnToggleSol3 = document.getElementById("btnToggleSol3");
  const cwSol3 = document.getElementById("cwSol3");

  if (btnRunPalindrome) {
    btnRunPalindrome.addEventListener("click", () => {
      const text = cwPalindromeInput.value;
      const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");
      const isP = clean === clean.split("").reverse().join("");

      if (isP) {
        cwPalindromeOutput.className = "badge-status saved";
        cwPalindromeOutput.textContent = "Yes, it's a Palindrome! ✅";
      } else {
        cwPalindromeOutput.className = "badge-status unsaved";
        cwPalindromeOutput.textContent = "No, not a Palindrome ❌";
      }
    });
  }

  if (btnToggleSol3) {
    btnToggleSol3.addEventListener("click", () => {
      cwSol3.classList.toggle("hidden");
      btnToggleSol3.innerHTML = cwSol3.classList.contains("hidden")
        ? '<i class="fa-solid fa-eye"></i> Show Solution'
        : '<i class="fa-solid fa-eye-slash"></i> Hide Solution';
    });
  }

  // Challenge 4: Max / Min Finder
  const cwArrayInput = document.getElementById("cwArrayInput");
  const btnRunMaxMin = document.getElementById("btnRunMaxMin");
  const cwMaxOutput = document.getElementById("cwMaxOutput");
  const cwMinOutput = document.getElementById("cwMinOutput");
  const btnToggleSol4 = document.getElementById("btnToggleSol4");
  const cwSol4 = document.getElementById("cwSol4");

  if (btnRunMaxMin) {
    btnRunMaxMin.addEventListener("click", () => {
      const numbers = cwArrayInput.value
        .split(",")
        .map((n) => parseFloat(n.trim()))
        .filter((n) => !isNaN(n));

      if (numbers.length > 0) {
        const max = Math.max(...numbers);
        const min = Math.min(...numbers);
        cwMaxOutput.textContent = max;
        cwMinOutput.textContent = min;
        showToast(`Max: ${max}, Min: ${min}`);
      }
    });
  }

  if (btnToggleSol4) {
    btnToggleSol4.addEventListener("click", () => {
      cwSol4.classList.toggle("hidden");
      btnToggleSol4.innerHTML = cwSol4.classList.contains("hidden")
        ? '<i class="fa-solid fa-eye"></i> Show Solution'
        : '<i class="fa-solid fa-eye-slash"></i> Hide Solution';
    });
  }

  // Challenge 5: Vowels Counter
  const cwVowelInput = document.getElementById("cwVowelInput");
  const btnRunVowels = document.getElementById("btnRunVowels");
  const cwVowelsOutput = document.getElementById("cwVowelsOutput");
  const cwConsonantsOutput = document.getElementById("cwConsonantsOutput");
  const btnToggleSol5 = document.getElementById("btnToggleSol5");
  const cwSol5 = document.getElementById("cwSol5");

  if (btnRunVowels) {
    btnRunVowels.addEventListener("click", () => {
      const text = cwVowelInput.value.toLowerCase();
      const vowels = text.match(/[aeiou]/g) || [];
      const consonants = text.match(/[bcdfghjklmnpqrstvwxyz]/g) || [];

      cwVowelsOutput.textContent = vowels.length;
      cwConsonantsOutput.textContent = consonants.length;
      showToast(`Analyzed ${vowels.length} vowels!`);
    });
  }

  if (btnToggleSol5) {
    btnToggleSol5.addEventListener("click", () => {
      cwSol5.classList.toggle("hidden");
      btnToggleSol5.innerHTML = cwSol5.classList.contains("hidden")
        ? '<i class="fa-solid fa-eye"></i> Show Solution'
        : '<i class="fa-solid fa-eye-slash"></i> Hide Solution';
    });
  }
}


/* ==============================================================================
   SECTION 17: COMPREHENSIVE 15-QUESTION EXAM BANK (TAB 3)
   ============================================================================== */
function initExamQuestionBank() {
  const container = document.getElementById("quizExamContainer");
  if (!container) return;

  const examQuestions = [
    {
      id: 1,
      topic: "Variables & Scope",
      q: "What is the difference between 'let' and 'const'?",
      options: [
        "'let' is for numbers, 'const' is for strings",
        "'let' can be reassigned, 'const' cannot be reassigned",
        "'const' is function scoped, 'let' is global",
        "There is no difference"
      ],
      correct: 1,
      explanation: "'const' creates an immutable variable identifier, while 'let' allows you to reassign values."
    },
    {
      id: 2,
      topic: "Functions",
      q: "What is the output of (() => 5 * 2)()?",
      options: ["NaN", "10", "undefined", "SyntaxError"],
      correct: 1,
      explanation: "This is an IIFE (Immediately Invoked Function Expression) with an arrow function returning 10."
    },
    {
      id: 3,
      topic: "DOM Manipulation",
      q: "Which property is used to safely update the text inside an HTML element?",
      options: [".innerHTML", ".textContent", ".textFormat()", ".applyText()"],
      correct: 1,
      explanation: ".textContent sets plain text and prevents HTML injection / XSS risks."
    },
    {
      id: 4,
      topic: "Event Handlers",
      q: "Which event fires natively when a <details> element expands or collapses?",
      options: ["'change'", "'expand'", "'toggle'", "'click'"],
      correct: 2,
      explanation: "The HTML <details> element triggers the native 'toggle' event."
    },
    {
      id: 5,
      topic: "Performance & Debouncing",
      q: "Why do we use debouncing on search inputs?",
      options: [
        "To encrypt search text",
        "To wait until the user pauses typing before running expensive search logic",
        "To clear browser history",
        "To convert text to uppercase"
      ],
      correct: 1,
      explanation: "Debouncing cancels rapid repeated calls and executes only after a quiet pause."
    },
    {
      id: 6,
      topic: "Arrays",
      q: "Which array method transforms every element and returns a new array of the same length?",
      options: [".filter()", ".map()", ".forEach()", ".reduce()"],
      correct: 1,
      explanation: ".map() creates a new array populated with the results of calling a provided function on every element."
    },
    {
      id: 7,
      topic: "Storage",
      q: "How do you convert a JavaScript object into a string for localStorage?",
      options: ["JSON.parse(obj)", "JSON.stringify(obj)", "obj.toString()", "Storage.encode(obj)"],
      correct: 1,
      explanation: "JSON.stringify(obj) serializes objects into valid JSON strings."
    },
    {
      id: 8,
      topic: "Async & Promises",
      q: "What keyword must be placed before 'fetch()' to wait for its Promise in an async function?",
      options: ["defer", "await", "wait", "hold"],
      correct: 1,
      explanation: "The 'await' keyword pauses execution of the async function until the Promise resolves."
    }
  ];

  container.innerHTML = "";

  examQuestions.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "exam-card";

    card.innerHTML = `
      <div class="exam-meta">
        <span>Question ${index + 1} of ${examQuestions.length}</span>
        <span class="tag">${item.topic}</span>
      </div>
      <div class="exam-question">${item.q}</div>
      <div class="exam-options"></div>
      <div class="exam-feedback hidden"></div>
    `;

    const optionsBox = card.querySelector(".exam-options");
    const feedbackBox = card.querySelector(".exam-feedback");

    item.options.forEach((optText, optIdx) => {
      const btn = document.createElement("button");
      btn.className = "exam-option-btn";
      btn.innerHTML = `<strong>${String.fromCharCode(65 + optIdx)}.</strong> ${optText}`;

      btn.addEventListener("click", () => {
        const allBtns = optionsBox.querySelectorAll(".exam-option-btn");
        allBtns.forEach((b) => (b.disabled = true));

        if (optIdx === item.correct) {
          btn.style.borderColor = "var(--success)";
          btn.style.backgroundColor = "var(--success-light)";
          feedbackBox.className = "exam-feedback";
          feedbackBox.style.backgroundColor = "var(--success-light)";
          feedbackBox.style.color = "var(--success)";
          feedbackBox.innerHTML = `🎉 <strong>Correct!</strong> ${item.explanation}`;
        } else {
          btn.style.borderColor = "var(--danger)";
          btn.style.backgroundColor = "var(--danger-light)";
          allBtns[item.correct].style.borderColor = "var(--success)";
          feedbackBox.className = "exam-feedback";
          feedbackBox.style.backgroundColor = "var(--danger-light)";
          feedbackBox.style.color = "var(--danger)";
          feedbackBox.innerHTML = `❌ <strong>Incorrect.</strong> ${item.explanation}`;
        }
        feedbackBox.classList.remove("hidden");
      });

      optionsBox.appendChild(btn);
    });

    container.appendChild(card);
  });
}


/* ==============================================================================
   SECTION 18: "INSPECT JS CODE" MODAL SYSTEM
   ============================================================================== */
function initCodeInspector() {
  const codeModal = document.getElementById("codeModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalDismissBtn = document.getElementById("modalDismissBtn");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalCodeBlock = document.getElementById("modalCodeBlock");
  const modalKeyPoints = document.getElementById("modalKeyPoints");
  const btnCopyModalCode = document.getElementById("btnCopyModalCode");

  const codeExplanations = {
    clock: {
      title: "1. Live Clock & Stopwatch JavaScript",
      description: "How JavaScript interacts with your computer's internal clock and runs recurring timers.",
      code: `const now = new Date();
const hours = String(now.getHours()).padStart(2, "0");
const minutes = String(now.getMinutes()).padStart(2, "0");
const seconds = String(now.getSeconds()).padStart(2, "0");

document.getElementById("liveTime").textContent = \`\${hours}:\${minutes}:\${seconds}\`;
setInterval(updateLiveClock, 1000);`,
      keyPoints: [
        "<code>new Date()</code> creates a snapshot of the current time.",
        "<code>String.padStart(2, '0')</code> formats numbers into two digits.",
        "<code>setInterval(fn, 1000)</code> runs code every 1 second continuously."
      ]
    },

    counter: {
      title: "2. Interactive Counter JavaScript",
      description: "State variables and if/else conditions.",
      code: `let count = 0;
btnPlus.addEventListener("click", () => {
  count += 1;
  counterDisplay.textContent = count;
});`,
      keyPoints: [
        "<code>let</code> holds changeable state in memory.",
        "<code>addEventListener('click')</code> responds to user actions."
      ]
    },

    textAnalyzer: {
      title: "3. Live Text Analyzer JavaScript",
      description: "String manipulation with split and trim.",
      code: `textarea.addEventListener("input", () => {
  const text = textarea.value;
  const words = text.trim().split(/\\s+/).filter(w => w.length > 0);
  document.getElementById("wordCount").textContent = words.length;
});`,
      keyPoints: [
        "The <code>'input'</code> event fires on every keystroke.",
        "<code>.split(/\\s+/)</code> breaks words cleanly by whitespace."
      ]
    },

    colorGen: {
      title: "4. Random Color Generator JavaScript",
      description: "Math.random and navigator.clipboard API.",
      code: `function getRandomHex() {
  return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}
await navigator.clipboard.writeText(hex);`,
      keyPoints: [
        "<code>Math.random()</code> generates random decimals.",
        "<code>navigator.clipboard.writeText()</code> writes to clipboard."
      ]
    },

    todo: {
      title: "5. Smart To-Do List (CRUD) JavaScript",
      description: "Arrays of objects, .push(), .filter(), and localStorage.",
      code: `let todos = [];
function addTodo(text) {
  todos.push({ id: Date.now(), text, completed: false });
  localStorage.setItem("todos", JSON.stringify(todos));
}`,
      keyPoints: [
        "<code>JSON.stringify()</code> serializes arrays for storage.",
        "<code>array.filter()</code> deletes items immutably."
      ]
    },

    quiz: {
      title: "6. Interactive Quiz Game JavaScript",
      description: "State indexing and score tracking.",
      code: `if (selected === questions[index].correct) {
  score += 10;
}`,
      keyPoints: [
        "Indexes allow moving through question arrays step-by-step."
      ]
    },

    storage: {
      title: "7. Browser Storage Inspector JavaScript",
      description: "Web Storage API get/set methods.",
      code: `localStorage.setItem("key", "val");
const saved = localStorage.getItem("key");`,
      keyPoints: [
        "<code>localStorage</code> data survives browser restarts."
      ]
    },

    handlers: {
      title: "8. Handlers: ontoggle & onsave JavaScript",
      description: "Handling element toggle and Ctrl+S save events.",
      code: `// 1. Native ontoggle
details.addEventListener("toggle", () => {
  console.log(details.open ? "Opened" : "Closed");
});

// 2. Ctrl + S Save handler
window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    e.preventDefault(); // Stop browser download dialog
    handleSave();       // Run custom save
  }
});`,
      keyPoints: [
        "<code>details.open</code> returns current toggle boolean state.",
        "<code>e.preventDefault()</code> inside <code>keydown</code> intercepts <kbd>Ctrl+S</kbd>."
      ]
    },

    passwordValidator: {
      title: "9. Password & Form Validator JavaScript",
      description: "Regular Expressions and DOM password type toggling.",
      code: `// Test regex patterns
const hasNumber = /\\d/.test(password);
const hasSpecial = /[!@#$%^&*]/.test(password);

// Toggle password eye visibility
input.type = input.type === "password" ? "text" : "password";`,
      keyPoints: [
        "<code>RegExp.test()</code> returns <code>true</code> if pattern is matched.",
        "Toggling <code>input.type</code> between 'password' and 'text' shows/hides text."
      ]
    },

    arrayLab: {
      title: "10. Array Transformation Lab (.map, .filter, .reduce)",
      description: "Functional programming array methods in JavaScript.",
      code: `const nums = [10, 25, 30, 45, 50];

// .map(): Transforms every item
const doubled = nums.map(x => x * 2);

// .filter(): Keeps matching items
const over25 = nums.filter(x => x > 25);

// .reduce(): Accumulates single total
const sum = nums.reduce((acc, curr) => acc + curr, 0);`,
      keyPoints: [
        "<code>.map()</code> returns an array of the same length with transformed values.",
        "<code>.filter()</code> returns a subset array matching the boolean condition.",
        "<code>.reduce()</code> distills array into a single accumulated result."
      ]
    },

    asyncFetch: {
      title: "11. Async & Fetch API Studio JavaScript",
      description: "Asynchronous JavaScript, Promises, and fetch().",
      code: `async function fetchData() {
  try {
    const res = await fetch("https://api.example.com/data");
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error("Network error:", error);
  }
}`,
      keyPoints: [
        "<code>async/await</code> provides synchronous-looking syntax for async code.",
        "<code>try/catch</code> safely catches network errors and failed promises."
      ]
    },

    classesOOP: {
      title: "12. ES6 Classes & Object-Oriented JS",
      description: "Blueprints for creating objects with constructors and methods.",
      code: `class Hero {
  constructor(name) {
    this.name = name;
    this.score = 0;
  }

  train() {
    this.score += 10;
  }
}

const nova = new Hero("Nova");
nova.train();`,
      keyPoints: [
        "<code>constructor</code> runs automatically when creating a <code>new</code> instance.",
        "<code>this</code> points to the specific object instance being manipulated."
      ]
    }
  };

  const inspectButtons = document.querySelectorAll(".btn-inspect");
  inspectButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      const data = codeExplanations[target];

      if (data) {
        modalTitle.textContent = data.title;
        modalDescription.textContent = data.description;
        modalCodeBlock.textContent = data.code;

        modalKeyPoints.innerHTML = "";
        data.keyPoints.forEach((point) => {
          const li = document.createElement("li");
          li.innerHTML = point;
          modalKeyPoints.appendChild(li);
        });

        codeModal.classList.remove("hidden");
      }
    });
  });

  function closeModal() {
    codeModal.classList.add("hidden");
  }

  modalCloseBtn.addEventListener("click", closeModal);
  modalDismissBtn.addEventListener("click", closeModal);

  codeModal.addEventListener("click", (e) => {
    if (e.target === codeModal) closeModal();
  });

  btnCopyModalCode.addEventListener("click", () => {
    navigator.clipboard.writeText(modalCodeBlock.textContent).then(() => {
      showToast("Code copied to clipboard! 📋");
    });
  });
}
