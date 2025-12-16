import { ChangePassword, Forgot, Signin, Signup, VerifyAcc } from '@/@types/auth'
import { toast } from '@/hooks/use-toast'
import { AuthService } from '@/services/api/auth.service'
// import { sessionStore } from '@/store'
import { Cookies } from 'react-cookie'
import { useStore } from 'zustand'

const useAuth = () => {
    // const session = useStore(sessionStore)
    const authService = new AuthService()
    const cookies = new Cookies();

    const fetchLogin = async (data: Signin) => {
        try {
            const request = await authService.login(data)

            // session.fnOnChange('access_token', request.data.access_token)
            // session.fnOnChange('expires_in', request.data.expires_in)
            // session.fnOnChange('user_id', request.data.user_id)

            cookies.set('userid', request.data.data.token, { path: '/' })

            toast({
                title: 'Login realizado com sucesso',
                description: 'Você será redirecionado para dashboard.',
                variant: 'default',
            })

            return request;

        } catch (error: any) {
            console.log(error)
            // const emailError = error.details.message.includes(
            //     'No found user for email ',
            // )

            // toast({
            //     title: 'Erro ao fazer login',
            //     description: translateErrorMessage(
            //         emailError ? 'No found user for email ' : error.details.message,
            //     ),
            //     variant: 'destructive',
            // })

            return { ok: false, message: error.message || error, data: null }
        }
    };

    // const fetchSignup = async (data: Signup) => {
    //     try {
    //         const request = await authService.register(data)

    //         return request
    //     } catch (error: any) {
    //         toast({
    //             title: 'Erro ao criar conta',
    //             description: translateErrorMessage(error.details.message),
    //             variant: 'destructive',
    //         })

    //         return { ok: false, message: error.message || error }
    //     }
    // };

    // const fetchForgot = async (data: Forgot) => {
    //     try {
    //         const request = await authService.forgotPassword(data.email)

    //         return request
    //     } catch (error: any) {
    //         toast({
    //             title: 'Erro ao recuperar a senha',
    //             description: translateErrorMessage(error.details.message),
    //             variant: 'destructive',
    //         })
    //         return { ok: false, message: error.message || error }
    //     }
    // };

    // const fetchChangePassword = async (data: ChangePassword) => {
    //     try {
    //         const request = await authService.resetPassword({
    //             token: data.token,
    //             password: data.password,
    //         })

    //         return request
    //     } catch (error: any) {
    //         toast({
    //             title: 'Erro ao mudar a sua senha',
    //             description: translateErrorMessage(error.details.message),
    //             variant: 'destructive',
    //         })

    //         return { ok: false, message: error.message || error }
    //     }
    // };

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
        // fetchSignup,
        // fetchVerifyAcc,
        // fetchForgot,
        // fetchChangePassword,
        // fetchSendChangePassEmail,
        // resendVerificationEmail,
    }
}

export default useAuth;