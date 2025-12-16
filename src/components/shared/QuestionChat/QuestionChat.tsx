'use client'

import { Headset, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function QuestionChat() {
    const [isActive, setIsActive] = useState<boolean>(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setIsActive(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={selectRef} className="relative">
            <div className="fixed bottom-5 right-7">
                <div className={`
                    bg-white 
                    rounded-xl 
                    w-[280px]
                    z-50
                    border
                    border-gray-200
                    shadow-lg
                    transition-all
                    duration-300
                    ${isActive ? 'mb-4 opacity-100 scale-100' : '-mb-20 opacity-0 scale-95 pointer-events-none'}
                `}>
                    <nav className="p-3">
                        <a 
                            href="/dashboard/suporte"
                            className="
                                flex
                                items-center
                                gap-3
                                p-3
                                rounded-lg
                                hover:bg-gray-50
                                transition-colors
                                group
                            "
                        >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                                <Headset 
                                    size={20}
                                    className="text-green-600" 
                                />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Suporte</h4>
                                <p className="text-sm text-gray-500">Fale com nossa equipe</p>
                            </div>
                        </a>
                    </nav>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`
                            w-10 
                            h-10 
                            rounded-full 
                            flex 
                            items-center 
                            justify-center 
                            shadow-xl
                            transition-colors
                            bg-gradient-to-tr 
                            from-black/60 
                            to-black/90
                            border-[1.5px]
                            ${isActive ? 'border-stone-300' : 'border-black/60'}
                        `}
                    >
                        {!isActive ? <Headset size={25} className="text-white" /> : <X size={25} className="text-white" />}
                    </button>
                </div>
            </div>
        </div>
    )
}