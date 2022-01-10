import React, { memo, useState, useEffect } from 'react';
import Crossword from '../shared/Crossword';
import './Collaborative.css';

export const Collaborative = memo(function Collaborative() {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clues, setClues] = useState([]);
  const [crosswordSize, setCrosswordSize] = useState(0);

  // Calling sample crossword data API
  useEffect(() => {
    fetch("http://localhost:8080/collaborative-game/sample-crossword")
      .then(res => res.json())
      .then(
        (result) => {
          // Storing the crossword clues
          setClues(result.clues);
          // Storing the size of the crossword
          setCrosswordSize(result.size);
          // Indicates that the crossword data hass been retrieved
          setIsLoaded(true);
        },
        // Handling any errors
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  // Array that keeps track of the cells that should be able to take in an input
  // Initially, every cell cannot take in an input
  let inputCellsArray:string[][]= [ 
    ["nonInputCell","nonInputCell","nonInputCell", "nonInputCell", "nonInputCell", "nonInputCell", "nonInputCell"],
    ["nonInputCell","nonInputCell","nonInputCell", "nonInputCell", "nonInputCell", "nonInputCell", "nonInputCell"],
    ["nonInputCell","nonInputCell","nonInputCell", "nonInputCell", "nonInputCell", "nonInputCell", "nonInputCell"],
    ["nonInputCell","nonInputCell","nonInputCell", "nonInputCell", "nonInputCell", "nonInputCell", "nonInputCell"],
    ["nonInputCell","nonInputCell","nonInputCell", "nonInputCell", "nonInputCell", "nonInputCell", "nonInputCell"],
    ["nonInputCell","nonInputCell","nonInputCell", "nonInputCell", "nonInputCell", "nonInputCell", "nonInputCell"],
    ["nonInputCell","nonInputCell","nonInputCell", "nonInputCell", "nonInputCell", "nonInputCell", "nonInputCell"] ]

  if (isLoaded) {
    // Modifies the inputCellsArray so that the appropriate cells can now take in an input
    clues.forEach((clue) => {
      var initialRowIndex = clue['row']
      var initialColIndex = clue['col']
      if(clue['direction'] === 'ACROSS') {
        for (let i = initialColIndex; i < (initialColIndex + clue['answerLength']); i++) {
          inputCellsArray[initialRowIndex][i] = "inputCell"
        }
      } else {
        for (let i = initialRowIndex; i < (initialRowIndex + clue['answerLength']); i++) {
          inputCellsArray[i][initialColIndex] = "inputCell"
        }
      }
    });
  }



  return (
    <div className='collaborative-page-div'>

      {/* Displaying the crossword grid*/}
      <div className='crossword-grid-div'>
        {isLoaded &&
          <Crossword size={crosswordSize} inputCells={inputCellsArray}/>
        }
      </div>

      {/* Displaying the crossword clues*/}
      <div className='clues-div'>
        <div className='across-clues-div'>
          <p className='clues-heading'>Across Clues</p>
          {clues.map((clue, index) => {
            if(clue['direction'] === 'ACROSS') {
              return <p key={index} className='clue-text'>{clue['hintNumber']}) {clue['hint']}</p> 
            }
          })}
        </div>
        <div className='down-clues-div'>
          <p className='clues-heading'>Down Clues</p>
          {clues.map((clue, index) => {
            if(clue['direction'] === 'DOWN') {
              return <p key={index} className='clue-text'>{clue['hintNumber']}) {clue['hint']}</p> 
            }
          })}
        </div>
      </div>
    </div>
  );
})

export default Collaborative;