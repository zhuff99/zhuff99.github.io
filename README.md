# Zach Huff — Portfolio

Personal portfolio site. Plain HTML/CSS/JS, no build step, hosted on GitHub Pages.

## Editing content

Almost everything lives in **`projects.js`**:

- `SITE`: name, headline, bio, facts, skills, email, LinkedIn, résumé, avatar
- `FEATURED`: the large project cards. Add one for any project, including ones that
  aren't on GitHub (set `repo: null`). Screenshots can be URLs or files in an `img/` folder.
- `HIDE_REPOS`: repos to leave out of the "More on GitHub" list
- `COURSEWORK`: pattern for repos tagged as coursework (hidden unless toggled on)

"More on GitHub" loads live from the GitHub API, so new public repos show up automatically.
Adding a description on GitHub (repo page → ⚙ next to "About") makes those cards much richer.

## Running locally

```bash
python -m http.server 8420
```

Then open http://localhost:8420.

## Deploying to GitHub Pages

Push these files to the `zhuff99.github.io` repository (default branch, root folder).
The site is served at https://zhuff99.github.io.
