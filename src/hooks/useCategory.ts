import { toast } from '@/hooks/use-toast'
import { CategoryServices } from '@/services/api/category.service'
import { ServicesService } from '@/services/api/services.service' // Ajuste o caminho se necessário
import { categoryStore } from '@/store/category/category-store'
import { useStore } from 'zustand'

const useCategory = () => {

    const categoryServices = new CategoryServices()
    const category = useStore(categoryStore);

    // const categoryService = new CategoryServiceMock() // Ou new CategoryService()

    const fetchCategories = async () => {
        try {
            const request: any = await categoryServices.readAll()
            category.fnOnChange("rows", request.data.data)
            category.fnOnChange("fetching", false)
            return request
        } catch (error: any) {
            console.log(error)
            toast({
                title: 'Erro ao carregar categorias',
                description: 'Não foi possível buscar a lista.',
                variant: 'destructive',
            })
            return { ok: false, message: error.message || error, data: [] }
        }
    }

    return { fetchCategories }
}

export default useCategory