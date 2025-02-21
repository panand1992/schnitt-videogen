/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ArrowLeft, Calendar, User, Clock, LogOut } from 'lucide-react';
import { formatDate } from "../utils/helper";
import { useNavigate, useParams } from "react-router-dom";

import './UploadDetails.scss';
import { getVideoDetails } from "../selectors/app";
import { fetchVideoDetails as fetchVideoDetailsRequest, userLogout as userLogoutRequest } from '../actions/app';

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

const UploadDetails = (props) => {
    const { uploadId } = useParams();
    const { fetchVideoDetails, videoDetails, userLogout } = props;
    const navigate = useNavigate();

    const [video, setVideo] = useState();

    useEffect(() => {
        const newVideo = mockVideos.find((mv) => mv.id == uploadId);
        if (!newVideo) {
            fetchVideoDetails({ videoId: uploadId });
        } else {
            setVideo({ ...newVideo });
        }
    }, []);

    useEffect(() => {
        if (videoDetails && videoDetails.id) {
            setVideo({ ...videoDetails });
        }
    }, [videoDetails])

    const onBack = () => {
        navigate('/upload/all');
    }

    const onClickLogout = () => {
        userLogout({ navigate });
    }

    return (
        <div className="app-container">
            {
                video ? (
                    <>
                        <div className="glass-header">
                            <div className="header-content">
                                <button className="back-button" onClick={onBack}>
                                    <ArrowLeft /> Back to Videos
                                </button>
                                <h1>{video.name}</h1>
                                <button onClick={onClickLogout} className="icon-button logout-btn">
                                    <LogOut />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>

                        <main className="detail-container">
                            <div className="video-detail-card">
                                <div className="video-player">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.name}
                                        className="video-preview"
                                    />
                                </div>

                                <div className="detail-info">
                                    <div className="detail-header">
                                        <h2>{video.name}</h2>
                                        <div className="detail-metadata">
                                            <div className="metadata-item">
                                                <Calendar className="icon" />
                                                <span>Created on {formatDate(video.createdAt)}</span>
                                            </div>
                                            <div className="metadata-item">
                                                <User className="icon" />
                                                <span>Created by {video.updatedBy}</span>
                                            </div>
                                            <div className="metadata-item">
                                                <Clock className="icon" />
                                                <span>Duration: 10s</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prompt-section">
                                        <h3>Generation Prompt</h3>
                                        <p className="prompt-text">{video.prompt}</p>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </>
                ) : <></>
            }
        </div>
    );
};

UploadDetails.propTypes = {
    fetchVideoDetails: PropTypes.func,
    videoDetails: PropTypes.array,
    userLogout: PropTypes.func
}

const mapStateToProps = createStructuredSelector({
    videoDetails: getVideoDetails()
});

const mapDispatchToProps = (dispatch) => ({
    fetchVideoDetails: (data) => dispatch(fetchVideoDetailsRequest(data)),
    userLogout: (data) => dispatch(userLogoutRequest(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadDetails);
