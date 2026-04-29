# Brand Kit Manager

A professional desktop application for managing brand identities, color palettes, typography, assets, and voice guidelines. Built with Electron, React, and Tailwind CSS.

![Brand Kit Manager](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🎨 Color Management
- **Advanced Color Generator**: Create beautiful 11-shade Tailwind-compatible palettes from any base color
- **Live Preview**: See colors instantly in real UI components (cards, forms, typography)
- **Accessibility Scoring**: WCAG AA/AAA contrast ratio checking
- **Export Options**: Copy as Tailwind config or CSS custom properties
- **Scale Visualization**: Grid view of all shades (50-950)

### 🌙 Dark/Light Mode
- Full theme support with system preference detection
- Persistent theme settings
- Smooth transitions between modes

### 📝 Brand Management
- Create and manage multiple brands
- SQLite database for local data persistence
- Brand-specific color palettes, fonts, and assets

### 🖼️ Asset Management
- Logo and icon vault
- Image uploads and organization
- Asset categorization

### 📊 Additional Features
- Typography management
- Voice & tone guidelines editor
- CSS & token export
- AI-powered color suggestions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/moutiebenamor/brand-kit-manager.git

# Navigate to project directory
cd brand-kit-manager

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac

# Build for Linux
npm run build:linux
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Desktop**: Electron
- **State Management**: Zustand
- **Database**: SQLite (sql.js)
- **Color Manipulation**: Chroma.js
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📂 Project Structure

```
brand-kit-manager/
├── src/
│   ├── main/           # Electron main process
│   ├── preload/        # Electron preload scripts
│   └── renderer/       # React frontend
│       ├── components/ # UI components
│       ├── views/      # Page views
│       ├── store/      # Zustand stores
│       └── ...
├── build/              # Build output
└── ...
```

## 🎯 Usage

1. **Launch the app** - Start managing your brand kit immediately
2. **Create a brand** - Add your brand name and start building
3. **Generate colors** - Use the advanced color generator to create palettes
4. **Manage assets** - Upload logos, icons, and other brand assets
5. **Export** - Copy colors as Tailwind config or CSS variables

## 🌟 Key Features Explained

### Color Generator
The color generator creates professional 11-shade palettes using Tailwind's lightness curve:
- 50, 100, 200, 300 (light tints)
- 400, 500, 600 (base colors)
- 700, 800, 900, 950 (dark shades)

Each shade is calculated for optimal accessibility and visual harmony.

### UI Previews
See your colors in action:
- **Card Preview**: Light and dark mode card components
- **Form Preview**: Inputs, buttons, toggles, and checkboxes
- **Typography Preview**: Heading hierarchy and body text

### Accessibility
Built-in contrast checking ensures your color combinations meet WCAG standards:
- **AAA**: Excellent contrast (7:1+)
- **AA**: Good contrast (4.5:1+)
- Automatic scoring and recommendations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Moutie Ben Amor**
- GitHub: [@moutiebenamor](https://github.com/moutiebenamor)

---

Built with ❤️ for designers and developers who care about brand consistency.
