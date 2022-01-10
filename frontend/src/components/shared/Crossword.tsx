import React, {ChangeEvent, memo, useState} from 'react';
import styles from './Crossword.module.scss';
import CSS from 'csstype';

export const Crossword = memo(function Crossword(props: {size:number, inputCells:Array<Array<string>>}) {
    // Setting the size of the crossword grid based on the API data retrieved
    const cells = [...Array(props.size).keys()];
    const [crosswordCharacters, setCrosswordCharacters] = useState(Array.from({length: props.size},()=> Array.from({length: props.size}, () => null)));

    const handleChange = (row: number,
                          column: number,
                          event: ChangeEvent<HTMLInputElement>) => {
        let copy = [...crosswordCharacters];
        // @ts-ignore
        copy[row][column] = event.target.value;
        setCrosswordCharacters(copy);
      };

      const styles = {
        // The styling for a cell that is capable of handling an input
        inputCell: {
          width: 60,
          height: 60,
          backgroundColor: "white",
          textAlign: "center",
        },
        // The styling for a cell that is not capable of handling an input
        nonInputCell: {
            width: 60,
            height: 60,
            backgroundColor: "black",
            pointerEvents: "none",
          },
        crosswordRow: {
            display: "flex",
        }
      } as const;

  return (
    <div>
        <table id="cross-word">
            <tbody>
                {cells.map((row)=>{   
                    return (
                            <div style={styles.crosswordRow}>
                                {cells.map((column)=>{   
                                    return (<div>
                                                {/* Returns a cell that can take in an input if necessary*/}
                                                {props.inputCells[row][column] === "inputCell" &&
                                                    <input 
                                                        style={styles.inputCell}
                                                        maxLength={1}
                                                        onChange={e => handleChange(row, column, e)}
                                                    />
                                                }  
                                                {/* Returns a cell that cannot take in an input if necessary*/}
                                                {props.inputCells[row][column] === "nonInputCell" &&
                                                    <input 
                                                        style={styles.nonInputCell}
                                                        maxLength={1}
                                                        onChange={e => handleChange(row, column, e)}
                                                    />
                                                }                                                                                    
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