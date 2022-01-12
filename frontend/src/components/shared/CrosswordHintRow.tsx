import { memo, useCallback, useMemo } from 'react';
import styles from './Crossword.module.scss';
import {
    Clue,
    NavigationSettings,
    Direction,
    CellHintAnnotation
} from './types/types';

interface CrosswordHintRowProps {
    clue: Clue;
    navSettings: NavigationSettings;
    setNavSettings: (coords: NavigationSettings) => void;
    annotationData: CellHintAnnotation;
    textClassName: string;
}
export const CrosswordHintRow = memo((props: CrosswordHintRowProps) => {
    let { clue, navSettings, setNavSettings, annotationData, textClassName } =
        props;
    var classNames = require('classnames');

    const onClick = useCallback(() => {
        setNavSettings({
            direction:
                clue.direction === Direction.ACROSS
                    ? Direction.ACROSS
                    : Direction.DOWN,
            coordinates: { row: clue.row, col: clue.col }
        });
    }, [clue.col, clue.direction, clue.row, setNavSettings]);

    const additionalStyling = useMemo(() => {
        if (
            (annotationData.across.hintNumber === clue.hintNumber &&
                clue.direction === Direction.ACROSS) ||
            (annotationData.down.hintNumber === clue.hintNumber &&
                clue.direction === Direction.DOWN)
        ) {
            if (clue.direction === navSettings.direction) {
                return styles.highlightPrimary;
            }
            return styles.highlightSecondary;
        }
    }, [
        annotationData.across.hintNumber,
        annotationData.down.hintNumber,
        clue.hintNumber,
        clue.direction,
        navSettings.direction
    ]);

    return (
        <div className={styles.crosswordHint} onClick={onClick}>
            <p
                className={classNames(
                    additionalStyling,
                    textClassName,
                    styles.hintNumber
                )}
            >
                {clue.hintNumber}
            </p>
            <p
                className={classNames(
                    additionalStyling,
                    textClassName,
                    styles.hintText
                )}
            >
                {clue.hint}
            </p>
        </div>
    );
});
