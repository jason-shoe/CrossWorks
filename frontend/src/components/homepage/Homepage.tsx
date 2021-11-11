import React, { memo, useEffect, useState } from 'react';
import styles from './styles/Homepage.module.scss';
import Settings from '../shared/Settings';
import SockJsClient from 'react-stomp';

export const Homepage = memo(function Homepage() {
    const [clientConnected, setClientConnected] = useState(false);
    const [messages, setMessages] = useState<String[]>([]);
    const [clientRef, setClientRef] = useState<any | undefined>(undefined);

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
        <div className={styles.App}>
            {/* settings component there is just temporary */}
            <Settings isCollaborative={true} />
            <p>This is the homepage</p>
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

export default Homepage;
