import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import './index.css';
import 'font-awesome/css/font-awesome.min.css';

import Map from './Map';
import MasterMap from './MasterMap';

class MapHandler extends React.Component {
  constructor(props) {
    super(props);
    const pageData = require('./data/' + this.props.json + '.json');
    const masterData = this.importRelevant(pageData);
    const url = pageData['url'] + '/';
    this.state = {
      pageData: pageData,
      url: url,
      data: masterData,
      dataList: this.createDataList(masterData, url)
    };
  }

  importRelevant(r) {
    var dict = {};
    const links = r['links'];
    let prefix = './data/';
    if(r['prefix']) prefix += r['prefix'] + '/';

    for(let i = 0; i < links.length; i++) {
      let json = require(prefix + links[i]['url'] + '.json');
      const id = json['url'];
      dict[id] = json;
    }
    return dict;
  }

  createDataList(data, prefix) {
    const list = Object.keys(data);
    const len = list.length;

    for(var i = 0; i < len; i++) {
      const d = data[list[i]];
      d['next'] = prefix + list[(i + 1) % len];
      d['prev'] = prefix + list[((i - 1) + len) % len];
    }
    return list;
  }

  render() {
    const d = this.state.data;
    const dL = this.state.dataList;
    
    return (
      <div>
        <Switch>
          <Route 
            exact path={"/" + this.state.url}
            render={() =>
              <MasterMap
                pageData={this.state.pageData}
                globalData={d}
                next={dL[0]}
                prev={dL[dL.length - 1]}
                altHome={this.state.pageData['altHome']}
              />
            }
          />
          <Route
            path={'/' + this.state.url + ':name'}
            render={({match}) =>
              <MapFinder
                data={d[match.params.name]}
                prefix={this.state.url}
              />
            }
          />
        </Switch>
      </div>
    );
  }
}

export default MapHandler;

class MapFinder extends React.Component {
  render() {
    if(this.props.data === undefined) {
      return(<Redirect to={"/" + this.props.prefix}/>);
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