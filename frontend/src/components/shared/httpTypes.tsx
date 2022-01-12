export interface HttpResponse<T> {
    body: T;
    headers: {
        type: string[];
    };
    statusCode: string;
    statusCodeValue: number;
}

export enum MessageType {
    GET_PLAYER_ID = 'getPlayerId',
    UPDATE_GAME = 'updateGame',
    CREATE_GAME = 'createGame'
}

export type HttpPlayerId = string;

export function isHttpPlayerId(object: any): object is HttpPlayerId {
    return typeof object === 'string';
}
