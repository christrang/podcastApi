import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        setMessage('');

        try {
            const response = await fetch('https://podcastsapi.herokuapp.com/auth/token', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });

            const data = await response.json();

            if (data.error) {
                setError(true);
                setMessage(data.error);
            } else {
                setMessage(data.message);
                localStorage.setItem('token', data.token);
                console.log(data.token);
                console.log('Response Data:', data);
                console.log('Stored Token:', localStorage.getItem('token'));
                navigate('/subscriptions');
            }

            setLoading(false);
        } catch (error) {
            setError(true);
            setMessage(error.message);
            setLoading(false);
        }
    }

    return (
        <div className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="box" style={{ width: '50vw' }}>
                        <h1 className="title has-text-centered">Login</h1>
                        <form onSubmit={handleLogin}>
                            <div className="field">
                                <label className="label">Email</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Password</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="field is-grouped is-grouped-centered">
                                <p className="control">
                                    <button type="submit" className="button is-primary">
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>
                                </p>
                                <p className="control">
                                    <Link to="/" className="button is-danger">
                                        Cancel
                                    </Link>
                                </p>
                            </div>
                        </form>
                        {error && <div className="notification is-danger">{message}</div>}
                        {!error && message && <div className="notification is-success">{message}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
