import { AuthType } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export interface SignInDto {
    email: string
    name: string
    authType: AuthType
    token?: string
    avatarUrl?: string
}