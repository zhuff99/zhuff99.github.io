/* ==========================================================================
   SITE CONTENT — edit this file to update the website.
   No build step: save, refresh, done.
   ========================================================================== */

window.SITE = {
  name: "Zach Huff",
  github: "zhuff99",
  email: "zhuff99@gmail.com",
  linkedin: "",          // e.g. "https://www.linkedin.com/in/your-handle" — hidden if empty
  resume: "",            // e.g. "resume.pdf" — hidden if empty
  avatar: "",            // e.g. "img/me.jpg" — defaults to your GitHub profile picture

  role: "Software Developer",
  headline: "I build clean, reliable software — from iOS apps to AI-powered tools.",
  intro:
    "Software developer working across mobile, web, and applied AI. I like taking an idea " +
    "all the way from first sketch to something polished people can actually use.",

  // Paragraphs for the About section
  bio: [
    "I'm a developer who enjoys the whole arc of building software: figuring out the right problem, " +
    "designing the data and the interface, and sweating the details until it feels effortless to use.",
    "Lately that's meant shipping a native iOS app in SwiftUI, building an LLM-powered research pipeline " +
    "that classifies websites at scale with Claude, and full-stack web work with React, Angular, Node, and MongoDB. " +
    "My computer science foundation spans C++, Java, Python, data structures, and software security.",
  ],

  // Rows in the About "facts" table. Leave a value empty to hide the row.
  facts: [
    ["Focus", "iOS · Web · Applied AI"],
    ["Education", "B.S. Computer Science, SNHU '24"],
    ["Location", ""],
    ["Status", "Open to opportunities"],
  ],

  skills: {
    "Languages":  ["Swift", "Python", "JavaScript / TypeScript", "Java", "C++", "SQL"],
    "Frameworks": ["SwiftUI & Core Data", "React", "Angular", "Node.js & Express"],
    "AI & Data":  ["Claude API", "Playwright", "Async pipelines", "Jupyter"],
    "Tools":      ["Git & GitHub", "Docker", "MongoDB", "Postman"],
  },
};

/* --------------------------------------------------------------------------
   FEATURED PROJECTS — shown as large cards, in this order.

   Fields:
     title        Display name
     repo         GitHub repo name (adds a "Code" link + live stars). Use null
                  for projects that aren't on GitHub (e.g. ones on your Mac).
     link         Optional live demo / App Store / website URL
     tagline      One short line
     description  2–3 sentences
     highlights   Short bullet points
     tags         Tech used
     images       Screenshot URLs (or local paths like "img/myapp.png").
                  Use phone: true for tall phone screenshots.
     diagram      Optional list of layers shown instead of images
   -------------------------------------------------------------------------- */

const RAW = (repo, path) => `https://raw.githubusercontent.com/zhuff99/${repo}/main/${path}`;

window.FEATURED = [
  {
    title: "StreakMed",
    repo: "StreakMed",
    tagline: "Native iOS medication tracker",
    description:
      "An iOS app that helps people build consistent medication habits. Streak tracking turns " +
      "adherence into momentum, with flexible schedules, per-dose reminders, and a clean dark-mode interface.",
    highlights: [
      "Per-dose local notifications and flexible scheduling",
      "Home-screen widgets, calendar, and history views",
      "Offline-first persistence with Core Data",
    ],
    tags: ["Swift", "SwiftUI", "Core Data", "WidgetKit"],
    phone: true,
    images: [
      RAW("StreakMed", "Screenshots/YourMeds.png"),
      RAW("StreakMed", "Screenshots/Calander.png"),
      RAW("StreakMed", "Screenshots/History.png"),
    ],
  },
  {
    title: "Bulk Website Analyzer",
    repo: "BulkWebsiteAnalyzer",
    tagline: "AI-powered research pipeline",
    description:
      "Feed it a list of URLs — or a keyword to discover them — and Claude returns structured metadata " +
      "for every site: niche, type, language, author, CMS, and confidence scores, exported to CSV or Google Sheets.",
    highlights: [
      "Handles 500–1,000+ sites per run with batched Claude API calls",
      "Async fetch layer with a Playwright fallback for JS-heavy sites",
      "Structured-output parsing, confidence scoring, DNS-verified emails",
    ],
    tags: ["Python", "Claude API", "Playwright", "Docker", "Google Sheets API"],
    images: [RAW("BulkWebsiteAnalyzer", "Screenshots/google_sheets.jpg")],
  },
  {
    title: "Little Lemon",
    repo: "My-Website",
    tagline: "Restaurant site with table booking, built in React",
    description:
      "A responsive restaurant website with a working reservation flow, built as the capstone " +
      "of Meta's Front-End Developer program.",
    highlights: [
      "Client-side routing and reusable components",
      "Table-booking form wired to a reservations API",
    ],
    tags: ["React", "JavaScript", "HTML & CSS", "React Router"],
    images: [RAW("My-Website", "image.jpg")],
  },
  {
    title: "Travlr Getaways",
    repo: "TravlrAdmin",
    tagline: "Full-stack MEAN travel booking platform",
    description:
      "A travel booking site with a customer-facing Express front end and an Angular single-page " +
      "admin app, backed by a REST API and MongoDB.",
    highlights: [
      "Angular SPA admin for managing trips",
      "RESTful API with full CRUD, tested in Postman",
      "Express + Handlebars templates for the public site",
    ],
    tags: ["Angular", "Express", "Node.js", "MongoDB"],
    diagram: ["Angular SPA (admin)", "Express REST API", "MongoDB"],
  },

  /* Example: a project that lives on your Mac, not GitHub.
  {
    title: "My Mac Project",
    repo: null,
    link: "https://apps.apple.com/...",
    tagline: "What it is in one line",
    description: "A couple of sentences about what it does and why it's interesting.",
    highlights: ["Something you're proud of", "Another detail"],
    tags: ["Swift", "AppKit"],
    images: ["img/my-mac-project.png"],
  },
  */
];

/* --------------------------------------------------------------------------
   "MORE ON GITHUB" — the rest of your public repos load live.
   Repos listed here are hidden from that list.
   -------------------------------------------------------------------------- */
window.HIDE_REPOS = ["zhuff99", "zhuff99.github.io", "Meta-Front-end-final", "Little_Lemon"];

// Repo names matching this are tagged "Coursework" (hidden unless the toggle is on)
window.COURSEWORK = /^(CS-?\d+|Coursera)$/i;
