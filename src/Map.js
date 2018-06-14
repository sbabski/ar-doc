import React from 'react';
import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import Chevrons from './Chevrons';

class Map extends React.Component {
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

  formatLink(x, i) {
    const target = x['type'].includes('tab') ? '_blank' : '';

    const icon = x['icon'];
    if(!icon) 
      return this.renderLink(x, this.renderIcon('fa-close', i), target);
    if(icon === 'fa-map-marker')
      return this.renderLink(x, this.renderIcon(icon, i), target, [0, -24]);
    if(icon.substring(0, 3) === 'fa-')
      return this.renderLink(x, this.renderIcon(icon, i), target);
    return this.renderLink(x, this.renderImageIcon(icon, i), target);
  }

  formatVideo(x, i) {
    const icon = x['icon'];
    const key = 'video' + i;

    let url = x['url'];
    if(x['type'] === 'local') url = require('./data' + url);

    let adjust = [0, 0];
    let renderIcon;
    if(!icon) {
      renderIcon = this.renderIcon('fa-close', i);
    } else if(icon.substring(0, 3) === 'fa-') {
      renderIcon =  this.renderIcon(icon, i);
      if(icon === 'fa-map-marker') adjust = [0, -24];
    } else {
      renderIcon = this.renderImageIcon(icon, i);
    }

    return this.renderVideo(url, key, x['name'], renderIcon, this.formatPos(x['pos'], adjust));
  }

  renderLink(vData, icon, target, adjust=[0,0]) {
    let className = 'video-open map-marker';
    if(this.state.videoPlaying) className += ' hidden';
    return(
      <Link 
        to={(vData['prefix'] || '') + vData['url']}
        className={className}
        style={this.formatPos(vData['pos'], adjust)}
        target={target}
      >
        {icon}
        <p>{this.formatName(vData['name'])}</p>
      </Link>
    );
  }

  renderImageIcon(icon) {
    return <img src={require('./data/' + icon)}/>;
  }

  renderIcon(icon, index) {
    return(
      <i className={"fa " + icon}>
        {this.props.data['numbered'] && <span>{index + 1}</span>}
      </i>
    );
  }

  renderVideo(url, key, name, renderIcon, pos) {
    return(
      <VideoPlayer
        key={key}
        id={key}
        url={url}
        icon={renderIcon}
        pos={pos}
        name={name}
        onClick={v => this.handleOpenClick(v)}
        anyVideoPlaying={this.state.videoPlaying}
      />
    );
  }

  handleOpenClick(v) {
    this.setState({videoPlaying: v});
  }

  render() {
    let links;
    if(this.props.data['links']) {
      links = this.props.data['links'].map((x, i) => {
        return x['type'].includes('link') ? this.formatLink(x, i) : this.formatVideo(x, i);
      });
    }

    return (
      <div>
        <div id="map">
          <img ref={this.mapRef} src={this.state.mapUrl} alt="" />
        </div>
        {links}
        <Chevrons 
          next={this.props.data['next']}
          prev={this.props.data['prev']}
          altHome={this.props.data['altHome']}
          anyVideoPlaying={this.state.videoPlaying}
        />
      </div>
    );
  }
}

export default Map;