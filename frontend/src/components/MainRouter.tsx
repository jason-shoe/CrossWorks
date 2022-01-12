// @ts-ignore
import SockJsClient from 'react-stomp';
import { memo, useEffect, useMemo, useState, useCallback } from 'react';
import Collaborative from './collaborative/Collaborative';
import Competitive from './competitive/Competitive';
import GameModeSelection from './homepage/GameModeSelection';
import Homepage from './homepage/Homepage';
import Settings from './settings/Settings';
import { GameState } from './shared/types/gameState';
import { CollaborativeGame } from './shared/types/types';
import {
    HttpResponse,
    HttpPlayerId,
    isHttpPlayerId,
    MessageType,
    BACKEND_URL
} from './shared/types/httpTypes';
import { JoinGameInput } from './homepage/JoinGameInput';
import { SocketEndpoint, SocketSubscription } from './shared/types/socketTypes';

type HttpMessageType = HttpResponse<HttpPlayerId | CollaborativeGame>;

const MainRouter = memo(function MainRouterFn() {
    const [gameState, setGameState] = useState<GameState>(GameState.MAIN);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [clientConnected, setClientConnected] = useState(false);
    const [clientId, setClientId] = useState<string | undefined>();
    const [clientRef, setClientRef] = useState<any | undefined>(undefined);
    const [game, setGame] = useState<CollaborativeGame | undefined>(undefined);
    const [subscriptions, setSubscriptions] = useState<string[]>([
        SocketSubscription.USER_MESSAGES
    ]);

    const addSubscription = useCallback(
        (endpoint: string) => {
            setSubscriptions([...subscriptions, endpoint]);
        },
        [subscriptions]
    );

    const sendMessage = useCallback(
        (endpoint: SocketEndpoint, payload?: any, gameId?: string) => {
            let endpointFull: string = endpoint;

            if (gameId !== undefined) {
                endpointFull += gameId;
            }

            if (payload === undefined) {
                clientRef.sendMessage(endpointFull);
            } else {
                clientRef.sendMessage(endpointFull, payload);
            }
        },
        [clientRef]
    );

    const onMessageReceive = useCallback(
        (msg: HttpMessageType) => {
            console.log('this is the message', msg);
            const messageType = msg.headers.type[0];
            if (isHttpPlayerId(msg.body)) {
                if (messageType === MessageType.GET_PLAYER_ID) {
                    setClientId(msg.body);
                }
            } else if (messageType === MessageType.CREATE_GAME) {
                addSubscription(
                    SocketSubscription.GAME_PREFIX + msg.body.gameId
                );
                setGame(msg.body);
            } else if (messageType === MessageType.UPDATE_GAME) {
                setGame(msg.body);
            } else if (messageType === MessageType.BAD_GAME_ID) {
                setGameState(GameState.BAD_JOIN_GAME);
            } else if (messageType === MessageType.START_GAME) {
                setGameState(GameState.COLLABORATIVE);
            }
        },
        [addSubscription]
    );

    useEffect(() => {
        if (
            (gameState === GameState.JOIN_GAME ||
                gameState === GameState.BAD_JOIN_GAME) &&
            game !== undefined
        ) {
            setGameState(GameState.COLLABORATIVE_SETTINGS);
        }
    }, [game, gameState]);

    const component = useMemo(() => {
        if (gameState === GameState.MAIN) {
            return <Homepage setGameState={setGameState} />;
        } else if (gameState === GameState.CREATE_GAME) {
            return <GameModeSelection setGameState={setGameState} />;
        } else if (
            gameState === GameState.JOIN_GAME ||
            gameState === GameState.BAD_JOIN_GAME
        ) {
            return clientId ? (
                <JoinGameInput
                    setGameState={setGameState}
                    clientId={clientId}
                    addSubscription={addSubscription}
                    sendMessage={sendMessage}
                    hasFailed={gameState === GameState.BAD_JOIN_GAME}
                />
            ) : undefined;
        } else if (
            gameState === GameState.COMPETITIVE_SETTINGS ||
            gameState === GameState.COLLABORATIVE_SETTINGS
        ) {
            return clientId ? (
                <Settings
                    isCollaborative={
                        gameState === GameState.COLLABORATIVE_SETTINGS
                    }
                    sendMessage={sendMessage}
                    clientId={clientId}
                    game={game}
                />
            ) : undefined;
        } else if (gameState === GameState.COMPETITIVE) {
            return <Competitive />;
        } else {
            return game ? (
                <Collaborative game={game} sendMessage={sendMessage} />
            ) : undefined;
        }
    }, [gameState, clientId, addSubscription, sendMessage, game]);

    return (
        <div>
            <SockJsClient
                url={BACKEND_URL + 'game-socket'}
                topics={subscriptions}
                onMessage={onMessageReceive}
                ref={setClientRef}
                onConnect={() => {
                    sendMessage(SocketEndpoint.GET_PLAYER_ID);
                    setClientConnected(true);
                }}
                onDisconnect={() => setClientConnected(false)}
                debug={false}
            />
            {component}
        </div>
    );
});

export default MainRouter;
