import { create } from 'zustand';
import { CanvasLayer, Product } from '../types';

interface CustomizerState {
  product: Product | null;
  activeSide: 'front' | 'back';
  layersBySide: {
    front: CanvasLayer[];
    back: CanvasLayer[];
  };
  selectedLayerId: string | null;
  history: Array<{ front: CanvasLayer[]; back: CanvasLayer[] }>;
  historyIndex: number;
  zoom: number;
  showGrid: boolean;

  setProduct: (product: Product) => void;
  setActiveSide: (side: 'front' | 'back') => void;
  setSelectedLayerId: (id: string | null) => void;
  addTextLayer: (initialText?: string) => void;
  addImageLayer: (url: string, width?: number, height?: number) => void;
  updateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
  deleteLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  reorderLayer: (id: string, direction: 'up' | 'down') => void;
  undo: () => void;
  redo: () => void;
  resetCanvas: () => void;
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
}

export const useCustomizerStore = create<CustomizerState>((set, get) => ({
  product: null,
  activeSide: 'front',
  layersBySide: {
    front: [],
    back: [],
  },
  selectedLayerId: null,
  history: [{ front: [], back: [] }],
  historyIndex: 0,
  zoom: 1,
  showGrid: false,

  setProduct: (product) => {
    set({
      product,
      activeSide: 'front',
      layersBySide: { front: [], back: [] },
      selectedLayerId: null,
      history: [{ front: [], back: [] }],
      historyIndex: 0,
    });
  },

  setActiveSide: (side) => {
    set({ activeSide: side, selectedLayerId: null });
  },

  setSelectedLayerId: (id) => {
    set({ selectedLayerId: id });
  },

  addTextLayer: (initialText = 'Your Brand Here') => {
    const { activeSide, layersBySide, history, historyIndex } = get();
    const newLayer: CanvasLayer = {
      id: `layer_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      type: 'text',
      text: initialText,
      fontFamily: 'Outfit',
      fontSize: 32,
      color: '#0B132B',
      textAlign: 'center',
      isBold: true,
      isItalic: false,
      x: 300,
      y: 350,
      rotation: 0,
      opacity: 1,
    };

    const updatedLayers = {
      ...layersBySide,
      [activeSide]: [...layersBySide[activeSide], newLayer],
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(updatedLayers)));

    set({
      layersBySide: updatedLayers,
      selectedLayerId: newLayer.id,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  addImageLayer: (url, width = 180, height = 180) => {
    const { activeSide, layersBySide, history, historyIndex } = get();
    const newLayer: CanvasLayer = {
      id: `layer_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      type: 'image',
      url,
      x: 310,
      y: 280,
      width,
      height,
      rotation: 0,
      opacity: 1,
    };

    const updatedLayers = {
      ...layersBySide,
      [activeSide]: [...layersBySide[activeSide], newLayer],
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(updatedLayers)));

    set({
      layersBySide: updatedLayers,
      selectedLayerId: newLayer.id,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  updateLayer: (id, updates) => {
    const { activeSide, layersBySide } = get();
    const currentList = layersBySide[activeSide];
    const updatedList = currentList.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer));

    set({
      layersBySide: {
        ...layersBySide,
        [activeSide]: updatedList,
      },
    });
  },

  deleteLayer: (id) => {
    const { activeSide, layersBySide, history, historyIndex } = get();
    const updatedLayers = {
      ...layersBySide,
      [activeSide]: layersBySide[activeSide].filter((l) => l.id !== id),
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(updatedLayers)));

    set({
      layersBySide: updatedLayers,
      selectedLayerId: null,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  duplicateLayer: (id) => {
    const { activeSide, layersBySide, history, historyIndex } = get();
    const layerToDup = layersBySide[activeSide].find((l) => l.id === id);
    if (!layerToDup) return;

    const duplicated: CanvasLayer = {
      ...JSON.parse(JSON.stringify(layerToDup)),
      id: `layer_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      x: layerToDup.x + 20,
      y: layerToDup.y + 20,
    };

    const updatedLayers = {
      ...layersBySide,
      [activeSide]: [...layersBySide[activeSide], duplicated],
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(updatedLayers)));

    set({
      layersBySide: updatedLayers,
      selectedLayerId: duplicated.id,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  reorderLayer: (id, direction) => {
    const { activeSide, layersBySide } = get();
    const list = [...layersBySide[activeSide]];
    const index = list.findIndex((l) => l.id === id);
    if (index === -1) return;

    if (direction === 'up' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    } else if (direction === 'down' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    }

    set({
      layersBySide: {
        ...layersBySide,
        [activeSide]: list,
      },
    });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      set({
        historyIndex: nextIndex,
        layersBySide: JSON.parse(JSON.stringify(history[nextIndex])),
        selectedLayerId: null,
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      set({
        historyIndex: nextIndex,
        layersBySide: JSON.parse(JSON.stringify(history[nextIndex])),
        selectedLayerId: null,
      });
    }
  },

  resetCanvas: () => {
    const cleared = { front: [], back: [] };
    set({
      layersBySide: cleared,
      selectedLayerId: null,
      history: [cleared],
      historyIndex: 0,
    });
  },

  setZoom: (zoom) => set({ zoom }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
}));
