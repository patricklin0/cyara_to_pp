import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Col } from 'react-bootstrap';

import Navbar from './components/Navbar'
import Home from './components/Home';
import Transformer from './components/Transformer';
import Help from './components/Help';

class App extends Component {
  render() {
    return (
      <div className="App ">
        <Router>
          <div id='wrapper'>
            <Col md={1}>
              <Navbar />
            </Col>
            <Col md={11}>
              <div className='page-container'>
                <Route exact path='/' component={Home}/>
                <Route path='/Transformer' component={Transformer}/>
                <Route path='/Help' component={Help}/>
              </div>
            </Col>
          </div>
        </Router>
      </div>
    );
  }
}
export default App;
