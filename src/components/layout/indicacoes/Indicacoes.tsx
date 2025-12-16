'use client';

import DashboardContainer from "@/components/shared/old-dashboard/DashboardContainer";
import IndicacaoDrawer from "@/components/shared/IndicacaoDrawer";
import SekeletonTable from "@/components/shared/SkeletonTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useIndicacoes from "@/hooks/useIndicacoes";
import { indicacaoStore } from "@/store/indicacoes/indicacao-store";
import { indicacoesStore } from "@/store/indicacoes/indicacoes-store";
import { FileText, PlusCircle, Search, Trash2, X, Eye, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

export default function Indicacoes() {
    const indicacaoHook = useIndicacoes();
    const indicacao = useStore(indicacaoStore);
    const indicacoes = useStore(indicacoesStore);

    const { action } = indicacao.data;
    const { rows, fetching } = indicacoes.data;
    
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [limit, setLimit] = useState<string>('30');

    useEffect(() => {
        indicacaoHook.fetchReadAllIndicacoes({});
    }, []);

    const searchIndicacao = () => {
        indicacaoHook.fetchReadAllIndicacoes({
            search: searchTerm,
            limit: ~~limit
        });
    }

    const filteredIndicacoes = rows?.filter(item =>
        item.texto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.User_vereador.User.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardContainer>
            <div className="flex flex-col w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative p-8 border-b bg-gradient-to-r from-purple-600 to-indigo-600">
                    <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:16px]" />
                    <div className="relative flex justify-between items-center">
                        <div className="text-white">
                            <h1 className="text-3xl font-bold">Indicações Legislativas</h1>
                            <p className="mt-2 text-purple-100">
                                Gerencie e acompanhe o progresso das indicações
                            </p>
                        </div>

                        <Button 
                            onClick={() => setIsOpen(true)}
                            className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Nova Indicação
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
                        <SekeletonTable />
                    ) : filteredIndicacoes && filteredIndicacoes.length > 0 ? (
                        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="font-semibold text-gray-700 py-4">Indicação</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-gray-700">Status</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-gray-700">Data</TableHead>
                                        <TableHead className="text-right font-semibold text-gray-700">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredIndicacoes.map((item, i) => (
                                        <TableRow key={i} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 line-clamp-1">{item.texto}</p>
                                                    <span className="text-sm text-gray-500 mt-1 block">{item.User_vereador.User.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
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
                                                        className="text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <Eye size={18} className="mr-2" />
                                                        Detalhes
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Nenhuma indicação encontrada</h3>
                            <p className="mt-2 text-gray-500">
                                Comece criando uma nova indicação para sua lista.
                            </p>
                            <Button 
                                onClick={() => setIsOpen(true)}
                                className="mt-6 bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                <PlusCircle className="w-5 h-5 mr-2" />
                                Criar Indicação
                            </Button>
                        </div>
                    )}

                    <div className="mt-6 flex items-center justify-between text-sm text-gray-600 px-2">
                        <span>Mostrando {filteredIndicacoes?.length || 0} indicações</span>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled>Anterior</Button>
                            <Button variant="outline" size="sm">Próxima</Button>
                        </div>
                    </div>
                </div>

                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetContent className="w-[600px] sm:max-w-[600px] h-screen overflow-y-auto">
                        <SheetHeader className="mb-6">
                            <SheetTitle>{action === 'create' ? 'Nova Indicação' : 'Editar Indicação'}</SheetTitle>
                            <SheetDescription>
                                Preencha os campos necessários para registrar sua indicação.
                            </SheetDescription>
                        </SheetHeader>

                        <IndicacaoDrawer />
                    </SheetContent>
                </Sheet>
            </div>
        </DashboardContainer>
    );
}
