import React, { memo, useState, useEffect, useCallback } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { BACKEND_URL } from './types/httpTypes';

interface CrosswordIdDate {
    crosswordId: string;
    crosswordDate: Date;
}

interface CrosswordCalendarProps {
    crosswordId: string;
    setCrosswordId: (crosswordId: string) => void;
}

export const Calendar = memo(function CrosswordCalendarFn(
    props: CrosswordCalendarProps
) {
    const { crosswordId, setCrosswordId } = props;

    const [selectedDate, setSelectedDateChange] = useState<Date | undefined>();
    const [crosswordIdToDateMap, setCrosswordIdToDateMap] = useState<
        Map<string, Date>
    >(new Map());

    const [availableCrosswords, setAvailableCrosswords] = useState<
        CrosswordIdDate[]
    >([]);

    useEffect(() => {
        fetch(BACKEND_URL + 'game/dates')
            .then((response) => response.json())
            .then((data) => {
                const sortedCrosswords: CrosswordIdDate[] = data
                    .map((element: any) => {
                        return {
                            crosswordId: element.crosswordId,
                            crosswordDate: new Date(element.date)
                        };
                    })
                    .sort((a: CrosswordIdDate, b: CrosswordIdDate) =>
                        a.crosswordDate > b.crosswordDate ? 1 : -1
                    );
                const forwardMap = new Map();
                sortedCrosswords.forEach(({ crosswordId, crosswordDate }) => {
                    forwardMap.set(crosswordId, crosswordDate);
                });
                setCrosswordIdToDateMap(forwardMap);
                setAvailableCrosswords(sortedCrosswords);

                if (sortedCrosswords.length !== 0) {
                    if (crosswordId === '') {
                        setSelectedDateChange(
                            sortedCrosswords[sortedCrosswords.length - 1]
                                .crosswordDate
                        );
                        setCrosswordId(
                            sortedCrosswords[sortedCrosswords.length - 1]
                                .crosswordId
                        );
                    } else {
                        setSelectedDateChange(forwardMap.get(crosswordId));
                    }
                }
            })
            .catch((error) => console.error(error));
    }, [crosswordId, setCrosswordId]);

    useEffect(() => {
        if (availableCrosswords.length !== 0) {
            if (crosswordId === '') {
                setSelectedDateChange(
                    availableCrosswords[availableCrosswords.length - 1]
                        .crosswordDate
                );
                setCrosswordId(
                    availableCrosswords[availableCrosswords.length - 1]
                        .crosswordId
                );
            } else {
                setSelectedDateChange(crosswordIdToDateMap.get(crosswordId));
            }
        }
    }, [
        crosswordId,
        availableCrosswords,
        crosswordIdToDateMap,
        setCrosswordId
    ]);

    const sameDay = useCallback(
        (d1: Date, d2: Date) =>
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate(),
        []
    );

    const tileDisabled = useCallback(
        ({ activeStartDate, date, view }) => {
            if (view === 'month') {
                return !availableCrosswords.some(
                    (
                        value: CrosswordIdDate,
                        _index: number,
                        _obj: CrosswordIdDate[]
                    ) => sameDay(value.crosswordDate, date)
                );
            }
            return false;
        },
        [sameDay, availableCrosswords]
    );

    const calendarChange = useCallback(
        (newDate: Date) => {
            setSelectedDateChange(newDate);
            const eligibleDates = availableCrosswords.filter(
                (
                    value: CrosswordIdDate,
                    _index: number,
                    _obj: CrosswordIdDate[]
                ) => sameDay(value.crosswordDate, newDate)
            );
            if (eligibleDates.length !== 0) {
                setCrosswordId(eligibleDates[0].crosswordId);
            }
        },
        [availableCrosswords, sameDay, setCrosswordId]
    );

    return (
        <div>
            <ReactCalendar
                onChange={calendarChange}
                value={selectedDate}
                calendarType={'US'}
                tileDisabled={tileDisabled}
            />
        </div>
    );
});

export default Calendar;
