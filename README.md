# 🎨 Paint Editor Node for ComfyUI

**Author:** PixelaiLabs.Com

A professional paint editor node that provides MS Paint-like editing capabilities directly within ComfyUI workflows. Load images, draw on them with precision tools, and output both edited images and masks for advanced image processing.

## Features

### Core Functionality
- **Image Loading**: Load images directly from ComfyUI's input directory
- **Interactive Drawing**: Full-featured paint editor in a popup window
- **High Precision**: Maintains original image quality and resolution
- **Mask Generation**: Automatic mask creation from enclosed drawing areas
- **Seamless Integration**: Direct integration with ComfyUI workflows

### Drawing Tools
- **Variable Brush Size**: 1-100px brush sizes with real-time preview
- **Color Picker**: Full color selection with hex color support
- **Undo/Redo**: Complete drawing history with keyboard shortcuts (Ctrl+Z/Y)
- **Clear All**: Reset to original image with confirmation
- **Save System**: Non-destructive editing with instant preview

### Advanced Features
- **Touch Support**: Works on tablets and touch devices
- **Smart Scaling**: Large images are visually scaled while maintaining full resolution
- **Mask Detection**: Automatically detects enclosed areas for masking
- **Real-time Updates**: Instant preview of changes in ComfyUI

## Installation

### Method 1: Manual Installation

1. **Create the directory structure:**
```
ComfyUI/custom_nodes/paint_editor/
├── __init__.py
└── web/
    └── paint_editor.js
```

2. **Copy the files:**
   - Save the provided Python code as `__init__.py`
   - Save the JavaScript code as `web/paint_editor.js`

3. **Restart ComfyUI:**
   - Completely restart your ComfyUI instance
   - The node will appear in the "image" category

### Method 2: Git Clone
```bash
cd ComfyUI/custom_nodes/
git clone https://github.com/Pixelailabs/paint_editor.git
```

## Usage

### Basic Workflow

1. **Add the Node**: Find "🎨 Paint Editor" in the image category and add it to your workflow

2. **Load an Image**: Place your images in `ComfyUI/input/` directory and select from dropdown

3. **Open Paint Editor**: Click the "🎨 Open Paint Editor" button - a new window opens with your image

4. **Draw and Edit**: Use brush tools, adjust size and color, use undo/redo for precision

5. **Save and Apply**: Click "💾 Save & Close" when finished, then execute the node

### Step-by-Step Guide

#### Loading Images
1. Copy your images to: `ComfyUI/input/your_image.jpg`
2. In the node, select your image from the dropdown
3. The image is now ready for editing

#### Drawing Process
1. Click "🎨 Open Paint Editor"
2. Use toolbar controls:
   - **Brush Size**: Adjust with slider (1-100px)
   - **Color**: Click color picker to choose
   - **Undo/Redo**: Use buttons or Ctrl+Z/Y
3. Draw directly on the image
4. Save changes when complete

## Outputs

The Paint Editor node provides two outputs:

### 1. Edited Image (IMAGE)
- **Type**: ComfyUI IMAGE tensor
- **Quality**: Maintains original image resolution and quality
- **Format**: RGB image with all your drawings applied
- **Usage**: Connect to any node that accepts IMAGE input

### 2. Drawn Mask (MASK)
- **Type**: ComfyUI MASK tensor
- **Content**: White areas = enclosed regions, Black areas = background
- **Detection**: Automatically finds areas completely surrounded by drawings
- **Usage**: Perfect for inpainting, background removal, object selection

## Drawing Tools

### Brush Controls
| Tool | Range | Description |
|------|-------|-------------|
| **Brush Size** | 1-100px | Variable brush size with real-time feedback |
| **Color Picker** | Full spectrum | Choose any color for drawing |
| **Opacity** | Automatic | Smooth brush strokes with natural blending |

### Navigation Controls
| Button | Shortcut | Function |
|--------|----------|----------|
| **↶ Undo** | Ctrl+Z | Undo last drawing action |
| **↷ Redo** | Ctrl+Y | Redo previously undone action |
| **🗑️ Clear All** | - | Reset to original image |
| **💾 Save & Close** | - | Apply changes and return to ComfyUI |
| **❌ Cancel** | - | Discard changes and close |

## Workflow Examples

### Example 1: Object Selection and Inpainting
```
[Paint Editor] → [Edited Image] → [Inpainting Node]
             → [Drawn Mask] ────┘
```

### Example 2: Background Removal
```
[Paint Editor] → [Drawn Mask] → [Mask Operations] → [Background Removal]
```

### Example 3: Creative Enhancement
```
[Paint Editor] → [Edited Image] → [Image Enhancement] → [Final Output]
```

### Mask Generation Workflow
1. **Draw Outline**: Create a closed loop around your subject
2. **Automatic Detection**: Node automatically detects enclosed area
3. **Mask Output**: Use the mask for selective editing
4. **Apply Effects**: Use mask with other nodes for targeted effects

## Advanced Techniques

### Creating Perfect Masks
1. **Continuous Lines**: Ensure your outline forms a complete loop
2. **Zoom Control**: Use browser zoom for precision on detailed areas
3. **Multiple Passes**: Draw rough outline first, then refine with undo/redo
4. **Quality Check**: Execute node to verify mask quality before proceeding

### High-Resolution Editing
- **Full Resolution**: Canvas maintains original image resolution
- **Display Scaling**: Large images are scaled for comfortable editing
- **Quality Preservation**: No quality loss during editing process
- **Precision Drawing**: Mouse coordinates mapped accurately to full resolution

### Workflow Integration
- **Non-Destructive**: Original image is never modified
- **Session Persistence**: Edits are saved until node is reset
- **Batch Compatible**: Can be used in batch processing workflows
- **Memory Efficient**: Only stores drawing data, not full images

## Troubleshooting

### Common Issues

**Issue**: Node doesn't appear in ComfyUI
- **Solution**: 
  1. Verify files are in correct location
  2. Restart ComfyUI completely
  3. Check console for error messages

**Issue**: Paint editor window doesn't open
- **Solution**:
  1. Check if popup blocker is enabled
  2. Ensure image is selected in dropdown
  3. Try refreshing ComfyUI page

**Issue**: Drawings don't appear in output
- **Solution**:
  1. Click "Save & Close" before executing node
  2. Verify node execution completed
  3. Check if image was modified in editor

**Issue**: Mask output is empty
- **Solution**:
  1. Ensure drawn lines form closed loops
  2. Check brush size isn't too small
  3. Verify sufficient contrast in drawing

### Performance Tips

- **Large Images**: May take longer to load initially
- **Complex Drawings**: Extensive drawing history may slow undo/redo
- **Memory Usage**: Close editor window when not in use
- **Browser Performance**: Use Chrome/Firefox for best compatibility

## Technical Notes

### Requirements
- **ComfyUI**: Latest version recommended
- **Browser**: Chrome, Firefox, Safari, Edge
- **Memory**: Sufficient RAM for image resolution
- **Storage**: Space in ComfyUI/input/ directory for images

### Image Format Support
- **Input**: PNG, JPG, JPEG, GIF, BMP, WEBP
- **Output**: High-quality PNG format
- **Color Modes**: RGB (RGBA converted automatically)
- **Resolution**: Unlimited (limited by system memory)

### API Endpoints
The node creates a REST API endpoint:
- **POST** `/paint_editor/save` - Saves edited image data

## Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with detailed description

## License

This project is licensed under the MIT License. Feel free to use in personal and commercial projects.

## Links

- **Author**: PixelaiLabs.Com

## Acknowledgments

- ComfyUI community for the excellent framework
- Contributors and testers
- Users providing feedback and suggestions

---

**Happy Painting! 🎨**

*Created with ❤️ by PixelaiLabs.Com*
