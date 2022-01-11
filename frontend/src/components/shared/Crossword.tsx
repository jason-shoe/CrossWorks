import React, { ChangeEvent, memo, useState, useRef, useEffect } from 'react';
import {
    NavigationSettings,
    Direction,
    Coordinates,
    Keys,
    CellHintAnnotation
} from './types';
import styles from './Crossword.module.scss';
import { CrosswordCell } from './CrosswordCell';

interface CrosswordProps {
    size: number;
    inputCells: CellHintAnnotation[][];
    setNavSettings: (coords: NavigationSettings) => void;
    navSettings: NavigationSettings;
}

export const Crossword = memo(function Crossword(props: CrosswordProps) {
    // Setting the size of the crossword grid based on the API data retrieved
    let { size, inputCells, setNavSettings, navSettings } = props;
    const cells = [...Array(size).keys()];
    const [crosswordCharacters, setCrosswordCharacters] = useState<
        (string | undefined)[][]
    >(
        Array.from({ length: size }, () =>
            Array.from({ length: size }, () => undefined)
        )
    );

    const handleChange = (
        letter: string | undefined,
        newSettings?: NavigationSettings
    ) => {
        let copy = [...crosswordCharacters];
        // @ts-ignore
        const settings = newSettings ?? navSettings;
        copy[settings.coordinates.row][settings.coordinates.col] = letter;
        setCrosswordCharacters(copy);
    };

    const handleCoordinateChange = (shift: number, newDirection: Direction) => {
        let newSettings;
        if (newDirection != navSettings.direction) {
            newSettings = {
                ...navSettings,
                direction: newDirection
            };
            setNavSettings(newSettings);
            return newSettings;
        }
        let startingIndex: number;
        if (newDirection == Direction.ACROSS) {
            startingIndex =
                navSettings.coordinates.row * size +
                navSettings.coordinates.col +
                shift;
        } else {
            startingIndex =
                navSettings.coordinates.col * size +
                navSettings.coordinates.row +
                shift;
        }

        for (let i = startingIndex; i >= 0 && i < size * size; i += shift) {
            let newRow =
                newDirection == Direction.ACROSS
                    ? Math.floor(i / size)
                    : i % size;
            let newCol =
                newDirection == Direction.ACROSS
                    ? i % size
                    : Math.floor(i / size);
            if (inputCells[newRow][newCol].isValid) {
                newSettings = {
                    coordinates: { row: newRow, col: newCol },
                    direction: newDirection
                };
                setNavSettings(newSettings);
                return newSettings;
            }
        }
    };

    const handleInputCoordinateChange = (considerFilled?: boolean) => {
        let newSettings;
        if (navSettings.direction == Direction.ACROSS) {
            for (
                let i = navSettings.coordinates.col + 1;
                i < size && i >= 0;
                i++
            ) {
                if (!inputCells[navSettings.coordinates.row][i].isValid) {
                    return navSettings;
                }
                if (
                    (crosswordCharacters[navSettings.coordinates.row][i] !=
                        undefined &&
                        considerFilled) ||
                    crosswordCharacters[navSettings.coordinates.row][i] ==
                        undefined
                ) {
                    newSettings = {
                        coordinates: {
                            row: navSettings.coordinates.row,
                            col: i
                        },
                        direction: navSettings.direction
                    };
                    setNavSettings(newSettings);
                    return newSettings;
                }
            }
        } else {
            for (
                let i = navSettings.coordinates.row + 1;
                i < size && i >= 0;
                i++
            ) {
                if (!inputCells[i][navSettings.coordinates.col].isValid) {
                    return navSettings;
                }
                if (
                    (crosswordCharacters[i][navSettings.coordinates.col] !=
                        undefined &&
                        considerFilled) ||
                    crosswordCharacters[i][navSettings.coordinates.col] ==
                        undefined
                ) {
                    newSettings = {
                        coordinates: {
                            row: i,
                            col: navSettings.coordinates.col
                        },
                        direction: navSettings.direction
                    };
                    setNavSettings(newSettings);
                    return newSettings;
                }
            }
        }
        return navSettings;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        const wasFilled =
            crosswordCharacters[navSettings.coordinates.row][
                navSettings.coordinates.col
            ] != undefined;
        if (event.key == Keys.ARROW_UP) {
            handleCoordinateChange(-1, Direction.DOWN);
        } else if (event.key == Keys.ARROW_RIGHT) {
            handleCoordinateChange(1, Direction.ACROSS);
        } else if (event.key == Keys.ARROW_DOWN) {
            handleCoordinateChange(1, Direction.DOWN);
        } else if (event.key == Keys.ARROW_LEFT) {
            handleCoordinateChange(-1, Direction.ACROSS);
        } else if (isLetter(event.key)) {
            handleChange(event.key.toUpperCase());
            handleInputCoordinateChange(wasFilled);
        } else if (event.key == Keys.BACKSPACE) {
            let settings;
            if (!wasFilled) {
                settings = handleCoordinateChange(-1, navSettings.direction);
            }
            handleChange(undefined, settings);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [navSettings, crosswordCharacters]);

    return (
        <div>
            <table id="cross-word">
                <tbody>
                    {cells.map((row) => {
                        return (
                            <div className={styles.crosswordRow}>
                                {cells.map((col) => {
                                    return (
                                        <CrosswordCell
                                            row={row}
                                            col={col}
                                            annotationData={
                                                inputCells[row][col]
                                            }
                                            navSettings={navSettings}
                                            setNavSettings={setNavSettings}
                                            value={
                                                crosswordCharacters[row][col]
                                            }
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
});

function isLetter(str: string) {
    return str.length === 1 && str.match(/[a-zA-Z]/i);
}

export default Crossword;
