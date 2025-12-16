'use client';

import DashboardContainer from "@/components/shared/old-dashboard/DashboardContainer";
import IndicacaoDrawer from "@/components/shared/IndicacaoDrawer";
import SekeletonTable from "@/components/shared/SkeletonTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useIndicacoes from "@/hooks/useIndicacoes";
import { indicacaoStore } from "@/store/indicacoes/indicacao-store";
import { indicacoesStore } from "@/store/indicacoes/indicacoes-store";
import { FileText, PlusCircle, Search, Trash2, X, Eye, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

export default function MinhasIndicacoes() {
    const indicacaoHook = useIndicacoes();
    const indicacao = useStore(indicacaoStore);
    const indicacoes = useStore(indicacoesStore);

    const { action } = indicacao.data;
    const { rows, fetching } = indicacoes.data;

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [limit, setLimit] = useState<string>('30');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [indicacaoToDelete, setIndicacaoToDelete] = useState<any>(null);

    useEffect(() => {
        indicacaoHook.fetchReadAllLiderIndicacoes({});
    }, []);

    const handleNewIndicacao = () => {
        indicacao.fnOnChange('action', 'create');
        setIsOpen(true);
    };

    const handleEditIndicacao = (item: any) => {
        indicacao.fnOnChange('action', 'update');
        indicacao.fnOnChange('id', item.id);
        indicacao.fnOnChange('texto', item.texto);
        setIsOpen(true);
    };

    const handleDeleteClick = (item: any) => {
        setIndicacaoToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (indicacaoToDelete) {
            try {
                await indicacaoHook.fetchReadAllLiderIndicacoes({});
            } catch (error) {
                console.error('Error deleting indicacao:', error);
            }
        }
        setDeleteDialogOpen(false);
        setIndicacaoToDelete(null);
    };

    const filteredIndicacoes = rows?.filter(item =>
        item.texto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.User_vereador.User.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardContainer>
            <div className="flex flex-col w-full bg-white rounded-2xl shadow-lg">
                <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 p-8 md:p-10 rounded-t-2xl">
                    <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:16px]" />
                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="text-white">
                            <h1 className="text-2xl md:text-3xl font-bold">Minhas Indicações</h1>
                            <p className="mt-2 text-purple-100">
                                Gerencie e acompanhe todas as suas indicações legislativas
                            </p>
                        </div>

                        <Button 
                            onClick={handleNewIndicacao}
                            className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Nova Indicação
                        </Button>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-xl">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="text-gray-400" size={20} />
                                </div>
                                <Input 
                                    className="pl-12 pr-12 py-6 text-base rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                                    placeholder="Buscar por indicação ou vereador..." 
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

                            <div className="flex items-center gap-3">
                                <Button variant="outline" className="gap-2">
                                    <Filter size={18} />
                                    Filtros
                                </Button>

                                <Select
                                    onValueChange={setLimit}
                                    defaultValue="30"
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue placeholder="Exibir 30" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[30, 50, 100].map(value => (
                                            <SelectItem 
                                                key={value}
                                                value={value.toString()}
                                                className="cursor-pointer"
                                            >
                                                Exibir {value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {fetching ? (
                        <SekeletonTable />
                    ) : filteredIndicacoes && filteredIndicacoes.length > 0 ? (
                        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="font-semibold min-w-[300px]">Indicação</TableHead>
                                        <TableHead className="w-[150px] font-semibold">Status</TableHead>
                                        <TableHead className="w-[150px] font-semibold">Data</TableHead>
                                        <TableHead className="text-right font-semibold">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredIndicacoes.map((item, i) => (
                                        <TableRow key={i} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-gray-900 line-clamp-1">{item.texto}</p>
                                                    <span className="text-sm text-gray-500">{item.User_vereador.User.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    Ativo
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-gray-600">
                                                    {new Date().toLocaleDateString()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-gray-700 hidden md:flex hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
                                                        onClick={() => handleEditIndicacao(item)}
                                                    >
                                                        <Eye size={16} className="mr-1" />
                                                        Detalhes
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-gray-700 md:hidden hover:bg-purple-50 hover:text-purple-700"
                                                        onClick={() => handleEditIndicacao(item)}
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        onClick={() => handleDeleteClick(item)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                <FileText size={32} className="text-purple-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Nenhuma indicação encontrada</h3>
                            <p className="mt-2 text-gray-600 text-center max-w-sm">
                                Comece criando uma nova indicação para sua lista.
                            </p>
                            <Button
                                onClick={handleNewIndicacao}
                                className="mt-6 bg-purple-600 hover:bg-purple-700"
                            >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Criar Indicação
                            </Button>
                        </div>
                    )}

                    <div className="mt-6 flex items-center justify-between text-sm text-gray-600 px-2">
                        <span>Total de {filteredIndicacoes?.length || 0} indicações</span>
                        <span>Página 1 de 1</span>
                    </div>
                </div>

                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetContent className="w-full md:w-[600px] sm:max-w-[600px] h-screen overflow-y-auto">
                        <SheetHeader className="mb-6">
                            <SheetTitle>{action === 'create' ? 'Nova Indicação' : 'Editar Indicação'}</SheetTitle>
                            <SheetDescription>
                                Preencha os campos necessários para registrar sua indicação.
                            </SheetDescription>
                        </SheetHeader>

                        <IndicacaoDrawer />
                    </SheetContent>
                </Sheet>

                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent className="max-w-md rounded-xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tem certeza que deseja excluir esta indicação? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="hover:bg-gray-100">Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleConfirmDelete}
                                className="bg-red-600 text-white hover:bg-red-700"
                            >
                                Excluir
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DashboardContainer>
    );
}