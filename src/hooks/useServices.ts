import { toast } from '@/hooks/use-toast'
import { ServicesService } from '@/services/api/services.service' // Ajuste o caminho se necessário
import { serviceListStore } from '@/store/services/service-list-store';
import { serviceStore } from '@/store/services/services-store';
import { useStore } from 'zustand';

const useServices = () => {

    const servicesService = new ServicesService();
    const servicesList = useStore(serviceListStore);
    const service = useStore(serviceStore);

    // 1. Listar todos os serviços (readAll)
    const fetchOneService = async (id: string) => {
        try {
            const request = await servicesService.readOne(id);
            console.log(request)
            service.fnOnChange("id", request.data.data?.id || null);
            service.fnOnChange("id_workspace", request.data.data.id_workspace);
            service.fnOnChange("id_category", request.data.data.id_category);
            service.fnOnChange("id_subcategory", request.data.data.id_subcategory);
            service.fnOnChange("whatsapp", request.data.data.whatsapp);
            service.fnOnChange("name", request.data.data.name);
            service.fnOnChange("logo_image", request.data.data.logo_image);
            service.fnOnChange("cover_image", request.data.data.cover_image);
            service.fnOnChange("content", request.data.data.content);
            service.fnOnChange("gallery", request.data.data.gallery);
            service.fnOnChange("address", request.data.data.Address);
            service.fnOnChange("fetching", false);
            return request
        } catch (error: any) {
            console.log(error)
            toast({
                title: 'Erro ao carregar serviços',
                description: 'Não foi possível buscar a lista de serviços.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    }

    const fetchServices = async () => {
        try {
            const request = await servicesService.readAll();
            servicesList.fnOnChange("services", request.data.data);
            servicesList.fnOnChange("fetching", false);
            return request
        } catch (error: any) {
            console.log(error)
            toast({
                title: 'Erro ao carregar serviços',
                description: 'Não foi possível buscar a lista de serviços.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    }

    // 2. Criar serviço (create)
    // Notei que seu service pede { image: any }, mantive a tipagem.
    const createService = async (data: any) => {
        try {
            const request = await servicesService.create(data)

            toast({
                title: 'Serviço criado',
                description: 'O novo serviço foi cadastrado com sucesso.',
                variant: 'default',
            })

            return request
        } catch (error: any) {
            toast({
                title: 'Erro ao criar',
                description: 'Não foi possível cadastrar o serviço.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error }
        }
    }

    const updateService = async (id_service: string, data: any) => {
        try {
            const request = await servicesService.update(id_service, data)

            toast({
                title: 'Serviço atualizado',
                description: 'O serviço foi atualizado com sucesso.',
                variant: 'default',
            })

            return request
        } catch (error: any) {
            toast({
                title: 'Erro ao criar',
                description: 'Não foi possível atualizar o serviço.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error }
        }
    }

    // 3. Remover serviço (remove)
    const deleteService = async (id: string) => {
        try {
            const request = await servicesService.remove(id)

            toast({
                title: 'Serviço removido',
                description: 'O serviço foi excluído com sucesso.',
                variant: 'default',
            })
            fetchServices();
            return request
        } catch (error: any) {
            toast({
                title: 'Erro ao excluir',
                description: 'Não foi possível remover o serviço.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error }
        }
    }

    return {
        fetchServices,
        fetchOneService,
        createService,
        updateService,
        deleteService
    }
}

export default useServices