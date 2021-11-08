import React, { memo, useState } from 'react';
import styles from './Crossword.module.scss';

export const Crossword = memo(function Crossword() {
    const size = 10;
    const cells = [...Array(size).keys()];
    const [crosswordCharacters, setCrosswordCharacters] = useState(Array.from({length: size},()=> Array.from({length: size}, () => null)));

    const handleChange = (row, column, event) => {
        let copy = [...crosswordCharacters];
        copy[row][column] = event.target.value;
        setCrosswordCharacters(copy);
      };

  return (
    <div>
        <table id="cross-word">
            <tbody>
                {cells.map((row)=>{   
                    return (
                            <div className={styles.CrosswordRow}>
                                {cells.map((column)=>{   
                                    return (<div>
                                                <input 
                                                    className={styles.CrosswordCell} maxlength="1"
                                                    onChange={e => handleChange(row, column, e)}
                                                />
                                            </div>);   
                                })}
                            </div>  
                        
                    );   
                })  
                }
            </tbody>
        </table>
    </div>
  );
})

export default Crossword;