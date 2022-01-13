export type SendMessageFn = (
    endpoint: SocketEndpoint,
    payload?: any,
    gameId?: string
) => void;

export enum SocketEndpoint {
    GET_PLAYER_ID = '/app/getPlayerId',
    CONNECT = '/app/collaborative/connect/',
    CREATE_GAME = '/app/collaborative/create',
    SET_CROSSWORD = '/app/collaborative/game-crossword/',
    START_GAME = '/app/collaborative/start-game/',
    MAKE_MOVE = '/app/collaborative/make-move/', // needs gameid
    UNPAUSE_GAME = '/app/collaborative/unpause/', // needs gameid
    PAUSE = '/app/collaborative/pause/', // needs gameId
    GIVE_UP = '/app/collaborative/give-up/', // needs gameId
    RETURN_TO_SETTINGS = '/app/collaborative/return-to-settings/',
    LEAVE_GAME = '/app/collaborative/leave-game/'
}

export enum SocketSubscription {
    USER_MESSAGES = '/users/queue/messages',
    GAME_PREFIX = 'queue/collaborative/'
}
