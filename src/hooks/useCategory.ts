import { toast } from '@/hooks/use-toast'
import { CategoryServices } from '@/services/api/category.service'
import { categoryStore } from '@/store/category/category-store'
import { subcategoryStore } from '@/store/subcategory/subcategory-store'
import { useStore } from 'zustand'

const useCategory = () => {

    const categoryServices = new CategoryServices()
    const category = useStore(categoryStore);
    const subcategory = useStore(subcategoryStore);

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

    const fetchSubcategories = async (id_category: string) => {
        try {
            const request: any = await categoryServices.read(id_category)
            subcategory.fnOnChange("id", request.data.data.id)
            subcategory.fnOnChange("name", request.data.data.name)
            subcategory.fnOnChange("Subcategories", request.data.data.Subcategories)
            subcategory.fnOnChange("fetching", false)
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

    return { fetchCategories, fetchSubcategories }
}

export default useCategory