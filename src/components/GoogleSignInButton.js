import { GoogleLogin } from '@react-oauth/google';
import './GoogleSignInButton.css';

function GoogleSignInButton({ onSuccess, onError, disabled = false }) {
  if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <>
      <div className="auth-divider">
        <span>or</span>
      </div>
      <div className={`google-login-wrap${disabled ? ' google-login-wrap--disabled' : ''}`}>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={() => onError?.('Google sign in failed. Please try again.')}
          theme="filled_black"
          size="large"
          width="340"
          text="continue_with"
          useOneTap={false}
        />
      </div>
    </>
  );
}

export default GoogleSignInButton;
