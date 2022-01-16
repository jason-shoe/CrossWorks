import { useCallback, useState } from 'react';
import { ChatMessage } from '../shared/types/httpTypes';

export function useChatMessages() {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

    const addChatMessage = useCallback(
        (chatMessage: ChatMessage) => {
            setChatMessages([...chatMessages, chatMessage]);
        },
        [chatMessages]
    );

    const clearChatMessages = useCallback(() => {
        setChatMessages([]);
    }, []);

    return { chatMessages, addChatMessage, clearChatMessages };
}
