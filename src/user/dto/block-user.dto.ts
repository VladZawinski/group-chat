
export interface BlockedUserDto {
    id: number;
    createdAt: string;
    blocked: {
        id: number;
        username: string;
        name: string;
        createdAt: string;
    };
}

export function mapBlockUser(input: any): BlockedUserDto {
    const { userId, role, ...restBlocked } = input.blocked;

    const output: BlockedUserDto = {
        id: input.id,
        createdAt: input.createdAt,
        blocked: {
            id: input.blockedId,
            ...restBlocked,
        },
    };

    return output;
}