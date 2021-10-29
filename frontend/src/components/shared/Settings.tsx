import React, { memo } from 'react';
import { UserEntry } from './UserEntry';
import Calendar from './Calendar';
import { InputNumber } from 'rsuite';
import { UserInfo } from '@rsuite/icons';
import styles from './Settings.module.scss';

interface SettingsProps {
    isCollaborative: boolean;
}

export const Settings = memo(function SettingsFn(props: SettingsProps) {
    const { isCollaborative } = props;
    return (
        <div className={styles.settingsWrapper}>
            <div>
                <h2>Select Crossword</h2>
                <Calendar />
            </div>
            <div className={styles.mainSettings}>
                <h2>Settings</h2>
                <div>
                    <div className={styles.settingsField}>
                        <p className={styles.settingsFieldLabel}>Time Limit</p>
                        <InputNumber className={styles.settingsFieldInput} />
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
    );
});

export default Settings;
