export const BACKEND_URL = 'http://localhost:8080/';
export const CLIENT_NAME_KEY = 'crossworksClientName';
export enum ChatMessageType {
    CHAT = 'chatMessage'
}
export interface ChatMessage {
    sender: string;
    receiver: string;
    message: string;
    messageType: ChatMessageType | null;
}
export interface HttpResponse<T> {
    body: T;
    headers: {
        type: string;
        message: ChatMessage | null;
    };
    statusCode: string;
    statusCodeValue: number;
}

export interface HttpResponseRaw<T> {
    body: T;
    headers: {
        type: string[];
        sender: string[] | null;
        receiver: string[] | null;
        message: string[] | null;
    };
    statusCode: string;
    statusCodeValue: number;
}

function getFirstOrNull(val: string[] | null) {
    return val ? val[0] : null;
}

export function unpackResponse<T>(responseRaw: HttpResponseRaw<T>) {
    const sender = getFirstOrNull(responseRaw.headers.sender);
    const receiver = getFirstOrNull(responseRaw.headers.receiver);
    const message = getFirstOrNull(responseRaw.headers.message);
    const messageType = getFirstOrNull(responseRaw.headers.type);
    let unpackedResponse: HttpResponse<T> = {
        ...responseRaw,
        headers: {
            type: responseRaw.headers.type[0],
            message:
                sender && receiver && message
                    ? {
                          sender,
                          receiver,
                          message,
                          messageType: messageType as ChatMessageType
                      }
                    : null
        }
    };
    return unpackedResponse;
}

export enum MessageType {
    GET_PLAYER_ID = 'getPlayerId',
    UPDATE_GAME = 'updateGame',
    CREATE_GAME = 'createGame',
    BAD_GAME_ID = 'badGameId',
    START_GAME = 'startGame',
    TEAMS_ANSWERS_UPDATE = 'competitiveAnswersUpdate'
}

export type HttpPlayerId = string;

export function isHttpPlayerId(object: any): object is HttpPlayerId {
    return typeof object === 'string';
}

export enum BoardVal {
    BLOCK = '#',
    EMPTY = ' ',
    CORRECT = '1',
    INCORRECT = '0'
}
