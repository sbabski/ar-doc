import React from 'react';
import { Link } from 'react-router-dom';
import Chevrons from './Chevrons';

class MasterMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapUrl: require('./data/' + this.props.data['map']),
      offset: [0, 0],
      ratio: 1,
      resize: false
    }
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    document.title = this.props.data['name'];

    if(!this.state.resize) {
      window.addEventListener('resize', this.handleWindowResize.bind(this));
      this.setState({resize: true});
    }

    for(var i = 0; i < 10; i++) {
      setTimeout(this.handleWindowResize.bind(this), i);
    }
  }

  handleWindowResize() {
    const m = this.mapRef.current;
    if(m != null) {
      const r = m.getBoundingClientRect();
      this.setState({
        offset: [r.left, r.top],
        ratio: r.width / m.naturalWidth
      });
    }
  }

  formatPos(pos) {
    return {
      left: pos[0] + 'px',
      top: pos[1] + 'px'
    };
  }

  formatName(name) {
    name = name.split(' ');
    return name.reduce((accu, elem) => {
      return accu === null ? [elem] : [...accu, <br/>, elem]
    }, null);
  }

  renderLinkMapMarker(vData, index) {
    let pos = vData['pos'].map((v, i) => {
      let offset = this.state.offset[i];
      if(i == 1) offset -= 24;
      return v * this.state.ratio + offset;
    });

    return(
      <Link 
        to={vData['url']}
        className='video-open map-marker'
        style={this.formatPos(pos)}
      >
        <i className="fa fa-map-marker" />
        <p>{this.formatName(vData['name'])}</p>
      </Link>
    );
  }

  render() {
    const links = this.props.data['links'].map((x, i) => {
      return this.renderLinkMapMarker(x, i);
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
          altHome={this.props.altHome}
        />  
      </div>
    );
  }
}

export default MasterMap;