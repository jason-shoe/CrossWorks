import React, { memo, useCallback, useState } from 'react';
import { GameState } from '../shared/types/gameState';

interface GameModeSelectionProps {
    setGameState: (state: GameState) => void;
}

export const GameModeSelection = memo(function GameModeSelection({
    setGameState
}: GameModeSelectionProps) {
    const [mode, setMode] = useState<GameState>();

    const createGame = useCallback(() => {
        if (mode !== undefined) {
            setGameState(mode);
        }
    }, [mode, setGameState]);

    const handleSetCollab = useCallback(() => {
        setMode(GameState.COLLABORATIVE_SETTINGS);
    }, [setMode]);

    const handleSetComp = useCallback(() => {
        setMode(GameState.COMPETITIVE_SETTINGS);
    }, [setMode]);

    const cardButtonStyles = `bg-white border border-gray-200 rounded text-xl py-32
                        flex-grow shadow hover:bg-blue-50 focus:ring-2
                        focus:ring-blue-700 focus:bg-blue-50`;
    return (
        <div className={`max-w-2xl m-auto mt-20 space-y-8`}>
            {/* settings component there is just temporary */}
            <div className={`space-y-3`}>
                <p className={`text-4xl font-bold text-blue-700`}>
                    Choose your game mode
                </p>
                <p>Description</p>
            </div>
            <div className={`flex justify-between space-x-6`}>
                <button className={cardButtonStyles} onClick={handleSetCollab}>
                    Collaborative
                </button>
                <button className={cardButtonStyles} onClick={handleSetComp}>
                    Competitive
                </button>
            </div>
            <div className={`flex space-x-4 pt-16`}>
                <button
                    className={`px-20 py-4 bg-blue-50 rounded-md text-blue-700 
                          font-semibold text-lg`}
                    onClick={() => setGameState(GameState.MAIN)}
                >
                    Back
                </button>
                <button
                    className={`px-12 py-4 bg-blue-700 rounded-md text-white 
                        font-semibold text-lg disabled:opacity-50`}
                    disabled={mode === undefined}
                    onClick={createGame}
                >
                    Create Game
                </button>
            </div>
        </div>
    );
});

export default GameModeSelection;
