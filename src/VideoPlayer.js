import React from 'react';
import ReactPlayer from 'react-player';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
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

  formatName(name) {
    name = name.split(' ');
    return name.reduce((accu, elem) => {
      return accu === null ? [elem] : [...accu, <br/>, elem]
    }, null);
  }

  render() {
    let vidClass = "fullscreen-video";
    let openClass = "video-open";

    if(!this.state.visible) vidClass += " hidden";
    if(this.props.anyVideoPlaying) openClass += " hidden";
    if(!this.props.icon) openClass += " map-marker";

    const icon = this.props.icon ? 
      <img src={this.props.icon} alt="X"/> :
      <i className="fa fa-map-marker" />;

    const name = this.props.name ? <p>{this.formatName(this.props.name)}</p> : null;

    return (
      <div id={this.props.id}>
        <div 
          className={openClass} 
          onClick={() => this.handleOpenClick(true)}
          style={this.formatPos()}>
          {icon}
          {name}
        </div>
        <div className={vidClass}>
          <ReactPlayer
            url={this.props.url}
            width='100vw'
            height='100vh'
            playing={this.state.visible}
            controls={true}
          />
          <div className="close" onClick={() => this.handleOpenClick(false)}>
            <i className="fa fa-close"></i>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoPlayer;