import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import 'bulma/css/bulma.css';

function DetailsPodcast() {
    const { id } = useParams();
    const [podcastData, setPodcastData] = useState({});
    
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`https://podcastsapi.herokuapp.com/podcast?podcastId=${id}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setPodcastData(data);
                } else {
                    console.error('Error fetching podcast data:', response.status);
                }
            } catch (error) {
                console.error('Error fetching podcast data:', error);
            }
        }

        fetchData();
    }, [id]);

    return (
        <div className="hero is-fullheight">
            <div className="container">
              {podcastData && (
                <div className="box">
                    <div className="section">
                        <div className="has-text-centered">
                            <img src={podcastData.artworkUrl} alt={podcastData.name} />
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="section">
                        <p className="subtitle is-6"><b>Name: </b> {podcastData.name}</p>
                        <p className="subtitle is-6"><b>Artist: </b> {podcastData.artist}</p>
                        <p className="subtitle is-6">
                          <b>Genre: </b> {podcastData.genres && podcastData.genres.join(', ')}
                        </p>
                        <p className="subtitle is-6">Description: {podcastData.description}</p>
                        <div>
                            <p className="title is-4">Episodes</p>
                            <ul className="content">
                                {podcastData.episodes &&
                                    podcastData.episodes.map((episode) => (
                                    <li key={episode.episodeId}>
                                        <p><b>Title: </b>{episode.title}</p>
                                        <p><b>Content: </b>{episode.content}</p>
                                        <p><b>Date: </b>{episode.isoDate}</p>
                                        <audio id="audioURL" controls="controls" preload="metadata" src={episode.audioUrl}></audio>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
              )}
            </div>
          </div>
      );
}

export default DetailsPodcast;
