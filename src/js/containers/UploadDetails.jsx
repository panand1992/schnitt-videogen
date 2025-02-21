/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { formatDate } from "../utils/helper";
import { useNavigate, useParams } from "react-router-dom";

import './UploadDetails.scss';

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

const UploadDetails = () => {
    const { uploadId } = useParams();
    const navigate = useNavigate();

    const [video, setVideo] = useState();

    useEffect(() => {
        const newVideo = mockVideos.find((mv) => mv.id == uploadId)
        setVideo({ ...newVideo });
    }, []);

    const onBack = () => {
        navigate('upload/all');
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
                                                <span>Created by {video.createdBy}</span>
                                            </div>
                                            <div className="metadata-item">
                                                <Clock className="icon" />
                                                <span>Duration: {video.duration}</span>
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

export default UploadDetails;
