import { memo, useEffect, useCallback } from 'react';
import Calendar from '../shared/Calendar';
import {
    CollaborativeGame,
    CompetitiveGame,
    isCollaborative
} from '../shared/types/backendTypes';
import { InputNumber } from 'rsuite';
import styles from './Settings.module.scss';
import {
    SendMessageFn,
    isActiveTeamSubscription,
    isTeamSubscription,
    GameSocketEndpoint,
    PlayerSocketEndpoint
} from '../shared/types/socketTypes';
import { CollaborativeParty } from './CollaborativeParty';
import { CompetitiveParty } from './CompetitiveParty';

interface SettingsProps {
    createCollaborative: boolean;
    sendMessage: SendMessageFn;
    removeSubscription: (subscription: string) => void;
    subscriptions: string[];
    clientId: string;
    clientName: string;
    clientTeamNumber: number | undefined;
    game?: CollaborativeGame | CompetitiveGame;
}

export const Settings = memo(function SettingsFn(props: SettingsProps) {
    const {
        createCollaborative,
        game,
        sendMessage,
        clientId,
        clientName,
        clientTeamNumber,
        removeSubscription,
        subscriptions
    } = props;

    const setCrosswordId = useCallback(
        (crosswordId: string) => {
            if (game !== undefined) {
                sendMessage(
                    GameSocketEndpoint.SET_CROSSWORD,
                    crosswordId,
                    game.gameId
                );
            }
        },
        [game, sendMessage]
    );

    const startGame = useCallback(() => {
        if (game !== undefined) {
            sendMessage(GameSocketEndpoint.START_GAME, undefined, game.gameId);
        }
    }, [game, sendMessage]);

    useEffect(() => {
        if (clientId && game === undefined) {
            sendMessage(PlayerSocketEndpoint.SET_PLAYER_NAME, clientName);
            sendMessage(
                PlayerSocketEndpoint.CREATE_GAME,
                JSON.stringify({
                    playerName: clientName,
                    isCollaborative: createCollaborative
                })
            );
        }
    }, [clientId, clientName, createCollaborative, game, sendMessage]);

    useEffect(() => {
        subscriptions.forEach((subscription) => {
            if (
                game &&
                isTeamSubscription(subscription) &&
                !isActiveTeamSubscription(game.gameId, subscription)
            ) {
                removeSubscription(subscription);
            }
        });
    }, [game, removeSubscription, subscriptions]);

    return (
        <div>
            {game && (
                <div className={styles.settingsWrapper}>
                    <div className={styles.gameId}>{game?.gameId}</div>
                    <div className={styles.settingsMiddle}>
                        <div>
                            <h2>Select Crossword</h2>
                            <Calendar
                                crosswordId={game.crosswordId}
                                setCrosswordId={setCrosswordId}
                            />
                        </div>
                        <div className={styles.mainSettings}>
                            <h2>Settings</h2>
                            <div>
                                <div className={styles.settingsField}>
                                    <p className={styles.settingsFieldLabel}>
                                        Time Limit
                                    </p>
                                    <InputNumber
                                        className={styles.settingsFieldInput}
                                    />
                                </div>
                            </div>
                        </div>

                        {game && isCollaborative(game) ? (
                            <CollaborativeParty game={game} />
                        ) : (
                            <CompetitiveParty
                                game={game}
                                clientId={clientId}
                                clientTeamNumber={clientTeamNumber}
                                sendMessage={sendMessage}
                            />
                        )}
                    </div>
                    <button
                        className={styles.gameStartButton}
                        onClick={startGame}
                    >
                        Start
                    </button>
                </div>
            )}
        </div>
    );
});

export default Settings;
