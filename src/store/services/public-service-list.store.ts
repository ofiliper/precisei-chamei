import { create } from 'zustand'

// --- Interfaces para os itens da lista ---

export interface ISocialMedia {
    x?: string;
    facebook?: string;
    instagram?: string;
    [key: string]: string | undefined;
}

export interface IServiceContent {
    content: string;
    social_media: ISocialMedia;
}

// Interface que representa UM item dentro do array retornado pela API
export interface IServiceItem {
    id: string;
    id_workspace: string;
    id_category: string;
    name: string;
    logo_image: string | null;
    cover_image: string | null;
    content: IServiceContent;
    gallery: string[];
    createdAt: string;
    updatedAt: string;
    
    // Nota: O JSON fornecido aqui não trouxe os objetos expandidos
    // 'Category' e 'Address', então removi da tipagem. 
    // Se a API de listagem retornar eles, basta adicionar aqui.
}

// --- Interface do Estado Global da Listagem ---

interface IServicesData {
    fetching: boolean;
    services: IServiceItem[]; // Array contendo a lista
    count?: number; // Opcional: útil se a API retornar total de registros para paginação
}

// --- Estado Inicial ---

const stateDefault: IServicesData = {
    fetching: true,
    services: [],
    count: 0
}

// --- Definição do Store ---

type Store = {
    data: IServicesData
    
    // Actions
    fnSetServices: (services: IServiceItem[]) => void
    fnAddService: (service: IServiceItem) => void
    fnUpdateService: (id: string, partialService: Partial<IServiceItem>) => void
    fnRemoveService: (id: string) => void
    fnSetFetching: (isFetching: boolean) => void
    fnReset: () => void
}

export const publicServiceListStore = create<Store>((set) => ({
    data: { ...stateDefault },

    // Define a lista completa (ex: após o fetch inicial)
    fnSetServices: (services) => {
        set((state) => ({
            data: {
                ...state.data,
                services: services,
                fetching: false,
                count: services.length
            }
        }))
    },

    // Adiciona um item à lista (ex: criação otimista)
    fnAddService: (newService) => {
        set((state) => ({
            data: {
                ...state.data,
                services: [newService, ...state.data.services], // Adiciona no topo
                count: (state.data.count || 0) + 1
            }
        }))
    },

    // Atualiza um item específico na lista sem recarregar tudo
    fnUpdateService: (id, partialService) => {
        set((state) => ({
            data: {
                ...state.data,
                services: state.data.services.map((item) => 
                    item.id === id ? { ...item, ...partialService } : item
                )
            }
        }))
    },

    // Remove um item da lista
    fnRemoveService: (id) => {
        set((state) => ({
            data: {
                ...state.data,
                services: state.data.services.filter((item) => item.id !== id),
                count: (state.data.count || 1) - 1
            }
        }))
    },

    // Controla apenas o loading
    fnSetFetching: (isFetching) => {
        set((state) => ({
            data: {
                ...state.data,
                fetching: isFetching
            }
        }))
    },

    // Limpa o store
    fnReset: () => {
        set({ data: { ...stateDefault } })
    }
}))