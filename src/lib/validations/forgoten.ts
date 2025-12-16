import { z } from "zod"

export const forgotenSchema = z.object({
    email: z.string().email("E-mail inválido"),
})

export type ForgotenData = z.infer<typeof forgotenSchema>