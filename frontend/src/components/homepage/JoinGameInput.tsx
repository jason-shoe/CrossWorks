import { ChangeEvent, memo, useCallback, useState } from 'react';
import { GameState } from '../shared/gameState';

interface JoinGameInputProps {
    setGameState: (state: GameState) => void;
    clientId: string;
    addSubscription: (subscription: string) => void;
    clientRef: any;
    hasFailed: boolean;
}

export const JoinGameInput = memo(function JoinGameInputFn(
    props: JoinGameInputProps
) {
    const [gameId, setGameId] = useState('');
    const { setGameState, clientId, addSubscription, clientRef, hasFailed } =
        props;

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setGameId(event.target.value);
        },
        [setGameId]
    );

    const joinGame = useCallback(() => {
        addSubscription('queue/game/' + gameId);
        clientRef.sendMessage(
            '/app/connect/' + gameId,
            JSON.stringify({ playerId: clientId })
        );
    }, [addSubscription, gameId, clientRef, clientId]);

    const cardButtonStyles = `bg-white border border-gray-200 rounded text-xl py-32
                        flex-grow shadow hover:bg-blue-50 focus:ring-2
                        focus:ring-blue-700 focus:bg-blue-50`;
    return (
        <div className={`max-w-2xl m-auto mt-20 space-y-8`}>
            {/* settings component there is just temporary */}
            <div className={`space-y-3`}>
                <p className={`text-4xl font-bold text-blue-700`}>
                    Join a Game
                </p>
                <p>Description</p>
            </div>
            <div className={`flex justify-between space-x-6`}>
                <div>Input Game ID</div>
                <input
                    className={`flex-grow border border-gray-200`}
                    type="text"
                    value={gameId}
                    onChange={handleChange}
                ></input>
            </div>
            {hasFailed ? <p>failed</p> : <p>success</p>}
            <div className={`flex space-x-4 pt-16`}>
                <button
                    className={`px-20 py-4 bg-blue-50 rounded-md text-blue-700 
                          font-semibold text-lg`}
                    onClick={() => setGameState(GameState.MAIN)}
                >
                    Back
                </button>
                <button
                    className={`px-12 py-4 bg-blue-700 rounded-md text-white 
                        font-semibold text-lg disabled:opacity-50`}
                    onClick={joinGame}
                >
                    Join Game
                </button>
            </div>
        </div>
    );
});
