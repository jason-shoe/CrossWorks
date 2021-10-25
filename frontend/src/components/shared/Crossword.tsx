import React, { memo } from 'react';
import styles from './Crossword.module.scss';

export const Crossword = memo(function Crossword() {
    const size = 10;
    const cells = [...Array(size).keys()];
  return (
    <div>
        <table id="cross-word">
            <tbody>
                {cells.map((row)=>{   
                    return (
                            <div className={styles.CrosswordRow}>
                                {cells.map((column)=>{   
                                    return (<div>
                                                <input className={styles.CrosswordCell} maxlength="1"/>
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