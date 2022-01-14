export type SendMessageFn = (
    endpoint: CollaborativeSocketEndpoint | CompetitiveSocketEndpoint,
    payload?: any,
    gameId?: string
) => void;

export enum CollaborativeSocketEndpoint {
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

export enum CompetitiveSocketEndpoint {
    GET_PLAYER_ID = '/app/getPlayerId',
    CONNECT = '/app/competitive/connect/',
    CREATE_GAME = '/app/competitive/create',
    SET_CROSSWORD = '/app/competitive/game-crossword/',
    START_GAME = '/app/competitive/start-game/',
    MAKE_MOVE = '/app/competitive/make-move/', // needs gameid
    UNPAUSE_GAME = '/app/competitive/unpause/', // needs gameid
    PAUSE = '/app/competitive/pause/', // needs gameId
    GIVE_UP = '/app/competitive/give-up/', // needs gameId
    RETURN_TO_SETTINGS = '/app/competitive/return-to-settings/',
    LEAVE_GAME = '/app/competitive/leave-game/',
    NEW_TEAM = '/app/competitive/new-team/',
    SWITCH_TEAM = '/app/competitive/switch-team/',
    SEND_TEAM_ANSWERS = '/app/competitive/send-team-answers/'
}

export enum SocketSubscription {
    USER_MESSAGES = '/users/queue/messages',
    COLLABORATIVE_GAME_PREFIX = 'queue/collaborative/',
    COMPETITIVE_GAME_PREFIX = 'queue/competitive/'
}

export function isTeamSubscription(subscription: string) {
    return subscription.endsWith('team');
}
export function isActiveTeamSubscription(gameId: string, subscription: string) {
    return isTeamSubscription(subscription) && subscription.includes(gameId);
}

export function createTeamSubscription(gameId: string, teamNumber: number) {
    return (
        SocketSubscription.COMPETITIVE_GAME_PREFIX +
        gameId +
        '/' +
        teamNumber.toString() +
        '-team'
    );
}
