import { memo } from 'react';
import styles from './Header.module.scss';

interface WinScreenProps {
    closeWindow: () => void;
    text?: string;
}

export const WinScreen = memo(function WinScreenFn({
    text,
    closeWindow
}: WinScreenProps) {
    return (
        <div className={styles.winScreen}>
            <div>{text ?? 'You completed the crossword!'}</div>
            <button onClick={closeWindow}>Close window</button>
        </div>
    );
});
