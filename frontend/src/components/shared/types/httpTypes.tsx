export const BACKEND_URL = 'http://localhost:8080/';
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
    CREATE_GAME = 'createGame',
    BAD_GAME_ID = 'badGameId',
    START_GAME = 'startGame'
}

export type HttpPlayerId = string;

export function isHttpPlayerId(object: any): object is HttpPlayerId {
    return typeof object === 'string';
}

export enum BoardVal {
    BLOCK = '#',
    EMPTY = ' '
}
