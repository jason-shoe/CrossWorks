import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { CollaborativeGame, GameStatus } from '../shared/types/backendTypes';
import { CellHintAnnotation } from '../shared/types/boardTypes';
import './Collaborative.css';
import { SendMessageFn } from '../shared/types/socketTypes';
import { getCellAnnotations } from '../shared/util/crosswordUtil';
import { Paused } from '../header/Paused';
import { GameBoard } from '../crossword/GameBoard';
import { WinScreen } from '../header/WinScreen';
import { Header } from '../header/Header';
import styles from './Collaborative.module.scss';

interface CollaborativeProps {
    game: CollaborativeGame;
    clientId: string;
    sendMessage: SendMessageFn;
    leaveGame: () => void;
}

export const Collaborative = memo(function Collaborative(
    props: CollaborativeProps
) {
    const { game, sendMessage, leaveGame, clientId } = props;
    const [cellAnnotations, setCellAnnotations] = useState<
        CellHintAnnotation[][] | undefined
    >(undefined);

    const [winScreenClosed, setWinScreenClosed] = useState(false);

    useEffect(() => {
        const cellAnnotations = getCellAnnotations(game.crossword);
        setCellAnnotations(cellAnnotations);
        setWinScreenClosed(false);
    }, [game.crossword, game.teamAnswers]);

    const closeWinScreen = useCallback(() => {
        setWinScreenClosed(true);
    }, []);

    const component = useMemo(() => {
        if (cellAnnotations === undefined) {
            return undefined;
        }
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
                            teamAnswers={game.teamAnswers}
                            clientId={clientId}
                            sendMessage={sendMessage}
                            cellAnnotations={cellAnnotations}
                        />
                        {!winScreenClosed && game.status === GameStatus.WON && (
                            <WinScreen closeWindow={closeWinScreen} />
                        )}
                    </div>
                );
            default:
                return undefined;
        }
    }, [
        cellAnnotations,
        game,
        sendMessage,
        leaveGame,
        clientId,
        winScreenClosed,
        closeWinScreen
    ]);
    return <div className={styles.collaborativeWrapper}>{component}</div>;
});

export default Collaborative;
