import React from 'react';
import { Link } from 'react-router-dom';
import Chevrons from './Chevrons';

class MasterMap extends React.Component {
  constructor(props) {
    super(props);
    const data = require('./master_data/pages.json');
    this.state = {
      mapUrl: require('./master_data/' + data['map']),
      linkList: data['links'],
      id: '/' + data['id'] + '/',
      offset: [0, 0],
      ratio: 1
    }
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize.bind(this));
    setTimeout(this.handleWindowResize.bind(this), 1);
  }

  handleWindowResize() {
    const m = this.mapRef.current;
    const r = m.getBoundingClientRect();
    this.setState({
      offset: [r.left, r.top],
      ratio: r.width / m.naturalWidth
    });
  }

  formatPos(pos) {
    return {
      left: pos[0] + 'px',
      top: pos[1] + 'px'
    };
  }

  renderLink(vData, index) {
    let icon = require('./master_data/' + vData['icon']);
    let pos = vData['pos'].map((v, i) => {
      let offset = this.state.offset[i];
      if(i == 1) offset -= 24;
      return v * this.state.ratio + offset;
    });

    return(
      <Link to={vData['url']}
          id={vData['id']}
          className='video-open master'
          style={this.formatPos(pos)}>
          <i className="fa fa-map-marker" />
          <p>
            {vData['name']}
          </p>
      </Link>
    );
  }

  render() {
    const links = this.state.linkList.map((x, i) => {
      return this.renderLink(x, i);
    });

    return (
      <div>
        <div id="map">
          <img ref={this.mapRef} src={this.state.mapUrl} alt="" />
        </div>
        {links}
        <Chevrons 
          next={this.props.next}
          prev={this.props.prev}
          noHome={true}
        />  
      </div>
    );
  }
}

export default MasterMap;