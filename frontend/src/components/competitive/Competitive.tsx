import { memo, useState, useEffect } from 'react';
import { BACKEND_URL } from '../shared/types/httpTypes';
import { CrosswordData } from '../shared/types/backendTypes';
import { request } from '../shared/util/request';
// import styles from './styles/Competitive.module.scss';

export const Competitive = memo(function Competitive() {
    const [crosswordData, setCrosswordData] = useState<
        CrosswordData | undefined
    >();

    useEffect(() => {
        request<CrosswordData>(BACKEND_URL + 'sample-crossword')
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
