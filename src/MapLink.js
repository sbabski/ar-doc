import React from 'react';

class MapLink extends React.Component {

  formatPos() {
    return {
      left: this.props.pos[0] + 'px',
      top: this.props.pos[1] + 'px'
    };
  }


  render() {
    let openClass = "video-open";
    if(this.props.anyVideoPlaying) openClass += " hidden";

    const target = this.props.newPage ? "default" : "";

    return (
      <div id={this.props.id}>
        <div 
          className={openClass} 
          style={this.formatPos()}>
          <a href={this.props.url} target={target}>
            <img src={this.props.icon} alt="X"/>
          </a>
        </div>
      </div>
    );
  }
}

export default MapLink;