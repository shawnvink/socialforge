import { create } from "zustand";

interface AppState {
  selectedPlatform: string | null;
  selectedProfileId: string | null;
  isGenerating: boolean;
  generationProgress: string;
  setSelectedPlatform: (platform: string | null) => void;
  setSelectedProfileId: (id: string | null) => void;
  setIsGenerating: (generating: boolean) => void;
  setGenerationProgress: (progress: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedPlatform: null,
  selectedProfileId: null,
  isGenerating: false,
  generationProgress: "",
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
  setSelectedProfileId: (id) => set({ selectedProfileId: id }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
}));
