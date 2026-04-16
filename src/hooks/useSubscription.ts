import { toast } from '@/hooks/use-toast'
import { SubscriptionService } from '@/services/api/subscription.service';
import { plansStore } from '@/store/plans/plans-store';
import { useStore } from 'zustand';

const useSubscription = () => {

    const subscriptionService = new SubscriptionService();

    const plans = useStore(plansStore);

    // '/generate-stripe-link',
    //     '/generate-pix',
    //     '/consult-pix',

    // generateStripeLink
    // generatePix
    const createStripeLink = async (plan: string) => {
        try {
            const request = await subscriptionService.createStripeLink(plan);

            // plans.fnOnChange("rows", request.data.data);
            // plans.fnOnChange("fetching", false);
            return request
        } catch (error: any) {
            console.log(error)
            toast({
                title: 'Erro ao carregar assinaturas',
                description: 'Não foi possível buscar a lista de assinaturas.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    }
    const generatePix = async (plan: string) => {
        try {
            const request = await subscriptionService.generatePix(plan);

            // plans.fnOnChange("rows", request.data.data);
            // plans.fnOnChange("fetching", false);
            return request
        } catch (error: any) {
            console.log(error)
            toast({
                title: 'Erro ao carregar assinaturas',
                description: 'Não foi possível buscar a lista de assinaturas.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    }
    const consultPix = async (id_payment: string) => {
        try {
            const request = await subscriptionService.consultPix(id_payment);

            // plans.fnOnChange("rows", request.data.data);
            // plans.fnOnChange("fetching", false);
            return request
        } catch (error: any) {
            console.log(error)
            toast({
                title: 'Erro ao carregar assinaturas',
                description: 'Não foi possível buscar a lista de assinaturas.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    }


    return {
        createStripeLink,
        generatePix,
        consultPix,
    }
}

export default useSubscription