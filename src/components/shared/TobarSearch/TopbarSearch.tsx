'use client'

import { useEffect, useRef, useState } from "react";
import { PersonStanding } from "lucide-react";

export default function TopbarSearch() {

    interface IOptions {
        title: string;
        desc?: string;
        path: string;
        icon: IconType
    }


    const options: IOptions[] = [

        {
            icon: PersonStanding,
            title: 'Indicação',
            desc: 'Faça suas indicações de melhorias',
            path: `/dashboard`,
        },
        {
            icon: PersonStanding,
            title: 'Cadastrar',
            desc: 'Faça suas indicações de melhorias',
            path: `/dashboard/builder`,
        },
        {
            icon: PersonStanding,
            title: 'Agendar',
            desc: 'Faça suas indicações de melhorias',
            path: `/dashboard/builder`,
        },
    ];


    const [filterInput, setFilterInput] = useState<string>("");
    const [filterOptions, setFilterOptions] = useState<IOptions[]>([]);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (filterInput === '') return setFilterOptions([])

        const filteredOptions = options.filter(item => {
            const normalizedInput = filterInput.toLowerCase();
            return (
                item.title.toLowerCase().includes(normalizedInput) ||
                item.desc!.toLowerCase().includes(normalizedInput)
            );
        });

        setFilterOptions(filteredOptions);

    }, [filterInput]);

    const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setFilterOptions([])
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>

            <div ref={selectRef} className="relative flex gap-2 flex items-center gap-5 justify-between border border-white bg-gradient-to-t from-[#F5F5F5] to-transparent py-2 rounded-full pr-4 pl-7 w-[640px]">

                <input
                    type="text"
                    placeholder="Faça uma pesquisa"
                    value={filterInput}
                    onClick={() => setFilterOptions([...options])}
                    onChange={(e) => {
                        setFilterInput(e.target.value)
                    }}
                    className="bg-transparent outline-none w-full text-sm" />

                <button
                    className="!rounded-full block !py-2 !px-2"
                >
                    <PersonStanding />
                </button>

                {
                    <div className={`absolute left-0 top-10 bg-white rounded-xl w-full z-99 border border-black/5 shadow-xl transition-all ease-in-out duration-900 overflow-y-scroll
                      ${filterOptions.length > 4 ? 'h-[260px]' : 'h-auto'}
                      ${filterOptions.length > 0 ? 'visible opacity-100 top-10' : 'invisible opacity-0 top-8'}`}>
                        {
                            filterOptions.map((item, i) => {
                                return (
                                    <a
                                        key={i}
                                        href={item.path}
                                        className="block mx-2 my-2 px-2 py-2 rounded-md hover:bg-black/5"
                                    >
                                        <h4 className="font-bold flex gap-1 items-center">
                                            {item.icon && (<item.icon className="text-[#2f887c] font-bold w-3 h-3" />)}
                                            {item.title}
                                        </h4>
                                        <p className="text-xs">{item.desc}</p>
                                    </a>
                                )
                            })
                        }
                        <a
                            href={"/dashboard/faq"}
                            className="block mx-2 my-2 px-2 py-2 rounded-md bg-gradient-to-t from-bg-[#F4F7F7] to-bg-transparent border border-[#F4F7F7]"
                        >
                            <h4 className="font-bold flex gap-1 items-center">
                                <PersonStanding className="text-[#2f887c] w-3 h-3 font-bold" />
                                Consulte nosso FAQ
                            </h4>
                            <p className="text-xs">
                                Não encontrou o que procurava? Consulte o nosso FAQ.
                            </p>
                        </a>
                    </div>
                }

            </div>
        </>
    )
}