# SVG Optimization Process

## Large Illustrations (Halftone Style)

The following SVGs are too large for browser rendering and must be converted to WebP:

- `assets/svg/2.svg` (~4.7MB) - skull illustration
- `assets/svg/7.svg` (~2.5MB) - illustration
- `assets/svg/8.svg` (~5MB) - illustration

### Conversion Process

1. Convert SVG to high-resolution PNG:
   ```bash
   rsvg-convert -w 1920 -h 1080 -f png assets/svg/2.svg -o assets/svg/2.png
   ```

2. Convert PNG to optimized WebP:
   ```bash
   cwebp -q 80 assets/svg/2.png -o apps/web/public/illustrations/skull.webp
   ```

3. Delete intermediate PNG files

### Usage in App

Use CSS mask to apply theme color to the illustration:

```css
.hero-illustration {
  -webkit-mask-image: url('/illustrations/skull.webp');
  mask-image: url('/illustrations/skull.webp');
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  background-color: var(--color-primary);
}
```

This allows the illustration to change color with the theme without the overhead of a massive SVG.

## Small SVGs (Line/Blob Shapes)

The following SVGs are small enough to stay as SVG but should be optimized:

- `assets/svg/10.svg` (~207KB) - blob shape
- `assets/svg/12.svg` (~71KB) - line shape

### Optimization Steps

1. Run through SVGO:
   ```bash
   npx svgo assets/svg/10.svg -o apps/web/public/shapes/blob.svg
   ```

2. Replace fixed colors with `currentColor`:
   - Change `fill="#FF2B51"` to `fill="currentColor"`
   - Change `stroke="#FF2B51"` to `stroke="currentColor"`

3. Apply theme color via CSS:
   ```css
   .blob-shape {
     color: var(--color-primary);
   }
   ```

## Logo SVGs

The following logo SVGs have been consolidated into a single React component:
- `assets/svg/1.svg`
- `assets/svg/6.svg`
- `assets/svg/9.svg`
- `assets/svg/11.svg`

These are no longer needed in the app. Use `@zenith/shared/Logo` component instead.
