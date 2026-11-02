
import { useNavigate } from "react-router-dom"; 
import "./NotFound.scss";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="background-blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <div className="content">
                <h1 className="heading-404">404</h1>
                <div className="heading_message">
                    <h2>Oops! Page Not Found</h2>
                    <p>The page you're looking for seems to have wandered off into the digital void. Don't worry, even the best explorers sometimes take a wrong turn.</p>
                </div>
                <div className="actions">
                    <button onClick={() => navigate(-1)} className="go-back"><i className="ri-arrow-left-line"></i> Go Back</button>
                    <button onClick={() => navigate('/')} className="go-home"><i className="ri-home-4-line"></i> Go Home</button>
                </div>
                <div className="extra-info">
                    <p>If you believe this is an error, please check the URL or contact our support team. We're here to help you find your way.</p>
                </div>
            </div>

            <div className="floating-dots">
                <div className="dot dot-1"></div>
                <div className="dot dot-2"></div>
                <div className="dot dot-3"></div>
            </div>
        </div>

    );
};

export default NotFound;
