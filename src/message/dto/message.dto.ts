
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
}

export function mapJsonToMessageDto(json: any): MessageDto {
    return {
        id: json.id,
        content: json.content,
        createdAt: json.createdAt,
        user: mapJsonToMessageUserDto(json.user),
    };
}

function mapJsonToMessageUserDto(json: any): MessageUserDto {
    return {
        id: json.id,
        username: json.username,
        name: json.name,
        avatarUrl: json.avatarUrl
    };
}