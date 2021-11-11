import React, { memo, useEffect, useState, useCallback } from 'react';
import styles from './styles/Homepage.module.scss';
import { useHistory } from 'react-router-dom';

export const Homepage = memo(function Homepage() {
    const history = useHistory();

    const navigateToCompetitiveSettings = useCallback(
        () => history.push('/competitive-settings'),
        []
    );
    const navigateToCollaborativeSettings = useCallback(
        () => history.push('/collaborative-settings'),
        []
    );
    return (
        <div className={styles.App}>
            {/* settings component there is just temporary */}
            <p>This is the homepage</p>
            <button onClick={navigateToCollaborativeSettings}>
                Collaborative Game
            </button>
            <button onClick={navigateToCompetitiveSettings}>
                Competitive Game
            </button>
        </div>
    );
});

export default Homepage;
