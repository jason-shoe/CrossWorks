import { memo, useEffect, useCallback } from 'react';
import { UserEntry } from '../shared/UserEntry';
import Calendar from '../shared/Calendar';
import {
    CollaborativeGame,
    CompetitiveGame,
    isCollaborative
} from '../shared/types/backendTypes';
import { InputNumber } from 'rsuite';
import { UserInfo } from '@rsuite/icons';
import styles from './Settings.module.scss';
import {
    SendMessageFn,
    CollaborativeSocketEndpoint,
    CompetitiveSocketEndpoint,
    createTeamSubscription,
    isActiveTeamSubscription,
    isTeamSubscription
} from '../shared/types/socketTypes';
import { CollaborativeParty } from './CollaborativeParty';
import { CompetitiveParty } from './CompetitiveParty';

interface SettingsProps {
    createCollaborative: boolean;
    sendMessage: SendMessageFn;
    addSubscription: (subscription: string) => void;
    removeSubscription: (subscription: string) => void;
    clientTeamNumber: number | undefined;
    subscriptions: string[];
    clientId: string;
    game?: CollaborativeGame | CompetitiveGame;
}

export const Settings = memo(function SettingsFn(props: SettingsProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
        createCollaborative,
        game,
        sendMessage,
        clientId,
        addSubscription,
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
        if (game !== undefined && clientTeamNumber !== undefined) {
            sendMessage(
                createCollaborative
                    ? CollaborativeSocketEndpoint.START_GAME
                    : CompetitiveSocketEndpoint.START_GAME,
                undefined,
                game.gameId
            );
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
                            <CollaborativeParty
                                game={game}
                                clientId={clientId}
                            />
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
