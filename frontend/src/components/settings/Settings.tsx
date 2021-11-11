import React, { memo, useState, useEffect } from 'react';
import { UserEntry } from '../shared/UserEntry';
import Calendar from '../shared/Calendar';
import { CollaborativeGame } from '../shared/types/CollaborativeGame';
import { InputNumber } from 'rsuite';
import { UserInfo } from '@rsuite/icons';
// @ts-ignore
import SockJsClient from 'react-stomp';
import styles from './Settings.module.scss';
import { request } from '../shared/util/request';
import { useParams } from 'react-router-dom';

interface SettingsProps {
    isCollaborative: boolean;
}

interface SettingsUrlParams {
    gameId?: string;
}

export const Settings = memo(function SettingsFn(props: SettingsProps) {
    const [clientConnected, setClientConnected] = useState(false);
    const [clientId, setClientId] = useState<String | undefined>();
    const [messages, setMessages] = useState<String[]>([]);
    const [clientRef, setClientRef] = useState<any | undefined>(undefined);
    const [game, setGame] = useState<CollaborativeGame | undefined>(undefined);

    const { isCollaborative } = props;
    let { gameId } = useParams<SettingsUrlParams>();
    console.log('gameid', gameId, gameId != null);

    const addPlayer = (playerId: string) => {
        setGame((prevGame: CollaborativeGame | undefined) => {
            return prevGame
                ? {
                      ...prevGame,
                      playerIds: [...prevGame.playerIds, playerId]
                  }
                : undefined;
        });
    };
    const onMessageReceive = (msg: string) => {
        console.log('just recieved this message');
        if (clientId) {
            addPlayer(msg);
        } else {
            setClientId(msg);
        }
    };
    const sendHello = () => {
        console.log('send hello');
        try {
            clientRef.sendMessage('/app/hello');
            return true;
        } catch (e) {
            return false;
        }
    };

    useEffect(() => {
        console.log('inside use effect, this is the sessionId', clientId);

        if (clientId) {
            if (gameId != null) {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        player: { playerId: clientId },
                        gameId: gameId
                    })
                };
                request<CollaborativeGame>(
                    'http://localhost:8080/collaborative-game/connect',
                    requestOptions
                ).then((data: CollaborativeGame) => {
                    console.log('THIS IS THE GAME', data);
                    setGame(data);
                });
            } else {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ playerId: clientId })
                };
                request<CollaborativeGame>(
                    'http://localhost:8080/collaborative-game/start',
                    requestOptions
                ).then((data) => {
                    console.log('THIS IS TEHE GAME', data);
                    setGame(data);
                });
            }
        }
    }, [clientId]);

    console.log('this is game before rendering', game);
    return (
        <div>
            <SockJsClient
                url="http://localhost:8080/gs-guide-websocket"
                topics={['/topic/hello', '/user/topic/hello']}
                onMessage={(msg: string) => {
                    console.log('this is the message', msg);
                    onMessageReceive(msg);
                }}
                ref={(client: any) => {
                    setClientRef(client);
                }}
                onConnect={() => {
                    console.log('successuflly connected to websocket');
                    sendHello();
                    setClientConnected(true);
                }}
                onDisconnect={() => setClientConnected(false)}
                debug={false}
            />
            {gameId && <p>from the url{gameId}</p>}
            {game && <p>from the backend {game.gameId}</p>}
            <div className={styles.settingsWrapper}>
                <div>
                    <h2>Select Crossword</h2>
                    <Calendar />
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
                            <UserEntry name={elem} icon={<UserInfo />} />
                        ))}
                </div>
            </div>
        </div>
    );
});

export default Settings;
