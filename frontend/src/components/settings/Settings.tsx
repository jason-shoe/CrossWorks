import React, { memo, useState, useEffect, useCallback } from 'react';
import { UserEntry } from '../shared/UserEntry';
import Calendar from '../shared/Calendar';
import { CollaborativeGame } from '../shared/types';
import { InputNumber, Message } from 'rsuite';
import { UserInfo } from '@rsuite/icons';
import styles from './Settings.module.scss';
import { request } from '../shared/util/request';
import { useParams } from 'react-router-dom';
import {
    HttpResponse,
    HttpPlayerId,
    isHttpPlayerId,
    MessageType
} from '../shared/httpTypes';

interface SettingsProps {
    isCollaborative: boolean;
    clientRef: any;
    clientId: string;
    game?: CollaborativeGame;
    subscriptions: string[];
    addSubscription: (subscription: string) => void;
}

export const Settings = memo(function SettingsFn(props: SettingsProps) {
    const {
        isCollaborative,
        game,
        addSubscription,
        subscriptions,
        clientRef,
        clientId
    } = props;

    const setCrosswordId = useCallback(
        (crosswordId: string) => {
            if (game != undefined) {
                clientRef.sendMessage(
                    '/app/update/game-crossword/' + game.gameId,
                    crosswordId
                );
            }
        },
        [game, clientRef]
    );

    const startGame = useCallback(() => {
        if (game != undefined) {
            clientRef.sendMessage('/app/update/start-game/' + game.gameId);
        }
    }, [clientRef, game]);

    useEffect(() => {
        if (clientId) {
            if (game == undefined) {
                clientRef.sendMessage(
                    '/app/create',
                    JSON.stringify({ playerId: clientId })
                );
            }
        }
    }, [clientId, clientRef]);

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
                                game.playerIds.map((elem: string) => (
                                    <UserEntry
                                        name={elem}
                                        icon={<UserInfo />}
                                    />
                                ))}
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
