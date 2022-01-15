import React, { memo } from 'react';
import { PlayerInfo } from './types/backendTypes';
import styles from './UserEntry.module.scss';

interface UserEntryProps {
    info: PlayerInfo;
    icon: JSX.Element;
}

export const UserEntry = memo(function UserEntryFn(props: UserEntryProps) {
    const { info, icon } = props;

    return (
        <div className={styles.wrapper}>
            <div className={styles.icon}>{icon}</div>
            <p className={styles.username}>{info.playerName}</p>
        </div>
    );
});
