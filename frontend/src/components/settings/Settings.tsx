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
    CollaborativeSocketEndpoint,
    CompetitiveSocketEndpoint,
    isActiveTeamSubscription,
    isTeamSubscription
} from '../shared/types/socketTypes';
import { CollaborativeParty } from './CollaborativeParty';
import { CompetitiveParty } from './CompetitiveParty';

interface SettingsProps {
    createCollaborative: boolean;
    sendMessage: SendMessageFn;
    removeSubscription: (subscription: string) => void;
    clientTeamNumber: number | undefined;
    subscriptions: string[];
    clientId: string;
    game?: CollaborativeGame | CompetitiveGame;
}

export const Settings = memo(function SettingsFn(props: SettingsProps) {
    const {
        createCollaborative,
        game,
        sendMessage,
        clientId,
        removeSubscription,
        subscriptions,
        clientTeamNumber
    } = props;

    const setCrosswordId = useCallback(
        (crosswordId: string) => {
            if (game !== undefined) {
                sendMessage(
                    createCollaborative
                        ? CollaborativeSocketEndpoint.SET_CROSSWORD
                        : CompetitiveSocketEndpoint.SET_CROSSWORD,
                    crosswordId,
                    game.gameId
                );
            }
        },
        [createCollaborative, game, sendMessage]
    );

    const startGame = useCallback(() => {
        if (game !== undefined) {
            if (clientTeamNumber !== undefined && !createCollaborative) {
                sendMessage(
                    CompetitiveSocketEndpoint.START_GAME,
                    undefined,
                    game.gameId
                );
            } else if (createCollaborative) {
                sendMessage(
                    CollaborativeSocketEndpoint.START_GAME,
                    undefined,
                    game.gameId
                );
            }
        }
    }, [clientTeamNumber, createCollaborative, game, sendMessage]);

    useEffect(() => {
        if (clientId && game === undefined) {
            sendMessage(
                createCollaborative
                    ? CollaborativeSocketEndpoint.CREATE_GAME
                    : CompetitiveSocketEndpoint.CREATE_GAME,
                JSON.stringify({ playerId: clientId })
            );
        }
    }, [clientId, createCollaborative, game, sendMessage]);

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
