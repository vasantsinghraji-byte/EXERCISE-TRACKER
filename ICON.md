# App icon

The icon is a square AI adaptation of the user-supplied illustration, created with the built-in image generation/editing tool. It is not a pixel-identical crop of the original attachment.

Master: `app-icon-source.png`. Installation assets: `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` (180px), and `favicon-32.png`.

To regenerate the resized PNGs with Playwright installed:

```sh
node scripts/build-icons.cjs app-icon-source.png
```

An optional second argument specifies the Playwright package path.

## Image-edit prompt

Edit target: the user's most recently attached portrait illustration of Hanuman behind a seated muscular man holding a barbell in a gym. Create a square app-icon asset from this exact image. Preserve the existing artwork, faces, poses, clothing, barbell, colors, and lighting as faithfully as possible. Fit the entire original portrait centrally inside a square canvas, extending only the gym background at the left and right to fill the extra width. Do not crop off heads, hands, feet, or barbell ends; do not redraw or redesign the subjects. No added text, logo, border, rounded corners, or badges. Output one opaque square PNG intended for 512px and 192px app icon derivatives. This is only an aspect-ratio adaptation of the supplied image, not a new illustration.
