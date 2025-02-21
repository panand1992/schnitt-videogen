import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { LogOut, Film, Sparkles, Loader2 } from 'lucide-react';
import './Home.scss';
import { useNavigate } from 'react-router-dom';
import { generateVideoFromPrompt as generateVideoFromPromptRequest, userLogout as userLogoutRequest } from '../actions/app';

const Home = (props) => {
    const { generateVideoFromPrompt, userLogout } = props;

    const navigate = useNavigate();

    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        // Simulate API call
        // await new Promise(resolve => setTimeout(resolve, 2000));
        const videoPromptData = {
            videoPrompt: prompt
        }

        generateVideoFromPrompt({ navigate, videoPromptData });
        setIsGenerating(false);
    };

    const onClickLogout = () => {
        userLogout({ navigate });
    }

    const onClickPreviousVideos = () => {
        navigate('/upload/all')
    }

    return (
        <div className="app-container">
            <header className="glass-header">
                <div className="header-content">
                    <button onClick={onClickPreviousVideos} className="icon-button previous-btn">
                        <Film />
                        <span>Previous Videos</span>
                    </button>

                    <button onClick={onClickLogout} className="icon-button logout-btn">
                        <LogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            <main className="main-content">
                <div className="prompt-card">
                    <div className="card-header">
                        <h1>Schnitt AI Video Generation</h1>
                        <p className="subtitle">Transform your ideas into stunning videos</p>
                    </div>

                    <form onSubmit={handleSubmit} className="prompt-form">
                        <div className="input-container">
                            <Sparkles className="sparkle-icon" />
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe your video idea in detail..."
                                className="modern-input"
                                rows={5}
                            />
                            {prompt.length > 0 && (
                                <div className="character-counter">
                                    {prompt.length} characters
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`generate-button ${isGenerating ? 'generating' : ''}`}
                            disabled={!prompt.trim() || isGenerating || prompt < 10}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="spin" />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles />
                                    <span>Generate Video</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

Home.propTypes = {
    generateVideoFromPrompt: PropTypes.func,
    userLogout: PropTypes.func
}

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = (dispatch) => ({
    generateVideoFromPrompt: (data) => dispatch(generateVideoFromPromptRequest(data)),
    userLogout: (data) => dispatch(userLogoutRequest(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);