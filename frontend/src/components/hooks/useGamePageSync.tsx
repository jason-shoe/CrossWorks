import { useEffect, useState } from 'react';
import {
    CollaborativeGame,
    CompetitiveGame,
    GameStatus,
    Grid,
    isCollaborative
} from '../shared/types/backendTypes';
import { PageState } from '../shared/types/pageState';

export function useGamePageSync() {
    const [pageState, setPageState] = useState<PageState>(PageState.MAIN);
    const [game, setGame] = useState<
        CollaborativeGame | CompetitiveGame | undefined
    >(undefined);
    const [competitiveTeamsAnswers, setCompetitiveTeamsAnswers] = useState<
        Grid[] | undefined
    >();

    useEffect(() => {
        if (game !== undefined) {
            if (game.status === GameStatus.SETTINGS) {
                isCollaborative(game)
                    ? setPageState(PageState.COLLABORATIVE_SETTINGS)
                    : setPageState(PageState.COMPETITIVE_SETTINGS);
            } else if (game.status === GameStatus.STARTED) {
                console.log(isCollaborative(game));
                isCollaborative(game)
                    ? setPageState(PageState.COLLABORATIVE)
                    : setPageState(PageState.COMPETITIVE);
            }
        }
    }, [game, pageState]);

    return {
        game,
        setGame,
        pageState,
        setPageState,
        competitiveTeamsAnswers,
        setCompetitiveTeamsAnswers
    };
}
