import { HealthConditionENUM, ObjectiveENUM } from '@/services/enum';
import { create } from 'zustand'

interface IProps {
    imageSelectedIndex: number;
    images?: {
        path: string;
        description: string;
        title: string;
    }[]
}

const stateDefault: IProps = {
    imageSelectedIndex: -1,
    images: [
        { path: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg', description: 'Bebas neue1', title: 'Titulo 1' },
        { path: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg', description: 'Bebas neue2', title: 'Titulo 2' },
        { path: 'https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg', description: 'Bebas neue3', title: 'Titulo 3' },
        { path: 'https://miro.medium.com/v2/resize:fit:20864/1*oM1GuZ0oC3_9v1GfKC2Egg.jpeg', description: 'Bebas neue4', title: 'Titulo 4' },
        { path: 'https://rsoaresempreiteira.com.br/wp-content/uploads/2021/05/imagem_home_nossos_servicos.png', description: 'Bebas neue4', title: 'Titulo 4' },
        { path: 'https://rsoaresempreiteira.com.br/wp-content/uploads/2021/05/home_sobre.png', description: 'Bebas neue5', title: 'Titulo 5' },
    ]
}

type Store = {
    data: IProps
    errors: Partial<{ [field in keyof IProps]: string }>
    fnOnChange: (field: keyof IProps, value: any) => void
    fnReset: () => void
    fnParcialReset: (field: keyof IProps) => void
}

export const imageLibraryStore = create<Store>((set, get) => ({
    data: { ...stateDefault },
    errors: {},
    fnOnChange: (field, value) => {
        set((prevState) => (
            {
                ...prevState,
                data: {
                    ...prevState.data,
                    [field]: value
                }
            }))
    },
    fnReset: () => {
        set((prevState) => (
            {
                ...prevState,
                data: { ...stateDefault }
            }))
    },
    fnParcialReset: (field) => {
        set((prevState) => {
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    [field]: stateDefault[field]
                }
            }
        }
        )
    }
}))