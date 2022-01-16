// @ts-ignore
import SockJsClient from 'react-stomp';
import { memo, useMemo, useCallback } from 'react';
import Collaborative from './collaborative/Collaborative';
import Competitive from './competitive/Competitive';
import GameModeSelection from './homepage/GameModeSelection';
import Homepage from './homepage/Homepage';
import Settings from './settings/Settings';
import { PageState } from './shared/types/pageState';
import { isCollaborative } from './shared/types/backendTypes';
import { BACKEND_URL } from './shared/types/httpTypes';
import { JoinGameInput } from './homepage/JoinGameInput';
import {
    PlayerSocketEndpoint,
    SocketSubscription
} from './shared/types/socketTypes';
import { useSubscriptions } from './hooks/useSubscriptions';
import { useWebsocket } from './hooks/useWebsocket';
import { useGamePageSync } from './hooks/useGamePageSync';
import { useChatMessages } from './hooks/useChatMessages';

const MainRouter = memo(function MainRouterFn() {
    const { subscriptions, addSubscription, removeSubscription } =
        useSubscriptions();

    const { chatMessages, addChatMessage, clearChatMessages } =
        useChatMessages();

    const {
        game,
        setGame,
        pageState,
        setPageState,
        competitiveTeamsAnswers,
        setCompetitiveTeamsAnswers
    } = useGamePageSync();

    const {
        clientId,
        clientNameProps,
        clientTeamNumber,
        setClientRef,
        sendMessage,
        onMessageReceive
    } = useWebsocket({
        game,
        setGame,
        setCompetitiveTeamsAnswers,
        pageState,
        setPageState,
        addSubscription,
        addChatMessage
    });

    const leaveGame = useCallback(() => {
        if (game) {
            removeSubscription(SocketSubscription.GAME_PREFIX + game.gameId);
            sendMessage(
                PlayerSocketEndpoint.LEAVE_GAME,
                undefined,
                game.gameId
            );
            setPageState(PageState.MAIN);
            setGame(undefined);
        }
    }, [game, removeSubscription, sendMessage, setGame, setPageState]);

    const component = useMemo(() => {
        switch (pageState) {
            case PageState.MAIN:
                return (
                    <Homepage
                        setPageState={setPageState}
                        clientNameProps={clientNameProps}
                    />
                );
            case PageState.CREATE_GAME:
                return (
                    <GameModeSelection
                        setPageState={setPageState}
                        clientNameProps={clientNameProps}
                    />
                );
            case PageState.JOIN_GAME:
            case PageState.BAD_JOIN_GAME:
                return clientId ? (
                    <JoinGameInput
                        setPageState={setPageState}
                        clientNameProps={clientNameProps}
                        addSubscription={addSubscription}
                        sendMessage={sendMessage}
                        hasFailed={pageState === PageState.BAD_JOIN_GAME}
                    />
                ) : undefined;
            case PageState.COMPETITIVE_SETTINGS:
            case PageState.COLLABORATIVE_SETTINGS:
                return clientId ? (
                    <Settings
                        createCollaborative={
                            PageState.COLLABORATIVE_SETTINGS === pageState
                        }
                        sendMessage={sendMessage}
                        removeSubscription={removeSubscription}
                        subscriptions={subscriptions}
                        clientId={clientId}
                        clientTeamNumber={clientTeamNumber}
                        clientName={clientNameProps.clientName}
                        chatMessages={chatMessages}
                        game={game}
                    />
                ) : undefined;
            case PageState.COMPETITIVE:
                return competitiveTeamsAnswers &&
                    clientTeamNumber !== undefined &&
                    clientId &&
                    game &&
                    !isCollaborative(game) ? (
                    <Competitive
                        game={game}
                        clientId={clientId}
                        chatMessages={chatMessages}
                        sendMessage={sendMessage}
                        leaveGame={leaveGame}
                        teamsAnswers={competitiveTeamsAnswers}
                        clientTeamNumber={clientTeamNumber}
                    />
                ) : undefined;
            case PageState.COLLABORATIVE:
                return clientId && game && isCollaborative(game) ? (
                    <Collaborative
                        game={game}
                        clientId={clientId}
                        chatMessages={chatMessages}
                        sendMessage={sendMessage}
                        leaveGame={leaveGame}
                    />
                ) : undefined;
            default:
                return undefined;
        }
    }, [
        pageState,
        setPageState,
        clientNameProps,
        clientId,
        addSubscription,
        sendMessage,
        removeSubscription,
        subscriptions,
        clientTeamNumber,
        chatMessages,
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
                    sendMessage(PlayerSocketEndpoint.GET_PLAYER_ID);
                }}
                debug={false}
            />
            {component}
        </div>
    );
});

export default MainRouter;
