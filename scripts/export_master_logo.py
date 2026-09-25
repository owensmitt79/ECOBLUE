from PIL import Image, ImageFilter
import numpy as np
import shutil
import os

# 1. Backup original boxed image if not already backed up
original_path = 'public/images/logo.png'
backup_path = 'public/images/logo-original-boxed.png'
if not os.path.exists(backup_path):
    shutil.copyfile(original_path, backup_path)
    print("Backed up original to logo-original-boxed.png")

# Load original
img = Image.open(backup_path).convert('RGB')
arr = np.array(img, dtype=np.float64)
H, W = arr.shape[:2]

bg = np.array([254.0, 254.0, 254.0])
diff = np.maximum(0, bg - arr)
color_dist = np.sqrt(np.sum(np.square(diff), axis=2))

# Identify solid logo core (color_dist >= 30)
solid_mask = color_dist >= 30.0

# Anti-aliased alpha
t_low = 18.0
t_high = 70.0
raw_alpha = np.clip((color_dist - t_low) / (t_high - t_low), 0.0, 1.0)
smooth_alpha = raw_alpha * raw_alpha * (3.0 - 2.0 * raw_alpha) # Hermite smoothstep
smooth_alpha = np.where(solid_mask, 1.0, smooth_alpha)

# Only keep alpha within 2px of solid mask to eliminate JPEG compression artifacts & ringing
solid_pil = Image.fromarray((solid_mask * 255).astype(np.uint8), mode='L')
valid_band = np.array(solid_pil.filter(ImageFilter.MaxFilter(5))) > 0
clean_alpha = np.where(valid_band, smooth_alpha, 0.0)

# Unblend color from white background:
# C_fg = (I - (1 - alpha) * 254) / alpha
unblended = np.zeros_like(arr)
for c in range(3):
    c_unblend = (arr[:, :, c] - (1.0 - clean_alpha) * bg[c]) / np.maximum(clean_alpha, 0.15)
    unblended[:, :, c] = np.clip(c_unblend, 0, 255)

# Color bleed from nearest solid pixels to prevent dark-background halos
dilated_rgb = unblended.copy()
known_mask = clean_alpha >= 0.7

for step in range(3):
    for c in range(3):
        ch_img = Image.fromarray(dilated_rgb[:, :, c].astype(np.uint8))
        blurred = np.array(ch_img.filter(ImageFilter.BoxBlur(1)), dtype=np.float64)
        dilated_rgb[:, :, c] = np.where(known_mask, dilated_rgb[:, :, c], blurred)
    known_pil = Image.fromarray((known_mask * 255).astype(np.uint8), mode='L')
    known_mask = np.array(known_pil.filter(ImageFilter.MaxFilter(3))) > 0

final_rgb = np.zeros_like(arr)
for c in range(3):
    blend_w = np.clip((clean_alpha - 0.15) / 0.55, 0.0, 1.0)
    final_rgb[:, :, c] = blend_w * unblended[:, :, c] + (1.0 - blend_w) * dilated_rgb[:, :, c]

# Measure exact bounding box of the logo elements
vis = clean_alpha > 0.02
y_idx, x_idx = np.where(vis)
ymin, ymax = y_idx.min(), y_idx.max()
xmin, xmax = x_idx.min(), x_idx.max()

logo_w = xmax - xmin + 1
logo_h = ymax - ymin + 1
print(f"Precise logo core dimensions: {logo_w}px wide x {logo_h}px high")

# Crop exactly to the logo
logo_crop_rgb = final_rgb[ymin:ymax+1, xmin:xmax+1]
logo_crop_alpha = clean_alpha[ymin:ymax+1, xmin:xmax+1]

# User requested:
# "Center the extracted logo and export it as a high-resolution PNG with a transparent background.
# The final result must contain ONLY the logo and nothing else.
# Completely remove the rectangular picture/frame surrounding the logo.
# Do not keep any part of the frame, background, border, or colored area.
# The final image should be tightly cropped around the logo with transparent space outside the logo."
#
# Let's add uniform, clean, centered transparent margin (e.g. 24px)
pad = 24
out_w = logo_w + 2 * pad
out_h = logo_h + 2 * pad

final_rgba = np.zeros((out_h, out_w, 4), dtype=np.uint8)
final_rgba[pad:pad+logo_h, pad:pad+logo_w, :3] = np.round(logo_crop_rgb).astype(np.uint8)
final_rgba[pad:pad+logo_h, pad:pad+logo_w, 3] = np.round(logo_crop_alpha * 255.0).astype(np.uint8)

export_img = Image.fromarray(final_rgba, 'RGBA')

# Export to all primary logo asset paths
export_img.save('public/images/logo.png', 'PNG', optimize=True)
export_img.save('public/images/logo-transparent.png', 'PNG', optimize=True)
export_img.save('public/images/ecoblue-logo-transparent.png', 'PNG', optimize=True)

print(f"Exported clean transparent PNG: {out_w}x{out_h} to public/images/logo.png and logo-transparent.png")
