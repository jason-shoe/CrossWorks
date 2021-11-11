import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import "tailwindcss/tailwind.css";
import Homepage from './components/homepage/Homepage';
import CompetitivePage from './components/competitive/Competitive';
import CollaborativePage from './components/collaborative/Collaborative';
import Settings from './components/settings/Settings';

import reportWebVitals from './reportWebVitals';
/* Remember to delete this */
import Crossword from './components/shared/Crossword';
import GameModeSelection from "./components/homepage/GameModeSelection";

ReactDOM.render(
    <React.StrictMode>
        <HashRouter>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/competitive" component={CompetitivePage} />
            <Route exact path="/collaborative" component={CollaborativePage} />
            <Route exact path="/createGame" component={GameModeSelection} />
            <Route exact path="/competitive-settings">
                <Settings isCollaborative={false} />
            </Route>
            <Route exact path="/collaborative-settings">
                <Settings isCollaborative={true} />
            </Route>
        </HashRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
