// import { FolderDTO, FormDTO, FormListDTO, FormsListDTO, ShowFolderDTO } from '@/services/dto';
import { FileText, Paperclip, User, Wrench } from 'lucide-react'
import { create } from 'zustand'

interface IProps {
    role: string
    User_vereadors: {
        id: string
        role: string
        Vereador: {
            id: string
            name: string
            description: string | null
        }
    }[]
    id: string
    name: string
    email: string
    cpf: string | null
    fetching: boolean
}

const stateDefault: IProps = {
    fetching: true,
    role: 'LIDER',
    User_vereadors: [],
    id: '',
    name: '',
    email: '',
    cpf: null
}

type Store = {
    data: IProps
    errors: Partial<{ [field in keyof IProps]: string }>
    fnOnChange: (field: keyof IProps, value: any) => void
    fnReset: () => void
    fnParcialReset: (field: keyof IProps) => void
}

export const vereadorListStore = create<Store>((set, get) => ({
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