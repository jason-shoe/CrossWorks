// @ts-ignore
import SockJsClient from 'react-stomp';
import { memo, useEffect, useMemo, useState, useCallback } from 'react';
import Collaborative from './collaborative/Collaborative';
import Competitive from './competitive/Competitive';
import GameModeSelection from './homepage/GameModeSelection';
import Homepage from './homepage/Homepage';
import Settings from './settings/Settings';
import { PageState } from './shared/types/pageState';
import {
    CollaborativeGame,
    CompetitiveGame,
    GameStatus,
    Grid,
    isCollaborative,
    isGrids
} from './shared/types/backendTypes';
import {
    HttpResponse,
    HttpPlayerId,
    isHttpPlayerId,
    MessageType,
    BACKEND_URL
} from './shared/types/httpTypes';
import { JoinGameInput } from './homepage/JoinGameInput';
import {
    CollaborativeSocketEndpoint,
    CompetitiveSocketEndpoint,
    createTeamSubscription,
    SocketSubscription
} from './shared/types/socketTypes';

type HttpMessageType = HttpResponse<
    HttpPlayerId | CollaborativeGame | CompetitiveGame | Grid[]
>;

const MainRouter = memo(function MainRouterFn() {
    const [pageState, setPageState] = useState<PageState>(PageState.MAIN);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [clientConnected, setClientConnected] = useState(false);
    const [clientId, setClientId] = useState<string | undefined>();
    const [clientRef, setClientRef] = useState<any | undefined>(undefined);
    const [game, setGame] = useState<
        CollaborativeGame | CompetitiveGame | undefined
    >(undefined);
    const [subscriptions, setSubscriptions] = useState<string[]>([
        SocketSubscription.USER_MESSAGES
    ]);
    const [competitiveTeamsAnswers, setCompetitiveTeamsAnswers] = useState<
        Grid[] | undefined
    >();

    const clientTeamNumber = useMemo(
        () =>
            clientId && game && !isCollaborative(game)
                ? game.playerIds.findIndex((team: string[]) =>
                      team.includes(clientId)
                  )
                : undefined,
        [clientId, game]
    );

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
        (
            endpoint: CollaborativeSocketEndpoint | CompetitiveSocketEndpoint,
            payload?: any,
            gameId?: string
        ) => {
            let endpointFull: string = endpoint;

            if (gameId !== undefined) {
                endpointFull += gameId;
            }

            if (payload === undefined) {
                console.log('sending message', endpointFull);
                clientRef.sendMessage(endpointFull);
            } else {
                console.log('sending message', endpointFull, payload);
                clientRef.sendMessage(endpointFull, payload);
            }
        },
        [clientRef]
    );

    const leaveGame = useCallback(() => {
        if (game) {
            removeSubscription(
                SocketSubscription.COLLABORATIVE_GAME_PREFIX + game.gameId
            );
            sendMessage(
                CollaborativeSocketEndpoint.LEAVE_GAME,
                JSON.stringify({ playerId: clientId }),
                game.gameId
            );
            setPageState(PageState.MAIN);
            setGame(undefined);
        }
    }, [clientId, game, removeSubscription, sendMessage]);

    const onMessageReceive = useCallback(
        (msg: HttpMessageType) => {
            console.log('this is the message', msg, pageState);
            const messageType = msg.headers.type[0];
            if (isHttpPlayerId(msg.body)) {
                if (messageType === MessageType.GET_PLAYER_ID) {
                    setClientId(msg.body);
                }
            } else if (isGrids(msg.body)) {
                if (messageType === MessageType.TEAMS_ANSWERS_UPDATE) {
                    setCompetitiveTeamsAnswers(msg.body);
                }
            } else if (messageType === MessageType.CREATE_GAME) {
                if (isCollaborative(msg.body)) {
                    addSubscription(
                        SocketSubscription.COLLABORATIVE_GAME_PREFIX +
                            msg.body.gameId
                    );
                } else {
                    addSubscription(
                        SocketSubscription.COMPETITIVE_GAME_PREFIX +
                            msg.body.gameId
                    );
                }

                setGame(msg.body);
            } else if (messageType === MessageType.UPDATE_GAME) {
                setGame(msg.body);
            } else if (messageType === MessageType.BAD_GAME_ID) {
                setPageState(PageState.BAD_JOIN_GAME);
            } else if (messageType === MessageType.START_GAME) {
                if (clientTeamNumber !== undefined) {
                    addSubscription(
                        createTeamSubscription(
                            msg.body.gameId,
                            clientTeamNumber
                        )
                    );
                    sendMessage(
                        CompetitiveSocketEndpoint.SEND_TEAM_ANSWERS,
                        undefined,
                        msg.body.gameId
                    );
                }
                setGame(msg.body);
                setPageState(PageState.COLLABORATIVE);
            }
        },
        [addSubscription, clientTeamNumber, pageState, sendMessage]
    );

    useEffect(() => {
        if (game !== undefined) {
            if (game.status === GameStatus.SETTINGS) {
                isCollaborative(game)
                    ? setPageState(PageState.COLLABORATIVE_SETTINGS)
                    : setPageState(PageState.COMPETITIVE_SETTINGS);
            } else if (game.status === GameStatus.STARTED) {
                console.log(isCollaborative(game));
                isCollaborative(game)
                    ? setPageState(PageState.COLLABORATIVE)
                    : setPageState(PageState.COMPETITIVE);
            }
        }
    }, [addSubscription, clientTeamNumber, game, pageState, sendMessage]);

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
                    createCollaborative={
                        PageState.COLLABORATIVE_SETTINGS === pageState
                    }
                    sendMessage={sendMessage}
                    addSubscription={addSubscription}
                    removeSubscription={removeSubscription}
                    subscriptions={subscriptions}
                    clientId={clientId}
                    clientTeamNumber={clientTeamNumber}
                    game={game}
                />
            ) : undefined;
        } else if (pageState === PageState.COMPETITIVE) {
            return competitiveTeamsAnswers &&
                clientTeamNumber !== undefined &&
                clientId &&
                game &&
                !isCollaborative(game) ? (
                <Competitive
                    game={game}
                    clientId={clientId}
                    sendMessage={sendMessage}
                    leaveGame={leaveGame}
                    teamsAnswers={competitiveTeamsAnswers}
                    clientTeamNumber={clientTeamNumber}
                />
            ) : undefined;
        } else {
            return clientId && game && isCollaborative(game) ? (
                <Collaborative
                    game={game}
                    clientId={clientId}
                    sendMessage={sendMessage}
                    leaveGame={leaveGame}
                />
            ) : undefined;
        }
    }, [
        pageState,
        clientId,
        addSubscription,
        sendMessage,
        clientTeamNumber,
        removeSubscription,
        subscriptions,
        game,
        competitiveTeamsAnswers,
        leaveGame
    ]);

    return (
        <div>
            <SockJsClient
                url={BACKEND_URL + 'game-socket'}
                topics={subscriptions}
                onMessage={onMessageReceive}
                ref={setClientRef}
                onConnect={() => {
                    sendMessage(CollaborativeSocketEndpoint.GET_PLAYER_ID);
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
