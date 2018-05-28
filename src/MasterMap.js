import React from 'react';
import { Link } from 'react-router-dom';

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
    const r = this.mapRef.current.getBoundingClientRect();
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
      return v * this.state.ratio + this.state.offset[i];
    });

    return(
      <Link to={vData['url']}
          id={vData['id']}
          className='video-open master'
          style={this.formatPos(pos)}>
          <img src={icon} alt="X"/>
          <p class="test-text">test</p>
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
      </div>
    );
  }
}

export default MasterMap;