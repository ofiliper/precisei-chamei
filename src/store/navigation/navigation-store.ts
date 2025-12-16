// import { FolderDTO, FormDTO, FormListDTO, FormsListDTO, ShowFolderDTO } from '@/services/dto';
import { create } from 'zustand'

interface IProps {
    stepper: number;
}

const stateDefault: IProps = {
    stepper: 0
}

type Store = {
    data: IProps
    errors: Partial<{ [field in keyof IProps]: string }>
    fnOnChange: (field: keyof IProps, value: any) => void
    fnReset: () => void
    fnParcialReset: (field: keyof IProps) => void
}

export const navigationStore = create<Store>((set, get) => ({
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