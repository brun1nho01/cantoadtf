import { create } from 'zustand';

export type MeshMaterial = 'algodao' | 'pv' | 'pp';
export type CollarType = 'ribana-padrao' | 'ribana-premium' | 'vies';
export type ArtworkSize = 'A4' | 'A3' | 'A2';
export type ArtworkPosition = 'peito-centro' | 'costas-centro' | 'peito-esquerdo';

interface SimulatorState {
  // Configurações da Camiseta
  shirtColor: string;
  material: MeshMaterial;
  collar: CollarType;
  
  // Configurações da Estampa (DTF)
  frontArtworkId: string | null;
  backArtworkId: string | null;
  artworkSize: ArtworkSize;
  
  // O lado ativo no painel lateral
  activeSide: 'front' | 'back';

  // Estados de UI / Carregamento
  isBakingTexture: boolean;
  bakedFrontUrl: string | null;
  bakedBackUrl: string | null;

  // Ações
  setShirtColor: (color: string) => void;
  setMaterial: (mat: MeshMaterial) => void;
  setCollar: (col: CollarType) => void;
  setActiveSide: (side: 'front' | 'back') => void;
  setArtwork: (id: string | null, side: 'front' | 'back', size?: ArtworkSize) => void;
  setBakingState: (isBaking: boolean, textureUrl?: string | null, side?: 'front' | 'back') => void;
}

export const useSimulatorStore = create<SimulatorState>((set) => ({
  shirtColor: '#ffffff', // Branco padrão
  material: 'algodao',
  collar: 'ribana-premium',
  
  frontArtworkId: null,
  backArtworkId: null,
  artworkSize: 'A3',
  activeSide: 'front',

  isBakingTexture: false,
  bakedFrontUrl: null,
  bakedBackUrl: null,

  setShirtColor: (color) => set({ shirtColor: color }),
  setMaterial: (mat) => set({ material: mat }),
  setCollar: (col) => set({ collar: col }),
  setActiveSide: (side) => set({ activeSide: side }),

  setArtwork: (id, side, size) => set({
    ...(side === 'front' ? { frontArtworkId: id } : { backArtworkId: id }),
    ...(size ? { artworkSize: size } : {})
  }),

  setBakingState: (isBaking, textureUrl, side) => set(() => {
    const updates: Partial<SimulatorState> = { isBakingTexture: isBaking };
    if (textureUrl !== undefined && side) {
      if (side === 'front') updates.bakedFrontUrl = textureUrl;
      if (side === 'back') updates.bakedBackUrl = textureUrl;
    }
    return updates;
  }),
}));
