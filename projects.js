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

  // Visitor counter endpoint (Terraform output "counter_api_url"). Hidden if empty.
  counterApi: "",

  role: "Cloud Engineer",
  headline: "I build and automate cloud infrastructure on AWS.",
  intro:
    "Computer science grad focused on AWS, infrastructure as code, and automation, with a " +
    "software development background that means I understand what runs on the infrastructure, too.",

  // Paragraphs for the About section
  bio: [
    "I started out building software: a native iOS app, full-stack web apps, and an AI-powered data " +
    "pipeline. Along the way I found the parts I enjoyed most were underneath the code: how it gets " +
    "deployed, how it scales, and how to automate the work so it's repeatable.",
    "Now I'm focused on cloud engineering: designing on AWS, defining infrastructure in Terraform, " +
    "containerizing with Docker and Kubernetes, and wiring it all together with CI/CD. " +
    "My developer background helps me build infrastructure that fits the applications running on it.",
  ],

  // Rows in the About "facts" table. Leave a value empty to hide the row.
  facts: [
    ["Focus", "AWS · IaC · Automation"],
    ["Education", "B.S. Computer Science, SNHU '24"],
    ["Location", ""],
    ["Status", "Open to cloud roles"],
  ],

  // status: "Earned" or "In progress". Optional: date, link (e.g. Credly badge URL)
  certifications: [
    { name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", status: "In progress", date: "" },
  ],

  skills: {
    "AWS":             ["S3 & CloudFront", "Lambda & API Gateway", "DynamoDB", "IAM", "Route 53 & ACM", "EC2 & VPC"],
    "IaC & CI/CD":     ["Terraform", "GitHub Actions", "OIDC federation", "Git"],
    "Containers & OS": ["Docker", "Kubernetes", "Linux", "Bash & Python scripting"],
    "Development":     ["Python", "JavaScript", "Java & C++", "SQL & NoSQL"],
  },
};

/* --------------------------------------------------------------------------
   FEATURED PROJECTS — shown as large cards, in this order.

   Fields:
     title        Display name
     repo         GitHub repo name (adds a "Code" link + live stars). Use null
                  for projects that aren't on GitHub (e.g. ones on your Mac).
     link         Optional live demo / website URL
     status       Optional small badge, e.g. "In progress"
     tagline      One short line
     description  2–3 sentences
     highlights   Short bullet points
     tags         Tech used
     images       Screenshot URLs (or local paths like "img/myapp.png").
                  Use phone: true for tall phone screenshots.
     diagram      Optional architecture shown instead of images. Either a list
                  of layers, or { lanes: [{ title, steps: [...] }], footer }
   -------------------------------------------------------------------------- */

const RAW = (repo, path) => `https://raw.githubusercontent.com/zhuff99/${repo}/main/${path}`;

window.FEATURED = [
  {
    title: "Serverless Portfolio on AWS",
    repo: "zhuff99.github.io",
    status: "In progress",
    tagline: "This website, as code",
    description:
      "The site you're reading is served from a private S3 bucket through CloudFront over HTTPS, " +
      "with a serverless visitor counter. Every resource is defined in Terraform and every push " +
      "deploys automatically through GitHub Actions.",
    highlights: [
      "Private S3 origin locked to CloudFront with Origin Access Control",
      "API Gateway → Lambda (Python) → DynamoDB counter with throttling",
      "Keyless CI/CD: GitHub Actions assumes a scoped IAM role via OIDC",
      "Lambda unit tests and terraform validate run on every push",
    ],
    tags: ["Terraform", "S3", "CloudFront", "Lambda", "DynamoDB", "GitHub Actions"],
    diagram: {
      lanes: [
        { title: "Static site", steps: ["Route 53 + ACM", "CloudFront CDN", "S3 (private)"] },
        { title: "Visitor counter", steps: ["API Gateway", "Lambda · Python", "DynamoDB"] },
      ],
      footer: "Terraform · deployed by GitHub Actions via OIDC",
    },
  },
  {
    title: "Bulk Website Analyzer",
    repo: "BulkWebsiteAnalyzer",
    tagline: "Containerized AI data pipeline",
    description:
      "A Dockerized batch pipeline that classifies websites at scale. Feed it a list of URLs and it " +
      "fetches each site, sends batched requests to the Claude API, and exports structured results " +
      "to CSV or Google Sheets.",
    highlights: [
      "Packaged with Docker for one-command, dependency-free runs",
      "Async fetch layer with a Playwright fallback for JS-heavy sites",
      "Processes 500–1,000+ sites per run with batched API calls",
      "Secrets via environment config; optional proxy support",
    ],
    tags: ["Docker", "Python", "Claude API", "Playwright", "Google Sheets API"],
    images: [RAW("BulkWebsiteAnalyzer", "Screenshots/google_sheets.jpg")],
  },
  {
    title: "Travlr Getaways",
    repo: "TravlrAdmin",
    tagline: "Three-tier MEAN stack application",
    description:
      "A travel booking platform with a REST API backend and MongoDB data tier, serving both a " +
      "public Express site and an Angular single-page admin app.",
    highlights: [
      "RESTful API with full CRUD, tested in Postman",
      "NoSQL data tier in MongoDB",
      "Separate public and admin front ends sharing one API",
    ],
    tags: ["Node.js", "Express", "MongoDB", "Angular"],
    diagram: ["Angular SPA (admin)", "Express REST API", "MongoDB"],
  },
  {
    title: "StreakMed",
    repo: "StreakMed",
    tagline: "Native iOS app",
    description:
      "An iOS medication tracker built with SwiftUI and Core Data, with streak tracking, " +
      "flexible schedules, per-dose reminders, and home-screen widgets.",
    highlights: [
      "Offline-first persistence with Core Data",
      "Local notifications, widgets, calendar, and history views",
    ],
    tags: ["Swift", "SwiftUI", "Core Data", "WidgetKit"],
    phone: true,
    images: [
      RAW("StreakMed", "Screenshots/YourMeds.png"),
      RAW("StreakMed", "Screenshots/Calander.png"),
      RAW("StreakMed", "Screenshots/History.png"),
    ],
  },

  /* Example: a project that lives on your Mac, not GitHub.
  {
    title: "My Mac Project",
    repo: null,
    link: "https://example.com",
    tagline: "What it is in one line",
    description: "A couple of sentences about what it does and why it's interesting.",
    highlights: ["Something you're proud of", "Another detail"],
    tags: ["Terraform", "AWS"],
    images: ["img/my-project.png"],
  },
  */
];

/* --------------------------------------------------------------------------
   "MORE ON GITHUB" — the rest of your public repos load live.
   Repos listed here are hidden from that list.
   -------------------------------------------------------------------------- */
window.HIDE_REPOS = ["zhuff99", "Meta-Front-end-final", "Little_Lemon"];

// Repo names matching this are tagged "Coursework" (hidden unless the toggle is on)
window.COURSEWORK = /^(CS-?\d+|Coursera)$/i;
