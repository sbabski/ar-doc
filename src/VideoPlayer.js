import React from 'react';
import ReactPlayer from 'react-player';

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
          <img src={this.props.icon} alt="X"/>
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

export default VideoPlayer;