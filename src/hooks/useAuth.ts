import { ChangePassword, Forgot, Signin, Signup, VerifyAcc } from '@/@types/auth'
import { toast } from '@/hooks/use-toast'
import { AuthService } from '@/services/api/auth.service'
// import { sessionStore } from '@/store'
import { Cookies } from 'react-cookie'
import { useStore } from 'zustand'

const useAuth = () => {

    const authService = new AuthService()
    const cookies = new Cookies();

    const fetchLogin = async (data: Signin) => {
        try {

            const request = await authService.login(data)

            cookies.set('userid', request.data.data.token, { path: '/' })

            toast({
                title: 'Login realizado com sucesso',
                description: 'Você será redirecionado para dashboard.',
                variant: 'default',
            })

            return request;

        } catch (error: any) {
            console.log(error)
            toast({
                title: 'Erro ao fazer login',
                description: 'Não foi possível conectar',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }

        }

    };

    const fetchSignup = async (data: { name: string, email: string, phone: string, password: string }) => {
        try {
            const request = await authService.register(data)

            return request
        } catch (error: any) {
            toast({
                title: 'Erro ao criar conta',
                // description: translateErrorMessage(error.details.message),
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error }
        }
    };

    const fetchForgot = async (data: { email: string }) => {
        try {
            const request = await authService.forgot(data)

            return request
        } catch (error: any) {
            toast({
                title: 'Erro ao recuperar a senha',
                // description: translateErrorMessage(error.details.message),
                variant: 'destructive',
            })
            return { ok: false, message: error.message || error }
        }
    };

    const fetchChangePassword = async (data: { email: string, password: string, token: string }) => {
        try {
            const request = await authService.updatePassword(data)

            return request
        } catch (error: any) {
            toast({
                title: 'Erro ao mudar a sua senha',
                // description: translateErrorMessage(error.details.message),
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error }
        }
    };

    const verificationAcc: any = async (data: { email: string, token: string }) => {
        try {
            const request = await authService.confirm(data)

            return request
        } catch (error: any) {
            toast({
                title: 'Erro ao confirmar a sua senha',
                // description: translateErrorMessage(error.details.message),
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error }
        }
    };

    // const resendVerificationEmail = async ({ email }: { email: string }) => {
    //     try {
    //         const request = await authService.forgotResendVerification(email)

    //         return request
    //     } catch (error: any) {
    //         toast({
    //             title: 'Erro ao re-eviar o email ',
    //             description: 'Tente novamente mais tarde',
    //             variant: 'destructive',
    //         })
    //         return { ok: false, message: error.message || error }
    //     }
    // };

    // const fetchSendChangePassEmail = async (email: string) => {

    //     const request = await authService.forgotPassword(email)

    //     return request;
    // };

    return {
        fetchLogin,
        fetchSignup,
        fetchForgot,
        fetchChangePassword,
        verificationAcc,
        // fetchVerifyAcc,
        // fetchSendChangePassEmail,
    }
}

export default useAuth;