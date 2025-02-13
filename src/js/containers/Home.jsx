// import React from 'react';

import videoGenData from '../constants/promptDataFinal.json';
// import { Link } from 'react-router-dom';

// const Home = () => {
//     return (
//         <div style={{ width: '100vw', height: '100vh' }}>
//             <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, width: '100%', background: 'radial-gradient(rgba(10, 10, 10, 0.8), rgba(0, 0, 0, 0.95))', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 0px 30px inset', backdropFilter: 'blur(4px)' }}>
//                 {
//                     videoGenData.map((vgd, i) => (
//                         <Link to={`vg-details/${i}`} key={i} style={{ backgroundColor: 'rgb(40, 40, 40)', borderRadius: 8, boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 8px', padding: 16, color: 'white', cursor: 'pointer', transition: 'transform 0.3s', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
//                             <h2 style={{ fontSize: 18, marginBottom: 4 }}>{vgd.promptCode}</h2>
//                             <p className='ellipsis-text'>Prompt: {vgd.prompt}</p>
//                             <p style={{ fontSize: 12, color: 'rgb(160, 160, 160)' }}>Scenes: 2</p>
//                         </Link>
//                     ))
//                 }
//             </div>
//         </div>
//     )
// }

// export default Home;
import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import styled, { keyframes } from "styled-components";

/**
 * SINGLE-FILE DEMO:
 * 1) Now we have 10 videos, shown 5 across in the overview grid.
 * 2) Bridging scenes also have a refresh button (like "Refresh bridging").
 *
 * Retains:
 * - No upload button
 * - Subprompts for normal & bridging scenes
 * - Draggable normal scenes; bridging not draggable
 * - "Invisible" timeline UI
 */

// -------------------------
// parsePromptToSubprompts
// -------------------------
function parsePromptToSubprompts(mainPrompt) {
    if (!mainPrompt) return [];
    return mainPrompt
        .split(/[.?!]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}

// -------------------------
// Keyframes
// -------------------------
const pulse = keyframes`
  0% {
    box-shadow: 0 0 6px rgba(255,255,255,0.1);
  }
  50% {
    box-shadow: 0 0 12px rgba(255,255,255,0.3);
  }
  100% {
    box-shadow: 0 0 6px rgba(255,255,255,0.1);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// -------------------------
// Styled Components
// -------------------------
const Container = styled.div`
  font-family: "SF Pro Display", "Inter", "Helvetica Neue", sans-serif;
  color: rgb(235,235,235);
  width: 100vw;
  height: 100vh;
  background: linear-gradient(145deg, rgb(50,50,50), rgb(10,10,10));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

const TopBarContainer = styled.div`
  position: relative;
  width: 100%;
  &:hover .hover-controls {
    opacity: 1;
    pointer-events: auto;
    animation: ${fadeIn} 0.3s ease forwards;
  }
`;

const HiddenControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: rgba(30,30,50,0.5);
  backdrop-filter: blur(8px);
  box-shadow: 0 0 12px rgba(0,0,0,0.4);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
`;

function getSceneBlockBackground(scene, isSelected) {
    if (scene.bridging) {
        // bridging color is pinkish
        return isSelected
            ? "linear-gradient(to right, rgb(255,128,128), rgb(220,80,80))"
            : "linear-gradient(to right, rgb(200,80,80), rgb(160,60,60))";
    }
    // normal scene color
    return isSelected
        ? "linear-gradient(to right, rgb(120,120,255), rgb(90,90,200))"
        : "linear-gradient(to right, rgb(80,80,80), rgb(50,50,50))";
}

const TimelineWrapper = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  position: relative;
`;

const TimelineTrack = styled.div`
  position: relative;
  width: ${({ trackWidth }) => trackWidth}px;
  height: 110px;
  background: linear-gradient(to right, rgb(60,60,80), rgb(30,30,40));
  border-radius: 12px;
  overflow: hidden;
  box-sizing: border-box;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
`;

const TimelineBlock = styled.div`
  position: absolute;
  top: 25px;
  bottom: 25px;
  left: ${({ left }) => left}px;
  right: ${({ right }) => right}px;
  background: ${({ scene, isSelected }) =>
        getSceneBlockBackground(scene, isSelected)};
  border: ${({ isSelected }) =>
        isSelected ? "2px solid rgb(255,255,255)" : "1px solid rgb(100,100,100)"};
  border-radius: 8px;
  box-sizing: border-box;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    animation: ${pulse} 1.5s infinite;
  }
`;

const ResizeHandle = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: col-resize;
  &:hover {
    background: rgb(120,120,120);
  }
`;

const PlayheadLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: rgb(255,0,0);
  left: ${({ left }) => left}px;
  pointer-events: none;
`;

const PhoneContainer = styled.div`
  width: 370px;
  height: 700px;
  background: ${({ bridging, isSelected }) =>
        bridging
            ? isSelected
                ? "linear-gradient(to bottom right, rgb(200,70,70), rgb(160,30,30))"
                : "linear-gradient(to bottom right, rgb(160,60,60), rgb(120,30,30))"
            : "linear-gradient(to bottom right, rgb(40,40,50), rgb(10,10,10))"};
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: ${({ isSelected }) =>
        isSelected
            ? "0 0 24px rgba(255,255,255,0.5)"
            : "0 0 12px rgba(0,0,0,0.7)"};
  flex-shrink: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s, box-shadow 0.3s;
  transform: ${({ isSelected }) => (isSelected ? "scale(1.04)" : "scale(1)")};

  &:hover {
    animation: ${pulse} 2s infinite;
  }
`;

const PhoneLabel = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  color: rgb(255,255,255);
  font-size: 18px;
  font-weight: 600;
`;

/** SHIFT subprompts down so label is visible */
const PhoneContent = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  color: rgb(180,180,180);
  padding: 20px;
  font-size: 15px;
  line-height: 1.4;
  gap: 8px;
  margin-top: 50px;
`;

const SubPromptVertical = styled.div`
  position: relative;
  width: 100%;
  height: 240px;
  margin-bottom: 12px;
  background: linear-gradient(to bottom right, rgb(60,60,70), rgb(30,30,30));
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 6px rgba(0,0,0,0.5);
  overflow: hidden;
`;

const SubPromptHeader = styled.div`
  position: absolute;
  top: 8px;
  left: 12px;
  right: 12px;
  color: rgb(255,255,255);
  font-size: 14px;
  font-weight: 500;
`;

const SubPromptImagePlaceholder = styled.div`
  flex: 1;
`;

const SubPromptFooter = styled.div`
  background: rgba(0,0,0,0.4);
  padding: 6px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const SubPromptButton = styled.button`
  background: linear-gradient(to bottom right, rgb(150,50,50), rgb(120,30,30));
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 13px;
  margin-left: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;

const PhoneTimeLabel = styled.div`
  position: absolute;
  bottom: 60px;
  left: 16px;
  color: rgb(255,255,255);
  font-size: 14px;
`;

const PhoneButtonGroup = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  gap: 16px;
`;

const PhoneButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.2);
  }
`;

/** Minimal bottom bar (invisible) */
const BottomBar = styled.div`
  background: rgba(40,40,40,0.0);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 100%;
  position: relative;
  height: 0; /* hidden bottom bar */
`;

// -------------------------
// PhonePreview
// bridging scenes => label "Transition from X to Y", bridging-level refresh
// -------------------------
const PhonePreview = ({
    scene,
    isSelected,
    onClickPhone,
    onAddScene,
    onDeleteScene
}) => {
    const bridging = !!scene.bridging;
    const [localSubs, setLocalSubs] = useState(scene.subPrompts || []);

    useEffect(() => {
        setLocalSubs(scene.subPrompts || []);
    }, [scene.subPrompts]);

    function refreshSubPrompt(idx) {
        const sp = localSubs[idx];
        alert(`AI re-generating frames for "${sp.text}"`);
    }

    function handleGenerate(idx) {
        alert(`Generating/Regenerating image for subprompt #${idx + 1}...`);
    }

    /** bridging => refresh bridging | normal => regenerate entire scene */
    function handleRegenerateScene(e) {
        e.stopPropagation();
        if (bridging) {
            alert(`Refresh bridging scene #${scene.id}?`);
        } else {
            alert(`Regenerate entire scene #${scene.id}?`);
        }
    }

    // bridging label
    const phoneLabel = bridging
        ? `Transition from Scene ${scene.fromId} to Scene ${scene.toId}`
        : `Scene ${scene.id}`;

    return (
        <PhoneContainer
            isSelected={isSelected}
            bridging={bridging}
            onClick={onClickPhone}
        >
            <PhoneLabel>{phoneLabel}</PhoneLabel>

            <PhoneContent>
                {bridging ? (
                    // bridging with 2 subprompts => last of prev + first of next
                    localSubs.length >= 2 ? (
                        <>
                            {localSubs.map((sp, idx) => (
                                <SubPromptVertical key={idx}>
                                    <SubPromptHeader>
                                        {sp.text || `Bridging subprompt #${idx + 1}`}
                                    </SubPromptHeader>
                                    <SubPromptImagePlaceholder />
                                    <SubPromptFooter>
                                        <SubPromptButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                refreshSubPrompt(idx);
                                            }}
                                        >
                                            Refresh
                                        </SubPromptButton>
                                        <SubPromptButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleGenerate(idx);
                                            }}
                                        >
                                            Generate
                                        </SubPromptButton>
                                    </SubPromptFooter>
                                </SubPromptVertical>
                            ))}
                        </>
                    ) : (
                        <div
                            style={{
                                fontStyle: "italic",
                                color: "rgb(255,220,220)",
                                textAlign: "center"
                            }}
                        >
                            This bridging scene uses the last image from the previous scene
                            and the first image from the next scene.
                        </div>
                    )
                ) : localSubs.length > 0 ? (
                    // normal scene with subprompts
                    <>
                        {localSubs.map((sp, idx) => (
                            <SubPromptVertical key={idx}>
                                <SubPromptHeader>
                                    {sp.text || `Subprompt #${idx + 1}`}
                                </SubPromptHeader>
                                <SubPromptImagePlaceholder />
                                <SubPromptFooter>
                                    <SubPromptButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            refreshSubPrompt(idx);
                                        }}
                                    >
                                        Refresh
                                    </SubPromptButton>
                                    <SubPromptButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleGenerate(idx);
                                        }}
                                    >
                                        Generate
                                    </SubPromptButton>
                                </SubPromptFooter>
                            </SubPromptVertical>
                        ))}
                    </>
                ) : (
                    // normal fallback if no subprompts
                    <>
                        {scene.media ? (
                            <video
                                src={
                                    scene.media instanceof File
                                        ? URL.createObjectURL(scene.media)
                                        : null
                                }
                                controls
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    borderRadius: "12px"
                                }}
                            />
                        ) : (
                            <span>
                                {scene.prompt || "Describe this scene"}
                                <br /> or add an image or video
                            </span>
                        )}
                    </>
                )}
            </PhoneContent>

            {/* time label if not bridging */}
            {!bridging && (
                <PhoneTimeLabel>Start: {scene.start?.toFixed(2) ?? "0.00"}s</PhoneTimeLabel>
            )}

            <PhoneButtonGroup>
                {/* Add button */}
                <PhoneButton
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddScene();
                    }}
                >
                    <svg fill="rgb(255,255,255)" width="24px" height="24px" viewBox="0 0 24 24">
                        <path d="M19 11h-6V5c0-0.6-0.4-1-1-1s-1 .4-1 1v6H5c-0.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1v-6h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                </PhoneButton>

                {/* Delete button */}
                <PhoneButton
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteScene();
                    }}
                >
                    <svg fill="rgb(255,255,255)" width="24px" height="24px" viewBox="0 0 24 24">
                        <path d="M9 3c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v1h5c.6 0 1 .4 1 1s-.4 1-1 1h-1v14c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6H3c-.6 0-1-.4-1-1s.4-1 1-1h5V3zm1 1v1h4V4h-4zm8 3H6v14h12V7z" />
                    </svg>
                </PhoneButton>

                {/* bridging => refresh bridging, else normal regen */}
                <PhoneButton onClick={handleRegenerateScene}>
                    <svg fill="rgb(255,255,255)" width="24px" height="24px" viewBox="0 0 24 24">
                        <path d="M12 4V1L8 5l4 4V6c3.3 0 6 2.7 6 6 0 1-.3 1.9-.8 2.7l1.5 1.5c.8-1.2 1.3-2.7 1.3-4.2 0-4.4-3.6-8-8-8zm-6.8 7.3C5.3 10.1 5 9.2 5 8.3c0-1.7.7-3.2 1.8-4.3L5.3 2.5C3.9 3.9 3 5.8 3 7.7c0 1.5.5 3 1.3 4.2l1.5-1.6zm6.8 7v3l4-4-4-4v3c-3.3 0-6-2.7-6-6 0-1 .3-1.9.8-2.7l-1.5-1.5C5.4 7 5 8.3 5 9.7c0 4.4 3.6 8 8 8z" />
                    </svg>
                </PhoneButton>
            </PhoneButtonGroup>
        </PhoneContainer>
    );
};

// Memoize the phone for perf
const MemoizedPhonePreview = memo(PhonePreview);

/** Minimal bottom bar (Invisible) */
function BottomControlBar() {
    return null;
}
const MemoizedBottomControlBar = memo(BottomControlBar);

/**
 * FinalAdvancedStoryboard:
 * Bridging scenes auto inserted.
 */
function FinalAdvancedStoryboard({
    scenes,
    setScenes,
    selectedSceneId,
    setSelectedSceneId,
    timelineLength,
    setTimelineLength,
    zoom,
    setZoom
}) {
    const [draggingInfo, setDraggingInfo] = useState(null);
    const [playheadTime, setPlayheadTime] = useState(0);
    const [draggingPlayhead, setDraggingPlayhead] = useState(false);
    const trackRef = useRef(null);

    const baseTrackWidth = 600;
    const trackWidth = baseTrackWidth * zoom;

    const secondsToPixels = useCallback(
        (sec) => (sec / timelineLength) * trackWidth,
        [timelineLength, trackWidth]
    );
    const pixelsToSeconds = useCallback(
        (px) => (px / trackWidth) * timelineLength,
        [timelineLength, trackWidth]
    );

    const handleStartDrag = useCallback(
        (e, scene, mode, edge) => {
            e.stopPropagation();
            setSelectedSceneId(scene.id);
            setDraggingInfo({
                type: mode,
                sceneId: scene.id,
                edge,
                startX: e.clientX,
                originalStart: scene.start,
                originalEnd: scene.end
            });
        },
        [setSelectedSceneId]
    );

    useEffect(() => {
        function onMouseMove(e) {
            if (!draggingInfo) return;
            const { type, sceneId, startX, originalStart, originalEnd, edge } =
                draggingInfo;
            const deltaPx = e.clientX - startX;
            const deltaSec = pixelsToSeconds(deltaPx);

            setScenes((prev) =>
                prev.map((s) => {
                    if (s.id !== sceneId) return s;
                    if (s.bridging) return s; // bridging not draggable

                    if (type === "move") {
                        let newStart = originalStart + deltaSec;
                        let newEnd = originalEnd + deltaSec;
                        if (newStart < 0) {
                            const diff = -newStart;
                            newStart = 0;
                            newEnd += diff;
                        }
                        if (newEnd > timelineLength) {
                            const diff = newEnd - timelineLength;
                            newEnd = timelineLength;
                            newStart -= diff;
                        }
                        return {
                            ...s,
                            start: newStart,
                            end: newEnd
                        };
                    } else if (type === "resize") {
                        if (edge === "left") {
                            let newStart = originalStart + deltaSec;
                            if (newStart < 0) newStart = 0;
                            if (newStart > originalEnd) newStart = originalEnd - 0.1;
                            return {
                                ...s,
                                start: newStart
                            };
                        } else {
                            let newEnd = originalEnd + deltaSec;
                            if (newEnd > timelineLength) newEnd = timelineLength;
                            if (newEnd < originalStart) newEnd = originalStart + 0.1;
                            return {
                                ...s,
                                end: newEnd
                            };
                        }
                    }
                    return s;
                })
            );
        }
        function onMouseUp() {
            if (draggingInfo) setDraggingInfo(null);
        }
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [draggingInfo, pixelsToSeconds, timelineLength, setScenes]);

    const onTrackMouseDown = useCallback(
        (e) => {
            if (e.target === trackRef.current) {
                const rect = trackRef.current.getBoundingClientRect();
                let x = e.clientX - rect.left;
                x = Math.max(0, Math.min(x, trackWidth));
                const newTime = (x / trackWidth) * timelineLength;
                setPlayheadTime(newTime);
                setDraggingPlayhead(true);
            }
        },
        [timelineLength, trackWidth]
    );

    useEffect(() => {
        function move(e) {
            if (!draggingPlayhead) return;
            if (!trackRef.current) return;
            const rect = trackRef.current.getBoundingClientRect();
            let x = e.clientX - rect.left;
            x = Math.max(0, Math.min(x, trackWidth));
            const newTime = (x / trackWidth) * timelineLength;
            setPlayheadTime(newTime);
        }
        function up() {
            setDraggingPlayhead(false);
        }
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };
    }, [draggingPlayhead, timelineLength, trackWidth]);

    // bridging scenes => last subprompt of prev & first subprompt of next
    function makeBridgingScene(prevScene, nextScene, index) {
        let prevLast = "(no subprompts in prev)";
        if (prevScene.subPrompts && prevScene.subPrompts.length > 0) {
            prevLast =
                prevScene.subPrompts[prevScene.subPrompts.length - 1].text || "";
        }
        let nextFirst = "(no subprompts in next)";
        if (nextScene.subPrompts && nextScene.subPrompts.length > 0) {
            nextFirst = nextScene.subPrompts[0].text || "";
        }
        return {
            id: 9000 + index,
            bridging: true,
            prompt: "TRANSITION",
            fromId: prevScene.id,
            toId: nextScene.id,
            subPrompts: [
                { text: `From: ${prevLast}` },
                { text: `To: ${nextFirst}` }
            ],
            media: null,
            start: prevScene.end,
            end: nextScene.start
        };
    }

    const sorted = [...scenes].sort((a, b) => a.start - b.start);
    let finalArr = [];
    for (let i = 0; i < sorted.length; i++) {
        finalArr.push(sorted[i]);
        if (i < sorted.length - 1) {
            const bridgingScene = makeBridgingScene(sorted[i], sorted[i + 1], i);
            finalArr.push(bridgingScene);
        }
    }

    return (
        <Container>
            <TopBarContainer>
                <HiddenControls className="hover-controls">
                    <span style={{ color: "rgb(200,200,200)", fontSize: "12px" }}>
                        Invisible UI
                    </span>
                </HiddenControls>
            </TopBarContainer>

            {/* phone previews */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    padding: "20px",
                    gap: "20px",
                    overflowX: "auto",
                    width: "100%",
                    boxSizing: "border-box",
                    background: "radial-gradient(rgba(0,0,0,0.7), rgba(10,10,10,0.9))"
                }}
            >
                {finalArr.map((scene) => (
                    <MemoizedPhonePreview
                        key={scene.id}
                        scene={scene}
                        isSelected={scene.id === selectedSceneId}
                        onClickPhone={() => setSelectedSceneId(scene.id)}
                        onAddScene={() => {
                            const maxEnd = Math.max(...scenes.map((sc) => sc.end));
                            const newId = Math.max(...scenes.map((sc) => sc.id)) + 1;
                            setScenes((prev) => [
                                ...prev,
                                {
                                    id: newId,
                                    bridging: false,
                                    prompt: "New sub-scene",
                                    subPrompts: [
                                        { text: "Subprompt 1" },
                                        { text: "Subprompt 2" }
                                    ],
                                    media: null,
                                    start: maxEnd,
                                    end: maxEnd + 2
                                }
                            ]);
                        }}
                        onDeleteScene={() => {
                            setScenes((prev) => prev.filter((sc) => sc.id !== scene.id));
                        }}
                    />
                ))}
            </div>

            <TimelineWrapper>
                <TimelineTrack
                    trackWidth={trackWidth}
                    ref={trackRef}
                    onMouseDown={onTrackMouseDown}
                >
                    {finalArr.map((scene) => {
                        const isSelected = scene.id === selectedSceneId;
                        let leftPx = secondsToPixels(scene.start);
                        let rightPx = trackWidth - secondsToPixels(scene.end);
                        if (scene.start > scene.end) {
                            // bridging might have reversed times => clamp
                            rightPx = leftPx + 20;
                        }
                        return (
                            <TimelineBlock
                                key={scene.id}
                                scene={scene}
                                isSelected={isSelected}
                                left={leftPx}
                                right={rightPx}
                                onMouseDown={(e) => {
                                    if (scene.bridging) {
                                        e.stopPropagation(); // bridging not draggable
                                    } else {
                                        handleStartDrag(e, scene, "move");
                                    }
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "2px",
                                        left: "4px",
                                        color: "rgb(255,255,255)",
                                        fontSize: "13px",
                                        fontWeight: 500
                                    }}
                                >
                                    {scene.bridging
                                        ? `Transition from Scene ${scene.fromId} to Scene ${scene.toId}`
                                        : `Scene ${scene.id}`}
                                </div>
                                {!scene.bridging && (
                                    <>
                                        <ResizeHandle
                                            style={{ left: 0 }}
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                                handleStartDrag(e, scene, "resize", "left");
                                            }}
                                        />
                                        <ResizeHandle
                                            style={{ right: 0 }}
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                                handleStartDrag(e, scene, "resize", "right");
                                            }}
                                        />
                                    </>
                                )}
                            </TimelineBlock>
                        );
                    })}
                    <PlayheadLine left={secondsToPixels(playheadTime)} />
                </TimelineTrack>
            </TimelineWrapper>

            <BottomBar />
        </Container>
    );
}

// DetailedVideoView with advanced timeline
function DetailedVideoView({ video, onBack }) {
    const [scenes, setScenes] = useState(
        video.scenes.map((sc, idx) => ({
            ...sc,
            bridging: false,
            subPrompts: sc.subPrompts || [
                { text: `Subprompt #1 (Scene ${idx + 1})` },
                { text: `Subprompt #2 (Scene ${idx + 1})` }
            ]
        }))
    );

    const [timelineLength] = useState(20);
    const [zoom] = useState(1.0);
    const [selectedSceneId, setSelectedSceneId] = useState(null);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "rgb(15,15,20)"
            }}
        >
            <div style={{ backgroundColor: "rgb(40,40,40)", padding: "8px" }}>
                <button
                    style={{
                        backgroundColor: "rgb(60,60,60)",
                        color: "white",
                        borderRadius: "6px",
                        border: "none",
                        padding: "6px 12px",
                        cursor: "pointer",
                        marginRight: "20px"
                    }}
                    onClick={onBack}
                >
                    Back to Overview
                </button>
                <span style={{ marginLeft: "20px", color: "white" }}>
                    Video {video.id}
                </span>
            </div>

            <FinalAdvancedStoryboard
                scenes={scenes}
                setScenes={setScenes}
                selectedSceneId={selectedSceneId}
                setSelectedSceneId={setSelectedSceneId}
                timelineLength={timelineLength}
                setTimelineLength={() => { }}
                zoom={zoom}
                setZoom={() => { }}
            />
        </div>
    );
}

// Overview => 10 videos, 5 across in the grid
function Overview({ videos, onSelectVideo }) {
    return (
        <div
            style={{
                padding: "20px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
                width: "100%",
                background: "radial-gradient(rgba(10,10,10,0.8), rgba(0,0,0,0.95))",
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)"
            }}
        >
            {videos.map((vid, i) => (
                <div
                    key={i}
                    style={{
                        backgroundColor: "rgb(40,40,40)",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                        padding: "16px",
                        color: "white",
                        cursor: "pointer",
                        transition: "transform 0.3s",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        alignItems: "flex-start"
                    }}
                    onClick={() => onSelectVideo(i)}
                >
                    <h2 style={{ fontSize: "18px", marginBottom: "4px" }}>
                        {vid.promptCode}
                    </h2>
                    <p className='ellipsis-text' style={{ fontSize: "14px", opacity: 0.9 }}>
                        Prompt: {vid.prompt}
                    </p>
                    <p style={{ fontSize: "12px", color: "rgb(160,160,160)" }}>
                        Scenes: {2}
                    </p>
                </div>
            ))}
        </div>
    );
}

// Main App => 10 videos with bridging logic, 5 per row
export default function App() {

    const [selectedVideoId, setSelectedVideoId] = useState(null);

    const selectedVideo = selectedVideoId
        ? videoGenData[selectedVideoId]
        : null;

    function handleSelectVideo(id) {
        setSelectedVideoId(id);
    }

    function handleBackToOverview() {
        setSelectedVideoId(null);
    }

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            {!selectedVideo && (
                <Overview videos={videoGenData} onSelectVideo={handleSelectVideo} />
            )}
            {selectedVideo && (
                <DetailedVideoView video={selectedVideo} onBack={handleBackToOverview} />
            )}
        </div>
    );
}

/**
 * Additional Test Cases:
 * 1) it('renders overview with multiple videos', ...)
 * 2) it('selecting video transitions to detail', ...)
 * 3) bridging scenes auto => subprompts are last + first
 * 4) bridging refresh + normal refresh
 * 5) invisible timeline
 * 6) etc...
 */
