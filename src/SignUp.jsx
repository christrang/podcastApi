import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [error, setError] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const navigate = useNavigate();

  const validateEmail = () => {
    const hasAtSymbol = email.includes('@');
    const requirements = [
      { label: 'Must contain @ symbol', met: hasAtSymbol },
    ];
    const isValid = hasAtSymbol;

    return {
      message: isValid ? 'Email is valid' : 'Email must contain @ symbol.',
      requirements,
      isValid,
    };
  };
  
  const validatePassword = () => {
    const hasMinLength = password.length >= 8;
    const hasSymbol = /[!@#$%&*()[\]]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);

    const requirements = [
      { label: 'Minimum 8 characters', met: hasMinLength },
      { label: 'At least one symbol', met: hasSymbol },
      { label: 'At least one uppercase letter', met: hasUppercase },
      { label: 'At least one lowercase letter', met: hasLowercase },
    ];

    const isValid = hasMinLength && hasSymbol && hasUppercase && hasLowercase;

    return {
      message: isValid ? 'Password is valid' : 'Please fix password issues.',
      requirements,
      isValid,
    };
  };

  const validateConfirmPassword = () => {
    if (confirmPassword && confirmPassword !== password) {
      return {
        message: 'Passwords do not match.',
        requirements: [{ label: 'Passwords must match', met: false }],
        isValid: false,
      };
    }
    return { message: '', requirements: [], isValid: true };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const { message: passwordMessage, isValid: isPasswordValid } = validatePassword();
    setPasswordMessage(passwordMessage);

    const { message: emailMessage, isValid: isEmailValid } = validateEmail();
    setEmailMessage(emailMessage);

    const { message: confirmPasswordMessage, isValid: isConfirmPasswordValid } = validateConfirmPassword();
    setConfirmPasswordMessage(confirmPasswordMessage);

    if (isPasswordValid && isEmailValid && isConfirmPasswordValid) {
      try {
        const response = await fetch('https://podcastsapi.herokuapp.com/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.error) {
          setError(true);
          setPasswordMessage(data.error);
        } else {
          setPasswordMessage(data.message);
          localStorage.setItem('token', data.token);
          console.log(data.token);
          navigate('/subscriptions');
        }

        setLoading(false);
      } catch (error) {
        setError(true);
        setPasswordMessage(error.message);
        setLoading(false);
      }
    } else {
      setIsValid(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const { message: emailMessage, isValid: isEmailValid } = validateEmail();
    const { message: passwordMessage, isValid: isPasswordValid } = validatePassword();
    const { message: confirmPasswordMessage, isValid: isConfirmPasswordValid } = validateConfirmPassword();
  
    setEmailMessage(emailMessage);
    setPasswordMessage(passwordMessage);
    setConfirmPasswordMessage(confirmPasswordMessage);
    setIsValid(isEmailValid && isPasswordValid && isConfirmPasswordValid);
  }, [password, confirmPassword, email, validateEmail, validatePassword, validateConfirmPassword]);
  

  return (
    <div className="hero is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="box" style={{ width: '50vw' }}>
            <h1 className="title has-text-centered">Sign Up</h1>
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
                  {!error && (
                    <div>
                      <p style={{ color: emailMessage.isValid ? 'green' : 'red' }}>{emailMessage.message}</p>
                      {emailMessage.message !== 'Email is valid' && (
                        <ul>
                          {validateEmail().requirements.map((requirement, index) => (
                            <li key={index} style={{ color: requirement.met ? 'green' : 'red' }}>
                              {requirement.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
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
                <div className="validation-message">
                  {passwordMessage && (
                    <div>
                      {passwordMessage !== 'Password is valid' && (
                        <ul>
                          {validatePassword().requirements.map((requirement, index) => (
                            <li key={index} style={{ color: requirement.met ? 'green' : 'red' }}>
                              {requirement.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="field">
                <label className="label">Confirm Password</label>
                <div className="control">
                  <input
                    className={`input ${
                      confirmPasswordMessage !== '' ? (isValid ? 'is-success' : 'is-danger') : ''
                    }`}
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>
                <div className="validation-message">
                  {confirmPasswordMessage && (
                    <div>
                      <p className={`help ${isValid ? 'is-success' : 'is-danger'}`}>{confirmPasswordMessage.message}</p>
                      {validateConfirmPassword().requirements.length > 0 && (
                        <ul>
                          {validateConfirmPassword().requirements.map((requirement, index) => (
                            <li key={index} style={{ color: requirement.met ? 'green' : 'red' }}>
                              {requirement.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="field is-grouped is-grouped-centered">
                <p className="control">
                  <button
                    type="submit"
                    className="button is-primary"
                    disabled={!isValid || loading}
                  >
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </button>
                </p>
                <p className="control">
                  <Link to="/" className="button is-danger">
                    Cancel
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
