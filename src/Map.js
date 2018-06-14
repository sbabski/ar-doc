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

  renderLink(vData, index, url) {
    let icon = require('./data' + vData['icon']);
    let pos = vData['pos'].map((v, i) => {
      let offset = this.state.offset[i];
      return v * this.state.ratio + offset;
    });

    let openClass = "video-open";
    if(this.state.videoPlaying) openClass += " hidden";

    return(
      <div id={'link' + index}>
        <div 
          className={openClass} 
          style={this.formatPos(pos)}>
          <a href={url} target="default">
            <img src={icon} alt="X"/>
          </a>
        </div>
      </div>
    );
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

  renderLinkDefault(vData, index, url) {
    let pos = vData['pos'].map((v, i) => {
      return v * this.state.ratio + this.state.offset[i];
    });

    return(
      <Link 
        to={url}
        id={vData['id']}
        className='video-open'
        style={this.formatPos(pos)}
        target={"default"}
      >
        <i className="fa fa-close" />
      </Link>
    );
  }

  
  renderLinkMapMarker(vData, index) {
    let pos = vData['pos'].map((v, i) => {
      let offset = this.state.offset[i];
      if(i === 1) offset -= 24;
      return v * this.state.ratio + offset;
    });

    return(
      <Link 
        to={this.state.prefix + '/' + vData['url']}
        id={vData['id']}
        className='video-open map-marker'
        style={this.formatPos(pos)}
      >
        <i className="fa fa-map-marker" />
        <p>{this.formatName(vData['name'])}</p>
      </Link>
    );
  }

  renderVideoPlayer(vData, index, url) {
    let icon = require('./data' + vData['icon']);
    let pos = vData['pos'].map((v, i) => {
      let offset = this.state.offset[i];
      if(i === 1) offset -= 24;
      return v * this.state.ratio + offset;
    });

    return(
      <VideoPlayer
        key={'video' + index}
        id={'video' + index}
        url={url}
        icon={icon}
        pos={pos}
        onClick={v => this.handleOpenClick(v)}
        anyVideoPlaying={this.state.videoPlaying}
      />
    );
  }

  renderVideoPlayerDefault(vData, index, url) {
    let pos = vData['pos'].map((v, i) => {
      let offset = this.state.offset[i];
      if(i === 1) offset -= 24;
      return v * this.state.ratio + offset;
    });

    return(
      <VideoPlayer
        key={'video' + index}
        id={'video' + index}
        url={url}
        pos={pos}
        name={vData['name']}
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
      links = this.props.data['links'].map((vData, index) => {
        let url = vData['url'];

        switch(vData['type']) {
          case 'link':
            return this.renderLinkMapMarker(vData, index, url);
          case 'local':
            url = require('./data' + url);
          default:
            return this.renderVideoPlayerDefault(vData, index, url);
        }
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