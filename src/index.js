import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import data from './data.json'
import ReactPlayer from 'react-player';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapUrl: data['map'],
      vidList: data['videos'],
      videoPlaying: false
    }
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    //console.log(ReactDOM.findDOMNode(this.mapRef.current));
    //console.log(ReactDOM.findDOMNode(this.mapRef.current).getBoundingClientRect().width);
    const w = ReactDOM.findDOMNode(this.mapRef.current).getBoundingClientRect();
    console.log(w);
    console.log(ReactDOM.findDOMNode(this.mapRef.current).offsetWidth);
  }

  handleOpenClick(v) {
    this.setState({videoPlaying: v})
  }

  render() {
    const videos = this.state.vidList.map((vData, index) => {
      let url = vData['url'];
      //let icon = require('/.media/' + vData['icon']);
      if(vData['type'] === 'local') url = require('./media/' + url);
      return(
        <VideoPlayer
          key={'video' + index}
          id={'video' + index}
          url={url}
          icon={vData['icon']}
          pos={vData['pos']}
          onClick={v => this.handleOpenClick(v)}
          anyVideoPlaying={this.state.videoPlaying}
        />
      );
    });

    return (
      <div>
        <div id="map">
          <img ref={this.mapRef} src={require('./media/' + this.state.mapUrl)} alt="" />
        </div>
        {videos}
      </div>
    );
  }
}

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      anyVideoPlaying: false
    }
    this.formatPos = this.formatPos.bind(this);
  }

  handleOpenClick(v) {
    this.setState({visible: v});
    this.props.onClick(v);
  }

  formatPos() {
    return {
      left: this.props.pos[0] + 'px',
      top: this.props.pos[1] + 'px'
    };
  }


  render() {
    let vidClass = "fullscreen-video";
    let openClass = "video-open";

    if(!this.state.visible) vidClass += " hidden";
    if(this.props.anyVideoPlaying) openClass += " hidden";

    return (
      <div id={this.props.id} className="video-container">
        <div 
          className={openClass} 
          onClick={() => this.handleOpenClick(true)}
          style={this.formatPos()}>
          <img src={require('./media/' + this.props.icon)} alt="X"/>
        </div>
        <div className={vidClass}>
          <ReactPlayer
            url={this.props.url}
            width='100vw'
            height='100vh'
            playing={this.state.visible}
            controls={true}
          />
          <div className="close" onClick={() => this.handleOpenClick(false)}>X</div>
        </div>
      </div>
    );
  }
}
// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
