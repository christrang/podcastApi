import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function UpdateProfile() {
  const authToken = localStorage.getItem("token");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEmail() {
      try {
        const response = await fetch("https://podcastsapi.herokuapp.com/user", {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEmail(data.email);
        }
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    }
    fetchEmail();
  }, [authToken]);

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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const { message: passwordMessage, isValid: isPasswordValid } = validatePassword();
    setPasswordMessage(passwordMessage);

    const { message: emailMessage, isValid: isEmailValid } = validateEmail();
    setEmailMessage(emailMessage);

    const { message: confirmPasswordMessage, isValid: isConfirmPasswordValid } = validateConfirmPassword();
    setConfirmPasswordMessage(confirmPasswordMessage);

    if (isEmailValid.isValid && isPasswordValid.isValid && isConfirmPasswordValid.isValid) {
      try {
        const response = await fetch("https://podcastsapi.herokuapp.com/user", {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.error) {
            setError(true);
            setPasswordMessage(data.error);
        } else {
            setPasswordMessage(data.message);
            localStorage.setItem("token", data.token);
            navigate("/subscriptions")
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

  const handleDeleteUser = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch("https://podcastsapi.herokuapp.com/user", {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (data.error) {
        setError(true);
        setPasswordMessage(data.error);
      } else {
        localStorage.removeItem("token");
        navigate("/");
      }

      setLoading(false);
    } catch (error) {
      setError(true);
      setPasswordMessage(error.message);
      setLoading(false);
    }
  };

  const renderValidationMessage = (message, requirements) => {
    return (
      <div>
        <p style={{ color: isValid ? "green" : "red" }}>{message}</p>
        {message !== "Email is valid" && (
          <ul>
            {requirements.map((requirement, index) => (
              <li key={index} style={{ color: requirement.met ? "green" : "red" }}>
                {requirement.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="hero is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="box" style={{ width: "50vw" }}>
            <h1 className="title has-text-centered">Profile</h1>
            <form onSubmit={handleUpdateProfile}>
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
                  {!error && renderValidationMessage(emailMessage.message, validateEmail().requirements)}
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
                  {!error && renderValidationMessage(passwordMessage.message, validatePassword().requirements)}
                </div>
              </div>

              <div className="field">
                <label className="label">Confirm Password</label>
                <div className="control">
                  <input
                    className={`input ${
                      confirmPasswordMessage !== "" ? (isValid ? "is-success" : "is-danger") : ""
                    }`}
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="validation-message">
                  {!error &&
                    renderValidationMessage(confirmPasswordMessage.message, validateConfirmPassword().requirements)}
                </div>
              </div>

              <div className="field is-grouped is-grouped-centered">
              <p className="control">
                <button type="submit" className="button is-primary" disabled={!isValid || loading}>
                  {loading ? "Updating profile..." : "Update Profile"}
                </button>
              </p>
              <p className="control">
                <button
                  className="button is-danger"
                  onClick={() => setDeleteModalOpen(true)}
                  disabled={loading}
                >
                  Delete Account
                </button>
              </p>
              <p className="control">
                <Link to="/" className="button is-danger">
                  Cancel
                </Link>
              </p>
            </div>

            {/* Delete Account Modal */}
            {isDeleteModalOpen && (
              <div className="modal is-active">
                <div className="modal-background" onClick={() => setDeleteModalOpen(false)}></div>
                <div className="modal-content">
                  <div className="box">
                    <p className="has-text-centered">Are you sure you want to delete your account?</p>
                    <div className="field is-grouped is-grouped-centered mt-3">
                      <p className="control">
                        <button className="button is-danger" onClick={handleDeleteUser} disabled={loading}>
                          Confirm
                        </button>
                      </p>
                      <p className="control">
                        <button className="button" onClick={() => setDeleteModalOpen(false)} disabled={loading}>
                          Cancel
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  className="modal-close is-large"
                  aria-label="close"
                  onClick={() => setDeleteModalOpen(false)}
                ></button>
              </div>
            )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
