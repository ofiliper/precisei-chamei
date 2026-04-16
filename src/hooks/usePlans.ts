import { toast } from '@/hooks/use-toast'
import { PlansService } from '@/services/api/plan.service';
import { ServicesService } from '@/services/api/services.service' // Ajuste o caminho se necessário
import { plansStore } from '@/store/plans/plans-store';
import { serviceListStore } from '@/store/services/service-list-store';
import { serviceStore } from '@/store/services/services-store';
import { useStore } from 'zustand';

const usePlans = () => {

    const plansService = new PlansService();

    const plans = useStore(plansStore);

    const fetchPlans = async () => {
        try {
            const request = await plansService.readAll();
  
            plans.fnOnChange("rows", request.data.data);
            plans.fnOnChange("fetching", false);
            return request
        } catch (error: any) {
            console.log(error)
            toast({
                title: 'Erro ao carregar planos',
                description: 'Não foi possível buscar a lista de planos.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    }


    return {
        fetchPlans
    }
}

export default usePlans