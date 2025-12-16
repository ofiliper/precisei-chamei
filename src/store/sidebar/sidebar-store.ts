// import { FolderDTO, FormDTO, FormListDTO, FormsListDTO, ShowFolderDTO } from '@/services/dto';
import { FileSignature, FileText, ListCheck, Paperclip, ScrollText, User, Wrench } from 'lucide-react'
import { create } from 'zustand'

interface IProps {

    menu: {
        icon: any
        title: string
        path: string
        active: boolean
        roles: string[]
    }[]
}

const stateDefault: IProps = {
    menu: [
        {
            icon: ListCheck,
            title: 'Minhas indicações',
            path: `/dashboard/minhas-indicacoes`,
            active: true,
            roles: ['LIDER', 'ADMIN', 'OWNER']
        },
        {
            icon: FileSignature,
            title: 'Meus ofícios', 
            path: `/dashboard/meus-oficios`,
            active: true,
            roles: ['LIDER', 'ADMIN', 'OWNER']
        },
        {
            icon: FileText,
            title: 'Todas as indicações',
            path: `/dashboard/indicacoes`,
            active: false,
            roles: ['ADMIN', 'OWNER']
        },
        {
            icon: ScrollText,
            title: 'Todos os ofícios',
            path: `/dashboard/oficios`, 
            active: false,
            roles: ['ADMIN', 'OWNER']
        },
        {
            icon: User,
            title: 'Usuários e permissões',
            path: `/dashboard/usuarios-permissoes`,
            active: false,
            roles: ['ADMIN', 'OWNER']
        },
        {
            icon: Wrench,
            title: 'Configurações',
            path: `/dashboard/configuracoes`,
            active: false,
            roles: ['ADMIN', 'OWNER']
        },
    ]
}

type Store = {
    data: IProps
    errors: Partial<{ [field in keyof IProps]: string }>
    fnOnChange: (field: keyof IProps, value: any) => void
    fnReset: () => void
    fnParcialReset: (field: keyof IProps) => void
}

export const sidebarStore = create<Store>((set, get) => ({
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