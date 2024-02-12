
export class MessageDto {
    id: number
    content: string
    createdAt: string
    user: MessageUserDto
}

export class MessageUserDto {
    id: number
    username: string
    name: string
    avatarUrl?: string
    subscribed?: boolean
}

export function mapJsonToMessageDto(json: any, followedUserIds: number[]): MessageDto {
    return {
        id: json.id,
        content: json.content,
        createdAt: json.createdAt,
        user: mapJsonToMessageUserDto(json.user, followedUserIds.includes(json.user.id)),
    };
}

function mapJsonToMessageUserDto(json: any, subscribed: boolean): MessageUserDto {
    return {
        id: json.id,
        username: json.username,
        name: json.name,
        avatarUrl: json.avatarUrl,
        subscribed: subscribed
    };
}