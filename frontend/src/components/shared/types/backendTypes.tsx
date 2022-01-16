import { Direction } from './boardTypes';

export enum GameStatus {
    SETTINGS = 'SETTINGS',
    STARTED = 'STARTED',
    PAUSED = 'PAUSED',
    INCORRECT = 'INCORRECT',
    WON = 'WON',
    LOST = 'LOST'
}

export interface PlayerInfo {
    playerId: string;
    playerName: string;
    currentGameId: string;
}

export interface CollaborativeGame extends Game {
    players: PlayerInfo[];
}

export interface CompetitiveGame extends Game {
    players: PlayerInfo[][];
    winningTeam: number;
}

export interface Game {
    gameId: string;
    crosswordId: string;
    status: GameStatus;
    crossword: CrosswordData;
    board: Grid | undefined;
}

export interface Grid {
    grid: string[][];
    id: number;
    numNonBlock: number;
    size: number;
}

export function isGrids(object: any): object is Grid[] {
    return Array.isArray(object) && object.length !== 0 && 'grid' in object[0];
}

export interface CrosswordData {
    crosswordId: string;
    name: string;
    date: string;
    source: string;
    size: number;
    clues: CrosswordHint[];
}

export interface CrosswordHint {
    crosswordHintId: string;
    hintNumber: number;
    hint: string;
    row: number;
    col: number;
    direction: Direction;
    answerLength: number;
}

export interface Clue {
    crosswordHintId: string;
    hintNumber: number;
    hint: string;
    row: number;
    col: number;
    direction: string;
    answerLength: number;
}

export function isCollaborativePlayers(
    object: PlayerInfo[] | PlayerInfo[][]
): object is PlayerInfo[] {
    if (object.length === 0) {
        return true;
    }
    return 'playerId' in object[0];
}

export function flattenPlayers(players: PlayerInfo[] | PlayerInfo[][]) {
    if (isCollaborativePlayers(players)) {
        return players;
    }
    return players.reduce((acc: PlayerInfo[], curVal: PlayerInfo[]) => {
        return acc.concat(curVal);
    }, []);
}

export function isCollaborativeGameId(gameId: string) {
    return gameId.startsWith('collaborative_game');
}

export function isCollaborative(
    object: CollaborativeGame | CompetitiveGame
): object is CollaborativeGame {
    return isCollaborativeGameId(object.gameId);
}
