<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paint Editor Node for ComfyUI</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #24292f;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        
        h1, h2, h3, h4 {
            color: #1f2328;
            border-bottom: 1px solid #d1d9e0;
            padding-bottom: 8px;
        }
        
        h1 {
            font-size: 2em;
            margin-bottom: 16px;
        }
        
        h2 {
            font-size: 1.5em;
            margin-top: 24px;
            margin-bottom: 16px;
        }
        
        h3 {
            font-size: 1.25em;
            margin-top: 20px;
            margin-bottom: 12px;
        }
        
        code {
            background-color: #f6f8fa;
            border-radius: 6px;
            font-size: 85%;
            margin: 0;
            padding: 0.2em 0.4em;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
        }
        
        pre {
            background-color: #f6f8fa;
            border-radius: 6px;
            font-size: 85%;
            line-height: 1.45;
            overflow: auto;
            padding: 16px;
            margin: 16px 0;
        }
        
        pre code {
            background-color: transparent;
            border: 0;
            font-size: 100%;
            margin: 0;
            padding: 0;
            word-break: normal;
        }
        
        table {
            border-collapse: collapse;
            border-spacing: 0;
            display: block;
            max-width: 100%;
            overflow: auto;
            width: max-content;
            margin: 16px 0;
        }
        
        table th, table td {
            border: 1px solid #d1d9e0;
            padding: 6px 13px;
            text-align: left;
        }
        
        table th {
            background-color: #f6f8fa;
            font-weight: 600;
        }
        
        .badge {
            background-color: #0969da;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .feature-card {
            border: 1px solid #d1d9e0;
            border-radius: 8px;
            padding: 16px;
            background-color: #f6f8fa;
        }
        
        .workflow-step {
            background-color: #dbeafe;
            border-left: 4px solid #3b82f6;
            margin: 8px 0;
            padding: 12px 16px;
        }
        
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            margin: 16px 0;
            padding: 12px 16px;
            border-radius: 4px;
        }
        
        .success {
            background-color: #d4edda;
            border-left: 4px solid #28a745;
            margin: 16px 0;
            padding: 12px 16px;
            border-radius: 4px;
        }
        
        a {
            color: #0969da;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        .toc {
            background-color: #f6f8fa;
            border: 1px solid #d1d9e0;
            border-radius: 6px;
            padding: 16px;
            margin: 20px 0;
        }
        
        .toc ul {
            margin: 0;
            padding-left: 20px;
        }
    </style>
</head>
<body>
    <h1>🎨 Paint Editor Node for ComfyUI</h1>
    
    <p><strong>Author:</strong> <a href="https://pixelailabs.com">PixelaiLabs.Com</a></p>
    
    <p>A professional paint editor node that provides MS Paint-like editing capabilities directly within ComfyUI workflows. Load images, draw on them with precision tools, and output both edited images and masks for advanced image processing.</p>
    
    <div class="toc">
        <h2>📋 Table of Contents</h2>
        <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#installation">Installation</a></li>
            <li><a href="#usage">Usage</a></li>
            <li><a href="#outputs">Outputs</a></li>
            <li><a href="#drawing-tools">Drawing Tools</a></li>
            <li><a href="#workflow-examples">Workflow Examples</a></li>
            <li><a href="#troubleshooting">Troubleshooting</a></li>
            <li><a href="#license">License</a></li>
        </ul>
    </div>
    
    <h2 id="features">✨ Features</h2>
    
    <div class="feature-grid">
        <div class="feature-card">
            <h3>Core Functionality</h3>
            <ul>
                <li><strong>🖼️ Image Loading:</strong> Load images directly from ComfyUI's input directory</li>
                <li><strong>🎨 Interactive Drawing:</strong> Full-featured paint editor in a popup window</li>
                <li><strong>📐 High Precision:</strong> Maintains original image quality and resolution</li>
                <li><strong>🎯 Mask Generation:</strong> Automatic mask creation from enclosed drawing areas</li>
                <li><strong>💾 Seamless Integration:</strong> Direct integration with ComfyUI workflows</li>
            </ul>
        </div>
        
        <div class="feature-card">
            <h3>Drawing Tools</h3>
            <ul>
                <li><strong>🖌️ Variable Brush Size:</strong> 1-100px brush sizes with real-time preview</li>
                <li><strong>🌈 Color Picker:</strong> Full color selection with hex color support</li>
                <li><strong>↶ Undo/Redo:</strong> Complete drawing history with keyboard shortcuts</li>
                <li><strong>🗑️ Clear All:</strong> Reset to original image with confirmation</li>
                <li><strong>💾 Save System:</strong> Non-destructive editing with instant preview</li>
            </ul>
        </div>
        
        <div class="feature-card">
            <h3>Advanced Features</h3>
            <ul>
                <li><strong>📱 Touch Support:</strong> Works on tablets and touch devices</li>
                <li><strong>🔍 Smart Scaling:</strong> Large images are visually scaled while maintaining full resolution</li>
                <li><strong>🎭 Mask Detection:</strong> Automatically detects enclosed areas for masking</li>
                <li><strong>⚡ Real-time Updates:</strong> Instant preview of changes in ComfyUI</li>
            </ul>
        </div>
    </div>
    
    <h2 id="installation">🚀 Installation</h2>
    
    <h3>Method 1: Manual Installation</h3>
    
    <div class="workflow-step">
        <strong>1. Create the directory structure:</strong>
        <pre><code>ComfyUI/custom_nodes/paint_editor/
├── __init__.py
└── web/
    └── paint_editor.js</code></pre>
    </div>
    
    <div class="workflow-step">
        <strong>2. Copy the files:</strong>
        <ul>
            <li>Save the provided Python code as <code>__init__.py</code></li>
            <li>Save the JavaScript code as <code>web/paint_editor.js</code></li>
        </ul>
    </div>
    
    <div class="workflow-step">
        <strong>3. Restart ComfyUI:</strong>
        <ul>
            <li>Completely restart your ComfyUI instance</li>
            <li>The node will appear in the "image" category</li>
        </ul>
    </div>
    
    <h3>Method 2: Git Clone</h3>
    <pre><code>cd ComfyUI/custom_nodes/
git clone [repository-url] paint_editor</code></pre>
    
    <h2 id="usage">📖 Usage</h2>
    
    <h3>Basic Workflow</h3>
    
    <div class="workflow-step">
        <strong>1. Add the Node:</strong><br>
        Find "🎨 Paint Editor" in the image category and add it to your workflow
    </div>
    
    <div class="workflow-step">
        <strong>2. Load an Image:</strong><br>
        Place your images in <code>ComfyUI/input/</code> directory and select from dropdown
    </div>
    
    <div class="workflow-step">
        <strong>3. Open Paint Editor:</strong><br>
        Click the "🎨 Open Paint Editor" button - a new window opens with your image
    </div>
    
    <div class="workflow-step">
        <strong>4. Draw and Edit:</strong><br>
        Use brush tools, adjust size and color, use undo/redo for precision
    </div>
    
    <div class="workflow-step">
        <strong>5. Save and Apply:</strong><br>
        Click "💾 Save & Close" when finished, then execute the node
    </div>
    
    <h2 id="outputs">📤 Outputs</h2>
    
    <p>The Paint Editor node provides two outputs:</p>
    
    <table>
        <thead>
            <tr>
                <th>Output</th>
                <th>Type</th>
                <th>Description</th>
                <th>Usage</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Edited Image</strong></td>
                <td><span class="badge">IMAGE</span></td>
                <td>RGB image with all drawings applied, maintains original quality</td>
                <td>Connect to any node accepting IMAGE input</td>
            </tr>
            <tr>
                <td><strong>Drawn Mask</strong></td>
                <td><span class="badge">MASK</span></td>
                <td>White areas = enclosed regions, Black = background</td>
                <td>Perfect for inpainting, background removal, object selection</td>
            </tr>
        </tbody>
    </table>
    
    <h2 id="drawing-tools">🛠️ Drawing Tools</h2>
    
    <h3>Brush Controls</h3>
    <table>
        <thead>
            <tr>
                <th>Tool</th>
                <th>Range</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Brush Size</strong></td>
                <td>1-100px</td>
                <td>Variable brush size with real-time feedback</td>
            </tr>
            <tr>
                <td><strong>Color Picker</strong></td>
                <td>Full spectrum</td>
                <td>Choose any color for drawing</td>
            </tr>
            <tr>
                <td><strong>Opacity</strong></td>
                <td>Automatic</td>
                <td>Smooth brush strokes with natural blending</td>
            </tr>
        </tbody>
    </table>
    
    <h3>Navigation Controls</h3>
    <table>
        <thead>
            <tr>
                <th>Button</th>
                <th>Shortcut</th>
                <th>Function</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>↶ Undo</strong></td>
                <td>Ctrl+Z</td>
                <td>Undo last drawing action</td>
            </tr>
            <tr>
                <td><strong>↷ Redo</strong></td>
                <td>Ctrl+Y</td>
                <td>Redo previously undone action</td>
            </tr>
            <tr>
                <td><strong>🗑️ Clear All</strong></td>
                <td>-</td>
                <td>Reset to original image</td>
            </tr>
            <tr>
                <td><strong>💾 Save & Close</strong></td>
                <td>-</td>
                <td>Apply changes and return to ComfyUI</td>
            </tr>
            <tr>
                <td><strong>❌ Cancel</strong></td>
                <td>-</td>
                <td>Discard changes and close</td>
            </tr>
        </tbody>
    </table>
    
    <h2 id="workflow-examples">🔧 Workflow Examples</h2>
    
    <h3>Example 1: Object Selection and Inpainting</h3>
    <pre><code>[Paint Editor] → [Edited Image] → [Inpainting Node]
             → [Drawn Mask] ────┘</code></pre>
    
    <h3>Example 2: Background Removal</h3>
    <pre><code>[Paint Editor] → [Drawn Mask] → [Mask Operations] → [Background Removal]</code></pre>
    
    <h3>Example 3: Creative Enhancement</h3>
    <pre><code>[Paint Editor] → [Edited Image] → [Image Enhancement] → [Final Output]</code></pre>
    
    <div class="success">
        <h4>Mask Generation Workflow</h4>
        <ol>
            <li><strong>Draw Outline:</strong> Create a closed loop around your subject</li>
            <li><strong>Automatic Detection:</strong> Node automatically detects enclosed area</li>
            <li><strong>Mask Output:</strong> Use the mask for selective editing</li>
            <li><strong>Apply Effects:</strong> Use mask with other nodes for targeted effects</li>
        </ol>
    </div>
    
    <h2 id="troubleshooting">🔍 Troubleshooting</h2>
    
    <h3>Common Issues</h3>
    
    <div class="warning">
        <strong>Issue:</strong> Node doesn't appear in ComfyUI<br>
        <strong>Solution:</strong>
        <ol>
            <li>Verify files are in correct location</li>
            <li>Restart ComfyUI completely</li>
            <li>Check console for error messages</li>
        </ol>
    </div>
    
    <div class="warning">
        <strong>Issue:</strong> Paint editor window doesn't open<br>
        <strong>Solution:</strong>
        <ol>
            <li>Check if popup blocker is enabled</li>
            <li>Ensure image is selected in dropdown</li>
            <li>Try refreshing ComfyUI page</li>
        </ol>
    </div>
    
    <div class="warning">
        <strong>Issue:</strong> Drawings don't appear in output<br>
        <strong>Solution:</strong>
        <ol>
            <li>Click "Save & Close" before executing node</li>
            <li>Verify node execution completed</li>
            <li>Check if image was modified in editor</li>
        </ol>
    </div>
    
    <h3>Performance Tips</h3>
    <ul>
        <li><strong>Large Images:</strong> May take longer to load initially</li>
        <li><strong>Complex Drawings:</strong> Extensive drawing history may slow undo/redo</li>
        <li><strong>Memory Usage:</strong> Close editor window when not in use</li>
        <li><strong>Browser Performance:</strong> Use Chrome/Firefox for best compatibility</li>
    </ul>
    
    <h2>📝 Technical Notes</h2>
    
    <h3>Requirements</h3>
    <ul>
        <li><strong>ComfyUI:</strong> Latest version recommended</li>
        <li><strong>Browser:</strong> Chrome, Firefox, Safari, Edge</li>
        <li><strong>Memory:</strong> Sufficient RAM for image resolution</li>
        <li><strong>Storage:</strong> Space in ComfyUI/input/ directory for images</li>
    </ul>
    
    <h3>Image Format Support</h3>
    <ul>
        <li><strong>Input:</strong> PNG, JPG, JPEG, GIF, BMP, WEBP</li>
        <li><strong>Output:</strong> High-quality PNG format</li>
        <li><strong>Color Modes:</strong> RGB (RGBA converted automatically)</li>
        <li><strong>Resolution:</strong> Unlimited (limited by system memory)</li>
    </ul>
    
    <h2 id="license">📄 License</h2>
    
    <p>This project is licensed under the MIT License. Feel free to use in personal and commercial projects.</p>
    
    <h2>🔗 Links</h2>
    
    <ul>
        <li><strong>Author:</strong> <a href="https://pixelailabs.com">PixelaiLabs.Com</a></li>
        <li><strong>Support:</strong> <a href="https://pixelailabs.com/contact">Contact Us</a></li>
        <li><strong>Documentation:</strong> <a href="https://pixelailabs.com/docs/paint-editor">Full Docs</a></li>
    </ul>
    
    <h2>🙏 Acknowledgments</h2>
    
    <ul>
        <li>ComfyUI community for the excellent framework</li>
        <li>Contributors and testers</li>
        <li>Users providing feedback and suggestions</li>
    </ul>
    
    <hr>
    
    <p><strong>Happy Painting! 🎨</strong></p>
    
    <p><em>Created with ❤️ by PixelaiLabs.Com</em></p>
</body>
</html>