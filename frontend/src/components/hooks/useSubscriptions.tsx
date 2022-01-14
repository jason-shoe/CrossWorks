import { useCallback, useState } from 'react';
import { SocketSubscription } from '../shared/types/socketTypes';

export function useSubscriptions() {
    const [subscriptions, setSubscriptions] = useState<string[]>([
        SocketSubscription.USER_MESSAGES
    ]);
    const addSubscription = useCallback(
        (endpoint: string) => {
            setSubscriptions([...subscriptions, endpoint]);
        },
        [subscriptions]
    );
    const removeSubscription = useCallback(
        (endpoint: string) => {
            setSubscriptions(subscriptions.filter((val) => val !== endpoint));
        },
        [subscriptions]
    );

    return { subscriptions, addSubscription, removeSubscription };
}
