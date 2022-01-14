import { memo, useCallback } from 'react';
import {
    SendMessageFn,
    CollaborativeSocketEndpoint
} from '../shared/types/socketTypes';
import { GameStatus } from '../shared/types/backendTypes';

interface PausedProps {
    gameId: string;
    status: GameStatus;
    sendMessage: SendMessageFn;
}

export const Paused = memo(function PausedFn(props: PausedProps) {
    const { gameId, status, sendMessage } = props;
    const unpause = useCallback(
        () =>
            sendMessage(
                CollaborativeSocketEndpoint.UNPAUSE_GAME,
                undefined,
                gameId
            ),
        [gameId, sendMessage]
    );

    return (
        <div>
            The game is {status} <button onClick={unpause}>Resume</button>
        </div>
    );
});
