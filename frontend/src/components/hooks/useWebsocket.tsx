import { useCallback, useMemo, useState } from 'react';
import {
    CollaborativeGame,
    CompetitiveGame,
    Grid,
    isCollaborative,
    isGrids,
    PlayerInfo
} from '../shared/types/backendTypes';
import {
    CLIENT_NAME_KEY,
    HttpPlayerId,
    HttpResponse,
    isHttpPlayerId,
    MessageType
} from '../shared/types/httpTypes';
import { PageState } from '../shared/types/pageState';
import { ClientNameProps } from '../shared/types/propTypes';
import {
    createTeamSubscription,
    GameSocketEndpoint,
    PlayerSocketEndpoint,
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
    const [clientName, setClientNameState] = useState<string>(
        localStorage.getItem(CLIENT_NAME_KEY) || ''
    );
    const [gaveWarning, setGaveWarning] = useState(false);

    type HttpMessageType = HttpResponse<
        HttpPlayerId | CollaborativeGame | CompetitiveGame | Grid[]
    >;
    const clientTeamNumber = useMemo(
        () =>
            clientId && game && !isCollaborative(game)
                ? game.players.findIndex((team: PlayerInfo[]) =>
                      team.map((player) => player.playerId).includes(clientId)
                  )
                : undefined,
        [clientId, game]
    );

    const setClientName = useCallback((name: string) => {
        localStorage.setItem(CLIENT_NAME_KEY, name);
        setClientNameState(name);
    }, []);

    const sendMessage = useCallback(
        (
            endpoint: PlayerSocketEndpoint | GameSocketEndpoint,
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
                        SocketSubscription.GAME_PREFIX + msg.body.gameId
                    );
                } else {
                    addSubscription(
                        SocketSubscription.GAME_PREFIX + msg.body.gameId
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
                        GameSocketEndpoint.SEND_TEAM_ANSWERS,
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

    const clientNameProps: ClientNameProps = {
        clientName,
        setClientName,
        gaveWarning,
        setGaveWarning
    };

    return {
        clientId,
        clientNameProps,
        clientTeamNumber,
        setClientRef,
        sendMessage,
        onMessageReceive
    };
}
