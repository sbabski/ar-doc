import React from 'react';
import VideoPlayer from './VideoPlayer';
import Chevrons from './Chevrons';
import { Link } from 'react-router-dom';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '/' + this.props.data['id'] + '/',
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
    for(var i = 0; i < 10; i++) {
      setTimeout(this.handleWindowResize.bind(this), i);
    }
  }

  componentDidUpdate() {
    this.handleWindowResize.bind(this);
  }

  handleOpenClick(v) {
    this.setState({videoPlaying: v});
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

  renderLink(vData, index, url) {
    let icon = require('./data' + this.state.id + vData['icon']);
    let pos = vData['pos'].map((v, i) => {
      return v * this.state.ratio + this.state.offset[i];
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

  renderVideoPlayer(vData, index, url) {
    let icon = require('./data' + this.state.id + vData['icon']);
    let pos = vData['pos'].map((v, i) => {
      return v * this.state.ratio + this.state.offset[i];
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
      return v * this.state.ratio + this.state.offset[i];
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

  render() {
    let links;
    if(this.props.data['links']) {
      links = this.props.data['links'].map((vData, index) => {
        let url = vData['url'];

        switch(vData['type']) {
          case 'link':
            return this.renderLinkDefault(vData, index, url);
          case 'local':
            url = require('./data' + this.state.id + url);
          default:
            return this.renderVideoPlayerDefault(vData, index, url);
        }
      });
    }

    return (
      <div>
        <div id="map">
          <img ref={this.mapRef} src={require('./data/' + this.props.data['map'])} alt="" />
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