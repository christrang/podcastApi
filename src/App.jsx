import { useState, useEffect } from 'react';
import 'bulma/css/bulma.css';
import './App.css';
import { Link } from 'react-router-dom';

function App() {
  const [podcasts, setPodcasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [podcastsPerPage, setPodcastsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPodcastsPerPage, setSelectedPodcastsPerPage] = useState(8);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://podcastsapi.herokuapp.com/podcasts/top');
        if (response.ok) {
          const data = await response.json();
          setPodcasts(data);
          setTotalPages(Math.ceil(data.length / podcastsPerPage));
        } else {
          console.error('Error fetching podcast data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching podcast data:', error);
      }
    }
  
    fetchData();
  }, [podcastsPerPage]);
  

  useEffect(() => {
    const storedPodcastsPerPage = localStorage.getItem('podcastsPerPage');
    if (storedPodcastsPerPage) {
      setPodcastsPerPage(Number(storedPodcastsPerPage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('podcastsPerPage', String(podcastsPerPage));
  }, [podcastsPerPage]);

  useEffect(() => {
    localStorage.setItem('podcastsPerPage', String(selectedPodcastsPerPage));
  }, [selectedPodcastsPerPage]);

  const startIndex = (currentPage - 1) * selectedPodcastsPerPage;
  const endIndex = startIndex + selectedPodcastsPerPage;
  const filteredPodcasts = podcasts.slice(startIndex, endIndex).filter((podcast) =>
    podcast.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleNextPage = () => {
    handlePageChange(currentPage + 1);
  };
  
  const handlePrevPage = () => {
    handlePageChange(currentPage - 1);
  };
  
  const handlePodcastsPerPageChange = (perPage) => {
    setSelectedPodcastsPerPage(perPage);
    setPodcastsPerPage(perPage);
  
    const newTotalPages = Math.ceil(podcasts.length / perPage);
  
    setTotalPages(newTotalPages);
  
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };
  
  
  return (
    <div className="App">
      <div className="section">
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="field">
              <div className="columns is-centered">
                <div className="column is-narrow">
                  <label className="label" style={{ color: 'white' }}>
                    Search
                  </label>
                </div>
                <div className="column">
                  <div className="control">
                    <input className="input" type="text" placeholder="Find a podcast" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="columns is-multiline">
          {filteredPodcasts.map((podcast) => (
            <div className="column is-one-quarter" key={podcast.id}>
              <Link to={`/podcasts/${podcast.podcastId}`}>
                <div className="card is-fullheight" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="card-image" style={{ flex: '1' }}>
                    <figure className="image">
                      <img src={podcast.artworkUrl} alt={podcast.name} style={{ objectFit: 'cover', height: '100%' }} />
                    </figure>
                  </div>
                  <div className="card-content has-text-centered">
                    <div>
                      <p className="title is-4">{podcast.name}</p>
                    </div>
                    <div>
                      <p className="subtitle is-6">{podcast.artist}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <div className="field">
        <label className="label" style={{ color: 'white' }}>
          Podcasts Per Page:
        </label>
        <div className="control">
          <div className="select">
            <select
              value={selectedPodcastsPerPage}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setSelectedPodcastsPerPage(value);
                handlePodcastsPerPageChange(value);
              }}
            >
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={24}>24</option>
            </select>
          </div>
        </div>
      </div>
      <div className="page-links">
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
      <footer>Matricule: e1995262</footer>
    </div>
    
  );
}

export default App;