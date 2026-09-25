from PIL import Image
import numpy as np

img = Image.open('public/images/logo.png').convert('RGB')
arr = np.array(img)

# Crop towers: y=250..450, x=350..600
tower_crop = Image.fromarray(arr[250:450, 350:600])
tower_crop.save('public/images/tower_crop.png')
print("Saved tower_crop.png")
