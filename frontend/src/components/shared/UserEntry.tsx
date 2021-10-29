import React, { memo } from 'react';
import styles from './UserEntry.module.scss';

interface UserEntryProps {
    name: string;
    icon: JSX.Element;
}

export const UserEntry = memo(function UserEntryFn(props: UserEntryProps) {
    const { name, icon } = props;

    return (
        <div className={styles.wrapper}>
            <div className={styles.icon}>{icon}</div>
            <p className={styles.username}>{name}</p>
        </div>
    );
});
