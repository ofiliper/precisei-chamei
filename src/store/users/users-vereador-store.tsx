// import { FolderDTO, FormDTO, FormListDTO, FormsListDTO, ShowFolderDTO } from '@/services/dto';
import { FileText, Paperclip, User, Wrench } from 'lucide-react'
import { create } from 'zustand'

interface IProps {
    user_list: {
        id: string
        name: string
        email: string
        cpf: string | null
        User_vereadors: {
            role: string
            id: string
            approved?: boolean
        }[]
    }[]
    fetching: boolean
}

const stateDefault: IProps = {
    fetching: true,
    user_list: []
}

type Store = {
    data: IProps
    errors: Partial<{ [field in keyof IProps]: string }>
    fnOnChange: (field: keyof IProps, value: any) => void
    fnReset: () => void
    fnParcialReset: (field: keyof IProps) => void
}

export const usersVereadorStore = create<Store>((set, get) => ({
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