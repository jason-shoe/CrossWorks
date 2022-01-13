import { BoardVal } from '../types/httpTypes';
import {
    Grid,
    Clue,
    CrosswordData,
    CrosswordHint
} from '../types/backendTypes';
import { CellHintAnnotation, Direction } from '../types/boardTypes';

export function isBlock(cell: string) {
    return cell === BoardVal.BLOCK;
}

export function isEmpty(cell: string) {
    return cell === BoardVal.EMPTY;
}

export function isFilled(cell: string) {
    return !isBlock(cell) && !isEmpty(cell);
}

export function isLetter(str: string) {
    return str.length === 1 && str.match(/[a-zA-Z]/i);
}

export function clueHash(hintNumber: number, direction: Direction) {
    return [hintNumber, direction].join('');
}
export function getClueProgress(
    clues: CrosswordHint[],
    cellAnnotations: CellHintAnnotation[][],
    answers: Grid
) {
    const progress: Map<string, number> = new Map();
    clues.forEach((clue) => {
        progress.set(clueHash(clue.hintNumber, clue.direction), 0);
    });

    answers.grid.forEach((row, rowNum) =>
        [...row].forEach((elem, colNum) => {
            if (isFilled(elem)) {
                const hintAnnotation = cellAnnotations[rowNum][colNum];

                progress.set(
                    clueHash(
                        hintAnnotation.across.hintNumber,
                        Direction.ACROSS
                    ),
                    progress.get(
                        clueHash(
                            hintAnnotation.across.hintNumber,
                            Direction.ACROSS
                        )
                    )! + 1
                );
                progress.set(
                    clueHash(hintAnnotation.down.hintNumber, Direction.DOWN),
                    progress.get(
                        clueHash(hintAnnotation.down.hintNumber, Direction.DOWN)
                    )! + 1
                );
            }
        })
    );

    return progress;
}
export function getCellAnnotations(crossword: CrosswordData) {
    let inputCellsTemp: CellHintAnnotation[][] = [...Array(crossword.size)].map(
        (x) =>
            Array(crossword.size).fill({
                across: undefined,
                down: undefined
            })
    );

    // Array that keeps track of the cells that should be able to take in an input
    // Initially, every cell cannot take in an input
    crossword.clues.forEach((clue: Clue) => {
        var initialRowIndex = clue.row;
        var initialColIndex = clue.col;
        if (clue.direction === Direction.ACROSS) {
            for (
                let i = initialColIndex;
                i < initialColIndex + clue.answerLength;
                i++
            ) {
                inputCellsTemp[initialRowIndex][i] = {
                    ...inputCellsTemp[initialRowIndex][i],
                    across: {
                        hintNumber: clue.hintNumber,
                        isStart: i === initialColIndex
                    },
                    isValid:
                        inputCellsTemp[initialRowIndex][i].down !== undefined
                };
            }
        } else {
            for (
                let i = initialRowIndex;
                i < initialRowIndex + clue.answerLength;
                i++
            ) {
                inputCellsTemp[i][initialColIndex] = {
                    ...inputCellsTemp[i][initialColIndex],
                    down: {
                        hintNumber: clue.hintNumber,
                        isStart: i === initialRowIndex
                    },
                    isValid:
                        inputCellsTemp[i][initialColIndex].across !== undefined
                };
            }
        }
    });

    return inputCellsTemp;
}
