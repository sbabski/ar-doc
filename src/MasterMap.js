import React from 'react';
import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import Chevrons from './Chevrons';

class MasterMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapUrl: require('./data/' + this.props.data['map']),
      videoPlaying: false,
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

    this.handleWindowResize();
  }

  handleWindowResize() {
    const m = this.mapRef.current;
    if(m != null) {
      const r = m.getBoundingClientRect();
      console.log(r);

      if(m.width == 0) {
        setTimeout(this.handleWindowResize.bind(this), 1);
      } else {
        this.setState({
          offset: [r.left, r.top],
          ratio: r.width / m.naturalWidth
        });
      }
    }
  }

  formatName(name) {
    name = name.split(' ');
    return name.reduce((accu, elem) => {
      return accu === null ? [elem] : [...accu, <br/>, elem]
    }, null);
  }

  formatPos(pos, adjust) {
    const map = pos.map((v, i) => {
      let offset = this.state.offset[i];
      offset += adjust[i];
      return v * this.state.ratio + offset;
    });

    return {
      left: map[0] + 'px',
      top: map[1] + 'px'
    };
  }

  renderLink(vData, icon, adjust=[0,0]) {
    return(
      <Link 
        to={(vData['prefix'] || '') + vData['url']}
        className='video-open map-marker'
        style={this.formatPos(vData['pos'], adjust)}
      >
        {icon}
        <p>{this.formatName(vData['name'])}</p>
      </Link>
    );
  }

  renderImageIcon(icon) {
    return <img src={require('./data/' + icon)}/>;
  }

  renderIcon(icon) {
    return <i className={"fa " + icon} />;
  }

  render() {
    const links = this.props.data['links'].map((x, i) => {
      const icon = x['icon'];
      if(!icon) 
        return this.renderLink(x, this.renderIcon('fa-close'));
      if(icon === 'fa-map-marker')
        return this.renderLink(x, this.renderIcon(icon), [0, -24]);
      if(icon.substring(0, 3) === 'fa-')
        return this.renderLink(x, this.renderIcon(icon));
      return this.renderLink(x, this.renderImageIcon(icon));
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
          anyVideoPlaying={this.state.videoPlaying}
        />  
      </div>
    );
  }
}

export default MasterMap;