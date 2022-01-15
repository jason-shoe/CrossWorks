import React, { memo, useCallback, useState } from 'react';
import { PageState } from '../shared/types/pageState';
import { ClientNameProps } from '../shared/types/propTypes';
import { UsernameInput } from './UsernameInput';

interface GameModeSelectionProps {
    setPageState: (state: PageState) => void;
    clientNameProps: ClientNameProps;
}

export const GameModeSelection = memo(function GameModeSelection({
    setPageState,
    clientNameProps
}: GameModeSelectionProps) {
    const [mode, setMode] = useState<PageState>();

    const createGame = useCallback(() => {
        if (clientNameProps.clientName.length === 0) {
            clientNameProps.setGaveWarning(true);
        } else if (mode !== undefined) {
            setPageState(mode);
        }
    }, [clientNameProps, mode, setPageState]);

    const handleSetCollab = useCallback(() => {
        setMode(PageState.COLLABORATIVE_SETTINGS);
    }, [setMode]);

    const handleSetComp = useCallback(() => {
        setMode(PageState.COMPETITIVE_SETTINGS);
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
                <UsernameInput
                    clientName={clientNameProps.clientName}
                    setClientName={clientNameProps.setClientName}
                    showWarning={clientNameProps.gaveWarning}
                />
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
                    onClick={() => setPageState(PageState.MAIN)}
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
