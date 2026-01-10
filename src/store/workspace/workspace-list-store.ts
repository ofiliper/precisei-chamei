// import { FolderDTO, FormDTO, FormListDTO, FormsListDTO, ShowFolderDTO } from '@/services/dto';
import { FileText, Paperclip, User, Wrench } from 'lucide-react'
import { create } from 'zustand'

interface IUserWorkspace {
    name: string
    email: string
    role: string
    approved: boolean
}[]

interface IWorkspace {
    id: string
    name: string
    image: string
    fetching: boolean
    User_workspaces: IUserWorkspace[]
}[]

interface IProps {
    fetching: boolean
    rows: IWorkspace[]
}

// "id": "ec0cc422-de37-46fd-92d2-dd8069cd0592",
// "name": "Bebas",
// "url": null,
// "raw_url": null,
// "createdAt": "2025-12-31 16:53:53",
// "updatedAt": "2025-12-31 19:38:48",
// "User_workspaces": [
//     {
//         "id": "b5c81127-b9f1-4abd-bbcd-b4faf349c027",
//         "id_user": "0cf37f09-9dc9-47b0-9b24-2ed29f91586a",
//         "id_workspace": "ec0cc422-de37-46fd-92d2-dd8069cd0592",
//         "role": "OWNER",
//         "approved": true,
//         "createdAt": "2025-12-31 16:53:53",
//         "updatedAt": "2025-12-31 16:53:53"
//     }
// ]

const stateDefault: IProps = {
    fetching: true,
    rows: []
}

type Store = {
    data: IProps
    errors: Partial<{ [field in keyof IProps]: string }>
    fnOnChange: (field: keyof IProps, value: any) => void
    fnReset: () => void
    fnParcialReset: (field: keyof IProps) => void
}

export const workspaceListStore = create<Store>((set, get) => ({
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