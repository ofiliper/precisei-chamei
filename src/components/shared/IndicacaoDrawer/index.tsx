import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useIndicacoes from "@/hooks/useIndicacoes";
import { indicacaoStore } from "@/store/indicacoes/indicacao-store";
import { Check, Loader2, FileText, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useStore } from "zustand";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function IndicacaoDrawer() {
    const indicacaoHook = useIndicacoes();
    const indicacao = useStore(indicacaoStore);
    const [loading, setLoading] = useState<boolean>(false);

    const submitIndicacao = () => {
        const { fetching, action, id_user_vereador, createdAt, User_vereador, ...payload } = indicacao.data;
        setLoading(true);
        indicacaoHook.fetchCreateIndicacao(payload)
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="relative">
            <Tabs defaultValue="indicacao" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="indicacao" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Indicação
                    </TabsTrigger>
                    <TabsTrigger value="acoes" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Ações
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="indicacao">
                    <form className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">
                                    Bairro
                                </label>
                                <select
                                    id="bairro"
                                    name="bairro"
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                >
                                    <option value="">Selecione um bairro</option>
                                    <option value="centro">Centro</option>
                                    <option value="bairro1">Bairro 1</option>
                                    <option value="bairro2">Bairro 2</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="ementa" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ementa
                                </label>
                                <Textarea
                                    id="ementa"
                                    name="ementa"
                                    rows={3}
                                    className="w-full rounded-md border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    placeholder="Digite a ementa da indicação..."
                                    onChange={(e) => indicacao.fnOnChange('ementa', e.target.value)}
                                    value={indicacao.data.ementa}
                                />
                            </div>

                            <div>
                                <label htmlFor="arquivos" className="block text-sm font-medium text-gray-700 mb-1">
                                    Arquivos
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <div className="text-sm text-gray-600">
                                            <label htmlFor="arquivos" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                                                <span>Envie seus arquivos</span>
                                                <Input
                                                    id="arquivos"
                                                    name="arquivos"
                                                    type="file"
                                                    className="sr-only"
                                                    multiple
                                                />
                                            </label>
                                            <p className="pl-1">ou arraste e solte aqui</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, PDF até 10MB</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="texto" className="block text-sm font-medium text-gray-700 mb-1">
                                    Texto
                                </label>
                                <Textarea
                                    id="texto"
                                    name="texto"
                                    rows={4}
                                    className="w-full rounded-md border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    placeholder="Digite o texto da indicação..."
                                    onChange={(e) => indicacao.fnOnChange('texto', e.target.value)}
                                    value={indicacao.data.texto}
                                />
                            </div>

                            <div>
                                <label htmlFor="justificativa" className="block text-sm font-medium text-gray-700 mb-1">
                                    Justificativa
                                </label>
                                <Textarea
                                    id="justificativa"
                                    name="justificativa"
                                    rows={4}
                                    className="w-full rounded-md border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    placeholder="Digite a justificativa da indicação..."
                                    onChange={(e) => indicacao.fnOnChange('justificativa', e.target.value)}
                                    value={indicacao.data.justificativa}
                                />
                            </div>

                            <div>
                                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">
                                    Observações
                                </label>
                                <Textarea
                                    id="observacoes"
                                    name="observacoes"
                                    rows={3}
                                    className="w-full rounded-md border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    placeholder="Digite observações adicionais..."
                                    onChange={(e) => indicacao.fnOnChange('observacoes', e.target.value)}
                                    value={indicacao.data.observacoes}
                                />
                            </div>
                        </div>
                    </form>
                    <div className="sticky bottom-0 bg-white pt-4 border-t">
                        <Button
                            disabled={loading}
                            onClick={submitIndicacao}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Check className="w-5 h-5" />
                            )}
                            {loading ? 'Salvando...' : 'Salvar indicação'}
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="acoes">
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">Histórico de Ações</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 text-sm">
                                    <div className="w-24 flex-shrink-0 text-gray-500">12/12/2023</div>
                                    <div className="flex-1">
                                        <p className="text-gray-900">Indicação criada por João Silva</p>
                                        <p className="text-gray-500 text-xs mt-1">Status alterado para: Em análise</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 text-sm">
                                    <div className="w-24 flex-shrink-0 text-gray-500">13/12/2023</div>
                                    <div className="flex-1">
                                        <p className="text-gray-900">Documento anexado por Maria Santos</p>
                                        <p className="text-gray-500 text-xs mt-1">Arquivo: documento_001.pdf</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>


        </div>
    );
}