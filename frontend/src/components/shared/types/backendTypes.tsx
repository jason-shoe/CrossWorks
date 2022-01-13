import { Direction } from './boardTypes';

export enum GameStatus {
    SETTINGS = 'SETTINGS',
    STARTED = 'STARTED',
    PAUSED = 'PAUSED',
    INCORRECT = 'INCORRECT',
    WON = 'WON',
    LOST = 'LOST'
}

export interface CollaborativeGame {
    gameId: string;
    playerIds: string[];
    crosswordId: string;
    status: GameStatus;
    crossword: CrosswordData;
    teamAnswers: Grid;
    board: Grid | undefined;
}

export interface Grid {
    grid: string[][];
    id: number;
    numNonBlock: number;
    size: number;
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
