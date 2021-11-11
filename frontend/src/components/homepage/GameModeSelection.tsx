import React, { memo, useCallback, useState } from "react";
import { useHistory } from 'react-router-dom'

enum GameMode {
  collaborative,
  competitive
}
export const GameModeSelection = memo(function GameModeSelection() {
  const [mode, setMode] = useState<GameMode>();
  const history = useHistory();

  const navigateToCompetitiveSettings = useCallback(
    () => history.push('/competitive-settings'),
    []
  );
  const navigateToCollaborativeSettings = useCallback(
    () => history.push('/collaborative-settings'),
    []
  );

  const handleSetCollab = () => {
    setMode(GameMode.collaborative);
    console.log("game mode set to collab", mode);
  }

  const handleSetComp = () => {
    setMode(GameMode.competitive);
    console.log("game mode set to competitive", mode)
  }

  const cardButtonStyles = `bg-white border border-gray-200 rounded text-xl py-32
                        flex-grow shadow hover:bg-blue-50 focus:ring-2
                        focus:ring-blue-700 focus:bg-blue-50`
  return (
    <div className={`max-w-2xl m-auto mt-20 space-y-8`}>
      {/* settings component there is just temporary */}
      <div className={`space-y-3`}>
        <p className={`text-4xl font-bold text-blue-700`}>Choose your game mode</p>
        <p>Description</p>
      </div>
      <div className={`flex justify-between space-x-6`}>
        <button className={cardButtonStyles}
                onClick={handleSetCollab}>
          Collaborative
        </button>
        <button className={cardButtonStyles}
                onClick={handleSetComp}>
          Competitive
        </button>
      </div>
      <div className={`flex space-x-4 pt-16`}>
        <button className={`px-20 py-4 bg-blue-50 rounded-md text-blue-700 
                          font-semibold text-lg`}
                onClick={() => history.push('/')}>
          Back
        </button>
        <button className={`px-12 py-4 bg-blue-700 rounded-md text-white 
                        font-semibold text-lg disabled:opacity-50`}
                disabled={(mode === undefined)}>
          Create Game
        </button>
      </div>
    </div>
  )
})

export default GameModeSelection