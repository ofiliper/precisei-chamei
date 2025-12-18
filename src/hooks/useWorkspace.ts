import { toast } from '@/hooks/use-toast'
import { WorkspaceService } from '@/services/api/workspace.service'
import { workspaceStore } from '@/store/workspace/workspace-store'
import { useStore } from 'zustand'

const useWorkspace = () => {

    const workspaceService = new WorkspaceService()
    const workspace = useStore(workspaceStore)

    // 1. Buscar dados do Workspace
    const fetchWorkspace = async () => {
        try {
            const request = await workspaceService.read()

            const userData = request.data.data?.User_workspaces?.[0]?.User 
                ? {
                    name: request.data.data.User_workspaces[0].User.name,
                    email: request.data.data.User_workspaces[0].User.email,
                  }
                : { name: '', email: '' }; // Fallback seguro

            // Atualiza a Store Global (Zustand)
            workspace.fnOnChange("id", request.data.data.id)
            workspace.fnOnChange("name", request.data.data.name)
            workspace.fnOnChange("user", userData)
            workspace.fnOnChange("fetching", false)

            return request
        } catch (error: any) {
            console.log(error)
            toast({
                title: 'Erro ao carregar o workspace',
                description: 'Não foi possível buscar as informações da conta.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    }

    return {
        fetchWorkspace,
    }
}

export default useWorkspace