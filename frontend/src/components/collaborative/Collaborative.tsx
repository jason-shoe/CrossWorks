import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { CollaborativeGame, GameStatus } from '../shared/types/backendTypes';
import { CellHintAnnotation } from '../shared/types/boardTypes';
import './Collaborative.css';
import { SendMessageFn, SocketEndpoint } from '../shared/types/socketTypes';
import { getCellAnnotations } from '../shared/util/crosswordUtil';
import { Paused } from './Paused';
import { CollaborativeGameBoard } from './CollaborativeGameBoard';
import styles from './styles/Collaborative.module.scss';
import { WinScreen } from './WinScreen';

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

    const pause = useCallback(
        () => sendMessage(SocketEndpoint.PAUSE, undefined, game.gameId),
        [game.gameId, sendMessage]
    );

    const giveUp = useCallback(
        () => sendMessage(SocketEndpoint.GIVE_UP, undefined, game.gameId),
        [game.gameId, sendMessage]
    );

    const returnToSettings = useCallback(
        () =>
            sendMessage(
                SocketEndpoint.RETURN_TO_SETTINGS,
                undefined,
                game.gameId
            ),
        [game.gameId, sendMessage]
    );

    const component = useMemo(() => {
        if (cellAnnotations === undefined) {
            return undefined;
        } else if (
            game.status === GameStatus.PAUSED ||
            game.status === GameStatus.INCORRECT
        ) {
            return (
                <Paused
                    gameId={game.gameId}
                    status={game.status}
                    sendMessage={sendMessage}
                />
            );
        } else if (
            game.status === GameStatus.STARTED ||
            game.status === GameStatus.WON ||
            game.status === GameStatus.LOST
        ) {
            return (
                <div>
                    <div> this is the game status{game.status}</div>
                    <button onClick={pause}>Pause</button>
                    <button onClick={giveUp}>Give Up</button>
                    <button onClick={leaveGame}>Leave Game</button>
                    <button onClick={returnToSettings}>
                        Return to Settings
                    </button>
                    <CollaborativeGameBoard
                        game={game}
                        clientId={clientId}
                        sendMessage={sendMessage}
                        cellAnnotations={cellAnnotations}
                    />
                    {!winScreenClosed && game.status === GameStatus.WON && (
                        <WinScreen closeWindow={closeWinScreen} />
                    )}
                </div>
            );
        }
    }, [
        cellAnnotations,
        game,
        sendMessage,
        pause,
        giveUp,
        leaveGame,
        returnToSettings,
        winScreenClosed,
        closeWinScreen
    ]);
    return <div className={styles.collaborativeWrapper}>{component}</div>;
});

export default Collaborative;
