import { ChangePassword, Forgot, Signin, Signup, VerifyAcc } from '@/@types/auth'
import { toast } from '@/hooks/use-toast'
import { AuthService } from '@/services/api/auth.service'
import { IndicacaoDTO } from '@/services/indicacoes/indicacao.dto'
import { IndicacoesService } from '@/services/indicacoes/indicacoes.service'
import { VereadorService } from '@/services/vereador/vereador.service'
import { indicacoesStore } from '@/store/indicacoes/indicacoes-store'
import { vereadorStore } from '@/store/vereador/vereador-store'
// import { sessionStore } from '@/store'
import { Cookies } from 'react-cookie'
import { useStore } from 'zustand'

const useIndicacoes = () => {

    const indicacoes = useStore(indicacoesStore);
    const indicacaoService = new IndicacoesService();

    const fetchCreateIndicacao = async (data: IndicacaoDTO) => {
        try {

            const request = await indicacaoService.createIndicacao(data);

            fetchReadAllLiderIndicacoes();
            // indicacoes.fnOnChange('rows', request.data.data.rows);
            // indicacoes.fnOnChange('fetching', false);
            // vereador.fnOnChange('user', request.data.data.User);
            // vereador.fnOnChange('role', request.data.data.role);

            return request;

        } catch (error: any) {
            // const emailError = error.details.message.includes(
            //     'No found user for email ',
            // )

            toast({
                title: 'Erro ao recuperar as indicações',
                // description: translateErrorMessage(
                //     emailError ? 'No found user for email ' : error.details.message,
                // ),
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    };

    const fetchReadAllIndicacoes = async (data?: { page?: number, limit?: number, search?: string }) => {
        try {

            const request = await indicacaoService.readAllIndicacoes(data);
            indicacoes.fnOnChange('rows', request.data.data.rows);
            indicacoes.fnOnChange('fetching', false);
            // vereador.fnOnChange('user', request.data.data.User);
            // vereador.fnOnChange('role', request.data.data.role);

            return request;

        } catch (error: any) {
            // const emailError = error.details.message.includes(
            //     'No found user for email ',
            // )

            toast({
                title: 'Erro ao recuperar as indicações',
                // description: translateErrorMessage(
                //     emailError ? 'No found user for email ' : error.details.message,
                // ),
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    };

    const fetchReadAllLiderIndicacoes = async (data?: { page?: number, limit?: number, search?: string }) => {
        try {

            const request = await indicacaoService.readAllLiderIndicacoes(data);
            indicacoes.fnOnChange('rows', request.data.data.rows);
            indicacoes.fnOnChange('fetching', false);
            // vereador.fnOnChange('user', request.data.data.User);
            // vereador.fnOnChange('role', request.data.data.role);

            return request;

        } catch (error: any) {
            // const emailError = error.details.message.includes(
            //     'No found user for email ',
            // )

            toast({
                title: 'Erro ao recuperar as indicações',
                // description: translateErrorMessage(
                //     emailError ? 'No found user for email ' : error.details.message,
                // ),
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    };



    return {
        fetchReadAllIndicacoes,
        fetchReadAllLiderIndicacoes,
        fetchCreateIndicacao
    }
}

export default useIndicacoes;