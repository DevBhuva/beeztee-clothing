# 📱 Responsive Design Quick Reference Card

## 🎯 Breakpoints (Remember These!)

```css
/* Mobile First Approach */
320px   - Small Mobile (Base)
480px   - Mobile Large
768px   - Tablet Portrait
1024px  - Tablet Landscape / Small Desktop
1400px  - Desktop Large
```

---

## 🔧 Common Media Queries (Copy-Paste Ready)

```css
/* Tablet and Below */
@media (max-width: 1024px) {
  /* Your styles */
}

/* Mobile and Below */
@media (max-width: 768px) {
  /* Your styles */
}

/* Small Mobile */
@media (max-width: 480px) {
  /* Your styles */
}
```

---

## 📏 Typography Scale (Quick Reference)

| Element | Desktop | Tablet | Mobile | Small Mobile |
|---------|---------|--------|--------|--------------|
| Hero Title | 5rem | 3.5rem | 2.5rem | 2rem |
| Section Title | 3rem | 2.5rem | 2rem | 1.6rem |
| Subsection | 2rem | 1.7rem | 1.4rem | 1.2rem |
| Body Text | 1rem | 0.95rem | 0.9rem | 0.85rem |
| Button | 1rem | 0.9rem | 0.85rem | 0.8rem |

---

## 🎨 Grid Patterns (Most Common)

### 4-Column to 1-Column
```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .grid { grid-template-columns: 1fr; }
}
```

### Auto-Fit Pattern
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
```

---

## 🔄 Flex Patterns

### Horizontal to Vertical Stack
```css
.container {
  display: flex;
  gap: 30px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 20px;
  }
}
```

---

## 📦 Spacing Scale

| Screen | Section Padding | Container Padding | Element Gap |
|--------|----------------|-------------------|-------------|
| Desktop | 100px | 50px | 30px |
| Large Tablet | 80px | 40px | 25px |
| Tablet | 60px | 30px | 20px |
| Mobile | 40px | 20px | 15px |
| Small Mobile | 30px | 15px | 10px |

---

## 🎯 Touch Targets

```css
/* Minimum touch target size */
.button, .link, .icon {
  min-width: 44px;
  min-height: 44px;
}

/* Increase on very small screens */
@media (max-width: 480px) {
  .button {
    min-width: 48px;
    min-height: 48px;
  }
}
```

---

## 🖼️ Image Responsive

```css
/* Always use this pattern */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* For background images */
.bg-image {
  background-size: cover;
  background-position: center;
}

/* For product images with fixed container */
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## 🎪 Carousel Responsive Pattern

```css
/* Desktop: 5 items */
.carousel-slide {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 25px;
}

/* Tablet: 3 items */
@media (max-width: 1024px) {
  .carousel-slide {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

/* Mobile: 2 items */
@media (max-width: 768px) {
  .carousel-slide {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}

/* Small Mobile: 1 item */
@media (max-width: 480px) {
  .carousel-slide {
    grid-template-columns: 1fr;
  }
}
```

---

## 🍔 Hamburger Menu Code

### CSS
```css
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
}

.mobile-menu-toggle span {
  width: 28px;
  height: 3px;
  background: #f5f5f5;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: flex;
  }
  
  .nav-links {
    position: fixed;
    right: -100%;
    transition: right 0.4s ease;
  }
  
  .nav-links.active {
    right: 0;
  }
}
```

### React
```jsx
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

<div 
  className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
>
  <span></span>
  <span></span>
  <span></span>
</div>
```

---

## ⚡ Performance Tips

### DO:
✅ Use `transform` and `opacity` for animations
✅ Add `will-change` for frequently animated elements
✅ Use `object-fit: cover` for images
✅ Implement lazy loading for images
✅ Minimize repaints with `transform` instead of `top/left`

### DON'T:
❌ Animate `width`, `height`, `padding`, `margin`
❌ Use too many `box-shadow` on mobile
❌ Create horizontal scroll
❌ Use fixed pixel values everywhere
❌ Forget to test on real devices

---

## 🎨 Common Component Patterns

### Modal/Popup
```css
.modal {
  width: 90%;
  max-width: 1000px;
}

@media (max-width: 768px) {
  .modal {
    width: 95%;
    max-height: 95vh;
    overflow-y: auto;
  }
}
```

### Cards
```css
.card {
  padding: 40px;
  border-radius: 20px;
}

@media (max-width: 768px) {
  .card {
    padding: 25px;
    border-radius: 15px;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 20px;
    border-radius: 12px;
  }
}
```

### Buttons
```css
.button {
  padding: 15px 40px;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .button {
    padding: 12px 30px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .button {
    padding: 10px 25px;
    font-size: 0.85rem;
    width: 100%; /* Full width on mobile */
    max-width: 280px;
  }
}
```

---

## 🔍 Testing Shortcuts

### Chrome DevTools
```
Cmd/Ctrl + Shift + M  - Toggle Device Toolbar
Cmd/Ctrl + Shift + I  - Open DevTools
```

### Common Test Sizes
- iPhone SE: 375 x 667
- iPhone 12 Pro: 390 x 844
- iPad: 768 x 1024
- Desktop: 1920 x 1080

---

## 📋 Component Checklist

When adding a new component, ensure:
- [ ] Tested at all 5 breakpoints
- [ ] Typography scales properly
- [ ] Images are responsive
- [ ] Buttons have proper touch targets
- [ ] No horizontal scroll
- [ ] Spacing adjusts correctly
- [ ] Grid/Flex works on mobile
- [ ] Touch interactions work
- [ ] Text remains readable
- [ ] Component doesn't break layout

---

## 🚨 Common Mistakes to Avoid

1. **Fixed widths without max-width**
   ```css
   ❌ width: 1200px;
   ✅ max-width: 1200px; width: 100%;
   ```

2. **Forgetting viewport meta tag**
   ```html
   ✅ <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

3. **Using px everywhere**
   ```css
   ❌ font-size: 16px;
   ✅ font-size: 1rem;
   ```

4. **Not testing on real devices**
   ```
   ✅ Always test on at least one real mobile device!
   ```

---

## 💡 Pro Tips

1. **Mobile-First Approach**
   ```css
   /* Start with mobile */
   .element {
     font-size: 1rem;
   }
   
   /* Scale up for larger screens */
   @media (min-width: 768px) {
     .element {
       font-size: 1.2rem;
     }
   }
   ```

2. **Use CSS Variables**
   ```css
   :root {
     --spacing: 20px;
   }
   
   @media (max-width: 768px) {
     :root {
       --spacing: 15px;
     }
   }
   ```

3. **Aspect Ratio Boxes**
   ```css
   .aspect-ratio-box {
     aspect-ratio: 16 / 9;
     width: 100%;
   }
   ```

---

## 🎯 This Project's Specific Patterns

### Carousel Navigation Buttons
```css
.carousel-btn {
  width: 50px;
  height: 50px;
}

@media (max-width: 768px) {
  .carousel-btn {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .carousel-btn {
    width: 35px;
    height: 35px;
  }
}
```

### Section Headers
```css
.section-title {
  font-size: 3rem;
  letter-spacing: 0.2rem;
}

@media (max-width: 1024px) {
  .section-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
    letter-spacing: 0.15rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.6rem;
    letter-spacing: 0.1rem;
  }
}
```

---

## 📱 Device-Specific Hacks (Use Sparingly!)

```css
/* iOS Safari specific */
@supports (-webkit-touch-callout: none) {
  .element {
    /* iOS specific styles */
  }
}

/* Android Chrome specific */
@supports not (-webkit-touch-callout: none) {
  .element {
    /* Android specific styles */
  }
}

/* Hide scrollbar but keep functionality */
.scrollable {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollable::-webkit-scrollbar {
  display: none;
}
```

---

## ✅ Final Checklist Before Deployment

- [ ] All components responsive at 5 breakpoints
- [ ] Mobile menu functional
- [ ] All carousels work on touch devices
- [ ] Forms are usable on mobile
- [ ] No horizontal scroll on any page
- [ ] Images load and scale correctly
- [ ] Typography readable at all sizes
- [ ] Touch targets minimum 44px
- [ ] Tested on real iPhone/Android device
- [ ] Tested in portrait and landscape
- [ ] Performance score > 90 on mobile
- [ ] No console errors on mobile
- [ ] All links/buttons accessible

---

**Remember**: If it works on desktop but not on mobile, 90% of the time it's a `max-width` or `flex-direction` issue!

---

*Keep this handy while developing!*
