import { memo, useEffect, useCallback, useMemo } from 'react';
import { Grid, isCollaborativeGameId } from './types/backendTypes';
import {
    CellHintAnnotation,
    Direction,
    NavigationSettings,
    Keys
} from '../shared/types/boardTypes';
import styles from './Crossword.module.scss';
import { CrosswordCell } from './CrosswordCell';
import {
    SendMessageFn,
    CollaborativeSocketEndpoint,
    CompetitiveSocketEndpoint
} from './types/socketTypes';
import { BoardVal } from './types/httpTypes';
import { isEmpty, isLetter } from './util/crosswordUtil';

interface CrosswordProps {
    size: number;
    inputCells: CellHintAnnotation[][];
    answers: Grid;
    gameId?: string;
    clientId?: string;
    sendMessage?: SendMessageFn;
    groundTruth?: Grid;
    setNavSettings?: (coords: NavigationSettings) => void;
    navSettings?: NavigationSettings;
}

export const Crossword = memo(function Crossword(props: CrosswordProps) {
    // Setting the size of the crossword grid based on the API data retrieved
    let {
        size,
        inputCells,
        setNavSettings,
        navSettings,
        answers,
        sendMessage,
        gameId,
        clientId,
        groundTruth
    } = props;
    const cells = [...Array(size).keys()];

    const canEdit = useMemo(
        () => gameId && clientId && sendMessage,
        [clientId, gameId, sendMessage]
    );
    const canNav = useMemo(
        () => navSettings && setNavSettings,
        [navSettings, setNavSettings]
    );

    const handleChange = useCallback(
        (letter: string, newSettings?: NavigationSettings) => {
            if (!canEdit || !canNav) {
                return;
            }
            const settings = newSettings ?? navSettings!;
            sendMessage!(
                isCollaborativeGameId(gameId!)
                    ? CollaborativeSocketEndpoint.MAKE_MOVE
                    : CompetitiveSocketEndpoint.MAKE_MOVE,
                JSON.stringify({
                    row: settings.coordinates.row,
                    col: settings.coordinates.col,
                    c: letter,
                    player: { playerId: clientId }
                }),
                gameId
            );
        },
        [clientId, gameId, navSettings, sendMessage]
    );

    const handleCoordinateChange = useCallback(
        (shift: number, newDirection: Direction) => {
            if (!canEdit) {
                return;
            }
            let newSettings;
            if (newDirection !== navSettings!.direction) {
                newSettings = {
                    ...navSettings!,
                    direction: newDirection
                };
                setNavSettings!(newSettings);
                return newSettings;
            }
            let startingIndex: number;
            if (newDirection === Direction.ACROSS) {
                startingIndex =
                    navSettings!.coordinates.row * size +
                    navSettings!.coordinates.col +
                    shift;
            } else {
                startingIndex =
                    navSettings!.coordinates.col * size +
                    navSettings!.coordinates.row +
                    shift;
            }

            for (let i = startingIndex; i >= 0 && i < size * size; i += shift) {
                let newRow =
                    newDirection === Direction.ACROSS
                        ? Math.floor(i / size)
                        : i % size;
                let newCol =
                    newDirection === Direction.ACROSS
                        ? i % size
                        : Math.floor(i / size);
                if (inputCells[newRow][newCol].isValid) {
                    newSettings = {
                        coordinates: { row: newRow, col: newCol },
                        direction: newDirection
                    };
                    setNavSettings!(newSettings);
                    return newSettings;
                }
            }
        },
        [canEdit, inputCells, navSettings, setNavSettings, size]
    );

    const handleInputCoordinateChange = useCallback(
        (considerFilled?: boolean) => {
            if (!canNav) {
                return;
            }
            let newSettings;
            if (navSettings!.direction === Direction.ACROSS) {
                for (
                    let i = navSettings!.coordinates.col + 1;
                    i < size && i >= 0;
                    i++
                ) {
                    if (!inputCells[navSettings!.coordinates.row][i].isValid) {
                        return navSettings;
                    }
                    if (
                        (!isEmpty(
                            answers.grid[navSettings!.coordinates.row][i]
                        ) &&
                            considerFilled) ||
                        isEmpty(answers.grid[navSettings!.coordinates.row][i])
                    ) {
                        newSettings = {
                            coordinates: {
                                row: navSettings!.coordinates.row,
                                col: i
                            },
                            direction: navSettings!.direction
                        };
                        setNavSettings!(newSettings);
                        return newSettings;
                    }
                }
            } else {
                for (
                    let i = navSettings!.coordinates.row + 1;
                    i < size && i >= 0;
                    i++
                ) {
                    if (!inputCells[i][navSettings!.coordinates.col].isValid) {
                        return navSettings;
                    }
                    if (
                        (!isEmpty(
                            answers.grid[i][navSettings!.coordinates.col]
                        ) &&
                            considerFilled) ||
                        isEmpty(answers.grid[i][navSettings!.coordinates.col])
                    ) {
                        newSettings = {
                            coordinates: {
                                row: i,
                                col: navSettings!.coordinates.col
                            },
                            direction: navSettings!.direction
                        };
                        setNavSettings!(newSettings);
                        return newSettings;
                    }
                }
            }
            return navSettings;
        },
        [answers.grid, canNav, inputCells, navSettings, setNavSettings, size]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!canNav) {
                return;
            }
            const wasFilled = !isEmpty(
                answers.grid[navSettings!.coordinates.row][
                    navSettings!.coordinates.col
                ]
            );
            if (event.key === Keys.ARROW_UP) {
                handleCoordinateChange(-1, Direction.DOWN);
            } else if (event.key === Keys.ARROW_RIGHT) {
                handleCoordinateChange(1, Direction.ACROSS);
            } else if (event.key === Keys.ARROW_DOWN) {
                handleCoordinateChange(1, Direction.DOWN);
            } else if (event.key === Keys.ARROW_LEFT) {
                handleCoordinateChange(-1, Direction.ACROSS);
            } else if (isLetter(event.key) && sendMessage) {
                handleChange(event.key.toUpperCase());
                handleInputCoordinateChange(wasFilled);
            } else if (event.key === Keys.BACKSPACE && sendMessage) {
                let settings;
                if (!wasFilled) {
                    settings = handleCoordinateChange(
                        -1,
                        navSettings!.direction
                    );
                }
                handleChange(BoardVal.EMPTY, settings);
            }
        },
        [
            answers.grid,
            canNav,
            handleChange,
            handleCoordinateChange,
            handleInputCoordinateChange,
            navSettings,
            sendMessage
        ]
    );

    useEffect(() => {
        if (canNav) {
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [canNav, handleKeyDown, navSettings]);

    return (
        <div>
            {cells.map((row) => {
                return (
                    <div className={styles.crosswordRow} key={row}>
                        {cells.map((col) => {
                            return (
                                <CrosswordCell
                                    row={row}
                                    col={col}
                                    annotationData={inputCells[row][col]}
                                    navSettings={navSettings}
                                    setNavSettings={setNavSettings}
                                    value={answers.grid[row][col]}
                                    groundTruth={groundTruth?.grid[row][col]}
                                    key={col}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
});

export default Crossword;
