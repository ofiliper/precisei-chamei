'use client';

import DashboardContainer from "@/components/shared/old-dashboard/DashboardContainer";
import PageTitle from "@/components/shared/PageTitle/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Pencil, PlusCircle, Search, X } from "lucide-react";
import { useState } from "react";

export default function MeusOficios() {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [limit, setLimit] = useState<string>('30');

    return (
        <DashboardContainer>
            <div className="flex flex-col w-full">

                <div className="flex justify-between items-end py-4 px-7 border-b border-stone-200">
                    <div>
                        <h3 className="text-xl">
                            Meus ofícios
                        </h3>
                        <p className="text-sm">
                            Abaixo estão todos os meus ofícios.
                        </p>
                    </div>
                    <Button>
                        <PlusCircle />
                        Novo ofício
                    </Button>
                </div>

                <div className="p-4">

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="Pesquisar indicação"
                                className="w-full max-w-s"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                            />
                            <Button
                                onClick={() => { }}
                                disabled={search.length === 0} >
                                <Search />
                                Buscar
                            </Button>
                            {
                                search.length > 0 && (
                                    <Button
                                        variant={'ghost'}
                                        onClick={() => {
                                            setSearch('');
                                        }}>
                                        <X />
                                        Limpar
                                    </Button>
                                )
                            }
                        </div>
                        <Select
                            onValueChange={(value) => {
                                setLimit(value);
                            }}
                        >
                            <SelectTrigger className="w-[110px] max-w-sm">
                                <SelectValue placeholder="Exibir 30" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30" className="cursor-pointer">Exibir 30</SelectItem>
                                <SelectItem value="50" className="cursor-pointer">Exibir 50</SelectItem>
                                <SelectItem value="100" className="cursor-pointer">Exibir 100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Table className="border">
                            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px]">Nome</TableHead>
                                    <TableHead>Solicitação</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    [
                                        {
                                            name: 'Márcio Moreira',
                                            desc: 'Solicito a implementação de um quebra-molas no bairro Moacyr de Paula Lobo, devido ao excesso de velocidade dos veículos que colocam pedestres e moradores em risco diariamente.'
                                        },
                                        {
                                            name: 'Márcio Moreira',
                                            desc: 'Solicito a implementação de um quebra-molas no bairro Moacyr de Paula Lobo, devido ao excesso de velocidade dos veículos que colocam pedestres e moradores em risco diariamente.'
                                        },
                                        {
                                            name: 'Luciana Freitas',
                                            desc: 'Peço a instalação de postes de iluminação pública na Rua das Acácias. A escuridão no local tem gerado insegurança e aumento nos casos de assaltos à noite.'
                                        }
                                    ]
                                        .map((item, i) => {
                                            return (
                                                <TableRow key={i} className={`${i % 2 ? ('!bg-zinc-100') : ''} hover:!bg-sky-50`}>
                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                    <TableCell> {item.desc.slice(0, 99)}...</TableCell>
                                                    <TableCell className="text-right gap-2 flex items-center justify-end">
                                                        <Button className="text-xs" variant={"outline"}>
                                                            <Check />
                                                            Aprovar
                                                        </Button>
                                                        <Button className="text-xs" variant={"outline"}>
                                                            <Pencil />
                                                            Editar
                                                        </Button>
                                                        <Button className="text-xs" variant="outline">
                                                            <Search />
                                                            Ver mais
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                }
                            </TableBody>
                            {/* <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3}>Total</TableCell>
                                    <TableCell className="text-right">$2,500.00</TableCell>
                                </TableRow>
                            </TableFooter> */}
                        </Table>
                    </div>

                </div>
            </div>

        </DashboardContainer>
    );
}
