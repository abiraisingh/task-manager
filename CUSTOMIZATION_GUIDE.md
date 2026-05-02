# Animation & Glassmorphism Customization Guide

## 🎨 Quick Customization Tips

### 1. Change Theme Colors

**Location**: `frontend/src/index.css` (body background gradient)

```css
body {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 50%, #YOUR_COLOR_3 100%);
}
```

**Example - Purple to Pink:**
```css
background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #ec4899 100%);
```

**Example - Blue to Cyan:**
```css
background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #10b981 100%);
```

### 2. Adjust Glassmorphism Effect

**Blur intensity** - Change the blur value:
```css
.dashboard-card {
  backdrop-filter: blur(20px); /* Increase/decrease for more/less blur */
}
```

**Glass opacity** - Adjust the alpha channel:
```css
background: rgba(255, 255, 255, 0.9); /* 0.9 = 90% opaque, 0.7 = 70% opaque */
```

**Border glow** - Change border color:
```css
border: 1px solid rgba(255, 255, 255, 0.5); /* Adjust opacity */
```

### 3. Modify Animation Speed

**Form entrance animations** - Edit delay and duration in component:
```typescript
// Login.tsx / Register.tsx
transition={{ duration: 0.6, ease: "easeOut" }} // Change 0.6 to slower/faster
```

**Staggered task animations** - Edit in Dashboard.tsx:
```typescript
staggerChildren: 0.1, // Increase for slower cascade effect
delayChildren: 0.3,   // Increase to delay overall animation start
```

**Task hover effect** - Change the movement distance:
```typescript
whileHover={{ x: 5 }} // Change 5 to larger/smaller value
```

### 4. Three.js Background Settings

**Location**: `frontend/src/components/ThreeBackground.tsx`

**Change particle count:**
```typescript
const particlesCount = 100; // Increase for more particles
```

**Change particle size:**
```typescript
size: 0.08, // Increase for larger particles
```

**Adjust rotation speed:**
```typescript
particles.rotation.x += 0.0001; // Increase for faster rotation
```

**Change background opacity:**
```typescript
style={{ opacity: 0.4 }} // 0.4 = 40% opacity
```

**Disable Three.js completely:**
Remove or comment out in `App.tsx`:
```typescript
{/* <ThreeBackground /> */}
```

### 5. Button Customization

**Primary button color:**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Success button (Edit):**
```css
.edit-btn {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}
```

**Danger button (Delete):**
```css
.delete-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}
```

### 6. Input Field Styling

**Focus effect:**
```css
.task-input-row input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}
```

**Border color:**
```css
border: 2px solid rgba(102, 126, 234, 0.2); /* Adjust the alpha value */
```

### 7. Font Customization

**Change font family:**
```css
body {
  font-family: "Poppins", "Segoe UI", "Helvetica Neue", sans-serif;
}
```

**Change heading size:**
```css
.topbar h2 {
  font-size: 24px; /* Adjust value */
}
```

## 🔧 Animation Timing Functions

Common easing options:
- `ease`: Default, slow start and end
- `easeOut`: Slow start, fast end
- `easeIn`: Fast start, slow end
- `easeInOut`: Slow start and end
- `linear`: Constant speed
- `circIn`/`circOut`/`circInOut`: Circular timing
- `backIn`/`backOut`: Overshoots slightly
- `anticipate`: Pulls back before animating

```typescript
transition={{ duration: 0.5, ease: "easeOut" }}
```

## 📱 Mobile Optimization

**Change mobile breakpoint:**
```css
@media (max-width: 640px) {
  /* Adjust 640px to your preferred breakpoint */
}
```

**Reduce animations for slower devices:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    /* This already respects user preferences */
  }
}
```

## 🎬 Common Animation Combinations

### Fade + Scale
```typescript
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.5 }}
```

### Slide + Rotate
```typescript
initial={{ opacity: 0, x: -20, rotate: -10 }}
animate={{ opacity: 1, x: 0, rotate: 0 }}
transition={{ duration: 0.5 }}
```

### Bounce Effect
```typescript
transition={{ 
  type: "spring", 
  stiffness: 300, 
  damping: 20 
}}
```

## 🎨 Gradient Combinations

**Dark Mode Theme:**
```css
background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 50%, #3d3d5c 100%);
```

**Sunset Theme:**
```css
background: linear-gradient(135deg, #ff6b6b 0%, #ffa94d 50%, #ffd93d 100%);
```

**Ocean Theme:**
```css
background: linear-gradient(135deg, #0066cc 0%, #0099ff 50%, #00ffcc 100%);
```

**Forest Theme:**
```css
background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%);
```

## ✅ Testing Your Changes

1. **Development**: `npm run dev` - Hot reload enabled
2. **Production build**: `npm run build` - Optimized for performance
3. **Test animations**: Chrome DevTools → Animation inspector
4. **Test responsiveness**: Chrome DevTools → Device toolbar

## 📊 Performance Tips

- Use `will-change` CSS for frequently animated elements
- Keep animation durations under 0.6s for snappy feel
- Use `backdropFilter` only on essential elements
- Test on low-end devices
- Monitor FPS with DevTools Performance tab

---

For more details, see [MODERNIZATION.md](./MODERNIZATION.md)
