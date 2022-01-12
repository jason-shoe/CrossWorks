export type SendMessageFn = (
    endpoint: SocketEndpoint,
    payload?: any,
    gameId?: string
) => void;

export enum SocketEndpoint {
    GET_PLAYER_ID = '/app/getPlayerId',
    CONNECT = '/app/connect/',
    CREATE_GAME = '/app/create',
    SET_CROSSWORD = '/app/update/game-crossword/',
    START_GAME = '/app/update/start-game/',
    MAKE_MOVE = '/app/update/make-move/' // needs gameid
}

export enum SocketSubscription {
    USER_MESSAGES = '/users/queue/messages',
    GAME_PREFIX = 'queue/game/'
}
