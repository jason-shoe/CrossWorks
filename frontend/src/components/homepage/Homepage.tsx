import React, { memo } from 'react';
import styles from './styles/Homepage.module.scss';
import Settings from '../shared/Settings';

export const Homepage = memo(function Homepage() {
    return (
        <div className={styles.App}>
            {/* settings component there is just temporary */}
            <Settings isCollaborative={true} />
            <p>This is the homepage</p>
        </div>
    );
});

export default Homepage;
