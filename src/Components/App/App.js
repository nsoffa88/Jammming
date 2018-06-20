import React, { Component } from 'react';
import './App.css';
import SearchResult from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [{name: '', artist: '', album: '', id: ''}],
      playlistName: 'New Playlist',
      playlistTracks: [{name: '', artist: '', album: '', id: ''}]
    }

    this.addTrack = this.addTrack.bind(this);
    this.removedTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    this.setState({ playlistTracks: this.state.playlistTracks.concat(track) });
  }

  removeTrack(track) {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return this.setState({ playlistTracks: this.state.playlistTracks.filter(removalTrack => removalTrack.id !== track.id) });
    }
  }

  updatePlaylistName(name) {
    return this.setState({
      playlistName: name
    })
  }

  savePlaylist() {
    var trackURIs = this.state.playListTracks.uri;
    Spotify.savePlaylist(this.playlistName, trackURIs);
    this.setState({ playlistName: 'New Playlist' });
    this.setState({ playListTracks: [] });
  }

  search(searchTerm) {
    Spotify.search(searchTerm);
  }

  render() {
    return (
      <div>
        <h1>Ja<span class="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResult searchResults={this.search} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
