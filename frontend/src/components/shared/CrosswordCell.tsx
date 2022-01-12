import { memo, useMemo, useCallback } from 'react';
import styles from './Crossword.module.scss';
import { CellHintAnnotation, NavigationSettings, Direction } from './types';

interface CrosswordCellProps {
    row: number;
    col: number;
    annotationData: CellHintAnnotation;
    navSettings: NavigationSettings;
    setNavSettings: (coords: NavigationSettings) => void;
    value: string | undefined;
}

export const CrosswordCell = memo(function Crossword(
    props: CrosswordCellProps
) {
    var classNames = require('classnames');
    let { row, col, annotationData, navSettings, setNavSettings, value } =
        props;

    const isHighlightedCell = useMemo(
        () =>
            row == navSettings.coordinates.row &&
            col == navSettings.coordinates.col,
        [row, col, navSettings.coordinates]
    );

    const className = useMemo(() => {
        if (!annotationData.isValid) {
            return styles.nonInputCell;
        } else if (isHighlightedCell) {
            return styles.highlightedCell;
        } else if (
            (row == navSettings.coordinates.row &&
                navSettings.direction == Direction.ACROSS) ||
            (col == navSettings.coordinates.col &&
                navSettings.direction == Direction.DOWN)
        ) {
            return styles.highlightedClue;
        } else {
            return styles.inputCell;
        }
    }, [annotationData, navSettings, styles, row, col, isHighlightedCell]);

    const onClick = useCallback(
        () =>
            setNavSettings({
                coordinates: {
                    row: row,
                    col: col
                },
                // flips the direction if you click on the higlighted cell
                direction: isHighlightedCell
                    ? navSettings.direction == Direction.ACROSS
                        ? Direction.DOWN
                        : Direction.ACROSS
                    : navSettings.direction
            }),
        [setNavSettings, row, col, isHighlightedCell, navSettings]
    );

    const annotation = useMemo(() => {
        if (
            annotationData.across != undefined &&
            annotationData.across.isStart
        ) {
            return annotationData.across.hintNumber;
        } else if (
            annotationData.down != undefined &&
            annotationData.down.isStart
        ) {
            return annotationData.down.hintNumber;
        }
        return undefined;
    }, [annotationData]);

    const processedValue = useMemo(() => {
        if (value == 'BLOCK' || value == 'EMPTY') {
            return undefined;
        }
        return value;
    }, [value]);

    return (
        <div
            className={classNames(className, styles.inputCell)}
            onClick={onClick}
        >
            <p className={styles.hintAnnotation}>{annotation}</p>
            <p className={styles.cellValue}>{processedValue}</p>
        </div>
    );
});
