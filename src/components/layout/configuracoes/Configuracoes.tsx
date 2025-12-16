'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "zustand"
import { vereadorStore } from "@/store/vereador/vereador-store"
import { useState } from "react"
import DashboardContainer from "@/components/shared/old-dashboard/DashboardContainer"
import { Camera, Save, KeyRound, Bell, Trash2, QrCode, RefreshCw, Settings2, Shield, BellRing } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

export default function Configuracoes() {
    const vereador = useStore(vereadorStore);
    const { vereador: vereadorInfo } = vereador.data;
    const [autoProcess, setAutoProcess] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [qrCodeData, setQrCodeData] = useState("https://example.com/qr-code");
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSaveProfile = async () => {
        try {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            toast({
                title: "✨ Perfil atualizado com sucesso!",
                description: "Suas alterações foram salvas e já estão em vigor.",
            });
        } catch (error) {
            toast({
                title: "Oops! Algo deu errado",
                description: "Não foi possível salvar suas alterações. Tente novamente.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }

    const refreshQRCode = () => {
        setQrCodeData(`https://example.com/qr-code?t=${Date.now()}`);
        toast({
            title: "🔄 QR Code atualizado!",
            description: "Seu novo QR Code está pronto para uso.",
        });
    }

    return (
        <DashboardContainer>
            <div className="flex flex-col w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative p-8 border-b bg-gradient-to-r from-purple-600 to-indigo-600">
                    <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:16px]" />
                    <div className="relative flex justify-between items-center">
                        <div className="text-white">
                            <h1 className="text-3xl font-bold">Configurações</h1>
                            <p className="mt-2 text-purple-100">
                                Personalize sua experiência e gerencie sua conta
                            </p>
                        </div>

                        <Button 
                            onClick={handleSaveProfile}
                            className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            disabled={isLoading}
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {isLoading ? 'Salvando...' : 'Salvar alterações'}
                        </Button>
                    </div>
                </div>

                <div className="p-8">
                    <Tabs defaultValue="profile" className="mt-6">
                        <TabsList className="inline-flex bg-muted/50 p-1 rounded-2xl shadow-inner">
                            <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg rounded-xl px-8 py-3 transition-all duration-300">
                                <Settings2 className="w-4 h-4 mr-2" />
                                Perfil
                            </TabsTrigger>
                            <TabsTrigger value="account" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg rounded-xl px-8 py-3 transition-all duration-300">
                                <Shield className="w-4 h-4 mr-2" />
                                Conta
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg rounded-xl px-8 py-3 transition-all duration-300">
                                <BellRing className="w-4 h-4 mr-2" />
                                Notificações
                            </TabsTrigger>
                            <TabsTrigger value="qrcode" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg rounded-xl px-8 py-3 transition-all duration-300">
                                <QrCode className="w-4 h-4 mr-2" />
                                QR Code
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="mt-6">
                            <Card className="p-8 rounded-xl border border-gray-200">
                                <div className="flex items-start gap-8">
                                    <div className="relative group">
                                        <div className="h-40 w-40 rounded-[2rem] bg-cover bg-center bg-no-repeat ring-8 ring-purple-600/10 transition-all duration-500 group-hover:ring-purple-600/20 shadow-2xl transform group-hover:scale-105"
                                            style={{
                                                backgroundImage: `url(${vereadorInfo?.avatar || 'https://www.angradosreis.rj.leg.br/atividade-legislativa/legislaturas/legislatura-2017/leo_marmoraria.png'})`,
                                            }}
                                        />
                                        <Button variant="secondary" size="icon" className="absolute -bottom-3 -right-3 rounded-2xl shadow-lg hover:shadow-xl hover:bg-purple-600/10 p-4 transition-all duration-300 transform hover:scale-110">
                                            <Camera className="h-6 w-6" />
                                        </Button>
                                    </div>
                                    
                                    <div className="flex-1 space-y-8">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Label htmlFor="name" className="text-lg font-medium">Nome completo</Label>
                                                <Input 
                                                    id="name"
                                                    defaultValue={vereadorInfo?.name}
                                                    placeholder="Seu nome completo"
                                                    className="h-12 text-lg rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="role" className="text-lg font-medium">Cargo</Label>
                                                <div className="h-12 flex items-center">
                                                    <Badge variant="secondary" className="text-base px-6 py-2 bg-purple-600/10 text-purple-600">Vereador</Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="description" className="text-lg font-medium">Biografia</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Conte um pouco sobre sua trajetória política..."
                                                className="min-h-[160px] text-lg rounded-xl border-gray-200 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                defaultValue={vereadorInfo?.description || ''}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="account" className="mt-6">
                            <Card className="p-8 rounded-xl border border-gray-200">
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Alterar Senha</h3>
                                        <p className="text-muted-foreground">
                                            Mantenha sua conta segura atualizando sua senha periodicamente
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Senha atual</Label>
                                            <Input
                                                id="current-password"
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="border-gray-200"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">Nova senha</Label>
                                            <Input
                                                id="new-password"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="border-gray-200"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="border-gray-200"
                                            />
                                        </div>
                                    </div>

                                    <Button className="bg-purple-600 hover:bg-purple-700">
                                        <KeyRound className="w-4 h-4 mr-2" />
                                        Atualizar senha
                                    </Button>
                                </div>

                                <Separator className="my-8" />

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-red-600">Zona de Perigo</h3>
                                        <p className="text-muted-foreground">
                                            Ações irreversíveis para sua conta
                                        </p>
                                    </div>

                                    <Button variant="destructive">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Excluir minha conta
                                    </Button>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notifications" className="mt-6">
                            <Card className="p-8 rounded-xl border border-gray-200">
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Preferências de Notificação</h3>
                                        <p className="text-muted-foreground">
                                            Escolha como deseja receber suas notificações
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Notificações por email</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receba atualizações importantes no seu email
                                                </p>
                                            </div>
                                            <Switch
                                                checked={emailNotifications}
                                                onCheckedChange={setEmailNotifications}
                                            />
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Notificações push</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receba notificações em tempo real no seu navegador
                                                </p>
                                            </div>
                                            <Switch
                                                checked={pushNotifications}
                                                onCheckedChange={setPushNotifications}
                                            />
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Processamento automático</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Permitir que o sistema processe automaticamente suas solicitações
                                                </p>
                                            </div>
                                            <Switch
                                                checked={autoProcess}
                                                onCheckedChange={setAutoProcess}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="qrcode" className="mt-6">
                            <Card className="p-8 rounded-xl border border-gray-200">
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">QR Code de Acesso</h3>
                                        <p className="text-muted-foreground">
                                            Use este QR Code para acessar rapidamente seu perfil
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center space-y-6">
                                        <div className="bg-white p-4 rounded-xl shadow-lg">
                                            <img
                                                src={qrCodeData}
                                                alt="QR Code"
                                                className="w-48 h-48"
                                            />
                                        </div>

                                        <Button
                                            onClick={refreshQRCode}
                                            variant="outline"
                                            className="w-full max-w-sm"
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Gerar novo QR Code
                                        </Button>

                                        <p className="text-sm text-muted-foreground text-center max-w-sm">
                                            Por segurança, recomendamos que você gere um novo QR Code periodicamente
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DashboardContainer>
    )
}
