Bien sûr ! Voici la version mise à jour du `README.md` **en anglais**, avec un nouveau chapitre intitulé **"Privacy and Data Handling"**, précisant que l'application fonctionne uniquement en local dans le navigateur et n'envoie aucune donnée vers un serveur.

---

# DORA Report

**DORA Report** is a web application designed to assist in the reporting of incidents and threats to the European Banking Authority (EBA), in compliance with the **DORA** regulation (Digital Operational Resilience Act). This tool enables financial institutions to quickly and efficiently submit cybersecurity reports, ensuring regulatory compliance.

## Features

- **Interactive forms**: Simplified input of incident and threat data.
- **Real-time validation**: Verifies data before submission.
- **DORA compliance**: Fully aligned with European regulatory requirements.
- **User-friendly interface**: Clean and intuitive user experience.

## Technologies Used

The application is built using the following frameworks and tools:

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript.
- **Vite**: Fast build tool for modern front-end projects.
- **ESLint**: Linting utility for identifying code issues.

## Privacy and Data Handling

⚠️ **Your data never leaves your computer.**

DORA Report is a **client-side only** web application that runs entirely in your browser. It does **not** transmit any data to a remote server or external service. All form entries, incident details, and user inputs remain **fully local** to your device.

This makes the application ideal for sensitive use cases, such as drafting regulatory incident reports in compliance with the [DORA Regulation](https://www.eba.europa.eu/regulation-and-policy/internal-governance/digital-operational-resilience-dora).

### How it works:

- The application is built as a **static website** (HTML + JS + CSS).
- When loaded in your browser (either from a local folder or a static host), all logic runs locally.
- You can even open the `index.html` file directly from your filesystem without any backend.

### Learn more:

- [How static websites work](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Pages_sites_and_servers)
- [Digital Operational Resilience Act (EBA)](https://www.eba.europa.eu/regulation-and-policy/internal-governance/digital-operational-resilience-dora)

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation and Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/cyr-ius/dora-report.git
   cd dora-report
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173).

## Build for Production

To generate an optimized build for production:

```bash
npm run build
```

The production-ready files will be located in the `dist/` folder.

## Deployment

The contents of the `dist/` folder can be deployed to any static file hosting service, such as:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -m 'Add my feature'`).
4. Push to your fork (`git push origin feature/my-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

For more information, visit the GitHub repository: [https://github.com/cyr-ius/dora-report](https://github.com/cyr-ius/dora-report).
