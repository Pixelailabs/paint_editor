"""
@author: PixelaiLabs.com
@title: Paint Editor
@nickname: Paint Editor
@description: Load and edit images in a paint-like editor. Select image file and draw on it.
"""

import torch
import base64
import os
from PIL import Image
import numpy as np
from io import BytesIO
import folder_paths
import json
import server

def tensor_to_pil(tensor):
    """Convert tensor to PIL Image"""
    i = 255. * tensor.cpu().numpy()
    img = Image.fromarray(np.clip(i, 0, 255).astype(np.uint8))
    return img

def create_mask_from_drawing(edited_image, original_image):
    """Create a mask from the differences between original and edited image"""
    # Convert images to numpy arrays
    edited_array = np.array(edited_image)
    original_array = np.array(original_image)
    
    # Calculate difference
    diff = np.abs(edited_array.astype(np.float32) - original_array.astype(np.float32))
    
    # Create mask where there are differences (drawings)
    # Sum across RGB channels and threshold
    diff_sum = np.sum(diff, axis=2)
    drawing_mask = (diff_sum > 30).astype(np.uint8) * 255
    
    # Simple flood fill to find enclosed areas
    h, w = drawing_mask.shape
    
    # Create a slightly larger canvas for flood fill
    padded = np.zeros((h + 2, w + 2), dtype=np.uint8)
    padded[1:-1, 1:-1] = drawing_mask
    
    # Flood fill from edges - mark all areas reachable from outside
    flooded = padded.copy()
    
    # Flood fill from all four edges
    for i in range(h + 2):
        # Left and right edges
        if flooded[i, 0] == 0:
            flood_fill_simple(flooded, i, 0, 128)
        if flooded[i, w + 1] == 0:
            flood_fill_simple(flooded, i, w + 1, 128)
    
    for j in range(w + 2):
        # Top and bottom edges  
        if flooded[0, j] == 0:
            flood_fill_simple(flooded, 0, j, 128)
        if flooded[h + 1, j] == 0:
            flood_fill_simple(flooded, h + 1, j, 128)
    
    # Extract the center area and create final mask
    center_area = flooded[1:-1, 1:-1]
    
    # Areas that are 0 (not flooded and not drawn lines) are enclosed
    enclosed_mask = (center_area == 0).astype(np.float32)
    
    return enclosed_mask

def flood_fill_simple(image, start_row, start_col, new_value):
    """Simple flood fill implementation"""
    if start_row < 0 or start_row >= image.shape[0] or start_col < 0 or start_col >= image.shape[1]:
        return
    
    original_value = image[start_row, start_col]
    if original_value == new_value or original_value == 255:
        return
    
    stack = [(start_row, start_col)]
    
    while stack:
        row, col = stack.pop()
        
        if row < 0 or row >= image.shape[0] or col < 0 or col >= image.shape[1]:
            continue
            
        if image[row, col] != original_value:
            continue
            
        image[row, col] = new_value
        
        # Add neighboring pixels
        stack.extend([(row+1, col), (row-1, col), (row, col+1), (row, col-1)])

def pil_to_tensor(img):
    """Convert PIL Image to tensor"""
    img_array = np.array(img).astype(np.float32) / 255.0
    return torch.from_numpy(img_array)[None,]

def pil_to_mask_tensor(mask_array):
    """Convert mask array to ComfyUI mask tensor"""
    return torch.from_numpy(mask_array)[None,]

# API endpoint to save edited images
@server.PromptServer.instance.routes.post("/paint_editor/save")
async def save_edited_image(request):
    try:
        data = await request.json()
        node_id = data.get('node_id')
        image_data = data.get('image_data')
        
        if node_id and image_data:
            PaintEditor.edited_images[str(node_id)] = image_data
            return server.web.json_response({"status": "success"})
        else:
            return server.web.json_response({"status": "error", "message": "Missing data"}, status=400)
    except Exception as e:
        return server.web.json_response({"status": "error", "message": str(e)}, status=500)

class PaintEditor:
    """
    Paint editor node - load and edit images
    """
    
    # Class-level storage for edited images
    edited_images = {}
    
    def __init__(self):
        pass
        
    @classmethod
    def INPUT_TYPES(cls):
        # Get list of image files
        input_dir = folder_paths.get_input_directory()
        files = []
        if os.path.exists(input_dir):
            for f in os.listdir(input_dir):
                if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp')):
                    files.append(f)
        
        return {
            "required": {
                "image_file": (sorted(files), {"image_upload": True}),
            },
            "hidden": {
                "unique_id": "UNIQUE_ID",
            }
        }
    
    RETURN_TYPES = ("IMAGE", "MASK", "IMAGE")
    RETURN_NAMES = ("edited_image", "drawn_mask", "original_image")
    FUNCTION = "edit_image"
    CATEGORY = "image"
    
    def IS_CHANGED(s, image_file, unique_id):
        # Check if we have edited data for this node
        if str(unique_id) in PaintEditor.edited_images:
            return PaintEditor.edited_images[str(unique_id)]
        return image_file
    
    def edit_image(self, image_file, unique_id=None):
        """Main function - returns edited image, mask, and original image"""
        
        # Load the original image
        image_path = folder_paths.get_annotated_filepath(image_file)
        original_image = Image.open(image_path)
        
        # Preserve original format and quality
        original_format = original_image.format
        original_size = original_image.size
        
        # Convert to RGB if necessary but preserve original mode info
        if original_image.mode != 'RGB':
            original_image = original_image.convert('RGB')
        
        # Convert original image to tensor (always return this)
        original_tensor = pil_to_tensor(original_image)
        
        # Check if we have an edited version
        node_id_str = str(unique_id) if unique_id else None
        
        if node_id_str and node_id_str in PaintEditor.edited_images:
            try:
                edited_data = PaintEditor.edited_images[node_id_str]
                if edited_data and edited_data != "":
                    # Decode base64 image
                    if ',' in edited_data:
                        header, data = edited_data.split(',', 1)
                        image_data = base64.b64decode(data)
                        edited_image = Image.open(BytesIO(image_data))
                        
                        # Ensure RGB mode
                        if edited_image.mode != 'RGB':
                            edited_image = edited_image.convert('RGB')
                        
                        # Resize edited image back to original dimensions if different
                        if edited_image.size != original_size:
                            edited_image = edited_image.resize(original_size, Image.Resampling.LANCZOS)
                        
                        # Create mask from drawing differences
                        try:
                            mask_array = create_mask_from_drawing(edited_image, original_image)
                            mask_tensor = pil_to_mask_tensor(mask_array)
                        except Exception as e:
                            print(f"Error creating mask: {e}")
                            # Create empty mask as fallback
                            mask_tensor = torch.zeros((1, original_size[1], original_size[0]), dtype=torch.float32)
                        
                        # Convert edited image to tensor
                        edited_tensor = pil_to_tensor(edited_image)
                        return (edited_tensor, mask_tensor, original_tensor)
            except Exception as e:
                print(f"Error loading edited image: {e}")
        
        # Return original image as edited, empty mask, and original if no edit available
        empty_mask = torch.zeros((1, original_size[1], original_size[0]), dtype=torch.float32)
        return (original_tensor, empty_mask, original_tensor)
    
    @classmethod 
    def save_edited_image(cls, node_id, image_data):
        """Save edited image data"""
        cls.edited_images[str(node_id)] = image_data
        print(f"Saved edited image for node {node_id}")

# Web directory
WEB_DIRECTORY = "web"

# Node mappings
NODE_CLASS_MAPPINGS = {
    "PaintEditor": PaintEditor
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "PaintEditor": "🎨 Paint Editor"
}