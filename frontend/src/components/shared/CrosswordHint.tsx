import { memo, useCallback, useMemo } from 'react';
import { Row } from 'rsuite';
import styles from './Crossword.module.scss';
import {
    Clue,
    NavigationSettings,
    Direction,
    CellHintAnnotation
} from './types';

interface CrosswordHintProps {
    clue: Clue;
    navSettings: NavigationSettings;
    setNavSettings: (coords: NavigationSettings) => void;
    annotationData: CellHintAnnotation;
    textClassName: string;
}
export const CrosswordHint = memo((props: CrosswordHintProps) => {
    let { clue, navSettings, setNavSettings, annotationData, textClassName } =
        props;
    var classNames = require('classnames');

    const onClick = useCallback(() => {
        setNavSettings({
            direction:
                clue.direction == Direction.ACROSS
                    ? Direction.ACROSS
                    : Direction.DOWN,
            coordinates: { row: clue.row, col: clue.col }
        });
    }, [navSettings, setNavSettings]);

    const additionalStyling = useMemo(() => {
        if (
            (annotationData.across.hintNumber == clue.hintNumber &&
                clue.direction == Direction.ACROSS) ||
            (annotationData.down.hintNumber == clue.hintNumber &&
                clue.direction == Direction.DOWN)
        ) {
            if (clue.direction == navSettings.direction) {
                return styles.highlightPrimary;
            }
            return styles.highlightSecondary;
        }
    }, [annotationData, clue.direction, styles, navSettings]);

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
