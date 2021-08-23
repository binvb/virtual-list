import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import VirtualList from '../.';

const App = () => {
  return (
    <div>
      <VirtualList />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
