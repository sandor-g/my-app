# AdMaker - Advanced Social Media Ad Creator

A modern, professional web application for creating social media advertisements with advanced brand identity management, content editing, and element toggling.

## ✨ Features

### 🎨 **Brand Identity System**
- **3-Color Palette**: Primary, Secondary, and Accent color inputs with HEX support
- **Color Swatches**: Visual preview of your brand colors
- **Google Fonts Integration**: Curated selection of professional fonts (Inter, Roboto, Poppins, etc.)
- **Automatic Color Mapping**: Smart WCAG-compliant color assignment for templates
- **Contrast Warnings**: Accessibility alerts with one-click fix suggestions
- **Manual Override**: Custom color mapping controls for fine-tuning

### 📝 **Content Editing**
- **Per-Slide Content**: Edit Headline, Subheadline, Body, Bullets, CTA, and Footer for each slide
- **Slide Navigation**: Previous/Next buttons and slide index dropdown for carousels
- **Real-time Preview**: See content changes instantly in the preview pane
- **Persistent Storage**: All content automatically saved to localStorage

### 🧩 **Parts & Elements**
- **Element Toggles**: Show/hide individual template elements (headlines, shapes, CTAs, etc.)
- **Smart Controls**: Toggle controls automatically generated from template structure
- **Visual Feedback**: Icons and descriptions for each toggleable element
- **Geometry Locked**: Elements maintain their positions and sizes (design integrity)

### 🎯 **Template System**
- **8 Professional Templates**: Hero, Split, Big Quote, Checklist, Stats, Stepper, Before After, Minimal
- **Multiple Formats**: Single Image and Carousel support
- **Aspect Ratios**: 1:1, 16:9, 9:16, 4:5 (Instagram)
- **Full-screen Selection**: Beautiful modal with template previews

### 🔍 **Preview & Export**
- **Zoom Controls**: 50% to 200% zoom with real-time scaling
- **Slide Navigation**: Navigate between carousel slides
- **Responsive Artboard**: Centered preview with proper aspect ratios
- **Export Options**: Multiple sizes and quality settings

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with custom design system
- **Fonts**: Google Fonts integration with dynamic loading
- **Storage**: localStorage for data persistence
- **Accessibility**: WCAG AA compliance with contrast checking
- **Performance**: SVG-based rendering for crisp exports

## 🎨 Color System

### Brand Colors
- **Primary**: #232323 (Main text and key elements)
- **Secondary**: #71717A (Supporting text and secondary elements)
- **Accent**: #3B82F6 (Call-to-action and highlights)

### Automatic Mapping
The system automatically maps template tokens to brand colors:
1. **Background**: Ensures highest contrast with text
2. **Text**: Optimized for readability against background
3. **Accent**: Used for CTAs and important elements
4. **Shape**: Decorative elements using accent colors

### Accessibility
- **WCAG AA Compliance**: Automatic contrast checking
- **Smart Suggestions**: One-click fixes for contrast issues
- **Visual Warnings**: Clear indicators for accessibility problems

## 📱 Template Details

| Template | Slides | Best For | Features |
|----------|--------|----------|----------|
| **Hero** | 1 | Brand awareness | Headline, subheadline, CTA |
| **Split** | 1 | Product showcase | Text + visual balance |
| **Big Quote** | 1 | Testimonials | Prominent quote + attribution |
| **Checklist** | 1 | Feature lists | Headline + bullet points |
| **Stats** | 1 | Data presentation | Numbers + supporting text |
| **Stepper** | 3 | Process explanation | Multi-step visualization |
| **Before After** | 1 | Comparisons | Side-by-side layout |
| **Minimal** | 1 | Clean messaging | Single headline focus |

## 🎯 Usage Guide

### 1. **Setup Brand Identity**
- Choose your 3 brand colors (Primary, Secondary, Accent)
- Select a professional font family
- Review automatic color mapping
- Apply suggested fixes for accessibility

### 2. **Select Template**
- Click "Choose Template" in Parts section
- Browse 8 professional templates
- Preview layouts and descriptions
- Select based on your content needs

### 3. **Edit Content**
- Navigate between slides (for carousels)
- Edit headlines, subheadlines, body text
- Add bullet points and CTAs
- Include footer notes and disclaimers

### 4. **Configure Elements**
- Toggle element visibility on/off
- Maintain design integrity
- Customize which parts to show
- Preview changes in real-time

### 5. **Export**
- Choose export size (1080x1080, 1920x1080, etc.)
- Select quality level (High, Medium, Low)
- Download your professional ad

## 🔧 Development

### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure
```
src/
├── components/
│   ├── BrandSection.tsx      # Brand identity & color management
│   ├── ContentSection.tsx    # Content editing & slide navigation
│   ├── PartsSection.tsx      # Element toggles & template settings
│   ├── PreviewPane.tsx       # Preview pane with zoom & navigation
│   ├── Sidebar.tsx           # Main sidebar layout
│   └── TemplateModal.tsx     # Template selection modal
├── data/
│   └── googleFonts.ts        # Curated Google Fonts list
├── utils/
│   └── colorUtils.ts         # Color contrast & WCAG utilities
├── types.ts                  # TypeScript type definitions
└── App.tsx                   # Main application component
```

### Key Features Implementation
- **Color Mapping**: Automatic WCAG-compliant color assignment
- **Content Persistence**: localStorage integration for all user data
- **Template System**: JSON-based template definitions with element metadata
- **Accessibility**: Real-time contrast checking and suggestions
- **Responsive Design**: TailwindCSS-based responsive layout system

## 🎨 Design Principles

### Layout Constraints
- **Geometry Locked**: No moving, resizing, or adding elements
- **Template Integrity**: Maintains professional design standards
- **Consistent Spacing**: Proper typography and layout hierarchy

### User Experience
- **Real-time Preview**: Instant feedback on all changes
- **Intuitive Controls**: Clear, labeled controls for all functions
- **Visual Feedback**: Icons, colors, and states for better UX
- **Accessibility First**: WCAG compliance built-in

## 📄 License

MIT License - Feel free to use, modify, and distribute as needed.

## 🤝 Contributing

This project demonstrates modern web development best practices:
- TypeScript for type safety
- React hooks for state management
- TailwindCSS for consistent styling
- Accessibility-first design
- Performance optimization

---

**AdMaker** - Create professional social media ads with confidence! 🚀
