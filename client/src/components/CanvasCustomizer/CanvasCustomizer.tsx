import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Type,
  Image as ImageIcon,
  Layers,
  Undo,
  Redo,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Grid,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ShoppingCart,
  Save,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
} from 'lucide-react';
import { Product, CanvasLayer } from '../../types';
import { useCustomizerStore } from '../../store/customizerStore';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../Button/Button';
import './CanvasCustomizer.scss';

interface CanvasCustomizerProps {
  product: Product;
  initialConfiguration?: Record<string, string>;
  initialTotalPrice?: number;
  initialQuantity?: number;
}

export const CanvasCustomizer: React.FC<CanvasCustomizerProps> = ({
  product,
  initialConfiguration = {},
  initialTotalPrice,
  initialQuantity = 1,
}) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const {
    activeSide,
    layersBySide,
    selectedLayerId,
    historyIndex,
    history,
    zoom,
    showGrid,
    setProduct,
    setActiveSide,
    setSelectedLayerId,
    addTextLayer,
    addImageLayer,
    updateLayer,
    deleteLayer,
    duplicateLayer,
    reorderLayer,
    undo,
    redo,
    resetCanvas,
    setZoom,
    toggleGrid,
  } = useCustomizerStore();

  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'layers'>('text');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProduct(product);
    // Add an initial text layer if empty
    setTimeout(() => {
      addTextLayer('PRINTKART24');
    }, 100);
  }, [product, setProduct]);

  const currentLayers = layersBySide[activeSide] || [];
  const selectedLayer = currentLayers.find((l) => l.id === selectedLayerId);

  // Background mockup
  const frontMockup =
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
  const backMockup =
    product.images?.[1]?.url ||
    frontMockup;
  const currentMockup = activeSide === 'front' ? frontMockup : backMockup;

  // Handle local image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          addImageLayer(event.target.result as string, 160, 160);
          setActiveTab('layers');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent, layer: CanvasLayer) => {
    e.stopPropagation();
    setSelectedLayerId(layer.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const origLayerX = layer.x;
    const origLayerY = layer.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / zoom;
      const deltaY = (moveEvent.clientY - startY) / zoom;
      updateLayer(layer.id, {
        x: Math.round(origLayerX + deltaX),
        y: Math.round(origLayerY + deltaY),
      });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Resize logic
  const handleResizeDown = (e: React.MouseEvent, layer: CanvasLayer) => {
    e.stopPropagation();
    const startX = e.clientX;
    const origWidth = layer.width || 120;
    const origHeight = layer.height || 120;
    const origFontSize = layer.fontSize || 32;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / zoom;
      if (layer.type === 'text') {
        const newFontSize = Math.max(12, Math.min(100, Math.round(origFontSize + deltaX * 0.2)));
        updateLayer(layer.id, { fontSize: newFontSize });
      } else {
        const newW = Math.max(40, Math.round(origWidth + deltaX));
        const newH = Math.max(40, Math.round(origHeight + deltaX));
        updateLayer(layer.id, { width: newW, height: newH });
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Export and Add to Cart
  const handleAddToCartWithDesign = async () => {
    setIsSaving(true);

    // Snapshot layers as thumbnail preview (mockup with overlay)
    const customDesignPayload = {
      side: activeSide,
      layers: currentLayers,
    };

    const success = await addItem({
      productId: product.id,
      quantity: initialQuantity,
      unitPrice: initialTotalPrice ? initialTotalPrice / initialQuantity : product.basePrice,
      totalPrice: initialTotalPrice || product.basePrice,
      configuration: initialConfiguration,
      customDesign: customDesignPayload,
      customDesignPreviewUrl: currentMockup,
    });

    setIsSaving(false);
    if (success) {
      navigate('/cart');
    }
  };

  const handleSaveDraft = () => {
    setSaveMessage('Design draft saved to your browser session!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const fonts = [
    'Outfit',
    'Inter',
    'Playfair Display',
    'Bebas Neue',
    'Pacifico',
    'Montserrat',
    'Roboto',
  ];

  const colors = [
    '#15013F', // Brand Deep Purple
    '#AE1478', // Brand Magenta
    '#00D1FF', // Brand Accent Cyan
    '#0B132B',
    '#10B981',
    '#F59E0B',
    '#FFFFFF',
    '#64748B',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
    '#F97316',
    '#000000',
  ];

  return (
    <div className="pk-customizer">
      {/* Topbar */}
      <div className="pk-customizer__topbar">
        <div className="topbar-left">
          <button
            className="tool-btn"
            onClick={() => navigate(`/products/${product.slug}`)}
            title="Back to Product Details"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <span className="product-title">{product.name} — Design Studio</span>
        </div>

        {/* Undo / Redo / Zoom */}
        <div className="topbar-center">
          <button
            className="tool-btn"
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Undo"
          >
            <Undo size={15} /> Undo
          </button>
          <button
            className="tool-btn"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
          >
            <Redo size={15} /> Redo
          </button>
          <button className="tool-btn" onClick={resetCanvas} title="Reset All Layers">
            <RotateCcw size={15} /> Reset
          </button>
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />
          <button
            className={`tool-btn ${showGrid ? 'tool-btn--active' : ''}`}
            onClick={toggleGrid}
            title="Toggle Alignment Grid"
          >
            <Grid size={15} /> Grid
          </button>
          <button
            className="tool-btn"
            onClick={() => setZoom(Math.max(0.75, zoom - 0.1))}
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>{Math.round(zoom * 100)}%</span>
          <button
            className="tool-btn"
            onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
        </div>

        {/* Action CTAs */}
        <div className="topbar-right">
          <Button variant="outline" size="sm" onClick={handleSaveDraft} leftIcon={<Save size={15} />}>
            Save
          </Button>
          <Button
            variant="accent"
            size="sm"
            onClick={handleAddToCartWithDesign}
            isLoading={isSaving}
            leftIcon={<ShoppingCart size={15} />}
          >
            Add to Cart with Design
          </Button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="pk-customizer__workspace">
        {/* Left Tool Panel */}
        <div className="pk-customizer__tools">
          <div className="tools-nav">
            <button
              className={`nav-tab ${activeTab === 'text' ? 'nav-tab--active' : ''}`}
              onClick={() => setActiveTab('text')}
            >
              <Type size={16} style={{ display: 'inline', marginRight: 4 }} />
              Text
            </button>
            <button
              className={`nav-tab ${activeTab === 'image' ? 'nav-tab--active' : ''}`}
              onClick={() => setActiveTab('image')}
            >
              <ImageIcon size={16} style={{ display: 'inline', marginRight: 4 }} />
              Upload Logo
            </button>
            <button
              className={`nav-tab ${activeTab === 'layers' ? 'nav-tab--active' : ''}`}
              onClick={() => setActiveTab('layers')}
            >
              <Layers size={16} style={{ display: 'inline', marginRight: 4 }} />
              Layers ({currentLayers.length})
            </button>
          </div>

          <div className="tools-content">
            {saveMessage && (
              <div
                style={{
                  padding: '8px 12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10B981',
                  borderRadius: 6,
                  fontSize: 12,
                }}
              >
                {saveMessage}
              </div>
            )}

            {/* TAB: TEXT */}
            {activeTab === 'text' && (
              <>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => addTextLayer('Your Text Here')}
                  leftIcon={<Type size={16} />}
                >
                  + Add New Text
                </Button>

                {selectedLayer && selectedLayer.type === 'text' ? (
                  <>
                    <div className="tool-group">
                      <label>Edit Text Content</label>
                      <input
                        type="text"
                        value={selectedLayer.text || ''}
                        onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })}
                      />
                    </div>

                    <div className="tool-group">
                      <label>Font Family</label>
                      <select
                        value={selectedLayer.fontFamily || 'Outfit'}
                        onChange={(e) => updateLayer(selectedLayer.id, { fontFamily: e.target.value })}
                      >
                        {fonts.map((f) => (
                          <option key={f} value={f} style={{ fontFamily: f }}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="tool-group">
                      <label>Font Size ({selectedLayer.fontSize || 32}px)</label>
                      <input
                        type="range"
                        min="12"
                        max="80"
                        value={selectedLayer.fontSize || 32}
                        onChange={(e) =>
                          updateLayer(selectedLayer.id, { fontSize: parseInt(e.target.value, 10) })
                        }
                      />
                    </div>

                    <div className="tool-group">
                      <label>Color</label>
                      <div className="color-picker-grid">
                        {colors.map((c) => (
                          <button
                            key={c}
                            type="button"
                            className={`color-dot ${
                              selectedLayer.color === c ? 'color-dot--active' : ''
                            }`}
                            style={{ backgroundColor: c }}
                            onClick={() => updateLayer(selectedLayer.id, { color: c })}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="tool-group">
                      <label>Style & Alignment</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className={`tool-btn ${selectedLayer.isBold ? 'tool-btn--active' : ''}`}
                          onClick={() => updateLayer(selectedLayer.id, { isBold: !selectedLayer.isBold })}
                        >
                          <Bold size={14} />
                        </button>
                        <button
                          type="button"
                          className={`tool-btn ${selectedLayer.isItalic ? 'tool-btn--active' : ''}`}
                          onClick={() =>
                            updateLayer(selectedLayer.id, { isItalic: !selectedLayer.isItalic })
                          }
                        >
                          <Italic size={14} />
                        </button>
                        <button
                          type="button"
                          className={`tool-btn ${
                            selectedLayer.textAlign === 'left' ? 'tool-btn--active' : ''
                          }`}
                          onClick={() => updateLayer(selectedLayer.id, { textAlign: 'left' })}
                        >
                          <AlignLeft size={14} />
                        </button>
                        <button
                          type="button"
                          className={`tool-btn ${
                            selectedLayer.textAlign === 'center' ? 'tool-btn--active' : ''
                          }`}
                          onClick={() => updateLayer(selectedLayer.id, { textAlign: 'center' })}
                        >
                          <AlignCenter size={14} />
                        </button>
                        <button
                          type="button"
                          className={`tool-btn ${
                            selectedLayer.textAlign === 'right' ? 'tool-btn--active' : ''
                          }`}
                          onClick={() => updateLayer(selectedLayer.id, { textAlign: 'right' })}
                        >
                          <AlignRight size={14} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: 13, color: '#94a3b8' }}>
                    Click on a text layer on the canvas to customize its font, size, and styling.
                  </p>
                )}
              </>
            )}

            {/* TAB: IMAGE UPLOAD */}
            {activeTab === 'image' && (
              <div className="tool-group">
                <label>Upload Artwork or Company Logo</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleImageUpload}
                />
                <div
                  className="upload-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={32} style={{ color: '#E11D48', margin: '0 auto' }} />
                  <p style={{ fontWeight: 600, color: '#FFFFFF', marginTop: 8 }}>
                    Click to Upload Image
                  </p>
                  <p>Supports high-resolution PNG, JPG, SVG with transparent backgrounds.</p>
                </div>

                {/* Sample Logos to quick test */}
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Or Pick Sample Logo:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="tool-btn"
                      onClick={() =>
                        addImageLayer(
                          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300',
                          140,
                          140
                        )
                      }
                    >
                      Abstract Badge
                    </button>
                    <button
                      type="button"
                      className="tool-btn"
                      onClick={() =>
                        addImageLayer(
                          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300',
                          140,
                          140
                        )
                      }
                    >
                      Geometric Art
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LAYERS */}
            {activeTab === 'layers' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Current Layers
                </label>
                {currentLayers.length === 0 && (
                  <p style={{ fontSize: 13, color: '#64748b' }}>No layers added yet.</p>
                )}
                {currentLayers.map((layer, idx) => (
                  <div
                    key={layer.id}
                    className={`layer-item ${selectedLayerId === layer.id ? 'layer-item--active' : ''}`}
                    onClick={() => setSelectedLayerId(layer.id)}
                  >
                    <span>
                      {layer.type === 'text' ? `T: "${layer.text}"` : `Image #${idx + 1}`}
                    </span>
                    <div className="layer-actions">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          reorderLayer(layer.id, 'up');
                        }}
                        title="Bring Forward"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          reorderLayer(layer.id, 'down');
                        }}
                        title="Send Backward"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateLayer(layer.id);
                        }}
                        title="Duplicate"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLayer(layer.id);
                        }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Canvas Stage */}
        <div
          className="pk-customizer__stage"
          onClick={() => setSelectedLayerId(null)}
        >
          {/* Side Switcher (Front / Back) */}
          <div className="side-switcher" onClick={(e) => e.stopPropagation()}>
            <button
              className={activeSide === 'front' ? 'active' : ''}
              onClick={() => setActiveSide('front')}
            >
              Front View
            </button>
            <button
              className={activeSide === 'back' ? 'active' : ''}
              onClick={() => setActiveSide('back')}
            >
              Back View
            </button>
          </div>

          {/* Interactive Stage */}
          <div
            ref={stageContainerRef}
            className={`canvas-container ${showGrid ? 'grid-overlay' : ''}`}
            style={{ transform: `scale(${zoom})` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Product Mockup Background */}
            <img
              src={currentMockup}
              alt="Product Mockup"
              className="product-mockup-bg"
            />

            {/* Printable Safe Zone Guide */}
            <div className="printable-boundary">
              <span className="zone-label">PRINTABLE ZONE</span>
            </div>

            {/* Layers */}
            {currentLayers.map((layer) => {
              const isSelected = selectedLayerId === layer.id;

              return (
                <div
                  key={layer.id}
                  className={`canvas-layer ${isSelected ? 'canvas-layer--selected' : ''}`}
                  style={{
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    width: layer.width ? `${layer.width}px` : 'auto',
                    height: layer.height ? `${layer.height}px` : 'auto',
                    transform: `rotate(${layer.rotation || 0}deg)`,
                    opacity: layer.opacity ?? 1,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, layer)}
                >
                  {layer.type === 'text' && (
                    <div
                      className="layer-text"
                      style={{
                        fontFamily: layer.fontFamily || 'Outfit',
                        fontSize: `${layer.fontSize || 32}px`,
                        color: layer.color || '#0B132B',
                        fontWeight: layer.isBold ? 700 : 400,
                        fontStyle: layer.isItalic ? 'italic' : 'normal',
                        textAlign: layer.textAlign || 'center',
                      }}
                    >
                      {layer.text}
                    </div>
                  )}

                  {layer.type === 'image' && layer.url && (
                    <img
                      src={layer.url}
                      alt="Layer graphic"
                      className="layer-image"
                    />
                  )}

                  {/* Drag-to-resize handle */}
                  {isSelected && (
                    <div
                      className="resize-handle"
                      onMouseDown={(e) => handleResizeDown(e, layer)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
