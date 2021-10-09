import React, { memo } from 'react';
import styles from './styles/Collaborative.module.scss';
import RandomComponent from "../shared/RandomComponent"

export const Collaborative = memo(function Collaborative() {
  return (
    <div>
      <p>This is the collaborative crossword page</p>
	  <RandomComponent />
    </div>
  );
})

export default Collaborative;