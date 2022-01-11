export interface CollaborativeGame {
    gameId: string;
    playerIds: string[];
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
    direction: string;
    answerLength: number;
}

export interface NavigationSettings {
    coordinates: Coordinates;
    direction: Direction;
}

export interface Coordinates {
    row: number;
    col: number;
}

export enum Direction {
    ACROSS = 'ACROSS',
    DOWN = 'DOWN'
}

export enum Keys {
    ARROW_RIGHT = 'ArrowRight',
    ARROW_LEFT = 'ArrowLeft',
    ARROW_UP = 'ArrowUp',
    ARROW_DOWN = 'ArrowDown',
    BACKSPACE = 'Backspace'
}

export interface CellHintAnnotation {
    isValid: boolean;
    across: Annotation;
    down: Annotation;
}

export interface Annotation {
    hintNumber: number;
    isStart: boolean;
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
