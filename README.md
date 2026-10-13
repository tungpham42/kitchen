# Kitchen — Món Ăn 🍜

A modern Vietnamese recipe-sharing web application rebuilt from the legacy `tungpham42/monan` project. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Firebase, and Cloudinary.

> **Tung can cook.** A family-kitchen notebook for discovering, sharing, and managing Vietnamese recipes.

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Vietnamese Culinary Direction](#-vietnamese-culinary-direction)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Firebase Setup](#-firebase-setup)
- [Cloudinary Setup](#-cloudinary-setup)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Routes](#-routes)
- [Migration Notes](#-migration-notes)
- [Git Safety](#-git-safety)
- [Deployment](#-deployment)
- [Verification](#-verification)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

- **Recipe Discovery** — Browse, search, filter by category, sort, and paginate recipes.
- **Recipe Details** — View recipe videos, share links, read comments, and explore related recipes.
- **Weekly Meal Plans** — Curated meal suggestions for the week.
- **User Accounts** — Email/password and Google authentication, profile management, password changes.
- **Admin Panel** — Create, edit, and moderate recipes.
- **Image Uploads** — Direct browser uploads to Cloudinary using an unsigned upload preset.
- **Responsive UI** — Fully responsive layout with Tailwind CSS and inline SVG icons.
- **View Counter** — Recipe view tracking.
- **AdSense Integration** — Top banner and in-content ad placements.

---

## 🧰 Tech Stack

| Layer             | Technology                                |
| ----------------- | ----------------------------------------- |
| Framework         | Next.js 16 + App Router                   |
| Language          | TypeScript                                |
| UI                | React 19, Tailwind CSS 4                  |
| Lightweight State | AlpineJS (navigation and account menus)   |
| Backend / Auth    | Firebase Authentication + Firestore       |
| Media             | Cloudinary (unsigned image uploads)       |
| Icons             | Inline SVG (no Font Awesome or Bootstrap) |

---

## 🎨 Vietnamese Culinary Direction

The UI uses a warm traditional Vietnamese palette inspired by:

- **Lacquer red** — primary accent
- **Old paper / cream** — background tones
- **Turmeric gold** — highlights
- **Bamboo green** — secondary accents

Typography, borders, cards, and copy are designed around a **family-kitchen / recipe-notebook** feel while remaining responsive and modern.

---

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** 18.17 or later
- **npm** 9 or later
- A **Firebase project** with:
  - Authentication enabled
  - Email/Password provider enabled
  - Google provider enabled
  - Firestore database created
- A **Cloudinary account** with an unsigned upload preset configured

---

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tungpham42/kitchen.git
   cd kitchen
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` and fill in the required values:

   ```bash
   cp .env.example .env
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**

   ```bash
   npm run build
   npm start
   ```

---

## 🔧 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

NEXT_PUBLIC_ADMIN_EMAIL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=
```

> **Note:** `.env` is included for the credentials/configuration recovered from the legacy client-side project. It is **ignored by Git**. Use `.env.example` as the deployment template. Public Firebase web config values and Cloudinary unsigned-upload settings use the `NEXT_PUBLIC_` prefix because they are required in browser-side Firebase/Cloudinary flows. **Do not add a Cloudinary API secret to browser code.**

---

## 🔥 Firebase Setup

The app expects the same Firestore structure used by the legacy project:

```text
recipes
users
recipes/{recipeId}/comments
```

Authentication providers used by the UI:

- **Email/Password**
- **Google**

Ensure Firestore security rules are configured for your deployment environment.

---

## ☁️ Cloudinary Setup

Recipe images are uploaded directly from the browser with an **unsigned Cloudinary upload preset**.

The preset must be configured to accept the image uploads used by the application.

Required environment variables:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

---

## 📜 Available Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the development server     |
| `npm run build` | Build the production application |
| `npm start`     | Start the production server      |
| `npm run lint`  | Run ESLint                       |

---

## 📁 Project Structure

```text
kitchen/
├── app/                    # Next.js App Router pages and layouts
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, Firebase and Cloudinary configs
├── public/                 # Static assets
├── scripts/                # Utility scripts
├── styles/                 # Global and theme styles
├── .env.example            # Environment variable template
├── .gitignore
├── LICENSE
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## 🗺️ Routes

| Route                  | Description                                                         |
| ---------------------- | ------------------------------------------------------------------- |
| `/`                    | Recipe discovery, search, category filters, sorting, and pagination |
| `/recipes/[slug]`      | Recipe detail, video, sharing, comments, and related recipes        |
| `/meal-plans`          | Weekly meal suggestions                                             |
| `/recipes/new`         | Create a new recipe                                                 |
| `/recipes/[slug]/edit` | Admin recipe editing                                                |
| `/login`               | Email/password and Google login                                     |
| `/register`            | Account registration                                                |
| `/profile`             | Profile and password management                                     |
| `/admin`               | Admin recipe moderation                                             |
| `/guide`               | Usage guide                                                         |
| `/privacy-policy`      | Privacy policy                                                      |

---

## 🔄 Migration Notes

This project is a migration from the legacy `tungpham42/monan` codebase:

- **Bootstrap / React-Bootstrap → Tailwind CSS** — All Bootstrap components and Font Awesome icons replaced with Tailwind utility classes and inline SVG.
- **JavaScript → TypeScript** — Entire codebase converted to TypeScript for type safety.
- **App Router** — Page composition moved to the Next.js App Router.
- **Client-side Data Layer** — The data layer remains browser-side because the legacy application uses client-side Firebase Auth/Firestore and Cloudinary unsigned uploads. This avoids introducing a new server-admin Firebase credential model that would change the deployment/security setup.
- **Data Model** — Firestore structure and core routes preserved from the legacy project.

---

## 🔒 Git Safety

`.gitignore` excludes:

- `.env` and local environment variants
- Build output
- Dependency folders
- IDE metadata
- Common local logs

**Commit `.env.example`, not `.env`.**

---

## ☁️ Deployment

The project can be deployed to any platform that supports Next.js, such as Vercel, Netlify, or a Node.js server.

Ensure all environment variables are set in your hosting provider's dashboard.

**Build command**

```bash
npm run build
```

**Start command**

```bash
npm start
```

---

## ✅ Verification

The source tree was statically reviewed and type-checked as far as the offline environment permits. Full dependency installation/build could not be executed in that environment because npm package downloads are unavailable.

Run `npm install` followed by `npm run build` in an online Node.js environment before deployment.

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. Commit your changes.

   ```bash
   git commit -m "Add some amazing feature"
   ```

4. Push to the branch.

   ```bash
   git push origin feature/amazing-feature
   ```

5. Open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Tung Pham**

- GitHub: [@tungpham42](https://github.com/tungpham42)
- Repository: [tungpham42/kitchen](https://github.com/tungpham42/kitchen)

---

## 🙏 Acknowledgements

- Original legacy `tungpham42/monan` project
- Firebase
- Cloudinary
- Next.js
- Tailwind CSS
