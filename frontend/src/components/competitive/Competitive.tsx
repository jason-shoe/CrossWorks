import { memo, useState, useMemo, useEffect } from 'react';
import {
    CompetitiveGame,
    flattenPlayers,
    Grid,
    isCollaborative
} from '../shared/types/backendTypes';
import { SendMessageFn } from '../shared/types/socketTypes';
import { GameBoard } from '../crossword/GameBoard';
import { getCellAnnotations } from '../shared/util/crosswordUtil';
import { CellHintAnnotation } from '../shared/types/boardTypes';
import styles from './Competitive.module.scss';
import Crossword from '../crossword/Crossword';
import { Header } from '../header/Header';
import { Chat } from '../shared/Chat';
import { ChatMessage } from '../shared/types/httpTypes';

interface CompetitiveProps {
    game: CompetitiveGame;
    clientId: string;
    chatMessages: ChatMessage[];
    sendMessage: SendMessageFn;
    leaveGame: () => void;
    teamsAnswers: Grid[];
    clientTeamNumber: number;
}

export const Competitive = memo(function Competitive(props: CompetitiveProps) {
    const {
        game,
        clientId,
        chatMessages,
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

    const component = useMemo(() => {
        if (game !== undefined && cellAnnotations) {
            return (
                <div>
                    <Header
                        game={game}
                        sendMessage={sendMessage}
                        leaveGame={leaveGame}
                    />
                    <GameBoard
                        game={game}
                        teamAnswers={teamsAnswers[clientTeamNumber]}
                        clientId={clientId}
                        sendMessage={sendMessage}
                        cellAnnotations={cellAnnotations}
                    />
                    <Chat
                        players={flattenPlayers(game.players)}
                        chatMessages={chatMessages}
                        sendMessage={sendMessage}
                        isCollaborative={isCollaborative(game)}
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
        chatMessages,
        clientId,
        clientTeamNumber,
        game,
        leaveGame,
        sendMessage,
        teamsAnswers
    ]);

    return <div>{component}</div>;
});

export default Competitive;
