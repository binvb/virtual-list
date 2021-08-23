import React, { useState } from 'react';
import VirtualList from '@component/index'

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <VirtualList></VirtualList>
    </div>
  );
}