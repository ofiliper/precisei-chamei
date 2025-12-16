// import { create } from 'zustand'

// export interface UserDTO {
//     id: string;
//     name: string;
//     email: string;
// }

// export interface UserVereadorDTO {
//     role: 'ADMIN' | 'LIDER' | 'OWNER';
//     User: UserDTO;
// }

// export interface IndicacaoCompletaDTO {
//     id: string;
//     id_user_vereador: string;
//     tipo_de_documento: string;
//     bairro: string;
//     ementa: string;
//     texto: string;
//     raw_texto: string | null;
//     justificativa: string;
//     observacoes: string;
//     createdAt?: string;
//     updatedAt?: string;
//     User_vereador?: UserVereadorDTO;
//     action: 'create' | 'update'
// }


// interface IProps extends IndicacaoCompletaDTO {
//     fetching: boolean

// }

// const stateDefault: IProps = {
//     fetching: true,
//     action: 'create',
// }

// type Store = {
//     data: IProps
//     errors: Partial<{ [field in keyof IProps]: string }>
//     fnOnChange: (field: keyof IProps, value: any) => void
//     fnReset: () => void
//     fnParcialReset: (field: keyof IProps) => void
// }

// export const sessionStore = create<Store>((set, get) => ({
//     data: { ...stateDefault },
//     errors: {},
//     fnOnChange: (field, value) => {
//         set((prevState) => (
//             {
//                 ...prevState,
//                 data: {
//                     ...prevState.data,
//                     [field]: value
//                 }
//             }))
//     },
//     fnReset: () => {
//         set((prevState) => (
//             {
//                 ...prevState,
//                 data: { ...stateDefault }
//             }))
//     },
//     fnParcialReset: (field) => {
//         set((prevState) => {
//             return {
//                 ...prevState,
//                 data: {
//                     ...prevState.data,
//                     [field]: stateDefault[field]
//                 }
//             }
//         }
//         )
//     }
// }))