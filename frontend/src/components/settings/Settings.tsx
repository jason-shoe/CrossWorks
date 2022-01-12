import React, { memo, useState, useEffect, useCallback } from 'react';
import { UserEntry } from '../shared/UserEntry';
import Calendar from '../shared/Calendar';
import { CollaborativeGame } from '../shared/types';
import { InputNumber, Message } from 'rsuite';
import { UserInfo } from '@rsuite/icons';
// @ts-ignore
import SockJsClient from 'react-stomp';
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
}

interface SettingsUrlParams {
    gameId?: string;
}

type HttpMessageType = HttpResponse<HttpPlayerId | CollaborativeGame>;

export const Settings = memo(function SettingsFn(props: SettingsProps) {
    const [clientConnected, setClientConnected] = useState(false);
    const [clientId, setClientId] = useState<String | undefined>();
    const [clientRef, setClientRef] = useState<any | undefined>(undefined);
    const [game, setGame] = useState<CollaborativeGame | undefined>(undefined);
    const [subscriptions, setSubscriptions] = useState<string[]>([
        '/users/queue/messages'
    ]);
    let { gameId } = useParams<SettingsUrlParams>();

    const { isCollaborative } = props;

    const addSubscription = useCallback(
        (endpoint: string) => {
            setSubscriptions([...subscriptions, endpoint]);
        },
        [subscriptions, gameId]
    );

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

    const onMessageReceive = (msg: HttpMessageType) => {
        console.log('this is the message', msg);
        const messageType = msg.headers.type[0];
        console.log(
            isHttpPlayerId(msg.body),
            messageType == MessageType.GET_PLAYER_ID
        );
        if (isHttpPlayerId(msg.body)) {
            if (messageType == MessageType.GET_PLAYER_ID) {
                setClientId(msg.body);
            }
        } else if (messageType == MessageType.CREATE_GAME) {
            addSubscription('queue/game/' + msg.body.gameId);
            setGame(msg.body);
        } else if (messageType == MessageType.UPDATE_GAME) {
            setGame(msg.body);
        }
    };

    useEffect(() => {
        if (clientId) {
            if (gameId != null) {
                addSubscription('queue/game/' + gameId);
                clientRef.sendMessage(
                    '/app/connect/' + gameId,
                    JSON.stringify({ playerId: clientId })
                );
            } else {
                clientRef.sendMessage(
                    '/app/create',
                    JSON.stringify({ playerId: clientId })
                );
            }
        }
    }, [clientId, gameId, clientRef]);

    return (
        <div>
            <SockJsClient
                url="http://localhost:8080/gs-guide-websocket"
                topics={subscriptions}
                onMessage={onMessageReceive}
                ref={setClientRef}
                onConnect={() => {
                    clientRef.sendMessage('/app/getPlayerId');
                    setClientConnected(true);
                }}
                onDisconnect={() => setClientConnected(false)}
                debug={false}
            />
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
                    <button className={styles.gameStartButton}>Start</button>
                </div>
            )}
        </div>
    );
});

export default Settings;
