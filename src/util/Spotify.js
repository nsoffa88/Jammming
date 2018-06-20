var accessToken;
const clientID = 'e7635bb61afb4aa893c880a370d0e610';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if(accessToken !== null){
      return accessToken;
    }

    accessToken = window.location.href.match('/access_token=([^&]*)/');
    const expiresIn = window.location.href.match('/expires_in=([^&]*)/');
    if(accessToken && expiresIn) {
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
    }
  },

  search(searchTerm) {
    fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, { headers: {Authorization: `Bearer ${accessToken}`} }).then((response) => {
      if(response.ok) {
        return response.json().map((track) => ({ id: track.id,
                                                name: track.name,
                                                artist: track.artists[0].name,
                                                album: track.album.name,
                                                uri: track.uri
                                              }));
      }
    })
  },

  savePlaylist(playlistName, trackURIs) {
    if(playlistName && trackURIs) {
      var accessToken = this.accessToken;
      var headers = {Authorization: `Bearer ${accessToken}`}
      var userID;
      var playlistID;

      fetch('https://api.spotify.com/v1/me', { headers: headers }).then((response) => {
        if(response.ok) {
          response = response.json();
          userID = response.id;
        }
      })
      fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, { headers: headers }).then((response) => {
        if(response.ok) {
          response = response.json();
          playlistID = response.id;
        }
      })
      fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks?uris=${trackURIs}`, { headers: headers }).then((response) => {
        if(response.ok) {
          response = response.json();
          playlistID = response.id;
        }
      })
    } else {
      return;
    }
  }
};

export default Spotify;
