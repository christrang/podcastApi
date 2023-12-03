import { useState, useEffect } from 'react';
import 'bulma/css/bulma.css'; // Import Bulma CSS
import './App.css'; // Import your custom styles if needed

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
      <div className="section">
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
                  <p className="title is-4">{podcast.name}</p>
                  <p className="subtitle is-6">{podcast.artist}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <footer>
          Matricule: e1234567
        </footer>
      </div>
  );
}

export default App;
