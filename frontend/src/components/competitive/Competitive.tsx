import { memo, useState, useMemo, useEffect, useCallback } from 'react';
import { BACKEND_URL } from '../shared/types/httpTypes';
import { CompetitiveGame, Grid } from '../shared/types/backendTypes';
import { SendMessageFn } from '../shared/types/socketTypes';
import { CollaborativeGameBoard } from '../collaborative/CollaborativeGameBoard';
import { getCellAnnotations } from '../shared/util/crosswordUtil';
import { CellHintAnnotation } from '../shared/types/boardTypes';
import Crossword from '../shared/Crossword';
import styles from './styles/Competitive.module.scss';

interface CompetitiveProps {
    game: CompetitiveGame;
    clientId: string;
    sendMessage: SendMessageFn;
    leaveGame: () => void;
    teamsAnswers: Grid[];
    clientTeamNumber: number;
}

export const Competitive = memo(function Competitive(props: CompetitiveProps) {
    const {
        game,
        clientId,
        sendMessage,
        leaveGame,
        teamsAnswers,
        clientTeamNumber
    } = props;
    const [cellAnnotations, setCellAnnotations] = useState<
        CellHintAnnotation[][] | undefined
    >(undefined);

    useEffect(() => {
        const cellAnnotations = getCellAnnotations(game.crossword);
        setCellAnnotations(cellAnnotations);
    }, [game.crossword, game.teamAnswers]);

    const pause = useCallback(() => {}, []);
    const giveUp = useCallback(() => {}, []);
    const returnToSettings = useCallback(() => {}, []);

    const component = useMemo(() => {
        if (game !== undefined && cellAnnotations) {
            return (
                <div>
                    <div>this is the game status {game.status}</div>
                    <button onClick={pause}>Pause</button>
                    <button onClick={giveUp}>Give Up</button>
                    <button onClick={leaveGame}>Leave Game</button>
                    <button onClick={returnToSettings}>
                        Return to Settings
                    </button>
                    <CollaborativeGameBoard
                        game={game}
                        teamAnswers={teamsAnswers[clientTeamNumber]}
                        clientId={clientId}
                        sendMessage={sendMessage}
                        cellAnnotations={cellAnnotations}
                    />
                    <div className={styles.opponentCrosswordsWrapper}>
                        {teamsAnswers.map(
                            (teamAnswer, index) =>
                                index !== clientTeamNumber && (
                                    <Crossword
                                        size={game.crossword.size}
                                        inputCells={cellAnnotations}
                                        answers={teamAnswer}
                                        key={index}
                                    />
                                )
                        )}
                    </div>
                </div>
            );
        }
    }, [
        cellAnnotations,
        clientId,
        clientTeamNumber,
        game,
        giveUp,
        leaveGame,
        pause,
        returnToSettings,
        sendMessage,
        teamsAnswers
    ]);

    return <div>{component}</div>;
});

export default Competitive;
