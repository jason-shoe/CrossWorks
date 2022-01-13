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
    MAKE_MOVE = '/app/update/make-move/', // needs gameid
    UNPAUSE_GAME = '/app/update/unpause/', // needs gameid
    PAUSE = '/app/update/pause/', // needs gameId
    GIVE_UP = '/app/update/give-up/', // needs gameId
    RETURN_TO_SETTINGS = '/app/update/return-to-settings/',
    LEAVE_GAME = '/app/update/leave-game/'
}

export enum SocketSubscription {
    USER_MESSAGES = '/users/queue/messages',
    GAME_PREFIX = 'queue/game/'
}
