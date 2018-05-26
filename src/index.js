/*import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';



ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
    , document.getElementById('root'));*/

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import './index.css';
import Map from './Map';
import chevron from './chevron.png';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.importAll(require.context('./data', false, /\.json$/))
    };
  }

  importAll(r) {
    const mapped = r.keys().map(r);
    var dict = {};
    mapped.map((x) => {
      const id = x['id'];
      //delete x['id'];
      dict[id] = x;
      return x;
    });

    return dict;
  }

  renderChevron(pos, rev=false) {
    const lower = pos.toLowerCase();
    const text = <p>{pos}</p>;
    const img = <img src={chevron} alt={lower}/>;

    return(
      <div className={"chevron " + lower}>
        {rev ? img : text}
        {rev ? text : img}
      </div>
    );
  }

  render() {
    const d = this.state.data;
    /*const maps = Object.keys(d).map(function(key, index) {
      return(
        <Map
          key={'map-' + key}
          data={d[key]}
        />
      );
    });*/

    const MasterMap = () => (
      <Map
        key={'map-p1'}
        data={d['p1']}
      />
    );

    const MapFinder = ({match}) => (
      <Map
        key={'map-' + match.params.name}
        data={d[match.params.name]}
      />
    );

    return(
      <div>
        <Switch>
          <Route 
            exact path="/" 
            component={MasterMap}
          />
          <Route 
            path="/:name" 
            //render={({match}) => <div>{d[match.params.name]['id']}</div>}
            component={MapFinder}
          />
        </Switch>
        <div id="nav">
          {this.renderChevron("Prev")}
          {this.renderChevron("Next")}
          {this.renderChevron("Home", true)}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);