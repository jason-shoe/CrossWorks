import React, { memo, useState } from 'react';
import { UserEntry } from '../shared/UserEntry';
import Calendar from '../shared/Calendar';
import { InputNumber } from 'rsuite';
import { UserInfo } from '@rsuite/icons';
import SockJsClient from 'react-stomp';
import styles from './Settings.module.scss';

interface SettingsProps {
    isCollaborative: boolean;
}

export const Settings = memo(function SettingsFn(props: SettingsProps) {
    const [clientConnected, setClientConnected] = useState(false);
    const [messages, setMessages] = useState<String[]>([]);
    const [clientRef, setClientRef] = useState<any | undefined>(undefined);

    const { isCollaborative } = props;

    const onMessageRecieve = (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
    };
    const sendMessage = () => {
        console.log('send hello');
        try {
            clientRef.sendMessage('/app/hello');
            return true;
        } catch (e) {
            return false;
        }
    };

    return (
        <div>
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
                    <h2>Party</h2>
                    <UserEntry name={'Jason Xu'} icon={<UserInfo />} />
                    <UserEntry name={'Jason Xu'} icon={<UserInfo />} />
                    <UserEntry name={'Jason Xu'} icon={<UserInfo />} />
                </div>
            </div>
            <SockJsClient
                url="http://localhost:8080/gs-guide-websocket"
                topics={['/topic/hello']}
                onMessage={(msg) => {
                    console.log('this is the message', msg);
                    onMessageRecieve(msg);
                }}
                ref={(client) => {
                    setClientRef(client);
                }}
                onConnect={() => {
                    console.log('successuflly connected to websocket');
                    setClientConnected(true);
                }}
                onDisconnect={() => setClientConnected(false)}
                debug={false}
            />
            <button onClick={() => sendMessage()}>send a message</button>
            {messages.map((elem) => (
                <div>{elem}</div>
            ))}
        </div>
    );
});

export default Settings;
