"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import { ForgotenData, forgotenSchema } from "@/lib/validations/forgoten"
import { useState } from "react"
import { Loader2, ArrowLeft } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"

export default function Esqueci() {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ForgotenData>({
        resolver: zodResolver(forgotenSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (data: ForgotenData) => {
        try {
            setIsLoading(true)
            // API call here
            console.log("Recovery request:", data)
        } catch (error) {
            console.error("Recovery request failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 -top-20 -left-20 animate-pulse"></div>
                <div className="absolute w-96 h-96 bg-slate-500 rounded-full blur-3xl opacity-10 -bottom-20 -right-20 animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-md relative">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
                    <div className="text-center">
                        <Link href="/dashboard" className="inline-block">
                            <img 
                                src="/images/vesoft.svg" 
                                alt="VeSoft Logo" 
                                className="h-12 sm:h-16 mx-auto"
                            />
                        </Link>
                        <h2 className="mt-6 text-xl sm:text-2xl font-semibold text-gray-900">
                            Recuperar senha
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Digite seu e-mail para receber as instruções de recuperação
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 mt-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                type="email"
                                                placeholder="seu@email.com"
                                                className="rounded-lg"
                                                disabled={isLoading}
                                                autoComplete="email"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-end">
                                <Link 
                                    href="/auth/login" 
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    <span className="flex items-center gap-1">
                                        <ArrowLeft className="h-4 w-4" />
                                        Voltar para o login
                                    </span>
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium shadow-lg transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    "Enviar instruções"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
            <Toaster />
        </div>
    )
}
