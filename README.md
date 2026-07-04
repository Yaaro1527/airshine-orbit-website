# Airshine Orbit Solutions - Corporate Website

Premium corporate website for Airshine Orbit Solutions, a data management and IT services company based in Chiplun, Maharashtra, India.

## Tech Stack

- **Build Tool**: Vite 5.x
- **CSS Framework**: Tailwind CSS 3.x
- **Animations**: AOS (Animate On Scroll) 2.x
- **Icons**: Font Awesome 6.x
- **Fonts**: Plus Jakarta Sans, DM Sans (Google Fonts)
- **Deployment**: Vercel / Netlify / Any static host

## Project Structure

```
airshine-orbit-solutions/
├── index.html                  # Main HTML file (entry point)
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment config
├── netlify.toml                # Netlify deployment config
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── LICENSE                     # MIT License
├── public/
│   ├── robots.txt              # SEO robots file
│   ├── sitemap.xml             # SEO sitemap
│   ├── manifest.json           # PWA manifest
│   └── assets/
│       └── images/
│           └── logo.jpeg       # Company logo
├── src/
│   ├── css/
│   │   └── styles.css          # All custom CSS + Tailwind directives
│   └── js/
│       ├── main.js             # Application entry point
│       ├── router.js           # Hash-based page routing
│       ├── mobile-menu.js      # Mobile menu functionality
│       └── services-data.js    # Services & industries data
└── .vscode/
    ├── settings.json           # VS Code workspace settings
    └── extensions.json         # Recommended VS Code extensions
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20.x)
- npm 9+ (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/airshine-orbit-solutions.git
cd airshine-orbit-solutions

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:3000`

### Build for Production

```bash
# Build optimized production files
npm run build

# Preview the production build locally
npm run preview
```

The built files will be in the `dist/` folder.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" → Import your repository
4. Vercel auto-detects Vite — just click "Deploy"
5. Your site is live!

**Or via CLI:**
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Build settings are auto-configured via `netlify.toml`
6. Click "Deploy site"

**Or via CLI:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Deploy to GitHub Pages

```bash
npm run build
# Push the dist/ folder to gh-pages branch
npx gh-pages -d dist
```

### Deploy to Any Static Host

After running `npm run build`, upload the contents of the `dist/` folder to any static hosting provider (AWS S3, Firebase Hosting, Cloudflare Pages, etc).

## Customization Guide

### Edit Services
Open `src/js/services-data.js` to add, remove, or modify services.

### Edit Styles
All custom styles are in `src/css/styles.css`. Tailwind classes are used directly in `index.html`.

### Edit Colors
Modify the color palette in `tailwind.config.js` under `theme.extend.colors`.

### Edit Content
All page content is in `index.html`. The structure uses hash-based routing:
- `#home` — Home page
- `#about` — About page
- `#services` — Services page
- `#contact` — Contact page

### Add Google Analytics
Uncomment and fill `VITE_GA_ID` in `.env`, then add the GA script to `index.html`.

### Connect Contact Form Backend
The form currently shows an alert. To connect a real backend:
1. Set up a form service (Formspree, EmailJS, or custom API)
2. Update the form handler in `src/js/main.js`

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^5.4.0 | Build tool & dev server |
| tailwindcss | ^3.4.0 | Utility-first CSS framework |
| postcss | ^8.4.35 | CSS processing |
| autoprefixer | ^10.4.17 | Vendor prefix automation |
| aos | ^2.3.4 | Scroll animation library |

**CDN Dependencies (no install needed):**
- Font Awesome 6.5.1 (icons)
- Google Fonts (Plus Jakarta Sans, DM Sans)

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

## License

MIT License — see [LICENSE](./LICENSE) for details.

## Contact

- **Phone**: +91 73853 83911 / +91 98217 07551
- **Email**: airshineorbitsolutions@gmail.com
- **Location**: Chiplun, Maharashtra, India
