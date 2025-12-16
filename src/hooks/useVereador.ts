import { ChangePassword, Forgot, Signin, Signup, VerifyAcc } from '@/@types/auth'
import { toast } from '@/hooks/use-toast'
import { AuthService } from '@/services/api/auth.service'
import { VereadorService } from '@/services/vereador/vereador.service'
import { usersVereadorStore } from '@/store/users/users-vereador-store'
import { vereadorListStore } from '@/store/vereador/vereador-list-store'
import { vereadorStore } from '@/store/vereador/vereador-store'
// import { sessionStore } from '@/store'
import { Cookies } from 'react-cookie'
import { useStore } from 'zustand'

const useVerador = () => {

    const vereadorList = useStore(vereadorListStore);
    const usersVereador = useStore(usersVereadorStore);
    const vereador = useStore(vereadorStore);
    const vereadorService = new VereadorService();
    const cookies = new Cookies();

    const fetchVereadorInfo = async (data: { id: string }) => {
        try {

            const request = await vereadorService.readVereadorInfo(data);
            vereador.fnOnChange('vereador', request.data.data.Vereador);
            vereador.fnOnChange('user', request.data.data.User);
            vereador.fnOnChange('role', request.data.data.role);
            vereador.fnOnChange('id', request.data.data.id);
            vereador.fnOnChange('fetching', false);

            return request;

        } catch (error: any) {

            toast({
                title: 'Erro ao recuperar informações do vereador',
                variant: 'destructive',
            })
            cookies.remove('vereador', { path: '/' });

            throw { ok: false, message: error.message || error, data: null }

        }
    };

    const fetchAllUserFromVereador = async () => {
        try {

            const request = await vereadorService.readAllUserFromVereador();
            usersVereador.fnOnChange('user_list', request.data.data);
            usersVereador.fnOnChange('fetching', false);

            return request;

        } catch (error: any) {


            toast({
                title: 'Erro ao recuperar informações os usuários do vereador',
                // description: translateErrorMessage(
                //     emailError ? 'No found user for email ' : error.details.message,
                // ),
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    };

    const fetchAllVereadorFromUser = async () => {
        try {

            const request = await vereadorService.readAllVereadoresFromUser();
            vereadorList.fnOnChange('User_vereadors', request.data.data.User_vereadors);
            vereadorList.fnOnChange('fetching', false);

            return request;

        } catch (error: any) {


            toast({
                title: 'Erro ao recuperar informações os usuários do vereador',
                // description: translateErrorMessage(
                //     emailError ? 'No found user for email ' : error.details.message,
                // ),
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    };

    const fetchUpdateUserFromVereador = async (data: { id: string, role?: string }) => {
        try {

            const request = await vereadorService.editUserRelationship(data);
            fetchAllUserFromVereador();

            return request;

        } catch (error: any) {


            toast({
                title: 'Erro ao recuperar informações os usuários do vereador',
                // description: translateErrorMessage(
                //     emailError ? 'No found user for email ' : error.details.message,
                // ),
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    };



    return {
        fetchVereadorInfo,
        fetchAllUserFromVereador,
        fetchAllVereadorFromUser,
        fetchUpdateUserFromVereador
    }
}

export default useVerador;