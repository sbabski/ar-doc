import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import './index.css';
import 'font-awesome/css/font-awesome.min.css';

import Map from './Map';
import MasterMap from './MasterMap';

class App extends React.Component {
  constructor(props) {
    super(props);
    const data = this.importAll(require.context('./data', false, /\.json$/));
    this.state = {
      data: data,
      dataList: this.createDataList(data)
    };
  }

  importAll(r) {
    const mapped = r.keys().map(r);
    var dict = {};
    mapped.map((x, i) => {
      const id = x['id'];
      dict[id] = x;
      return x;
    });

    return dict;
  }

  createDataList(data) {
    const list = Object.keys(data);
    const len = list.length;

    for(var i = 0; i < len; i++) {
      const d = data[list[i]];
      d['next'] = list[(i + 1) % len];
      d['prev'] = list[((i - 1) + len) % len];
    }
    return list;
  }

  render() {
    const d = this.state.data;
    const dL = this.state.dataList;

    return(
      <div>
        <Switch>
          <Route 
            exact path="/"
            render={() =>
              <MasterMap
                globalData={d}
                next={dL[0]}
                prev={dL[dL.length - 1]}
              />
            }
          />
          <Route 
            path="/:name" 
            render={({match}) =>
              <MapFinder
                data={d[match.params.name]}
              />
            }
          />
        </Switch>
      </div>
    );
  }
}

class MapFinder extends React.Component {
  render() {
    if(this.props.data === undefined) {
      return(<Redirect to="/"/>);
    } else {
      return(
        <Map
          key={this.props.data['id']}
          data={this.props.data}
        />
      );
    }
  }
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);