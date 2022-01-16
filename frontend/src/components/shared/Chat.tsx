import { ChangeEvent, memo, useCallback, useMemo, useState } from 'react';
import { ChatMessage, MessageType } from './types/httpTypes';
import styles from './Chat.module.scss';
import { PlayerSocketEndpoint, SendMessageFn } from './types/socketTypes';
import { PlayerInfo } from './types/backendTypes';
interface ChatProps {
    chatMessages: ChatMessage[];
    players: PlayerInfo[];
    sendMessage: SendMessageFn;
    isCollaborative: boolean;
}

export const Chat = memo(function ChatFn(props: ChatProps) {
    const { chatMessages, players, sendMessage, isCollaborative } = props;
    const [currMessage, setCurrMessage] = useState('');
    const [receiver, setReceiver] = useState('GAME');

    const playerNameMap = useMemo(() => {
        let map = new Map<string, string>();
        players.forEach((player) =>
            map.set(player.playerId, player.playerName)
        );
        return map;
    }, [players]);

    const handleDropdownSelect = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            setReceiver(event.target.value);
        },
        []
    );
    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setCurrMessage(event.target.value);
    }, []);

    const onKeyDown = useCallback(
        (event) => {
            if (event.key === 'Enter') {
                sendMessage(
                    PlayerSocketEndpoint.CHAT,
                    JSON.stringify({ receiver: receiver, message: currMessage })
                );
                setCurrMessage('');
            }
        },
        [currMessage, receiver, sendMessage]
    );
    return (
        <div className={styles.chatWrapper}>
            <table className={styles.chatHistory}>
                {chatMessages.map((message: ChatMessage) => (
                    <tr>
                        <td>
                            {message.type === MessageType.CHAT_MESSAGE &&
                                playerNameMap.get(message.sender)}
                        </td>
                        <td>{message.message}</td>
                    </tr>
                ))}
            </table>
            <div className={styles.chatInputWrapper}>
                {!isCollaborative && (
                    <select value={receiver} onChange={handleDropdownSelect}>
                        <option value="GAME">Game</option>
                        <option value="TEAM">Team</option>
                    </select>
                )}
                <input onChange={handleChange} onKeyDown={onKeyDown} />
            </div>
        </div>
    );
});
