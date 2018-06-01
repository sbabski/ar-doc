import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import './index.css';
import 'font-awesome/css/font-awesome.min.css';

import MapHandler from './MapHandler';
import Map from './Map';

class App extends React.Component {
  render() {
    return(
      <BrowserRouter>
        <Switch>
          <Redirect exact from='/' to='/derive'/>
          <Route 
            path='/derive' 
            render={() => 
              <MapHandler json='derive_pages'/>
            }
          />
          <Route 
            path="/profile"
            render={() => 
              <Map data={require('./data/profile_videos.json')}/>
            }
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));