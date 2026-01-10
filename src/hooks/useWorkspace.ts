import { toast } from '@/hooks/use-toast'
import { WorkspaceService } from '@/services/api/workspace.service'
import { workspaceListStore } from '@/store/workspace/workspace-list-store'
import { workspaceStore } from '@/store/workspace/workspace-store'
import { useStore } from 'zustand'

const useWorkspace = () => {

    const workspaceService = new WorkspaceService()
    const workspace = useStore(workspaceStore)
    const workspaceList = useStore(workspaceListStore)

    // 1. Buscar dados do Workspace
    const fetchWorkspace = async () => {
        try {
            const request = await workspaceService.read()

            const userData = request.data.data?.User_workspaces?.[0]?.User
                ? {
                    name: request.data.data.User_workspaces[0].User.name,
                    email: request.data.data.User_workspaces[0].User.email,
                }
                : { name: '', email: '' };

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

    const fetchAllWorkspaces = async () => {
        try {
            const request = await workspaceService.readAll()

            workspaceList.fnOnChange("fetching", false)
            workspaceList.fnOnChange("rows", request.data.data)


            return request
        } catch (error: any) {
            console.log(error)
            toast({
                title: 'Erro ao carregar os workspaces',
                description: 'Não foi possível buscar as informações da conta.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    }

    return {
        fetchWorkspace,
        fetchAllWorkspaces,
    }
}

export default useWorkspace