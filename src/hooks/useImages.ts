import { toast } from '@/hooks/use-toast'
import { ImagesService } from '@/services/api/image.service'
import { imageLibraryStore } from '@/store/image-library/image-library-store'
import { useStore } from 'zustand'
 

const useImages = () => {
    // Instancia o serviço
    const imagesService = new ImagesService()
    const images = useStore(imageLibraryStore)

    // 1. Buscar todas as imagens (readAll)
    const fetchImages = async () => {
        try {
            const request = await imagesService.readAll()
            images.fnOnChange("fetching", false)
            images.fnOnChange("images", request.data.data)
            return request
        } catch (error: any) {
            console.log(error)
            toast({
                title: 'Erro ao carregar imagens',
                description: 'Não foi possível buscar a lista de imagens.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    }

    // 2. Criar/Upload de imagem (create)
    const uploadImage = async (data: { image: any }) => {
        try {

            console.log(data)
            const request = await imagesService.create(data)

            toast({
                title: 'Sucesso!',
                description: 'Imagem enviada com sucesso.',
                variant: 'default',
            })

            return request
        } catch (error: any) {
            console.log(error)
            toast({
                title: 'Erro no upload',
                description: 'Não foi possível enviar a imagem.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error }
        }
    }

    // 3. Remover imagem (remove)
    const deleteImage = async (id_image: string) => {
        try {
            const request = await imagesService.remove(id_image)

            toast({
                title: 'Imagem removida',
                description: 'A imagem foi excluída com sucesso.',
                variant: 'default',
            })

            return request
        } catch (error: any) {
            console.log(error)
            toast({
                title: 'Erro ao excluir',
                description: 'Não foi possível remover a imagem.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error }
        }
    }

    return {
        fetchImages,
        uploadImage,
        deleteImage
    }
}

export default useImages