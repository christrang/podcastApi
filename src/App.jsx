import { useState, useEffect } from 'react';
import 'bulma/css/bulma.css';
import './App.css';

function App() {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://podcastsapi.herokuapp.com/podcasts/top');
        if (response.ok) {
          const data = await response.json();
          setPodcasts(data);
        } else {
          console.error('Error fetching podcast data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching podcast data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="App">
      <div className="section">
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="field">
              <div className="columns is-centered">
                <div className="column is-narrow">
                  <label className="label" style={{color:'white'}}>Search</label>
                </div>
                <div className="column">
                  <div className="control">
                    <input className="input" type="text" placeholder="Find a podcast" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="columns is-multiline">
          {podcasts.map((podcast) => (
            <div key={podcast.id} className="column is-one-quarter">
              <div className="card is-fullheight">
                <div className="card-image">
                  <figure className="image">
                    <img src={podcast.artworkUrl} alt={podcast.name} />
                  </figure>
                </div>
                <div className="card-content has-text-centered" style={{ flexGrow: 1 }}>
                  <div>
                    <p className="title is-4">{podcast.name}</p>
                  </div>
                  <div style={{ marginTop: '25%' }}>
                    <p className="subtitle is-6">{podcast.artist}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <footer>
          Matricule: e1995262
        </footer>
      </div>
    </div>
  );
}

export default App;
