export interface AuthResponse {
    access_token: string;
    user_id: string;
    expires_in: number;
    ok: boolean;
    data?: any
}

export interface Signin {
    email: string
    password: string
}

export interface Signup {
    name: string
    email: string
    workspace: string
    password: string
}

export interface VerifyAcc {
    token: string
}

export interface Forgot {
    email: string
}

export interface ChangePassword {
    password: string
    repeatPassword: string
    token: string
} 