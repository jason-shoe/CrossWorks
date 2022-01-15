import { ChangeEvent, memo, useCallback, useState } from 'react';
import { PageState } from '../shared/types/pageState';
import { ClientNameProps } from '../shared/types/propTypes';
import {
    SendMessageFn,
    SocketSubscription,
    PlayerSocketEndpoint
} from '../shared/types/socketTypes';
import { UsernameInput } from './UsernameInput';

interface JoinGameInputProps {
    setPageState: (state: PageState) => void;
    clientNameProps: ClientNameProps;
    addSubscription: (subscription: string) => void;
    sendMessage: SendMessageFn;
    hasFailed: boolean;
}

export const JoinGameInput = memo(function JoinGameInputFn(
    props: JoinGameInputProps
) {
    const [gameId, setGameId] = useState('');
    const {
        setPageState,
        clientNameProps,
        addSubscription,
        sendMessage,
        hasFailed
    } = props;

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setGameId(event.target.value);
        },
        [setGameId]
    );

    const joinGame = useCallback(() => {
        if (clientNameProps.clientName.length === 0) {
            clientNameProps.setGaveWarning(true);
        } else if (gameId.includes('game')) {
            addSubscription(SocketSubscription.GAME_PREFIX + gameId);
            sendMessage(
                PlayerSocketEndpoint.CONNECT,
                clientNameProps.clientName,
                gameId
            );
        } else {
            setPageState(PageState.BAD_JOIN_GAME);
        }
    }, [clientNameProps, gameId, addSubscription, sendMessage, setPageState]);

    return (
        <div className={`max-w-2xl m-auto mt-20 space-y-8`}>
            {/* settings component there is just temporary */}
            <div className={`space-y-3`}>
                <p className={`text-4xl font-bold text-blue-700`}>
                    Join a Game
                </p>
                <p>Description</p>
                <UsernameInput
                    clientName={clientNameProps.clientName}
                    setClientName={clientNameProps.setClientName}
                    showWarning={clientNameProps.gaveWarning}
                />
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
                    onClick={() => setPageState(PageState.MAIN)}
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
