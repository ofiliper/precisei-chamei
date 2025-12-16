import { UserRoleENUM } from "@/services/user/user.enum";

export const roleMap = {
    LIDER: {
        name: 'Líder',
        style: 'border-slate-200 !bg-slate-400'
    },
    ADMIN: {
        name: 'Administrador',
        style: 'border-rose-500 !bg-rose-400'
    },
    OWNER: {
        name: 'Proprietário',
        style: 'border-green-200 !bg-green-400'
    },
};