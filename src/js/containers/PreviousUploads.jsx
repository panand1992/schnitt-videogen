/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { LogOut, Calendar, User, ChevronRight, CheckCircle, Loader2, XCircle } from 'lucide-react';
import './VideoLibrary.scss';
import { formatDate } from '../utils/helper';
import { useNavigate } from 'react-router-dom';
import { fetchPreviousUploads as fetchPreviousUploadsRequest, userLogout as userLogoutRequest } from '../actions/app';
import { getPreviousUploads } from '../selectors/app';

// Mock data for demonstration
const mockVideos = [
    {
        id: 1,
        name: "Sunset at the beach",
        prompt: "Create a calming video of sunset at a tropical beach with gentle waves",
        thumbnail: "/api/placeholder/320/180",
        createdAt: "2024-02-20T15:30:00",
        createdBy: "John Doe",
        duration: "00:30",
        status: "successful"
    },
    {
        id: 2,
        name: "City timelapse",
        prompt: "Generate a dynamic timelapse of a bustling city from day to night",
        thumbnail: "/api/placeholder/320/180",
        createdAt: "2024-02-19T10:15:00",
        createdBy: "Jane Smith",
        duration: "00:45",
        status: "processing"
    },
    {
        id: 3,
        name: "Mountain landscape",
        prompt: "Create a scenic mountain view with snow peaks",
        thumbnail: "/api/placeholder/320/180",
        createdAt: "2024-02-18T09:20:00",
        createdBy: "Mike Johnson",
        duration: "00:20",
        status: "failed"
    }
];

const videoStatus = ['failed', 'successful', 'processing']

const StatusIndicator = ({ status }) => {
    const getStatusInfo = () => {
        switch (status) {
            case 'successful':
                return {
                    icon: <CheckCircle className="status-icon success" />,
                    label: 'Successful',
                    className: 'status-badge success'
                };
            case 'processing':
                return {
                    icon: <Loader2 className="status-icon processing spin" />,
                    label: 'Processing',
                    className: 'status-badge processing'
                };
            case 'failed':
                return {
                    icon: <XCircle className="status-icon failed" />,
                    label: 'Failed',
                    className: 'status-badge failed'
                };
            default:
                return {
                    icon: null,
                    label: status,
                    className: 'status-badge'
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className={statusInfo.className}>
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
        </div>
    );
};

const PreviousUploads = (props) => {
    const { fetchPreviousUploads, previousUploads, userLogout } = props;

    const navigate = useNavigate();
    // const [selectedVideo, setSelectedVideo] = useState(null);

    // if (selectedVideo) {
    //     return <VideoDetail video={selectedVideo} onBack={() => setSelectedVideo(null)} />;
    // }

    const onClickUploadDetails = (videoId) => {
        navigate(`/upload/${videoId}`)
    }

    const onClickLogout = () => {
        userLogout({ navigate });
    }

    useEffect(() => {
        fetchPreviousUploads();
    }, []);

    return (
        <div className="app-container">
            <div className="glass-header">
                <div className="header-content">
                    <h1>Previous Videos</h1>
                    <button onClick={onClickLogout} className="icon-button logout-btn">
                        <LogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <main className="video-grid-container">
                {mockVideos.map((video) => (
                    <div
                        key={video.id}
                        className="video-card"
                        onClick={() => onClickUploadDetails(video.id)}
                    // onClick={() => setSelectedVideo(video)}
                    >
                        <div className="thumbnail-container">
                            <img
                                src={video.thumbnail}
                                alt={video.name}
                                className="video-thumbnail"
                            />
                            <span className="duration">{video.duration}</span>
                            <div className="status-container">
                                <StatusIndicator status={video.status} />
                            </div>
                        </div>
                        <div className="video-info">
                            <h3 className="video-title">{video.name}</h3>
                            <div className="video-metadata">
                                <div className="metadata-item">
                                    <Calendar className="icon" />
                                    <span>{formatDate(video.createdAt)}</span>
                                </div>
                                <div className="metadata-item">
                                    <User className="icon" />
                                    <span>{video.createdBy}</span>
                                </div>
                            </div>
                            <div className="view-details">
                                View Details <ChevronRight className="icon" />
                            </div>
                        </div>
                    </div>
                ))}
                {previousUploads.map((video) => (
                    <div
                        key={video.id}
                        className="video-card"
                        onClick={video.status !== 2 ? () => onClickUploadDetails(video.id) : null}
                    // onClick={() => setSelectedVideo(video)}
                    >
                        <div className="thumbnail-container">
                            <img
                                src={video.thumbnail}
                                // alt={video.name}
                                className="video-thumbnail"
                            />
                            {/* <span className="duration">{video.duration}</span> */}
                            <div className="status-container">
                                <StatusIndicator status={videoStatus[video.status]} />
                            </div>
                        </div>
                        <div className="video-info">
                            <h3 className="video-title">{video.name ? video.name : `Video ${video.id}`}</h3>
                            <div className="video-metadata">
                                <div className="metadata-item">
                                    <Calendar className="icon" />
                                    <span>{formatDate(video.createdAt)}</span>
                                </div>
                                <div className="metadata-item">
                                    <User className="icon" />
                                    <span>{video.updatedBy}</span>
                                </div>
                            </div>
                            <div className="view-details">
                                View Details <ChevronRight className="icon" />
                            </div>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

PreviousUploads.propTypes = {
    fetchPreviousUploads: PropTypes.func,
    previousUploads: PropTypes.array,
    userLogout: PropTypes.func
}

const mapStateToProps = createStructuredSelector({
    previousUploads: getPreviousUploads()
});

const mapDispatchToProps = (dispatch) => ({
    fetchPreviousUploads: (data) => dispatch(fetchPreviousUploadsRequest(data)),
    userLogout: (data) => dispatch(userLogoutRequest(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(PreviousUploads);