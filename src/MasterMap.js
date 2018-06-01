import React from 'react';
import { Link } from 'react-router-dom';
import Chevrons from './Chevrons';

class MasterMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapUrl: require('./data/' + this.props.pageData['map']),
      prefix: this.props.pageData['url'],
      linkList: this.props.pageData['links'],
      offset: [0, 0],
      ratio: 1,
      resize: false
    }
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    document.title = this.props.pageData['name'];

    if(!this.state.resize) {
      window.addEventListener('resize', this.handleWindowResize.bind(this));
      this.setState({resize: true});
    }
    setTimeout(this.handleWindowResize.bind(this), 1);
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

  renderLink(vData, index) {
    let pos = vData['pos'].map((v, i) => {
      let offset = this.state.offset[i];
      if(i == 1) offset -= 24;
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

  render() {
    const links = this.state.linkList.map((x, i) => {
      return this.renderLink(x, i);
    });

    return (
      <div>
        <div id="map">
          <img ref={this.mapRef} src={this.state.mapUrl} alt="" />
        </div>
        {links}
        <Chevrons 
          next={this.state.prefix + '/' + this.props.next}
          prev={this.state.prefix + '/' + this.props.prev}
          altHome={this.props.altHome}
        />  
      </div>
    );
  }
}

export default MasterMap;