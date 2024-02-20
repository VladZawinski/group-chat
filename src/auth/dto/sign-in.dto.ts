import { AuthType } from "@prisma/client";

export interface SignInDto {
    email: string
    name: string
    authType: AuthType
    token?: string
    avatarUrl?: string
    fcmToken?: string
}