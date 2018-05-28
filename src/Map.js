import React from 'react';
import VideoPlayer from './VideoPlayer';
import MapLink from './MapLink';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapUrl: this.props.data['map'],
      vidList: this.props.data['videos'],
      id: '/' + this.props.data['id'] + '/',
      videoPlaying: false,
      offset: [0, 0],
      ratio: 1
    }
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize.bind(this));
    setTimeout(this.handleWindowResize.bind(this), 1);
  }

  handleOpenClick(v) {
    this.setState({videoPlaying: v})
  }

  handleWindowResize() {
    const m = this.mapRef.current;
    const r = this.mapRef.current.getBoundingClientRect();
    this.setState({
      offset: [r.left, r.top],
      ratio: r.width / m.naturalWidth
    });
  }

  renderLink(vData, index, url) {
    let icon = require('./data' + this.state.id + vData['icon']);
    let pos = vData['pos'].map((v, i) => {
      return v * this.state.ratio + this.state.offset[i];
    });

    return(
      <MapLink
        key={'link' + index}
        id={'link' + index}
        url={url}
        icon={icon}
        pos={pos}
        newPage={true}
        anyVideoPlaying={this.state.videoPlaying}
      />
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

  render() {
    const videos = this.state.vidList.map((vData, index) => {
      let url = vData['url'];

      switch(vData['type']) {
        case 'link':
          return this.renderLink(vData, index, url);
        case 'local':
          url = require('./data' + this.state.id + url);
        default:
          return this.renderVideoPlayer(vData, index, url);
      }
    });

    return (
      <div>
        <div id="map">
          <img ref={this.mapRef} src={require('./data' + this.state.id + this.state.mapUrl)} alt="" />
        </div>
        {videos}
      </div>
    );
  }
}

export default Map;