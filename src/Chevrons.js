import React from 'react';
import { Link } from 'react-router-dom';

class Chevrons extends React.Component {
  renderChevron(pos, cName) {
    const lower = pos.toLowerCase();

    return(
      <div className={"chevron " + lower}>
        <i className={"fa fa-4x " + cName}></i>
        <p>{pos}</p>
      </div>
    );
  }

  render() {
    return(
      <div id="nav" className={this.props.anyVideoPlaying ? "hidden" : undefined}>
        <Link to={"/" + this.props.prev}>{this.renderChevron("Prev", "fa-long-arrow-left")}</Link>
        <Link to={"/" + this.props.next}>{this.renderChevron("Next", "fa-long-arrow-right")}</Link>
        {this.props.noHome || <Link to="/">{this.renderChevron("Home", "fa-long-arrow-up")}</Link>}
      </div>
    );
  }
}

export default Chevrons;