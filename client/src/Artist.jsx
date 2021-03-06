import React, {Component} from 'react';
import Albums from './Albums.jsx';

class Artist extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = (e) => {
    e.stopPropagation();
    this.props.artistMenuClick(this.props.id);
  }

  render() {
    const albums = Object.keys(this.props.albums)
    .map(item => <Albums key={item}
                         id={item}
                         artistID={this.props.id}
                         value={this.props.albums[item].name}
                         tracks={this.props.albums[item].tracks}
                         color={this.props.albums[item].color}
                         albumMenuClick={this.props.albumMenuClick}
                         trackMenuClick={this.props.trackMenuClick}
                         />);
    return (
      <div className="list__artists" onClick={this.handleClick}>
        <h1>
          {this.props.value}
        </h1>
        <div className="list__albums">
          {albums}
        </div>
      </div>
    )
  }
}

export default Artist;
