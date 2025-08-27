# 🧈 ButterPop.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.4-blue.svg)](https://github.com/Ayushx309/ButterPop.js)
[![Size](https://img.shields.io/badge/size-<100kb-brightgreen.svg)](https://github.com/Ayushx309/ButterPop.js)
[![](https://data.jsdelivr.com/v1/package/npm/butterpop/badge)](https://www.jsdelivr.com/package/npm/butterpop)

A lightweight, highly customizable toast notification library with no dependencies. ButterPop makes creating beautiful, interactive notifications smooth as butter! 🍞✨

[View Demo](https://ayushx309.eternalbytes.in/ButterPop.js/) | [GitHub](https://github.com/Ayushx309/ButterPop.js)

<p align="center">
  <img src="https://ayushx309.eternalbytes.in/ButterPop.js/banner.png" alt="ButterPop.js Demo" width="800" />
</p>

## ✨ Features

- **Zero Dependencies** - Pure vanilla JavaScript, no external libraries required
- **Lightweight** - Under 100KB minified (CSS + JS), won't weigh down your project
- **Multiple Themes** - 41 beautiful built-in themes (Default, Minimal, Dark, Light, Glassmorphism, Neon, Material, Gradient, Rounded, Neumorphism, Retro, Cyberpunk, Pastel, Terminal, Elegant, Bubble, Forest, Futuristic, Comic, Luxury, Neon Brutalism, Monochrome, Candy, Aqua, Nordic, Blueprint, Paper, Origami, Sunset, Holographic, Chalk, Aurora, Corporate, Zen, Frost, Velvet, Quantum, Neon Glow, Watercolor, Vintage, Pixel Art, Handwritten)
- **Fully Customizable** - Easily create your own themes or modify existing ones
- **Responsive Design** - Looks great on all devices, from mobile to desktop
- **Multiple Positions** - 7 positioning options for flexible placement
- **Progress Indicators** - Visual progress bars to show remaining time
- **Pause on Hover** - Intelligently pauses when users interact with notifications
- **Interactive Elements** - Support for action buttons and callbacks
- **Queue Management** - Smart handling of multiple notifications
- **Accessibility Focus** - ARIA attributes and keyboard navigation support
- **Duplicate Prevention** - Option to prevent duplicate notifications
- **ES Module Support** - Use with modern JavaScript workflows

## 📦 Installation

### Direct Download

Download the [latest release](https://github.com/Ayushx309/ButterPop.js/releases/) and include it in your project:

```html
<link rel="stylesheet" href="butterpop.css">
<script src="butterpop.js"></script>
```

### NPM (Coming Soon)

```bash
npm install butterpop
```

### CDN
You can include ButterPop.js directly from a CDN:

**jsDelivr:**
```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/butterpop@1.0.4/butterpop.min.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/butterpop@1.0.4/butterpop.min.js"></script>
```


**ES Module (for modern applications):**
```html
<script type="module">
  import ButterPop from 'https://cdn.jsdelivr.net/npm/butterpop@1.0.4/butterpop.esm.min.js';
  
  // Your code here
  ButterPop.success('Hello from ES Module!');
</script>
```

## 🚀 Quick Start

```javascript
// Basic usage examples
ButterPop.success('Operation completed successfully! 🎉');
ButterPop.error('An error occurred! ❌');
ButterPop.warning('Warning: This action cannot be undone! ⚠️');
ButterPop.info('Did you know? ButterPop.js is awesome! 💡');

// Advanced usage with options
ButterPop.show({
  message: "Custom notification with many options",
  type: "info",
  position: "top-right",
  duration: 5000,
  theme: "glassmorphism",
  progress: true,
  pauseOnHover: true,
  onClick: () => console.log("Toast clicked!"),
  actions: [{
    text: "View",
    callback: () => console.log("View clicked!")
  }, {
    text: "Dismiss",
    callback: (toast) => ButterPop.remove(toast.id)
  }]
});
```

## 📋 API Documentation

### Core Methods

| Method | Description |
|--------|-------------|
| `ButterPop.show(options)` | Create and display a toast with custom options |
| `ButterPop.success(message, options)` | Show a success toast (green) |
| `ButterPop.error(message, options)` | Show an error toast (red) |
| `ButterPop.warning(message, options)` | Show a warning toast (orange/yellow) |
| `ButterPop.info(message, options)` | Show an info toast (blue) |
| `ButterPop.remove(id)` | Remove a specific toast by ID |
| `ButterPop.clearAll()` | Remove all active toasts |
| `ButterPop.configure(options)` | Set global default options |

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | String | `''` | The notification message |
| `type` | String | `''` | Toast type (`success`, `error`, `warning`, `info`) |
| `position` | String | `'top-right'` | Position on screen (`top-left`, `top-right`, `top-center`, `bottom-left`, `bottom-right`, `bottom-center`, `center`) |
| `duration` | Number | `5000` | Duration in milliseconds (0 for persistent toast) |
| `theme` | String | `'default'` | Theme name (see Themes section below) |
| `progress` | Boolean | `false` | Show progress bar |
| `progressColor` | String | `null` | Custom color for progress bar (CSS color) |
| `closable` | Boolean | `true` | Show close button |
| `closeOnClick` | Boolean | `false` | Close when clicking on the toast |
| `pauseOnHover` | Boolean | `true` | Pause timer when hovering |
| `preventDuplicates` | Boolean | `false` | Prevent duplicate notifications |
| `onClick` | Function | `null` | Callback function when toast is clicked |
| `onClose` | Function | `null` | Callback function when toast is closed |
| `actions` | Array | `[]` | Action buttons with callbacks (see Actions section) |
| `className` | String | `''` | Additional CSS class to apply to the toast |
| `icon` | String/HTML/Boolean | `true` | Custom icon content or `false` to disable icon |
| `maxVisible` | Number | `5` | Maximum number of visible toasts (global option) |

### Action Buttons

You can add interactive action buttons to your toasts:

```javascript
ButterPop.show({
  message: "New message from John",
  type: "info",
  actions: [
    {
      text: "Reply",
      callback: () => { openReplyDialog(); }
    },
    {
      text: "Dismiss",
      callback: (toast) => { ButterPop.remove(toast.id); }
    }
  ]
});
```

Each action in the array accepts these properties:

| Property | Type | Description |
|----------|------|-------------|
| `text` | String | Button text |
| `callback` | Function | Function to call when clicked (receives toast object) |
| `className` | String | Additional CSS class for styling |

## 🎨 Themes

ButterPop.js comes with 41 beautiful built-in themes:

| Theme | Description |
|-------|-------------|
| `default` | Clean, simple style with colored borders |
| `minimal` | Subtle, minimalist style with thin borders |
| `dark` | Dark background with light text, suitable for light websites |
| `light` | Light background with dark text, suitable for dark websites |
| `glassmorphism` | Modern frosted glass effect with transparency |
| `neon` | Glowing borders with colorful text shadows |
| `material` | Google Material Design inspired with shadows and transitions |
| `gradient` | Smooth color gradients based on notification type |
| `rounded` | Pill-shaped toasts with fully rounded corners |
| `neumorphism` | Soft UI/Neumorphic design with adaptive light/dark mode support |
| `retro` | Vintage computer/pixel art inspired style |
| `cyberpunk` | Futuristic neon style with scan lines and glowing effects |
| `pastel` | Soft, gentle colors with smooth corners and subtle shadows |
| `terminal` | Command-line inspired theme with monospace font and console aesthetics |
| `elegant` | Sophisticated typography with subtle bottom borders and serif fonts |
| `bubble` | Speech bubble style with triangular tail and rounded corners |
| `forest` | Nature-inspired dark green theme with leaf pattern texture |
| `futuristic` | High-tech UI with gradients, accents, and modern typography |
| `comic` | Fun cartoon-style design with speech bubbles and bold outlines |
| `luxury` | Premium dark theme with gold accents and subtle gradients |
| `neon-brutalism` | Bold, skewed design with bright contrasting colors and thick outlines |
| `monochrome` | Minimalist black and white design with geometric accents |
| `candy` | Sweet, colorful design with dotted patterns and soft gradients |
| `aqua` | Water-inspired theme with ocean gradients and wave effects |
| `nordic` | Clean Scandinavian design with minimal colors and crisp aesthetics |
| `blueprint` | Technical drawing style with grid backgrounds and structured layout |
| `paper` | Paper texture with folded corner effect and subtle patterns |
| `origami` | Paper-fold inspired design with sharp angles and geometric patterns |
| `sunset` | Warm gradient colors inspired by sunset with soft light effects |
| `holographic` | Iridescent metallic effect with rainbow highlights and reflections |
| `chalk` | Chalkboard texture with handwritten style text and rustic appeal |
| `aurora` | Northern lights inspired with flowing gradients and soft glows |
| `corporate` | Professional business-like design with clean lines and subtle accents |
| `zen` | Minimalist, calm design with subtle gradient accents and balanced aesthetics |
| `frost` | Translucent frosted glass effect with subtle shadows and light reflections |
| `velvet` | Rich, luxurious dark theme with elegant typography and gradient accents |
| `quantum` | Futuristic sci-fi inspired theme with animated gradients and tech aesthetics |
| `neon-glow` | Vibrant glowing text with colorful shadows and pulsing effects |
| `watercolor` | Soft, artistic style with gradient backgrounds and subtle texture |
| `vintage` | Retro-inspired design with aged paper texture and classic typography |
| `pixel` | 8-bit style design with pixelated aesthetics and game-inspired colors |
| `handwritten` | Casual note-like appearance with handwritten font and paper texture |

### Using Themes

```javascript
// Set a theme for a specific toast
ButterPop.success("Operation completed!", { theme: "glassmorphism" });

// Set a default theme for all toasts
ButterPop.configure({ theme: "material" });
```

### Custom Icons

You can customize the icons in your toast notifications using several methods:

```javascript
// Use an emoji as an icon
ButterPop.show({
  message: "Toast with emoji icon",
  type: "info",
  icon: "🚀"
});

// Use custom SVG
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

ButterPop.show({
  message: "Toast with custom SVG icon",
  type: "info",
  icon: svgIcon
});

// Use Font Awesome or other icon libraries
// Make sure to include the Font Awesome library in your project
ButterPop.show({
  message: "Toast with Font Awesome icon",
  type: "info",
  icon: '<i class="fas fa-bell" style="font-size: 24px;"></i>'
});

// Use an image
ButterPop.show({
  message: "Toast with image icon",
  type: "info",
  icon: '<img src="path/to/icon.png" width="24" height="24" alt="Icon">'
});

// Remove the icon completely
ButterPop.show({
  message: "Toast with no icon",
  type: "info",
  icon: false
});
```

## ⚙️ Advanced Usage

### Global Configuration

You can set default options for all toasts:

```javascript
ButterPop.configure({
  position: "bottom-center",
  duration: 8000,
  theme: "material",
  progress: true,
  pauseOnHover: true,
  maxVisible: 3
});
```

### Custom Callbacks

```javascript
ButterPop.show({
  message: "Click me for more info",
  type: "info",
  onClick: () => {
    window.open('https://example.com', '_blank');
  },
  onClose: () => {
    console.log('Toast was closed');
  }
});
```

### Creating Persistent Toasts

Set duration to 0 to make a toast stay until manually closed:

```javascript
ButterPop.warning("This won't disappear until you close it", {
  duration: 0,
  closable: true
});
```

### Preventing Duplicates

```javascript
// This will only show one toast, even if called multiple times
const options = {
  message: "You have a new notification",
  preventDuplicates: true
};

ButterPop.info(options.message, options);
ButterPop.info(options.message, options); // This one won't appear
```

## 🧩 Browser Compatibility

- Chrome 49+
- Firefox 52+
- Safari 10+
- Edge 16+
- Opera 36+
- iOS Safari 10+
- Android Browser 4.4+

## 📚 Examples

### Form Validation

```javascript
function validateForm() {
  const email = document.getElementById('email').value;
  if (!email.includes('@')) {
    ButterPop.error("Please enter a valid email address", {
      position: "top-center",
      theme: "material"
    });
    return false;
  }
  
  ButterPop.success("Form submitted successfully!");
  return true;
}
```

### API Request Notification

```javascript
async function fetchData() {
  try {
    ButterPop.info("Fetching data...", { duration: 0, id: "fetch-toast" });
    
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    
    ButterPop.remove("fetch-toast");
    ButterPop.success("Data loaded successfully!");
    
    return data;
  } catch (error) {
    ButterPop.remove("fetch-toast");
    ButterPop.error("Failed to load data: " + error.message, {
      duration: 0,
      actions: [{
        text: "Retry",
        callback: fetchData
      }]
    });
  }
}
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT © [Ayushx309](https://github.com/Ayushx309) 
