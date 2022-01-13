export interface CellHintAnnotation {
    isValid: boolean;
    across: Annotation;
    down: Annotation;
}

export interface Annotation {
    hintNumber: number;
    isStart: boolean;
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
