import React, { memo } from 'react';
import styles from './styles/Homepage.module.scss';

export const Homepage = memo(function Homepage() {
  return (
    <div className={styles.App}>
      <p>This is the homepage</p>
    </div>
  );
})

export default Homepage;