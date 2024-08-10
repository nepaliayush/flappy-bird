import React from 'react';
import Image from 'next/image';

function Pipe({ width = 500, height = 400, left = 0, top = 0 }) {
  return (
    <div style={{ position: 'absolute', left: `${left}px`, top: `${top}px` }}>
      <Image
        src="/pipe-green.png"
        width={width}
        height={height}
        alt="Pipe"
      />
    </div>
  );
}

export default Pipe;
