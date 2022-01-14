import { memo } from 'react';
import styles from './Header.module.scss';

interface WinScreenProps {
    closeWindow: () => void;
}

export const WinScreen = memo(function WinScreenFn({
    closeWindow
}: WinScreenProps) {
    return (
        <div className={styles.winScreen}>
            <div>You completed the crossword!</div>
            <button onClick={closeWindow}>Close window</button>
        </div>
    );
});
