import React, { memo } from 'react';

export const RandomComponent = memo(function RandomComponent() {
  return (
    <div>
      <p>This is a random component</p>
    </div>
  );
})

export default RandomComponent;