import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#F5F6F3] pt-16 pb-8 border-t border-gray-100">
            {/* Mudei de w-[1100px] para max-w-[1100px] w-full */}
            <div className="max-w-[1100px] w-full mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

                {/* Brand */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        {/* Adicionei alt para acessibilidade */}
                        <img 
                            src="precisei-chamei-min.svg" 
                            className="w-[80px]" 
                            alt="Logo Precisei Chamei" 
                        />
                    </div>
                    <p className="text-sm text-slate-500 max-w-xs">
                        A solução mais rápida para encontrar profissionais qualificados perto de você.
                    </p>
                </div>

                {/* Navigation */}
                <div>
                    <h4 className="font-semibold text-slate-700 mb-4">Navegação</h4>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li><a href="#" className="hover:text-emerald-600 transition-colors">Sobre nós</a></li>
                        <li><a href="#" className="hover:text-emerald-600 transition-colors">Contato</a></li>
                        <li><a href="#" className="hover:text-emerald-600 transition-colors">Divulgue conosco</a></li>
                        <li><a href="#" className="hover:text-emerald-600 transition-colors">Seja revendedor</a></li>
                        <li><a href="#" className="hover:text-emerald-600 transition-colors">Área do usuário</a></li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h4 className="font-semibold text-slate-700 mb-4">Redes sociais</h4>
                    <div className="flex gap-4">
                        <a href="#" className="text-slate-500 hover:text-pink-600 transition-colors transform hover:scale-110">
                            <Instagram size={24} />
                        </a>
                        <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors transform hover:scale-110">
                            <Facebook size={24} />
                        </a>
                        <a href="#" className="text-slate-500 hover:text-red-600 transition-colors transform hover:scale-110">
                            <Youtube size={24} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            {/* Também ajustado para max-w-[1100px] w-full */}
            <div className="max-w-[1100px] w-full mx-auto px-4 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
                <p className="text-center md:text-left">
                    &copy; {new Date().getFullYear()} Precisei Chamei. Todos os direitos reservados.
                </p>
                <div className="flex gap-6">
                    <a href="/termos" className="hover:text-slate-600 transition-colors">Termos de uso</a>
                    <a href="/politica-de-privacidade" className="hover:text-slate-600 transition-colors">Políticas de privacidade</a>
                </div>
            </div>
        </footer>
    )
}