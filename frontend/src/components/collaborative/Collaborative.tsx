import React, { memo, useState, useEffect } from 'react';
import internal from 'stream';
import {
    NavigationSettings,
    Coordinates,
    Direction,
    CellHintAnnotation,
    Clue
} from '../shared/types';
import Crossword from '../shared/Crossword';
import './Collaborative.css';
import { CrosswordHint } from '../shared/CrosswordHint';

export const Collaborative = memo(function Collaborative() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [clues, setClues] = useState([]);
    const [crosswordSize, setCrosswordSize] = useState(0);
    const [inputCellsArray, setInputCellsArray] = useState<
        CellHintAnnotation[][] | undefined
    >(undefined);

    const [navSettings, setNavSettings] = useState<NavigationSettings>({
        coordinates: { row: 0, col: 0 },
        direction: Direction.ACROSS
    });

    // Calling sample crossword data API
    useEffect(() => {
        fetch('http://localhost:8080/collaborative-game/sample-crossword')
            .then((res) => res.json())
            .then(
                (result) => {
                    // Storing the crossword clues
                    setClues(result.clues);
                    // Storing the size of the crossword
                    setCrosswordSize(result.size);
                    // Indicates that the crossword data hass been retrieved
                    setIsLoaded(true);

                    let inputCellsTemp: CellHintAnnotation[][] = [
                        ...Array(result.size)
                    ].map((x) =>
                        Array(result.size).fill({
                            across: undefined,
                            down: undefined
                        })
                    );

                    // Array that keeps track of the cells that should be able to take in an input
                    // Initially, every cell cannot take in an input
                    result.clues.forEach((clue: Clue) => {
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
                                        isStart: i == initialColIndex
                                    },
                                    isValid:
                                        inputCellsTemp[initialRowIndex][i]
                                            .down != undefined
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
                                        isStart: i == initialRowIndex
                                    },
                                    isValid:
                                        inputCellsTemp[i][initialColIndex]
                                            .across != undefined
                                };
                            }
                        }
                    });
                    setInputCellsArray(inputCellsTemp);
                },
                // Handling any errors
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );
    }, []);

    return (
        <div>
            {/* Displaying the crossword grid*/}
            {isLoaded && inputCellsArray && (
                <div className="collaborative-page-div">
                    <div className="crossword-grid-div">
                        <Crossword
                            size={crosswordSize}
                            inputCells={inputCellsArray}
                            setNavSettings={setNavSettings}
                            navSettings={navSettings}
                        />
                    </div>

                    {/* Displaying the crossword clues*/}
                    <div className="clues-div">
                        <div className="across-clues-div">
                            <p className="clues-heading">Across Clues</p>
                            {clues.map((clue: Clue, index) => {
                                if (clue.direction === Direction.ACROSS) {
                                    return (
                                        <CrosswordHint
                                            clue={clue}
                                            navSettings={navSettings}
                                            setNavSettings={setNavSettings}
                                            annotationData={
                                                inputCellsArray[
                                                    navSettings.coordinates.row
                                                ][navSettings.coordinates.col]
                                            }
                                            textClassName={'clue-text'}
                                            key={index}
                                        />
                                    );
                                }
                            })}
                        </div>
                        <div className="down-clues-div">
                            <p className="clues-heading">Down Clues</p>
                            {clues.map((clue: Clue, index) => {
                                if (clue.direction == Direction.DOWN) {
                                    return (
                                        <CrosswordHint
                                            clue={clue}
                                            navSettings={navSettings}
                                            setNavSettings={setNavSettings}
                                            annotationData={
                                                inputCellsArray[
                                                    navSettings.coordinates.row
                                                ][navSettings.coordinates.col]
                                            }
                                            textClassName={'clue-text'}
                                            key={index}
                                        />
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default Collaborative;
