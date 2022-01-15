import { memo, useCallback } from 'react';
import {
    CollaborativeGame,
    CompetitiveGame
} from '../shared/types/backendTypes';
import { GameSocketEndpoint, SendMessageFn } from '../shared/types/socketTypes';

interface HeaderProps {
    game: CollaborativeGame | CompetitiveGame;
    sendMessage: SendMessageFn;
    leaveGame: () => void;
}
export const Header = memo(function HeaderFn(props: HeaderProps) {
    const { game, sendMessage, leaveGame } = props;
    const pause = useCallback(
        () => sendMessage(GameSocketEndpoint.PAUSE, undefined, game.gameId),
        [game.gameId, sendMessage]
    );

    const giveUp = useCallback(
        () => sendMessage(GameSocketEndpoint.GIVE_UP, undefined, game.gameId),
        [game.gameId, sendMessage]
    );

    const returnToSettings = useCallback(
        () =>
            sendMessage(
                GameSocketEndpoint.RETURN_TO_SETTINGS,
                undefined,
                game.gameId
            ),
        [game.gameId, sendMessage]
    );

    return (
        <div>
            <div> this is the game status{game.status}</div>
            <button onClick={pause}>Pause</button>
            <button onClick={giveUp}>Give Up</button>
            <button onClick={leaveGame}>Leave Game</button>
            <button onClick={returnToSettings}>Return to Settings</button>
        </div>
    );
});
