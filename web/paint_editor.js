import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";

class PaintEditorWindow {
    constructor(imageData, nodeId, callback) {
        this.imageData = imageData;
        this.nodeId = nodeId;
        this.callback = callback;
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.brushSize = 20;
        this.brushColor = '#FF0000';
        this.window = null;
        this.drawingHistory = []; // For undo/redo
        this.historyStep = -1;
        this.originalImageData = null;
        
        this.createWindow();
    }
    
    createWindow() {
        // Create new window
        this.window = window.open('', '_blank', 'width=900,height=800,scrollbars=no,resizable=yes');
        
        const doc = this.window.document;
        doc.title = 'Paint Editor';
        
        // Add styles
        const style = doc.createElement('style');
        style.textContent = `
            body {
                margin: 0;
                padding: 20px;
                background: #2a2a2a;
                font-family: Arial, sans-serif;
                color: white;
            }
            
            .toolbar {
                background: #1a1a1a;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                display: flex;
                gap: 15px;
                align-items: center;
                flex-wrap: wrap;
            }
            
            .tool-group {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            label {
                font-size: 12px;
                color: #ccc;
                font-weight: bold;
            }
            
            input[type="range"] {
                width: 120px;
            }
            
            input[type="color"] {
                width: 50px;
                height: 35px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            
            button {
                padding: 10px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                transition: opacity 0.2s;
            }
            
            button:hover {
                opacity: 0.8;
            }
            
            button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .btn-save {
                background: #4caf50;
                color: white;
            }
            
            .btn-clear {
                background: #f44336;
                color: white;
            }
            
            .btn-undo {
                background: #ff9800;
                color: white;
            }
            
            .btn-redo {
                background: #2196f3;
                color: white;
            }
            
            .btn-cancel {
                background: #666;
                color: white;
            }
            
            #paintCanvas {
                border: 3px solid #666;
                border-radius: 4px;
                background: white;
                display: block;
                margin: 0 auto;
                cursor: crosshair;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            }
            
            .canvas-container {
                text-align: center;
                background: #333;
                padding: 20px;
                border-radius: 8px;
            }
            
            .size-display {
                background: #333;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                min-width: 30px;
                text-align: center;
            }
        `;
        doc.head.appendChild(style);
        
        // Create HTML
        doc.body.innerHTML = `
            <h2>🎨 Paint Editor</h2>
            
            <div class="toolbar">
                <div class="tool-group">
                    <label>Brush Size:</label>
                    <input type="range" id="brushSize" min="1" max="100" value="20">
                    <div class="size-display" id="sizeValue">20</div>
                </div>
                
                <div class="tool-group">
                    <label>Color:</label>
                    <input type="color" id="brushColor" value="#FF0000">
                </div>
                
                <div class="tool-group">
                    <button class="btn-undo" id="undoBtn">↶ Undo</button>
                    <button class="btn-redo" id="redoBtn">↷ Redo</button>
                </div>
                
                <div class="tool-group">
                    <button class="btn-clear" id="clearBtn">🗑️ Clear All</button>
                    <button class="btn-save" id="saveBtn">💾 Save & Close</button>
                    <button class="btn-cancel" id="cancelBtn">❌ Cancel</button>
                </div>
            </div>
            
            <div class="canvas-container">
                <canvas id="paintCanvas" width="512" height="512"></canvas>
                <p style="color: #ccc; margin-top: 10px;">Click and drag to draw • Right-click for options</p>
            </div>
        `;
        
        // Setup canvas
        this.canvas = doc.getElementById('paintCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Load the image
        this.loadImage();
        
        // Setup event listeners
        this.setupEvents(doc);
        
        // Setup button event listeners
        doc.getElementById('undoBtn').addEventListener('click', () => this.undo());
        doc.getElementById('redoBtn').addEventListener('click', () => this.redo());
        doc.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());
        doc.getElementById('saveBtn').addEventListener('click', () => this.saveAndClose());
        doc.getElementById('cancelBtn').addEventListener('click', () => this.cancelEdit());
        
        // Update button states
        this.updateButtonStates(doc);
    }
    
    loadImage() {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            // Use original image dimensions (no downsizing)
            const originalWidth = img.width;
            const originalHeight = img.height;
            
            // Set canvas to original image size
            this.canvas.width = originalWidth;
            this.canvas.height = originalHeight;
            
            // If image is very large, scale the canvas display size but keep full resolution
            const maxDisplayWidth = 800;
            const maxDisplayHeight = 600;
            
            if (originalWidth > maxDisplayWidth || originalHeight > maxDisplayHeight) {
                const ratio = Math.min(maxDisplayWidth / originalWidth, maxDisplayHeight / originalHeight);
                this.canvas.style.width = (originalWidth * ratio) + 'px';
                this.canvas.style.height = (originalHeight * ratio) + 'px';
            } else {
                this.canvas.style.width = originalWidth + 'px';
                this.canvas.style.height = originalHeight + 'px';
            }
            
            // Draw the image at full resolution
            this.ctx.drawImage(img, 0, 0, originalWidth, originalHeight);
            
            // Initialize history
            this.drawingHistory = [];
            this.historyStep = -1;
            
            // Save initial state
            this.saveState();
            
            // Store original image data for clearing
            this.originalImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        };
        img.src = this.imageData;
    }
    
    saveState() {
        this.historyStep++;
        if (this.historyStep < this.drawingHistory.length) {
            this.drawingHistory.length = this.historyStep;
        }
        this.drawingHistory.push(this.canvas.toDataURL('image/png'));
        this.updateButtonStates();
    }
    
    setupEvents(doc) {
        const brushSizeSlider = doc.getElementById('brushSize');
        const sizeValue = doc.getElementById('sizeValue');
        const colorPicker = doc.getElementById('brushColor');
        
        // Brush size
        brushSizeSlider.addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            sizeValue.textContent = this.brushSize;
        });
        
        // Brush color
        colorPicker.addEventListener('change', (e) => {
            this.brushColor = e.target.value;
        });
        
        // Drawing events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e, 'start'));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e, 'move'));
        this.canvas.addEventListener('touchend', () => this.stopDrawing());
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Keyboard shortcuts
        doc.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    this.undo();
                } else if (e.key === 'z' && e.shiftKey || e.key === 'y') {
                    e.preventDefault();
                    this.redo();
                }
            }
        });
    }
    
    handleTouch(e, type) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        
        // Calculate actual canvas coordinates considering display scaling
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const mouseEvent = new MouseEvent(type === 'start' ? 'mousedown' : 'mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        
        this.canvas.dispatchEvent(mouseEvent);
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        
        // Calculate actual canvas coordinates considering display scaling
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = this.brushColor;
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        
        // Calculate actual canvas coordinates considering display scaling
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = this.brushColor;
        
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }
    
    stopDrawing() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        this.ctx.beginPath();
        
        // Save state after drawing
        this.saveState();
    }
    
    undo() {
        if (this.historyStep > 0) {
            this.historyStep--;
            this.restoreState();
        }
    }
    
    redo() {
        if (this.historyStep < this.drawingHistory.length - 1) {
            this.historyStep++;
            this.restoreState();
        }
    }
    
    restoreState() {
        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0);
            this.updateButtonStates();
        };
        img.src = this.drawingHistory[this.historyStep];
    }
    
    updateButtonStates(doc = this.window.document) {
        const undoBtn = doc.getElementById('undoBtn');
        const redoBtn = doc.getElementById('redoBtn');
        
        if (undoBtn) undoBtn.disabled = this.historyStep <= 0;
        if (redoBtn) redoBtn.disabled = this.historyStep >= this.drawingHistory.length - 1;
    }
    
    clearCanvas() {
        if (this.window.confirm('Are you sure you want to clear all drawings and start over?')) {
            // Clear the canvas and reload original image
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Reload the original image
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                
                // Reset history and save new state
                this.drawingHistory = [];
                this.historyStep = -1;
                this.saveState();
                this.originalImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                this.updateButtonStates();
            };
            img.src = this.imageData;
        }
    }
    
    saveAndClose() {
        // Convert canvas to base64
        const imageData = this.canvas.toDataURL('image/png', 1.0);
        
        // Send back to ComfyUI
        this.callback(imageData);
        
        // Close window
        this.window.close();
    }
    
    cancelEdit() {
        if (this.window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
            this.window.close();
        }
    }
}

// Register the extension
app.registerExtension({
    name: "PaintEditor",
    
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "PaintEditor") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            
            nodeType.prototype.onNodeCreated = function() {
                const result = onNodeCreated?.apply(this, arguments);
                
                // Add edit button
                const editButton = this.addWidget("button", "🎨 Open Paint Editor", null, () => {
                    this.openEditor();
                });
                
                editButton.serialize = false; // Don't save button state
                
                // Store for edited image data
                this.editedImageData = null;
                
                return result;
            };
            
            // Add method to open editor
            nodeType.prototype.openEditor = function() {
                // Get the selected image file
                const imageFileWidget = this.widgets.find(w => w.name === 'image_file');
                if (!imageFileWidget || !imageFileWidget.value) {
                    alert('Please select an image file first!');
                    return;
                }
                
                // Construct image path
                const imagePath = `/view?filename=${encodeURIComponent(imageFileWidget.value)}&type=input`;
                const imageUrl = new URL(imagePath, window.location.origin).toString();
                
                // Open paint editor
                new PaintEditorWindow(imageUrl, this.id, (editedData) => {
                    this.editedImageData = editedData;
                    
                    // Store in class-level storage
                    if (window.PaintEditor && window.PaintEditor.save_edited_image) {
                        window.PaintEditor.save_edited_image(this.id, editedData);
                    } else {
                        // Fallback: store in global
                        if (!window.PaintEditorData) {
                            window.PaintEditorData = {};
                        }
                        window.PaintEditorData[this.id] = editedData;
                    }
                    
                    // Mark node as changed to trigger re-execution
                    this.setDirtyCanvas(true);
                    
                    // Show success message
                    alert('Image saved! Execute the node to see the edited image.');
                });
            };
        }
    },
    
    async setup() {
        // Create global reference to Python class
        window.PaintEditor = {
            save_edited_image: function(nodeId, imageData) {
                // This will be called from JavaScript to store data
                // Send to Python backend via API call
                api.fetchApi('/paint_editor/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        node_id: nodeId,
                        image_data: imageData
                    })
                }).then(response => {
                    if (response.ok) {
                        console.log('Image data saved successfully');
                    }
                }).catch(error => {
                    console.error('Error saving image data:', error);
                    // Fallback to global storage
                    if (!window.PaintEditorData) {
                        window.PaintEditorData = {};
                    }
                    window.PaintEditorData[nodeId] = imageData;
                });
            }
        };
    }
});