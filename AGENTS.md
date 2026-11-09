# AGENTS.md

This file is the **single reference** for every AI agent (Claude, Copilot, Codex, Cursor...)
working in this repository. Change the rules here, not in agent-specific files.

DORA Report is a **client-side only** React application helping financial institutions draft
DORA incident and cyber threat reports (EBA schemas). It is a static site, deployed to GitHub
Pages: there is no backend.

## A task is done only when

1. **`npm run build` passes** (TypeScript check, then Vite build).
2. **`npm run lint` reports no error.**
3. **`prek run --files <files>` passes** on the modified files.
4. **The [security invariants](#security-invariants) still hold.**
5. **`README.md` is up to date** when a feature or a command visible to the user changed.
6. **A security review of the changes was made with the `security-review` MCP server** when
   it is connected (see [Security review](#security-review)).

If one of these steps is deliberately skipped, say so explicitly in the answer or in the pull
request description, with the reason. Never declare a task done without running the checks.

## Agent behavior

Before making any change:

1. Read the relevant source files and follow their existing patterns.
2. Get the development standards of the technologies you touch from the `security-review`
   MCP server (see [Coding conventions](#coding-conventions)) and apply them.
3. Make the smallest change that does the job.

Do not:

- add a dependency without a reason stated in the answer;
- replace a technology or a pattern of the project without approval;
- edit generated files (`package-lock.json`) by hand: use `npm`;
- edit the official EBA schemas (`src/schemas/DORA_*.json`) except to import a new version;
- bypass a failing check (`--no-verify`, `eslint-disable` without a reason);
- duplicate an existing component instead of extending it.

If a tool is missing or a command fails, report the command, the cause when known, and do
not hide the failure.

## Coding conventions

The development standards are provided by the `security-review` MCP server, and the
documentation of the frameworks (React, MUI, Vite, react-jsonschema-form...) by the `context7`
MCP server; both are declared in your local `.mcp.json`, ignored by git (`context7`:
`https://mcp.context7.com/mcp`; `security-review`: the URL of your server, with its OAuth
login, without any token in the file), and no skill is needed. Read the standards before writing
code:

- tool `get_development_standards`, by technology (`typescript`, `react`...) or by file
  (`package.json`, `vite.config.ts`...);
- tool `list_development_standards` to see the catalog;
- resource `standard://<slug>` to read one standard.

Do not copy them here. This file only keeps the rules specific to this repository; in case of
conflict, it wins. A standard never weakens security: keep the safe behavior and report the
conflict. If the server is not connected, say so, and follow the existing code.

## Technology stack

- React 19, TypeScript, Vite 7 (`@vitejs/plugin-react`), ESLint 9.
- MUI 7 (`@mui/material`, `@mui/x-date-pickers`), Emotion.
- Forms generated from JSON Schemas with react-jsonschema-form (`@rjsf/mui`) and AJV.
- i18next (translations in `public/locales/<lang>/`), jsPDF for the PDF export.
- Node.js 24 (Vite 7 needs 20.19+ or 22.12+), npm (`package-lock.json`).

## Project structure

```text
.
├── public/
│   └── locales/            # en, fr translations
├── src/
│   ├── main.tsx, App.tsx   # entry point, routes
│   ├── DoraIncident.tsx    # incident report form
│   ├── DoraThreat.tsx      # cyber threat report form
│   ├── buttons/            # JSON download, PDF export, step navigation
│   ├── contexts/           # data, debug, error, form and stepper state
│   ├── fields/             # custom form fields
│   ├── modals/             # import, save, locale dialogs
│   ├── schemas/            # EBA schemas (DORA_*.json), form and UI schemas
│   └── utils/              # AJV, i18n, version
├── vite.config.ts
└── AGENTS.md
```

## Development

```bash
npm ci            # dependencies from package-lock.json
prek install      # pre-commit hooks
npm run dev       # http://localhost:5173
npm run build     # tsc -b && vite build, output in dist/
npm run lint
```

## Security invariants

- **The data never leaves the browser**: no network call sends form data anywhere (no API,
  analytics or third-party service). The only requests load the translations from the site
  itself. Saved reports stay in `localStorage` (`dora-saves`) or in files the user downloads
  or imports.
- Imported JSON files are untrusted: they only feed the form data, validated by the schemas;
  never render their content as HTML.
- No secret in the repository or in the built site.

## Security review

When the `security-review` MCP server is connected (its prompts and tools appear in the
session), a security review of the changes is **systematic** before declaring a task done or
opening a pull request, whatever the size of the change:

1. Run the `security-review` prompt (or `configuration-review` for the workflows and YAML,
   `dependency-review` when `package.json` or `package-lock.json` change) on the modified
   files, with the diff as context.
2. Use `scan_code` and `get_review_checklist` during the review.
3. Save the result **once** with `save_security_report` (`project`: the repository name, plus
   `branch` and `commit_sha` when known).
4. Fix the `critical` and `high` findings before finishing. Fix or justify the others and
   propose their status with `propose_finding_status`: an agent never changes a status, a
   person validates the proposal in the web interface.
5. Summarize the review (report identifier, findings and what was done) in the answer and in
   the pull request description.

If the server is not connected or does not answer, say so explicitly: never claim a review
that was not made.

## Deployment and releases

Every push builds the site and deploys `dist/` to GitHub Pages (`deploy.yml`). A `v*.*.*` tag
creates the GitHub release (`release.yml`); bump the version with `npm run patch` (or
`npm version minor|major`), then push the commit and the tag.
