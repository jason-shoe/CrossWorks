import { useCallback, useMemo, useState } from 'react';
import {
    CollaborativeGame,
    CompetitiveGame,
    Grid,
    isCollaborative,
    isGrids
} from '../shared/types/backendTypes';
import {
    HttpPlayerId,
    HttpResponse,
    isHttpPlayerId,
    MessageType
} from '../shared/types/httpTypes';
import { PageState } from '../shared/types/pageState';
import {
    CollaborativeSocketEndpoint,
    CompetitiveSocketEndpoint,
    createTeamSubscription,
    SocketSubscription
} from '../shared/types/socketTypes';

interface useWebsocketProps {
    game: CollaborativeGame | CompetitiveGame | undefined;
    setGame: (game: CollaborativeGame | CompetitiveGame | undefined) => void;
    setCompetitiveTeamsAnswers: (answers: Grid[] | undefined) => void;
    pageState: PageState;
    setPageState: (pageState: PageState) => void;
    addSubscription: (subscription: string) => void;
}
export function useWebsocket(props: useWebsocketProps) {
    const {
        game,
        setGame,
        setCompetitiveTeamsAnswers,
        pageState,
        setPageState,
        addSubscription
    } = props;
    const [clientRef, setClientRef] = useState<any | undefined>(undefined);
    const [clientId, setClientId] = useState<string | undefined>();

    type HttpMessageType = HttpResponse<
        HttpPlayerId | CollaborativeGame | CompetitiveGame | Grid[]
    >;
    const clientTeamNumber = useMemo(
        () =>
            clientId && game && !isCollaborative(game)
                ? game.playerIds.findIndex((team: string[]) =>
                      team.includes(clientId)
                  )
                : undefined,
        [clientId, game]
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
                clientRef.sendMessage(endpointFull);
            } else {
                clientRef.sendMessage(endpointFull, payload);
            }
        },
        [clientRef]
    );

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
        [
            addSubscription,
            clientTeamNumber,
            pageState,
            sendMessage,
            setCompetitiveTeamsAnswers,
            setGame,
            setPageState
        ]
    );

    return {
        clientId,
        clientTeamNumber,
        setClientRef,
        sendMessage,
        onMessageReceive
    };
}
