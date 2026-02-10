# Scripts

## convert-hero-images.sh

Converts the hero slideshow PNG images to WebP format, reducing total size by ~86%.

### Prerequisites

Install the WebP tools (macOS):

```bash
brew install webp
```

### Usage

```bash
# From the repo root:
./scripts/convert-hero-images.sh          # default quality 80
./scripts/convert-hero-images.sh -q 90    # custom quality (0-100)
```

### What it does

1. Converts all PNGs in `assets/hero/` to WebP
2. Converts `projects/guadarramaski/assets/acc_snow.png` to WebP
3. Prints a before/after size report

### When to run

- After adding or replacing a hero image
- After editing an existing hero PNG (e.g. resizing, cropping)
- The original PNGs are kept so you can re-convert at different quality levels

### Adding a new hero image

1. Place the PNG in `assets/hero/`
2. Add its path to the `HERO_PNGS` array in `convert-hero-images.sh`
3. Run the script
4. Reference the `.webp` version in `index.html` CSS (`.hero-slide:nth-child(N)`)

### Current hero images

| Source PNG | WebP output | Used in |
|---|---|---|
| `assets/hero/habitat.png` | `assets/hero/habitat.webp` | Slide 1 |
| `assets/hero/insolation.png` | `assets/hero/insolation.webp` | Slide 2 |
| `projects/guadarramaski/assets/acc_snow.png` | `projects/guadarramaski/assets/acc_snow.webp` | Slide 3 |
| `assets/hero/ndvi.png` | `assets/hero/ndvi.webp` | Slide 4 |
| `assets/hero/aspect.png` | `assets/hero/aspect.webp` | Slide 5 |
| `assets/hero/ch.png` | `assets/hero/ch.webp` | Slide 6 |
