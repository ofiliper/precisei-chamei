"use client";

import { useState } from "react";
import DashboardContainer from "@/components/shared/Dashboard/Dashboard";

// --- Dados de Exemplo (Você pode substituir pelos dados reais do Precisei Chamei) ---
const faqData = [
  {
    category: "Geral",
    items: [
      {
        question: "Como funciona a plataforma?",
        answer: "Nossa plataforma conecta você aos melhores prestadores de serviço da região. Basta pesquisar o serviço desejado, comparar os perfis e entrar em contato diretamente.",
      },
      {
        question: "O cadastro é gratuito?",
        answer: "Sim! Para clientes que buscam serviços, o cadastro é totalmente gratuito. Para prestadores, oferecemos planos especiais com diferentes benefícios.",
      },
    ],
  },
  {
    category: "Pagamentos e Segurança",
    items: [
      {
        question: "Quais são as formas de pagamento aceitas?",
        answer: "Aceitamos cartões de crédito, PIX e boleto bancário. Todas as transações são processadas em ambiente seguro e criptografado.",
      },
      {
        question: "É seguro contratar pelo site?",
        answer: "Sim. Todos os prestadores passam por uma verificação de identidade. Além disso, você pode conferir as avaliações de outros usuários antes de fechar negócio.",
      },
    ],
  },
  {
    category: "Conta e Suporte",
    items: [
      {
        question: "Como altero minha senha?",
        answer: "Acesse a aba 'Perfil' no menu lateral, clique em 'Segurança' e siga as instruções para redefinir sua senha.",
      },
      {
        question: "Onde entro em contato com o suporte?",
        answer: "Caso não encontre sua dúvida aqui, você pode abrir um ticket na página de 'Ajuda' ou enviar um e-mail para suporte@preciseichamei.com.br.",
      },
    ],
  },
];

export default function Faq() {
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para controlar qual item está aberto. Ex: "Geral-0"
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  // Lógica de filtro baseada na busca
  const filteredFaqs = faqData.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(section => section.items.length > 0);

  return (
    <DashboardContainer>
      <div className="mx-auto max-w-4xl px-4 py-8">
        
        {/* Cabeçalho */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Perguntas Frequentes
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Tire suas dúvidas sobre nossos serviços e funcionamento.
          </p>

          {/* Barra de Busca */}
          <div className="relative mx-auto mt-8 max-w-xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full rounded-full border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
              placeholder="Busque por uma dúvida (ex: pagamento, cadastro...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de Perguntas */}
        <div className="space-y-8">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((section, sectionIndex) => (
              <div key={sectionIndex} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  {section.category}
                </h3>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => {
                    const uniqueId = `${section.category}-${itemIndex}`;
                    const isOpen = openItem === uniqueId;

                    return (
                      <div
                        key={itemIndex}
                        className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                          isOpen
                            ? "border-green-200 bg-green-50/30 shadow-sm"
                            : "border-slate-200 bg-white hover:border-green-200 hover:bg-slate-50"
                        }`}
                      >
                        <button
                          onClick={() => toggleItem(uniqueId)}
                          className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
                        >
                          <span className={`font-medium ${isOpen ? "text-green-800" : "text-slate-700"}`}>
                            {item.question}
                          </span>
                          <span className="ml-6 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200">
                            <svg
                              className={`h-4 w-4 transform text-slate-500 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </button>
                        
                        {/* Resposta com animação simples */}
                        <div
                          className={`transition-all duration-300 ease-in-out ${
                            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="border-t border-slate-100 px-6 pb-6 pt-2 text-slate-600">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900">Nenhum resultado encontrado</h3>
              <p className="text-slate-500">Tente buscar por outros termos.</p>
            </div>
          )}
        </div>

        {/* Rodapé de contato */}
        <div className="mt-16 rounded-2xl bg-slate-900 px-6 py-10 text-center sm:px-12">
          <h3 className="text-2xl font-bold text-white">Ainda tem dúvidas?</h3>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Não encontrou a resposta que procurava? Nossa equipe de suporte está pronta para ajudar você.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900">
              Falar com Suporte
            </button>
            <button className="rounded-lg bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
              Enviar Email
            </button>
          </div>
        </div>

      </div>
    </DashboardContainer>
  );
}