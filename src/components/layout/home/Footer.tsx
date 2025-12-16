import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
    return (
        < footer className="bg-[#F5F6F3] pt-16 pb-8 border-t border-gray-100" >
            <div className="w-[1100px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

                {/* Brand */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <img src="logo-min.png" />
                    </div>
                </div>

                {/* Navigation */}
                <div>
                    <h4 className="font-semibold text-slate-700 mb-4">Navegação</h4>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li><a href="#" className="hover:text-emerald-600">Sobre nós</a></li>
                        <li><a href="#" className="hover:text-emerald-600">Contato</a></li>
                        <li><a href="#" className="hover:text-emerald-600">Divulgue conosco</a></li>
                        <li><a href="#" className="hover:text-emerald-600">Seja revendedor</a></li>
                        <li><a href="#" className="hover:text-emerald-600">Área do usuário</a></li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h4 className="font-semibold text-slate-700 mb-4">Redes sociais</h4>
                    <div className="flex gap-4">
                        <a href="#" className="text-slate-800 hover:text-pink-600"><Instagram size={24} /></a>
                        <a href="#" className="text-slate-800 hover:text-blue-600"><Facebook size={24} /></a>
                        <a href="#" className="text-slate-800 hover:text-red-600"><Youtube size={24} /></a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="w-[1100px] mx-auto px-4 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
                <p>Todos os direitos reservados</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <a href="#">Termos de uso</a>
                    <a href="#">Políticas de privacidade</a>
                </div>
            </div>
        </footer >
    )
}