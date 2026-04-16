"use client";

import { useEffect, useState, useRef } from "react";
import DashboardContainer from "@/components/shared/Dashboard/Dashboard";
import usePlans from "@/hooks/usePlans";
import { plansStore } from "@/store/plans/plans-store";
import { useStore } from "zustand";
import {
    CreditCard,
    QrCode,
    CheckCircle2,
    Star,
    Copy,
    Loader2,
    X
} from "lucide-react";
import useSubscription from "@/hooks/useSubscription";
import { useRouter } from "next/navigation";

// Tipagem do retorno do PIX baseada no seu exemplo
interface PixResponse {
    paymentId: string;
    qrCode: string;
    qrCodeBase64: string;
}

const formatCurrency = (valueInCents: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valueInCents / 100);
};

export default function Assinar() {
    const plansHook = usePlans();
    const plans = useStore(plansStore);
    const subscriptionHook = useSubscription();
    const route = useRouter();

    const [loading, setLoading] = useState(false);

    // Estados para controle do PIX
    const [pixData, setPixData] = useState<PixResponse | null>(null);
    const [isPixModalOpen, setIsPixModalOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"PENDING" | "PAID">("PENDING");

    // Ref para controlar o intervalo e evitar memory leaks
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        plansHook.fetchPlans();
    }, []);

    // Effect para consultar o status do pagamento enquanto o modal estiver aberto e pendente
    useEffect(() => {
        if (isPixModalOpen && pixData?.paymentId && paymentStatus === "PENDING") {

            // Função de consulta
            const checkPayment = async () => {
                try {
                    console.log(`Consultando status do pagamento ID: ${pixData.paymentId}...`);
                    const response = await subscriptionHook.consultPix(pixData.paymentId);


                    if (response?.data.data.status === "approved" || response?.data.data.status === "paid" || response.data.data === true) {
                        setPaymentStatus("PAID");
                        if (pollingRef.current) clearInterval(pollingRef.current);
                    }
                } catch (error) {
                    console.error("Erro ao consultar PIX", error);
                }
            };

            // Inicia o intervalo de 3 segundos
            pollingRef.current = setInterval(checkPayment, 3000);
        }

        // Limpeza do intervalo ao fechar modal ou desmontar componente
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [isPixModalOpen, pixData, paymentStatus, subscriptionHook]);

    const sortedPlans = plans?.data?.rows?.sort((a, b) => a.duration - b.duration) || [];

    const handleSubscribe = async (plan: string, method: "CREDIT_CARD" | "PIX") => {
        setLoading(true);
        if (method === "CREDIT_CARD") {
            const response = await subscriptionHook.createStripeLink(plan)
            console.log(`Iniciando checkout do plano ${plan} via Cartão de Crédito`);
            // Lógica do cartão aqui...
        }
        if (method === "PIX") {
            try {
                // Gera o PIX e espera o retorno
                const response = await subscriptionHook.generatePix(plan);

                console.log(response)

                // Supondo que 'response' já venha no formato { paymentId, qrCode, qrCodeBase64 }
                if (response && response.data.data.paymentId) {
                    setPixData(response.data.data);
                    setPaymentStatus("PENDING");
                    setIsPixModalOpen(true);
                }
            } catch (error) {
                console.error("Erro ao gerar PIX", error);
                alert("Erro ao gerar o QR Code. Tente novamente.");
            }
        }
        setLoading(false);
    };

    const handleCopyPix = () => {
        if (pixData?.qrCode) {
            navigator.clipboard.writeText(pixData.qrCode);
            alert("Código PIX copiado!");
        }
    };

    const handleCloseModal = () => {
        // Se o pagamento foi feito, recarrega a página ao fechar
        if (paymentStatus === "PAID") {
            route.push("./dashboard");
        } else {
            setIsPixModalOpen(false);
            setPixData(null);
            if (pollingRef.current) clearInterval(pollingRef.current);
        }
    };

    return (
        <DashboardContainer>
            <div className="mx-auto max-w-6xl px-4 py-8 relative">

                {/* MODAL DE PIX */}
                {isPixModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">

                            {/* Cabeçalho do Modal */}
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-slate-800">
                                    {paymentStatus === "PAID" ? "Pagamento Confirmado!" : "Pagamento via PIX"}
                                </h3>
                                {paymentStatus !== "PAID" && (
                                    <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {/* Conteúdo do Modal */}
                            <div className="p-6 flex flex-col items-center text-center">

                                {paymentStatus === "PENDING" ? (
                                    <>
                                        <p className="text-sm text-slate-600 mb-4">
                                            Escaneie o QR Code abaixo ou copie o código para finalizar sua assinatura.
                                        </p>

                                        {/* Imagem QR Code Base64 */}
                                        <div className="bg-white p-2 border-2 border-slate-100 rounded-xl mb-4 shadow-sm">
                                            {pixData?.qrCodeBase64 ? (
                                                <img
                                                    src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                                                    alt="QR Code PIX"
                                                    className="w-48 h-48 object-contain"
                                                />
                                            ) : (
                                                <div className="w-48 h-48 flex items-center justify-center bg-slate-50 rounded-lg">
                                                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Código Copia e Cola */}
                                        <div className="w-full relative mb-6">
                                            <div className="bg-slate-100 p-3 rounded-lg text-xs text-slate-500 break-all font-mono text-left pr-10 border border-slate-200 h-20 overflow-y-auto">
                                                {pixData?.qrCode}
                                            </div>
                                            <button
                                                onClick={handleCopyPix}
                                                className="absolute top-2 right-2 p-1.5 bg-white rounded-md shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                                                title="Copiar código"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Loading Status */}
                                        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Aguardando pagamento...
                                        </div>
                                    </>
                                ) : (
                                    // TELA DE SUCESSO
                                    <div className="py-6 flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Obrigado!</h2>
                                        <p className="text-slate-600 mb-8 max-w-xs">
                                            Seu pagamento foi recebido com sucesso. Sua assinatura já está ativa.
                                        </p>

                                        <button
                                            onClick={() => route.push("/dashboard")}
                                            className="w-full bg-slate-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-1"
                                        >
                                            Atualizar Painel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Cabeçalho */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                        Escolha seu plano
                    </h1>
                    <p className="mt-4 text-lg text-slate-600">
                        Comece agora e tenha acesso completo aos melhores serviços.
                    </p>
                </div>

                {/* Grid de Planos */}
                <div className="grid gap-8 md:grid-cols-3 lg:gap-8 items-start">
                    {plans.data.fetching ? (
                        // Loading Skeleton
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-96 animate-pulse rounded-2xl bg-slate-100 border border-slate-200" />
                        ))
                    ) : sortedPlans.length > 0 ? (
                        sortedPlans.map((plan) => {
                            const isRecommended = plan.raw === "ANUAL";
                            const months = Math.round(plan.duration / 30);
                            const priceReal = plan.value / 100;
                            const equivalentMonthlyPrice = priceReal / (months || 1);

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isRecommended
                                        ? "border-green-500 ring-2 ring-green-500 ring-offset-2 z-10 scale-105 md:scale-100 lg:scale-105"
                                        : "border-slate-200"
                                        }`}
                                >
                                    {isRecommended && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-green-600 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
                                            <Star className="h-3 w-3 fill-current" />
                                            Melhor Escolha
                                        </div>
                                    )}

                                    <div className="mb-4 text-center">
                                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                        <p className="text-sm text-slate-500">
                                            {plan.raw === "MENSAL"
                                                ? "Pagamento recorrente"
                                                : `Faturamento único de ${formatCurrency(plan.value)}`}
                                        </p>
                                    </div>

                                    <div className="mb-6 flex flex-col items-center justify-center border-b border-slate-100 pb-6">
                                        <div className="flex items-baseline text-slate-900">
                                            <span className="text-4xl font-extrabold tracking-tight">
                                                {months > 1
                                                    ? formatCurrency(Math.round(equivalentMonthlyPrice * 100))
                                                    : formatCurrency(plan.value)
                                                }
                                            </span>
                                            <span className="ml-1 text-xl font-semibold text-slate-500">
                                                /mês
                                            </span>
                                        </div>
                                        {months > 1 && (
                                            <span className="mt-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                Economize assinando o {plan.name}
                                            </span>
                                        )}
                                    </div>

                                    <ul className="mb-8 space-y-4 text-sm text-slate-600 flex-1">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                            <span>Acesso completo à plataforma</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                            <span>Suporte prioritário via WhatsApp</span>
                                        </li>
                                    </ul>

                                    <div className="mt-auto space-y-3">
                                        <button
                                            disabled={loading}
                                            onClick={() => handleSubscribe(plan.raw, "CREDIT_CARD")}
                                            className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 px-4 text-sm font-semibold transition-colors shadow-sm bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50`}
                                        >
                                            <CreditCard className="h-4 w-4" />
                                            Pagar com Cartão
                                        </button>

                                        <button
                                            disabled={loading}
                                            onClick={() => handleSubscribe(plan.raw, "PIX")}
                                            className="group flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-3 px-4 text-sm font-semibold text-slate-700 transition-all hover:border-green-500 hover:bg-green-50 hover:text-green-700 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4 text-slate-500 group-hover:text-green-600" />}
                                            Pagar com PIX
                                        </button>
                                    </div>

                                    <p className="mt-4 text-center text-xs text-slate-400">
                                        {plan.raw === "MENSAL"
                                            ? "Cancele quando quiser."
                                            : "Parcela única, sem reembolso parcial."}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-3 py-12 text-center">
                            <p className="text-slate-500">Nenhum plano disponível no momento.</p>
                        </div>
                    )}
                </div>

                <div className="mx-auto mt-20 max-w-2xl text-center">
                    <h3 className="text-lg font-semibold text-slate-900">Dúvidas frequentes</h3>
                    <div className="mt-6 grid gap-6 text-left sm:grid-cols-2">
                        <div>
                            <h4 className="font-medium text-slate-900">Aprovação imediata?</h4>
                            <p className="mt-2 text-sm text-slate-500">Sim, tanto no PIX quanto no Cartão o acesso é liberado na hora.</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-slate-900">É seguro?</h4>
                            <p className="mt-2 text-sm text-slate-500">Utilizamos gateways de pagamento criptografados e seguros.</p>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardContainer>
    );
}