import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import 'bulma/css/bulma.css';

function DetailsPodcast() {
    const { id } = useParams();
    const [podcastData, setPodcastData] = useState({});
    const authToken = localStorage.getItem('token');
    const [subscription, setSubscription] = useState(false);

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

    useEffect(() => {
        async function fetchSubscription() {
            try {
                const response = await fetch(`https://podcastsapi.herokuapp.com/subscription?podcastId=${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setSubscription(data.isSubscribed);
                } else {
                    console.error('Error fetching subscription data:', response.status);
                }
            } catch (error) {
                console.error('Error fetching subscription data:', error);
            }
        }
        fetchSubscription();
    }, [id, authToken]);

    const handleSubscribe = async () => {
        try {
            const response = await fetch(`https://podcastsapi.herokuapp.com/subscription?podcastId=${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.ok) {
                setSubscription(true);
            } else {
                console.error('Error subscribing:', response.status);
            }
        } catch (error) {
            console.error('Error subscribing:', error);
        }
    };

    const handleUnsubscribe = async () => {
        try {
            const response = await fetch(`https://podcastsapi.herokuapp.com/subscription?podcastId=${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.ok) {
                setSubscription(false);
            } else {
                console.error('Error unsubscribing:', response.status);
            }
        } catch (error) {
            console.error('Error unsubscribing:', error);
        }
    };

    return (
        <div className="hero is-fullheight">
            <div className="container">
                {podcastData && (
                    <div className="box">
                        <div className="section">
                            {authToken && (
                                <div className="has-text-centered">
                                    {subscription ? (
                                        <button className="button is-danger" onClick={handleUnsubscribe}>
                                            Unsubscribe
                                        </button>
                                    ) : (
                                        <button className="button is-primary" onClick={handleSubscribe}>
                                            Subscribe
                                        </button>
                                    )}
                                </div>
                            )}
                            <br />
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
