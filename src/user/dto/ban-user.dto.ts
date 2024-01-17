
export interface BanUserDto {
    id: number;
    reason: string;
    createdAt: string;
    user: {
        id: number;
        username: string;
        name: string;
        createdAt: string;
    };
}

export function mapBanUser(input: any): BanUserDto {
    const { userId, role, ...restUser } = input.user;

    const output: BanUserDto = {
        id: input.id,
        reason: input.reason,
        createdAt: input.createdAt,
        user: {
            id: userId,
            ...restUser,
        },
    };

    return output;
}