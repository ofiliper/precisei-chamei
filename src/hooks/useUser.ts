import { toast } from '@/hooks/use-toast'
import { userStore } from '@/store/users/user-store'
import { useStore } from 'zustand'
import { UsersService } from '@/services/api/user.service'

const useUsers = () => {

    const userService = new UsersService();
    const user = useStore(userStore);

    // BUSCAR DADOS
    const fetchUser = async () => {
        try {
            const request = await userService.read();

            // O Axios retorna o JSON dentro de .data, e seu JSON tem um campo .data
            // Estrutura: response.data (axios) -> .data (seu json) -> .name
            const userData = request.data?.data; 

            if (userData) {
                user.fnOnChange("fetching", false);
                // Preenche a store com os dados vindos do banco
                user.fnOnChange("name", userData.name);
                user.fnOnChange("email", userData.email);
            }

            return request;

        } catch (error: any) {
            console.log(error);
            user.fnOnChange("fetching", false);
            return { ok: false, message: error.message || "Erro ao buscar dados", data: null };
        }
    };

    // ATUALIZAR DADOS
    const fetchUpdateUser = async (data: { name?: string; password?: string }) => {
        try {
            const request = await userService.update(data);

            console.log(request)
            // Verifica se a API retornou ok: true (conforme seu JSON)
            if (request.data?.ok === true ) {
                
                // --- AQUI ESTÁ A MÁGICA ---
                // Se atualizou o nome no banco, atualizamos na Store global agora mesmo
                if (data.name) {
                    user.fnOnChange("name", data.name);
                }

                toast({
                    title: 'Perfil atualizado!',
                    description: 'Seus dados foram salvos com sucesso.',
                    variant: 'default',
                    className: 'bg-green-600 text-white border-none' // Estilo opcional
                });
            }

            return request;

        } catch (error: any) {
            console.log(error);
            toast({
                title: 'Erro ao atualizar',
                description: 'Não foi possível salvar as alterações.',
                variant: 'destructive',
            });

            return { ok: false, message: error.message || error, data: null };
        }
    };

    return {
        fetchUser,
        fetchUpdateUser
    };
}

export default useUsers;