import { memo, useEffect, useState } from 'react';
import Crossword from './Crossword';
import { CrosswordHintRow } from './CrosswordHintRow';
import { SendMessageFn } from '../shared/types/socketTypes';
import {
    Clue,
    CollaborativeGame,
    CompetitiveGame,
    Grid
} from '../shared/types/backendTypes';
import {
    CellHintAnnotation,
    Direction,
    NavigationSettings
} from '../shared/types/boardTypes';
import { clueHash, getClueProgress } from '../shared/util/crosswordUtil';

interface GameBoardProps {
    game: CollaborativeGame | CompetitiveGame;
    teamAnswers: Grid;
    clientId: string;
    sendMessage: SendMessageFn;
    cellAnnotations: CellHintAnnotation[][];
}

export const GameBoard = memo(function CollaborativeGameFn(
    props: GameBoardProps
) {
    const { game, teamAnswers, sendMessage, cellAnnotations, clientId } = props;
    const [clueProgress, setClueProgress] = useState<Map<string, number>>(
        new Map()
    );

    const [navSettings, setNavSettings] = useState<NavigationSettings>({
        coordinates: { row: 0, col: 0 },
        direction: Direction.ACROSS
    });

    useEffect(() => {
        setClueProgress(
            getClueProgress(game.crossword.clues, cellAnnotations, teamAnswers)
        );
    }, [cellAnnotations, game.crossword.clues, teamAnswers]);

    return (
        <div className="collaborative-page-div">
            <div className="crossword-grid-div">
                <Crossword
                    size={game.crossword.size}
                    inputCells={cellAnnotations}
                    answers={teamAnswers}
                    sendMessage={sendMessage}
                    gameId={game.gameId}
                    clientId={clientId}
                    groundTruth={game.board}
                    setNavSettings={setNavSettings}
                    navSettings={navSettings}
                />
            </div>

            {/* Displaying the crossword clues*/}
            <div className="clues-div">
                <div className="across-clues-div">
                    <p className="clues-heading">Across Clues</p>
                    {game.crossword.clues.map((clue: Clue, index) =>
                        clue.direction === Direction.ACROSS ? (
                            <CrosswordHintRow
                                clue={clue}
                                navSettings={navSettings}
                                setNavSettings={setNavSettings}
                                annotationData={
                                    cellAnnotations[
                                        navSettings.coordinates.row
                                    ][navSettings.coordinates.col]
                                }
                                textClassName={'clue-text'}
                                key={index}
                                finished={
                                    clue.answerLength ===
                                    clueProgress.get(
                                        clueHash(
                                            clue.hintNumber,
                                            Direction.ACROSS
                                        )
                                    )
                                }
                            />
                        ) : undefined
                    )}
                </div>
                <div className="down-clues-div">
                    <p className="clues-heading">Down Clues</p>
                    {game.crossword.clues.map((clue: Clue, index) =>
                        clue.direction === Direction.DOWN ? (
                            <CrosswordHintRow
                                clue={clue}
                                navSettings={navSettings}
                                setNavSettings={setNavSettings}
                                annotationData={
                                    cellAnnotations[
                                        navSettings.coordinates.row
                                    ][navSettings.coordinates.col]
                                }
                                textClassName={'clue-text'}
                                key={index}
                                finished={
                                    clue.answerLength ===
                                    clueProgress.get(
                                        clueHash(
                                            clue.hintNumber,
                                            Direction.DOWN
                                        )
                                    )
                                }
                            />
                        ) : undefined
                    )}
                </div>
            </div>
        </div>
    );
});
