# Tools by Vineet — Product Directory

A polished, high-quality product suite directory hosted at [https://toolsby.vineetsansare.com](https://toolsby.vineetsansare.com). Designed as a central showcase for current and future software tools built by Vineet Sansare, starting with **JD2CV** as the flagship tool.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Styling**: Modern Vanilla CSS with CSS custom properties (variables), responsive CSS grid, glassmorphism accents, and accessible dark/light mode engine.
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: Client-side routing with `react-router-dom` supporting external app redirects and native tool paths (`/tools/:id`).
- **Deployment**: Static Web Export (`dist/`) suitable for GitHub Pages, Vercel, or Cloudflare Pages.

---

## 🚀 How Future Tools Are Added

The codebase uses a clean, data-driven **Tool Registry**. To add a new tool to the homepage directory, you only need to edit **one file**:

📁 `src/data/tools.ts`

Add your new tool object to the `TOOLS_REGISTRY` array:

```ts
{
  id: 'my-new-tool',
  name: 'My New Tool',
  shortDescription: 'Concise explanation of what the tool accomplishes.',
  longDescription: 'Optional detailed description shown in the details drawer.',
  category: 'Developer Tools', // 'Career / AI' | 'Developer Tools' | 'Productivity' | 'Utilities'
  status: 'available', // 'available' | 'coming-soon' | 'beta'
  url: 'https://mynewtool.vineetsansare.com', // External app URL or native route '/tools/my-new-tool'
  isExternal: true, // Set false if built natively into this repo
  iconName: 'Sparkles', // Lucide icon identifier
  featured: true,
  tags: ['TypeScript', 'Utility'],
  accentColor: '#10B981'
}
```

Once committed and deployed, the homepage automatically renders the new tool card with category filtering and search support.

---

## 🔗 JD2CV Integration

JD2CV is an independently hosted AI-powered CV tailoring application. The directory links out to JD2CV using the site configuration constant:

📁 `src/config/siteConfig.ts`

```ts
jd2cvUrl: import.meta.env.VITE_JD2CV_URL || 'https://jd2cv.vineetsansare.com'
```

To update or point the primary CTA to a different production deployment URL, set the environment variable:
```bash
VITE_JD2CV_URL=https://your-custom-jd2cv-domain.com
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Check TypeScript types
npm run lint

# Build for production
npm run build
```

---

## 🌐 Deployment & DNS Configuration

### DNS Settings for `toolsby.vineetsansare.com`
To point your custom domain `toolsby.vineetsansare.com` to your deployment host:

- **GitHub Pages**: Add CNAME record pointing `toolsby.vineetsansare.com` to `<your-github-username>.github.io`
- **Vercel / Cloudflare Pages**: Add CNAME record pointing `toolsby.vineetsansare.com` to your Vercel / Cloudflare project target.

The repository includes a `public/CNAME` pre-configured for `toolsby.vineetsansare.com`.
