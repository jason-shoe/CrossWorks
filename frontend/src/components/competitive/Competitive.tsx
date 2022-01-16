import { memo, useState, useMemo, useEffect, useCallback } from 'react';
import {
    CompetitiveGame,
    flattenPlayers,
    GameStatus,
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
import { Paused } from '../header/Paused';
import { WinScreen } from '../header/WinScreen';

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
    const [winScreenClosed, setWinScreenClosed] = useState(false);
    const [cellAnnotations, setCellAnnotations] = useState<
        CellHintAnnotation[][] | undefined
    >(undefined);

    const closeWinScreen = useCallback(() => {
        setWinScreenClosed(true);
    }, []);

    useEffect(() => {
        const cellAnnotations = getCellAnnotations(game.crossword);
        setCellAnnotations(cellAnnotations);
    }, [game.crossword]);

    const component = useMemo(() => {
        if (game !== undefined && cellAnnotations) {
            switch (game.status) {
                case GameStatus.PAUSED:
                case GameStatus.INCORRECT:
                    return (
                        <Paused
                            gameId={game.gameId}
                            status={game.status}
                            sendMessage={sendMessage}
                        />
                    );
                case GameStatus.STARTED:
                case GameStatus.WON:
                case GameStatus.LOST:
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
                            {!winScreenClosed &&
                                game.status === GameStatus.WON && (
                                    <WinScreen
                                        text={
                                            clientTeamNumber !==
                                            game.winningTeam
                                                ? 'You lost to team ' +
                                                  (clientTeamNumber + 1)
                                                : undefined
                                        }
                                        closeWindow={closeWinScreen}
                                    />
                                )}
                        </div>
                    );
                default:
                    return undefined;
            }
        }
    }, [
        cellAnnotations,
        chatMessages,
        clientId,
        clientTeamNumber,
        closeWinScreen,
        game,
        leaveGame,
        sendMessage,
        teamsAnswers,
        winScreenClosed
    ]);

    return <div>{component}</div>;
});

export default Competitive;
