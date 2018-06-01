import React from 'react';
import { Link } from 'react-router-dom';

class Chevrons extends React.Component {

  formatLink(url, cName, text, icon) {
    return (
      <Link to={"/" + url}>
        <div className={"chevron " + cName}>
          <i className={"fa fa-4x " + icon}></i>
          <p>{text}</p>
        </div>
      </Link>
    ); 
  }

  render() {
    const prev = this.props.prev ? this.formatLink(this.props.prev, "prev", "Prev", "fa-long-arrow-left") : null;
    const next = this.props.next ? this.formatLink(this.props.next, "next", "Next", "fa-long-arrow-right") : null;
    const topLink = this.props.altHome ?
      this.formatLink(this.props.altHome.url, "home", this.props.altHome.text, this.props.altHome.icon) :
      this.formatLink('', "home", "Home", "fa-long-arrow-up");

    return(
      <div id="nav" className={this.props.anyVideoPlaying ? "hidden" : undefined}>
        {prev}
        {next}
        {topLink}
      </div>
    );
  }
}

export default Chevrons;