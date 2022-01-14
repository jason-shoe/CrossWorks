import { memo, useMemo, useCallback } from 'react';
import styles from './Crossword.module.scss';
import { BoardVal } from '../shared/types/httpTypes';
import {
    CellHintAnnotation,
    Direction,
    NavigationSettings
} from '../shared/types/boardTypes';

interface CrosswordCellProps {
    row: number;
    col: number;
    annotationData: CellHintAnnotation;
    value: string | undefined;
    groundTruth: string | undefined;
    setNavSettings?: (coords: NavigationSettings) => void;
    navSettings?: NavigationSettings;
}

export const CrosswordCell = memo(function Crossword(
    props: CrosswordCellProps
) {
    var classNames = require('classnames');
    let {
        row,
        col,
        annotationData,
        navSettings,
        setNavSettings,
        value,
        groundTruth
    } = props;

    const isHighlightedCell = useMemo(
        () =>
            navSettings
                ? row === navSettings.coordinates.row &&
                  col === navSettings.coordinates.col
                : false,
        [navSettings, row, col]
    );

    const className = useMemo(() => {
        if (!annotationData.isValid) {
            return styles.nonInputCell;
        } else if (navSettings === undefined) {
            return styles.inputCell;
        } else if (isHighlightedCell) {
            return styles.highlightedCell;
        } else if (
            (row === navSettings.coordinates.row &&
                navSettings.direction === Direction.ACROSS) ||
            (col === navSettings.coordinates.col &&
                navSettings.direction === Direction.DOWN)
        ) {
            return styles.highlightedClue;
        } else {
            return styles.inputCell;
        }
    }, [annotationData, navSettings, row, col, isHighlightedCell]);

    const onClick = useCallback(
        () =>
            navSettings && setNavSettings
                ? setNavSettings({
                      coordinates: {
                          row: row,
                          col: col
                      },
                      // flips the direction if you click on the higlighted cell
                      direction: isHighlightedCell
                          ? navSettings.direction === Direction.ACROSS
                              ? Direction.DOWN
                              : Direction.ACROSS
                          : navSettings.direction
                  })
                : undefined,
        [setNavSettings, row, col, isHighlightedCell, navSettings]
    );

    const annotation = useMemo(() => {
        if (
            annotationData.across !== undefined &&
            annotationData.across.isStart
        ) {
            return annotationData.across.hintNumber;
        } else if (
            annotationData.down !== undefined &&
            annotationData.down.isStart
        ) {
            return annotationData.down.hintNumber;
        }
        return undefined;
    }, [annotationData]);

    const [processedValue, cellStyle] = useMemo(() => {
        if (
            value === BoardVal.BLOCK ||
            value === BoardVal.CORRECT ||
            value === BoardVal.INCORRECT
        ) {
            return [undefined, styles.cellValue];
        }
        if (groundTruth) {
            if (value === groundTruth) {
                return [value, styles.cellValue];
            }
            return [groundTruth, styles.cellValueIncorrect];
        }
        return [value, styles.cellValue];
    }, [groundTruth, value]);

    const backgroundColor = useMemo(() => {
        if (value === BoardVal.CORRECT) {
            return styles.greenBackground;
        }
        if (value === BoardVal.INCORRECT) {
            return styles.redBackground;
        }
        return styles.whiteBackground;
    }, [value]);

    return (
        <div
            className={classNames(backgroundColor, className, styles.inputCell)}
            onClick={onClick}
        >
            <p className={styles.hintAnnotation}>{annotation}</p>
            <div className={cellStyle}>{processedValue}</div>
        </div>
    );
});
