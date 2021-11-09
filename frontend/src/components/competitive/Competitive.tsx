import React, { memo, useState, useEffect } from 'react';
import { CrosswordData, CrosswordHint } from '../shared/types/CrosswordTypes';
import { request } from '../shared/util/request';
import styles from './styles/Competitive.module.scss';

export const Competitive = memo(function Competitive() {
    const [crosswordData, setCrosswordData] = useState<
        CrosswordData | undefined
    >();

    useEffect(() => {
        request<CrosswordData>(
            'http://localhost:8080/collaborative-game/sample-crossword'
        )
            .then((data) => {
                setCrosswordData(data);
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            {crosswordData && (
                <div>
                    <p>{crosswordData.crosswordId}</p>
                    <p>{crosswordData.name}</p>
                    <p>{crosswordData.date}</p>
                    <p>{crosswordData.source}</p>
                    <p>{crosswordData.size}</p>
                </div>
            )}
            <p>This is the competitive page</p>
        </div>
    );
});

export default Competitive;
