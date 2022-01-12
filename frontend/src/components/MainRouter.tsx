// @ts-ignore
import SockJsClient from 'react-stomp';
import { memo, useEffect, useMemo, useState, useCallback } from 'react';
import Collaborative from './collaborative/Collaborative';
import Competitive from './competitive/Competitive';
import GameModeSelection from './homepage/GameModeSelection';
import Homepage from './homepage/Homepage';
import Settings from './settings/Settings';
import { GameState } from './shared/gameState';
import { CollaborativeGame } from './shared/types';
import {
    HttpResponse,
    HttpPlayerId,
    isHttpPlayerId,
    MessageType
} from './shared/httpTypes';
import { JoinGameInput } from './homepage/JoinGameInput';

type HttpMessageType = HttpResponse<HttpPlayerId | CollaborativeGame>;

const MainRouter = memo(function MainRouterFn() {
    const [gameState, setGameState] = useState<GameState>(GameState.MAIN);

    const [clientConnected, setClientConnected] = useState(false);
    const [clientId, setClientId] = useState<string | undefined>();
    const [clientRef, setClientRef] = useState<any | undefined>(undefined);
    const [game, setGame] = useState<CollaborativeGame | undefined>(undefined);
    const [subscriptions, setSubscriptions] = useState<string[]>([
        '/users/queue/messages'
    ]);

    const addSubscription = useCallback(
        (endpoint: string) => {
            setSubscriptions([...subscriptions, endpoint]);
        },
        [subscriptions]
    );

    const onMessageReceive = (msg: HttpMessageType) => {
        console.log('this is the message', msg);
        const messageType = msg.headers.type[0];
        console.log(
            isHttpPlayerId(msg.body),
            messageType == MessageType.GET_PLAYER_ID
        );
        if (isHttpPlayerId(msg.body)) {
            if (messageType == MessageType.GET_PLAYER_ID) {
                setClientId(msg.body);
            }
        } else if (messageType == MessageType.CREATE_GAME) {
            addSubscription('queue/game/' + msg.body.gameId);
            setGame(msg.body);
        } else if (messageType == MessageType.UPDATE_GAME) {
            setGame(msg.body);
        } else if (messageType == MessageType.BAD_GAME_ID) {
            setGameState(GameState.BAD_JOIN_GAME);
        } else if (messageType == MessageType.START_GAME) {
            setGameState(GameState.COLLABORATIVE);
        }
    };

    useEffect(() => {
        if (
            (gameState == GameState.JOIN_GAME ||
                gameState == GameState.BAD_JOIN_GAME) &&
            game != undefined
        ) {
            setGameState(GameState.COLLABORATIVE_SETTINGS);
        }
    }, [game, gameState]);

    const component = useMemo(() => {
        if (gameState == GameState.MAIN) {
            return <Homepage setGameState={setGameState} />;
        } else if (gameState === GameState.CREATE_GAME) {
            return <GameModeSelection setGameState={setGameState} />;
        } else if (
            gameState === GameState.JOIN_GAME ||
            gameState === GameState.BAD_JOIN_GAME
        ) {
            // TODO: update this
            if (clientId) {
                return (
                    <JoinGameInput
                        setGameState={setGameState}
                        clientId={clientId}
                        addSubscription={addSubscription}
                        clientRef={clientRef}
                        hasFailed={gameState === GameState.BAD_JOIN_GAME}
                    />
                );
            }
            return undefined;
        } else if (gameState === GameState.COMPETITIVE_SETTINGS) {
            if (clientId) {
                return (
                    <Settings
                        isCollaborative={false}
                        clientRef={clientRef}
                        clientId={clientId}
                        game={game}
                        subscriptions={subscriptions}
                        addSubscription={addSubscription}
                    />
                );
            }
            return undefined;
        } else if (gameState === GameState.COLLABORATIVE_SETTINGS) {
            if (clientId) {
                return (
                    <Settings
                        isCollaborative={true}
                        clientRef={clientRef}
                        clientId={clientId}
                        game={game}
                        subscriptions={subscriptions}
                        addSubscription={addSubscription}
                    />
                );
            }
            return undefined;
        } else if (gameState === GameState.COMPETITIVE) {
            return <Competitive />;
        } else {
            if (game) {
                return <Collaborative game={game} clientRef={clientRef} />;
            }
            return undefined;
        }
    }, [gameState, clientId, clientRef, game, subscriptions, addSubscription]);

    return (
        <div>
            <SockJsClient
                url="http://localhost:8080/gs-guide-websocket"
                topics={subscriptions}
                onMessage={onMessageReceive}
                ref={setClientRef}
                onConnect={() => {
                    clientRef.sendMessage('/app/getPlayerId');
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
