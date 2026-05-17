# 🏖️ Sandbox Public Assets

This folder contains all the visual assets for the Sandbox Deployment Risk Simulator.

## Required Images

### Background & Theme
- **bg.png** - Beach/sand background texture
- **waves.gif** - Animated waves overlay (used in ProcessingScreen at 25% opacity)

### Icons & Logos
- **sandbox-logo.png** - Main Sandbox logo (displayed in TopBar)
- **bucket.png** - Bucket icon for upload area
- **shovel.png** - Shovel icon (decorative)
- **ring.png** - Ring icon (28×28px, displayed in TopBar next to project name)
- **castle.png** - Sandcastle icon (140×140px, used in ProcessingScreen)

### Interactive Elements
- **cursor.png** - Custom cursor (optional, for enhanced beach theme)

## Image Specifications

### Recommended Sizes
- **sandbox-logo.png**: 120×40px (or similar aspect ratio)
- **ring.png**: 28×28px
- **castle.png**: 140×140px
- **bucket.png**: 80×80px (or scalable)
- **bg.png**: Tileable texture, 512×512px or larger
- **waves.gif**: Animated, 800×200px or larger

### Style Guidelines
- **Color Palette**: Warm sand tones (#f5e6a3, #6b4226, #d4a574)
- **Style**: Retro pixel art or clean vector graphics
- **Format**: PNG for static images, GIF for animations
- **Transparency**: Use alpha channel where appropriate

## Usage in Components

- **TopBar.tsx**: sandbox-logo.png, ring.png
- **UploadScreen.tsx**: bucket.png, bg.png
- **ProcessingScreen.tsx**: castle.png, waves.gif
- **Dashboard.tsx**: bg.png (subtle)
- **globals.css**: cursor.png (optional custom cursor)

## Notes

Place all image files directly in this `public/` folder. Next.js will serve them from the root path (e.g., `/bg.png`, `/sandbox-logo.png`).