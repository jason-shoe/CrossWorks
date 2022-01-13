// @ts-ignore
import SockJsClient from 'react-stomp';
import { memo, useEffect, useMemo, useState, useCallback } from 'react';
import Collaborative from './collaborative/Collaborative';
import Competitive from './competitive/Competitive';
import GameModeSelection from './homepage/GameModeSelection';
import Homepage from './homepage/Homepage';
import Settings from './settings/Settings';
import { PageState } from './shared/types/pageState';
import { CollaborativeGame, GameStatus } from './shared/types/backendTypes';
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
    const [pageState, setPageState] = useState<PageState>(PageState.MAIN);

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
    const removeSubscription = useCallback(
        (endpoint: string) => {
            setSubscriptions(subscriptions.filter((val) => val !== endpoint));
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

    const leaveGame = useCallback(() => {
        if (game) {
            removeSubscription(SocketSubscription.GAME_PREFIX + game.gameId);
            sendMessage(
                SocketEndpoint.LEAVE_GAME,
                JSON.stringify({ playerId: clientId }),
                game.gameId
            );
            setPageState(PageState.MAIN);
            setGame(undefined);
        }
    }, [clientId, game, removeSubscription, sendMessage]);

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
                setPageState(PageState.BAD_JOIN_GAME);
            } else if (messageType === MessageType.START_GAME) {
                setGame(msg.body);
                setPageState(PageState.COLLABORATIVE);
            }
        },
        [addSubscription]
    );

    useEffect(() => {
        if (game !== undefined) {
            // trying to join, and successfully got a game
            if (
                pageState === PageState.JOIN_GAME ||
                pageState === PageState.BAD_JOIN_GAME
            ) {
                if (game.status === GameStatus.SETTINGS) {
                    setPageState(PageState.COLLABORATIVE_SETTINGS);
                } else {
                    setPageState(PageState.COLLABORATIVE);
                }
            } else if (game.status === GameStatus.SETTINGS) {
                setPageState(PageState.COLLABORATIVE_SETTINGS);
            }
        }
    }, [game, pageState]);

    const component = useMemo(() => {
        if (pageState === PageState.MAIN) {
            return <Homepage setPageState={setPageState} />;
        } else if (pageState === PageState.CREATE_GAME) {
            return <GameModeSelection setPageState={setPageState} />;
        } else if (
            pageState === PageState.JOIN_GAME ||
            pageState === PageState.BAD_JOIN_GAME
        ) {
            return clientId ? (
                <JoinGameInput
                    setPageState={setPageState}
                    clientId={clientId}
                    addSubscription={addSubscription}
                    sendMessage={sendMessage}
                    hasFailed={pageState === PageState.BAD_JOIN_GAME}
                />
            ) : undefined;
        } else if (
            pageState === PageState.COMPETITIVE_SETTINGS ||
            pageState === PageState.COLLABORATIVE_SETTINGS
        ) {
            return clientId ? (
                <Settings
                    isCollaborative={
                        pageState === PageState.COLLABORATIVE_SETTINGS
                    }
                    sendMessage={sendMessage}
                    clientId={clientId}
                    game={game}
                />
            ) : undefined;
        } else if (pageState === PageState.COMPETITIVE) {
            return <Competitive />;
        } else {
            return clientId && game ? (
                <Collaborative
                    game={game}
                    clientId={clientId}
                    sendMessage={sendMessage}
                    leaveGame={leaveGame}
                />
            ) : undefined;
        }
    }, [pageState, clientId, addSubscription, sendMessage, game, leaveGame]);

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
