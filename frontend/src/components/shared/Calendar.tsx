import React, { memo, useState, useEffect, useCallback } from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface CrosswordIdDate {
    crosswordId: string;
    crosswordDate: Date;
}

export const Calendar = memo(function CrosswordCalendarFn() {
    const [selectedDate, setSelectedDateChange] = useState<Date | undefined>();
    const [availableCrosswords, setAvailableCrosswords] = useState<
        CrosswordIdDate[]
    >([]);

    useEffect(() => {
        fetch('http://localhost:8080/collaborative-game/dates')
            .then((response) => response.json())
            .then((data) => {
                const sortedCrosswords = data
                    .map((element: any) => {
                        return {
                            crosswordId: element.crosswordId,
                            crosswordDate: new Date(element.date)
                        };
                    })
                    .sort((a: CrosswordIdDate, b: CrosswordIdDate) =>
                        a.crosswordDate > b.crosswordDate ? 1 : -1
                    );

                // updating states
                setAvailableCrosswords(sortedCrosswords);
                if (sortedCrosswords.length != 0) {
                    setSelectedDateChange(
                        sortedCrosswords[sortedCrosswords.length - 1]
                            .crosswordDate
                    );
                }
            })
            .catch((error) => console.error(error));
    }, []);

    const sameDay = useCallback(
        (d1: Date, d2: Date) =>
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate(),
        []
    );

    return (
        <div>
            <ReactCalendar
                onChange={setSelectedDateChange}
                value={selectedDate}
                calendarType={'US'}
                tileDisabled={({ activeStartDate, date, view }) => {
                    return !availableCrosswords.some(
                        (
                            value: CrosswordIdDate,
                            _index: number,
                            _obj: CrosswordIdDate[]
                        ) => sameDay(value.crosswordDate, date)
                    );
                }}
            />
        </div>
    );
});

export default Calendar;
