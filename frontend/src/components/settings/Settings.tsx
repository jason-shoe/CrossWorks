import { memo, useEffect, useCallback } from 'react';
import { UserEntry } from '../shared/UserEntry';
import Calendar from '../shared/Calendar';
import { CollaborativeGame } from '../shared/types/types';
import { InputNumber } from 'rsuite';
import { UserInfo } from '@rsuite/icons';
import styles from './Settings.module.scss';
import { SendMessageFn, SocketEndpoint } from '../shared/types/socketTypes';

interface SettingsProps {
    isCollaborative: boolean;
    sendMessage: SendMessageFn;
    clientId: string;
    game?: CollaborativeGame;
}

export const Settings = memo(function SettingsFn(props: SettingsProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isCollaborative, game, sendMessage, clientId } = props;

    const setCrosswordId = useCallback(
        (crosswordId: string) => {
            if (game !== undefined) {
                sendMessage(
                    SocketEndpoint.SET_CROSSWORD,
                    crosswordId,
                    game.gameId
                );
            }
        },
        [game, sendMessage]
    );

    const startGame = useCallback(() => {
        if (game !== undefined) {
            sendMessage(SocketEndpoint.START_GAME, undefined, game.gameId);
        }
    }, [game, sendMessage]);

    useEffect(() => {
        if (clientId && game === undefined) {
            sendMessage(
                SocketEndpoint.CREATE_GAME,
                JSON.stringify({ playerId: clientId })
            );
        }
    }, [clientId, game, sendMessage]);

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
                        <div>
                            <h2>Party {game ? game.playerIds.length : 0}</h2>

                            {game &&
                                game.playerIds.map(
                                    (elem: string, index: number) => (
                                        <UserEntry
                                            name={elem}
                                            icon={<UserInfo />}
                                            key={index}
                                        />
                                    )
                                )}
                        </div>
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
