import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './styles/app.scss';
import ToolBar from './components/ToolBar';
import SettingsBar from './components/SettingsBar';
import Canvas from './components/Canvas';

function App() {
  return (
    <Router>
      <div className='app'>
        <Switch>
          <Route path='/:id'>
            <ToolBar />
            <SettingsBar />
            <Canvas />
          </Route>
          <Redirect to={`f${(+new Date()).toString(16)}`} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
