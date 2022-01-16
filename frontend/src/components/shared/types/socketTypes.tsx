export type SendMessageFn = (
    endpoint: GameSocketEndpoint | PlayerSocketEndpoint,
    payload?: any,
    gameId?: string
) => void;

export enum SocketSubscription {
    USER_MESSAGES = '/users/queue/messages',
    GAME_PREFIX = 'queue/game/'
}

export enum GameSocketEndpoint {
    SET_CROSSWORD = '/app/set-game-crossword/', // gameId, crosswordId
    START_GAME = '/app/start-game/', // gameId
    MAKE_MOVE = '/app/make-move/', // gameId, [x, y, val]
    UNPAUSE_GAME = '/app/unpause/', // gameId
    PAUSE = '/app/pause/', // gameId
    GIVE_UP = '/app/give-up/', // gameId
    RETURN_TO_SETTINGS = '/app/return-to-settings/', // gameid
    SEND_TEAM_ANSWERS = '/app/send-team-answers/' // gameId
}

export enum PlayerSocketEndpoint {
    GET_PLAYER_ID = '/app/get-player-id',
    CHAT = '/app/chat',
    CREATE_GAME = '/app/create', // requires a bool on if it is collaborative and new playerName
    CONNECT = '/app/connect/', // requires a gameId and new playerName
    LEAVE_GAME = '/app/leave-game/', // gameId
    SWITCH_TEAM = '/app/switch-team/', //gameId, teamNumber
    NEW_TEAM = '/app/new-team/' // gameId
}

// export enum CollaborativeSocketEndpoint {
//     GET_PLAYER_ID = '/app/getPlayerId',
//     CONNECT = '/app/collaborative/connect/',
//     CREATE_GAME = '/app/collaborative/create',
//     SET_CROSSWORD = '/app/collaborative/game-crossword/',
//     START_GAME = '/app/collaborative/start-game/',
//     MAKE_MOVE = '/app/collaborative/make-move/', // needs gameid
//     UNPAUSE_GAME = '/app/collaborative/unpause/', // needs gameid
//     PAUSE = '/app/collaborative/pause/', // needs gameId
//     GIVE_UP = '/app/collaborative/give-up/', // needs gameId
//     RETURN_TO_SETTINGS = '/app/collaborative/return-to-settings/',
//     LEAVE_GAME = '/app/collaborative/leave-game/'
// }

// export enum CompetitiveSocketEndpoint {
//     GET_PLAYER_ID = '/app/getPlayerId',
//     CONNECT = '/app/competitive/connect/',
//     CREATE_GAME = '/app/competitive/create',
//     SET_CROSSWORD = '/app/competitive/game-crossword/',
//     START_GAME = '/app/competitive/start-game/',
//     MAKE_MOVE = '/app/competitive/make-move/', // needs gameid
//     UNPAUSE_GAME = '/app/competitive/unpause/', // needs gameid
//     PAUSE = '/app/competitive/pause/', // needs gameId
//     GIVE_UP = '/app/competitive/give-up/', // needs gameId
//     RETURN_TO_SETTINGS = '/app/competitive/return-to-settings/',
//     LEAVE_GAME = '/app/competitive/leave-game/',
//     NEW_TEAM = '/app/competitive/new-team/',
//     SWITCH_TEAM = '/app/competitive/switch-team/',
//     SEND_TEAM_ANSWERS = '/app/competitive/send-team-answers/'
// }

export function isTeamSubscription(subscription: string) {
    return subscription.endsWith('team');
}
export function isActiveTeamSubscription(gameId: string, subscription: string) {
    return isTeamSubscription(subscription) && subscription.includes(gameId);
}

export function createTeamSubscription(gameId: string, teamNumber: number) {
    return (
        SocketSubscription.GAME_PREFIX +
        gameId +
        '/' +
        teamNumber.toString() +
        '-team'
    );
}
