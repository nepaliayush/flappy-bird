import React from 'react';
import Image from 'next/image';

function Background() {
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: -1 }}>
      <Image 
        src="/background-day.png"
        layout="fill"
        objectFit="cover"
        alt="Background"
      />
    </div>
  );
}

export default Background;
