import React, { Component } from 'react';
import './App.css';

import MainComponent from './components/canvaComponents/MainComponent';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Initiation à l'IA</h1>
          <MainComponent />
        </header>
        <div className="panel">
            <label>Avancer</label><input id="forwardValue" defaultValue="10"/>
            <label>Collision</label><input id="collisionValue" defaultValue="-10"/><br/>
            <label>Tourner à droite</label><input id="turnRightValue" defaultValue="-3"/>
            <label>Tourner à gauche</label><input id="turnLeftValue" defaultValue="-3"/><br/>
            <label>Toucher devant (mur)</label><input id="touchForwardValue" defaultValue="-2"/>
            <label>Toucher devant (vide)</label><input id="touchForwardEmptyValue" defaultValue="-1"/><br/>
            <label>Toucher à droite (mur)</label><input id="touchRightValue" defaultValue="-2"/>
            <label>Toucher à droite (vide)</label><input id="touchRightEmptyValue" defaultValue="-1"/><br/>
            <label>Toucher à gauche (mur)</label><input id="touchLeftValue" defaultValue="-2"/>
            <label>Toucher à gauche (vide)</label><input id="touchLeftEmptyValue" defaultValue="-1"/><br/>
            <div id="info"></div>
        </div>
      </div>
    );
  }
};

export default App;
