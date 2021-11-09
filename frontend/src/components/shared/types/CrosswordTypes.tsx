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
