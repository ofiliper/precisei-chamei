'use client';

import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { Filter, PlusCircle, Search, Trash2, Lock, UnlockIcon, X, FileText, Pencil } from "lucide-react";

import DashboardContainer from "@/components/shared/old-dashboard/DashboardContainer";
import SkeletonTable from "@/components/shared/SkeletonTable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

import useVerador from "@/hooks/useVereador";
import { roleMap } from "@/constants/role-map";
import { UserRoleENUM } from "@/services/user/user.enum";
import { vereadorStore } from "@/store/vereador/vereador-store";
import { usersVereadorStore } from "@/store/users/users-vereador-store";

interface AddUserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (userData: any) => void;
}

interface DeleteUserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onDelete: () => void;
}

interface BlockUserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onBlock: () => void;
    isBlocking: boolean;
}

function AddUserDialog({ isOpen, onClose, onAdd }: AddUserDialogProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRoleENUM>(UserRoleENUM.ASSESSOR);

    const handleSubmit = () => {
        onAdd({ name, email, role });
        onClose();
        setName('');
        setEmail('');
        setRole(UserRoleENUM.ASSESSOR);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                    <DialogDescription>
                        Preencha os dados do novo usuário para adicionar ao sistema.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            placeholder="Digite o nome do usuário"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Digite o email do usuário"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Permissão</Label>
                        <Select value={role} onValueChange={(value) => setRole(value as UserRoleENUM)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma permissão" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(roleMap).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                        {value.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Adicionar Usuário</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DeleteUserDialog({ isOpen, onClose, user, onDelete }: DeleteUserDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir Usuário</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir o usuário {user?.name}? Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button variant="destructive" onClick={onDelete}>Excluir</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function BlockUserDialog({ isOpen, onClose, user, onBlock, isBlocking }: BlockUserDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isBlocking ? 'Bloquear' : 'Desbloquear'} Usuário</DialogTitle>
                    <DialogDescription>
                        {isBlocking 
                            ? `Tem certeza que deseja bloquear o acesso de ${user?.name}?`
                            : `Tem certeza que deseja desbloquear o acesso de ${user?.name}?`
                        }
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button variant={isBlocking ? "destructive" : "default"} onClick={onBlock}>
                        {isBlocking ? 'Bloquear' : 'Desbloquear'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function UsuariosPermissoes() {
    const vereadorHook = useVerador();
    const userVereador = useStore(usersVereadorStore);
    const vereador = useStore(vereadorStore);
    const { id, role } = vereador.data;
    const { user_list, fetching } = userVereador.data;
    
    const [searchTerm, setSearchTerm] = useState('');
    const [limit, setLimit] = useState<string>('30');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{id: string, name: string, approved?: boolean} | null>(null);
    const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<UserRoleENUM | null>(null);

    useEffect(() => {
        vereadorHook.fetchAllUserFromVereador();
    }, []);

    const handleAddUser = async (userData: any) => {
        try {
            await vereadorHook.createUserVereador(userData);
            setIsAddDialogOpen(false);
            toast({
                title: "Usuário adicionado com sucesso!",
                description: "O novo usuário foi criado e já pode acessar o sistema.",
            });
            vereadorHook.fetchAllUserFromVereador(); // Refresh list
        } catch (error) {
            toast({
                title: "Erro ao adicionar usuário",
                description: "Não foi possível adicionar o usuário. Tente novamente.",
                variant: "destructive"
            });
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        
        try {
            await vereadorHook.deleteUserVereador(selectedUser.id);
            setIsDeleteDialogOpen(false);
            toast({
                title: "Usuário excluído com sucesso!",
                description: "O usuário foi removido permanentemente do sistema.",
            });
            vereadorHook.fetchAllUserFromVereador(); // Refresh list
        } catch (error) {
            toast({
                title: "Erro ao excluir usuário",
                description: "Não foi possível excluir o usuário. Tente novamente.",
                variant: "destructive"
            });
        }
    };

    const handleBlockUser = async () => {
        if (!selectedUser) return;
        
        try {
            await vereadorHook.toggleBlockUserVereador(selectedUser.id);
            setIsBlockDialogOpen(false);
            toast({
                title: selectedUser.approved ? "Usuário bloqueado!" : "Usuário desbloqueado!",
                description: selectedUser.approved 
                    ? "O acesso do usuário foi bloqueado com sucesso."
                    : "O acesso do usuário foi restaurado com sucesso.",
            });
            vereadorHook.fetchAllUserFromVereador(); // Refresh list
        } catch (error) {
            toast({
                title: "Erro ao alterar acesso",
                description: "Não foi possível alterar o acesso do usuário. Tente novamente.",
                variant: "destructive"
            });
        }
    };

    const handleRoleChange = async (userId: string, newRole: UserRoleENUM) => {
        try {
            await vereadorHook.fetchUpdateUserFromVereador({ userId, role: newRole });
            toast({
                title: "Permissão alterada com sucesso!",
                description: "A permissão do usuário foi atualizada.",
            });
            vereadorHook.fetchAllUserFromVereador(); // Refresh list
        } catch (error) {
            toast({
                title: "Erro ao alterar permissão",
                description: "Não foi possível alterar a permissão do usuário. Tente novamente.",
                variant: "destructive"
            });
        }
    };

    const filteredUsers = user_list?.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardContainer>
            <div className="flex flex-col w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative p-8 border-b bg-gradient-to-r from-purple-600 to-indigo-600">
                    <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:16px]" />
                    <div className="relative flex justify-between items-center">
                        <div className="text-white">
                            <h1 className="text-3xl font-bold">Usuários e Permissões</h1>
                            <p className="mt-2 text-purple-100">
                                Gerencie os usuários e suas permissões de acesso ao sistema
                            </p>
                        </div>

                        <Button 
                            onClick={() => setIsAddDialogOpen(true)}
                            className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Novo Usuário
                        </Button>
                    </div>
                </div>

                <div className="p-8">
                    <div className="mb-8">
                        <div className="flex items-center justify-between gap-6">
                            <div className="relative flex-1 max-w-xl">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="text-gray-400" size={20} />
                                </div>
                                <Input 
                                    className="pl-12 pr-12 py-6 text-base rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                                    placeholder="Buscar por usuário..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <Button variant="outline" className="gap-2">
                                    <Filter size={18} />
                                    Filtros
                                </Button>

                                <Select
                                    onValueChange={setLimit}
                                    defaultValue="30"
                                >
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Exibir 30" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[30, 50, 100].map(value => (
                                            <SelectItem 
                                                key={value}
                                                value={value.toString()}
                                                className="cursor-pointer"
                                            >
                                                Exibir {value} itens
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {fetching ? (
                        <SkeletonTable />
                    ) : filteredUsers && filteredUsers.length > 0 ? (
                        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="font-semibold text-gray-700 py-4">Nome</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-gray-700">Permissões</TableHead>
                                        <TableHead className="text-right font-semibold text-gray-700">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((item, i) => (
                                        <TableRow key={i} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>
                                                {editingRoleId === item.id ? (
                                                    <Select 
                                                        value={selectedRole || item.User_vereadors[0].role}
                                                        onValueChange={(value) => {
                                                            setSelectedRole(value as UserRoleENUM);
                                                            handleRoleChange(item.id, value as UserRoleENUM);
                                                            setEditingRoleId(null);
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-[160px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.entries(roleMap).map(([key, value]) => (
                                                                <SelectItem key={key} value={key}>
                                                                    {value.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${roleMap[item.User_vereadors[0].role as UserRoleENUM].style}`}>
                                                            {roleMap[item.User_vereadors[0].role as UserRoleENUM]?.name}
                                                        </span>
                                                        <Button
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => setEditingRoleId(item.id)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    {id !== item.User_vereadors[0].id && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant={item.User_vereadors[0].approved ? "destructive" : "default"}
                                                                onClick={() => {
                                                                    setSelectedUser({
                                                                        id: item.id,
                                                                        name: item.name,
                                                                        approved: item.User_vereadors[0].approved
                                                                    });
                                                                    setIsBlockDialogOpen(true);
                                                                }}
                                                            >
                                                                {item.User_vereadors[0].approved ? (
                                                                    <Lock className="h-4 w-4" />
                                                                ) : (
                                                                    <UnlockIcon className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                onClick={() => {
                                                                    setSelectedUser({
                                                                        id: item.id,
                                                                        name: item.name
                                                                    });
                                                                    setIsDeleteDialogOpen(true);
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gray-50/50 rounded-xl border-2 border-dashed">
                            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Nenhum usuário encontrado</h3>
                            <p className="mt-2 text-gray-600 text-center max-w-sm mx-auto">
                                Comece adicionando um novo usuário ao sistema para gerenciar permissões.
                            </p>
                            <Button
                                onClick={() => setIsAddDialogOpen(true)}
                                className="mt-6"
                            >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Novo Usuário
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <AddUserDialog 
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onAdd={handleAddUser}
            />

            <DeleteUserDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                user={selectedUser}
                onDelete={handleDeleteUser}
            />

            <BlockUserDialog
                isOpen={isBlockDialogOpen}
                onClose={() => setIsBlockDialogOpen(false)}
                user={selectedUser}
                onBlock={handleBlockUser}
                isBlocking={selectedUser?.approved || false}
            />
        </DashboardContainer>
    );
}
