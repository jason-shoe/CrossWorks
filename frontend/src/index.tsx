import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import Homepage from './components/homepage/Homepage';
import CompetitivePage from './components/competitive/Competitive';
import CollaborativePage from './components/collaborative/Collaborative';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Route
        exact
        path='/'
        component={Homepage}
      />
      <Route
        exact
        path='/competitive'
        component={CompetitivePage}
      />
      <Route
        exact
        path='/collaborative'
        component={CollaborativePage}
      />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
