import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';

function App() {
    
  return (
      <Router>
          <Switch>
              <Route exact path={`${process.env.PUBLIC_URL + "/"}`} component={Home} />
          </Switch>
      </Router>
  )
}

export default App;
