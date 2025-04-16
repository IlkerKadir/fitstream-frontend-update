// src/components/streaming/AgoraStreamManager.jsx
import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { Mic, MicOff, Video, VideoOff, ScreenShare, Phone, Users } from 'lucide-react';

// Initialize Agora client
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

const AgoraStreamManager = ({
  streamData,
  isHost,
  onError,
  onUserJoined,
  onUserLeft
}) => {
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [screenTrack, setScreenTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenSharingEnabled, setScreenSharingEnabled] = useState(false);
  const localVideoRef = useRef(null);
  const [joinState, setJoinState] = useState('pending'); // pending, connected, error

  // Validate that we have required Agora credentials
  useEffect(() => {
    if (!streamData || !streamData.appId || !streamData.channelName || !streamData.token) {
      setJoinState('error');
      if (onError) onError('Missing Agora credentials. Please ensure the application is properly configured with Agora credentials.');
      return;
    }
  }, [streamData, onError]);

  // Initialize AgoraRTC client
  useEffect(() => {
    // Only set up if we have valid stream data
    if (!streamData || !streamData.appId) return;

    // Set up event listeners for the Agora client
    client.on('user-published', async (user, mediaType) => {
      // Subscribe to the remote user when a new user publishes audio/video
      await client.subscribe(user, mediaType);

      if (mediaType === 'video') {
        // Add the new user to our remoteUsers state
        setRemoteUsers(prevUsers => {
          // Check if user already exists
          if (prevUsers.find(u => u.uid === user.uid)) {
            return prevUsers.map(u => {
              if (u.uid === user.uid) {
                return { ...u, videoTrack: user.videoTrack };
              }
              return u;
            });
          }
          return [...prevUsers, user];
        });

        // Play the video
        user.videoTrack?.play(`remote-video-${user.uid}`);
      }

      if (mediaType === 'audio') {
        // Update the user with audio track
        setRemoteUsers(prevUsers => {
          if (prevUsers.find(u => u.uid === user.uid)) {
            return prevUsers.map(u => {
              if (u.uid === user.uid) {
                return { ...u, audioTrack: user.audioTrack };
              }
              return u;
            });
          }
          return [...prevUsers, user];
        });

        // Play the audio
        user.audioTrack?.play();
      }

      // Callback when a user joins
      if (onUserJoined) {
        onUserJoined(user, mediaType);
      }
    });

    client.on('user-unpublished', (user, mediaType) => {
      // Handle user unpublishing stream
      if (mediaType === 'video') {
        setRemoteUsers(prevUsers =>
          prevUsers.map(u => {
            if (u.uid === user.uid) {
              return { ...u, videoTrack: undefined };
            }
            return u;
          })
        );
      }
      if (mediaType === 'audio') {
        setRemoteUsers(prevUsers =>
          prevUsers.map(u => {
            if (u.uid === user.uid) {
              return { ...u, audioTrack: undefined };
            }
            return u;
          })
        );
      }
    });

    client.on('user-left', (user) => {
      // Remove the user from remoteUsers
      setRemoteUsers(prevUsers =>
        prevUsers.filter(u => u.uid !== user.uid)
      );

      // Callback when a user leaves
      if (onUserLeft) {
        onUserLeft(user);
      }
    });

    // Clean up on component unmount
    return () => {
      // Clean up our event listeners
      client.removeAllListeners();
    };
  }, [onUserJoined, onUserLeft, streamData]);

  // Join the Agora channel with the provided token and channel name
  useEffect(() => {
    // Skip if we don't have valid stream data
    if (!streamData || !streamData.appId || !streamData.channelName || !streamData.token) {
      return;
    }

    // Keep track of whether the component is mounted
    let isMounted = true;

    const joinChannel = async () => {
      try {
        // Join the channel
        await client.join(
          streamData.appId,
          streamData.channelName,
          streamData.token,
          streamData.uid || null
        );

        // Only proceed if the component is still mounted
        if (!isMounted) return;

        // If user is host, create and publish local tracks
        if (isHost) {
          try {
            const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

            // Only proceed if the component is still mounted
            if (!isMounted) {
              // Clean up tracks if component unmounted during creation
              audioTrack.close();
              videoTrack.close();
              return;
            }

            setLocalAudioTrack(audioTrack);
            setLocalVideoTrack(videoTrack);

            // Display local video
            if (localVideoRef.current) {
              videoTrack.play(localVideoRef.current);
            }

            // Publish tracks to the channel
            await client.publish([audioTrack, videoTrack]);
          } catch (mediaError) {
            console.error('Error creating media tracks:', mediaError);
            if (onError) onError(`Failed to access camera/microphone: ${mediaError.message}`);
          }
        }

        setJoinState('connected');
      } catch (error) {
        console.error('Error joining Agora channel:', error);
        // Don't set error state if the error is about canceled operation (component unmounting)
        if (isMounted && !(error.message && error.message.includes('OPERATION_ABORTED'))) {
          setJoinState('error');
          if (onError) onError(`Failed to join stream: ${error.message}`);
        }
      }
    };

    joinChannel();

    // Clean up when component unmounts or streamData changes
    return async () => {
      isMounted = false;

      // Stop and close all local tracks
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }
      if (screenTrack) {
        screenTrack.stop();
        screenTrack.close();
      }

      // Leave the channel
      try {
        await client.leave();
      } catch (error) {
        console.error('Error leaving channel:', error);
      }
    };
  }, [streamData, isHost, onError]);

  // Toggle local audio
  const toggleAudio = async () => {
    if (localAudioTrack) {
      if (audioEnabled) {
        await localAudioTrack.setEnabled(false);
      } else {
        await localAudioTrack.setEnabled(true);
      }
      setAudioEnabled(!audioEnabled);
    }
  };

  // Toggle local video
  const toggleVideo = async () => {
    if (localVideoTrack) {
      if (videoEnabled) {
        await localVideoTrack.setEnabled(false);
      } else {
        await localVideoTrack.setEnabled(true);
      }
      setVideoEnabled(!videoEnabled);
    }
  };

  // Toggle screen sharing
  const toggleScreenSharing = async () => {
    if (screenSharingEnabled) {
      // Stop screen sharing
      if (screenTrack) {
        // Unpublish screen track
        await client.unpublish(screenTrack);

        // Stop and close screen track
        screenTrack.stop();
        screenTrack.close();
        setScreenTrack(null);

        // Republish video track if it exists
        if (localVideoTrack && videoEnabled) {
          await client.publish(localVideoTrack);
        }
      }
    } else {
      try {
        // Create screen track
        const screenVideoTrack = await AgoraRTC.createScreenVideoTrack();

        // Unpublish local video track if it exists
        if (localVideoTrack) {
          await client.unpublish(localVideoTrack);
        }

        // Publish screen track
        await client.publish(screenVideoTrack);

        // Store screen track
        setScreenTrack(screenVideoTrack);
      } catch (error) {
        console.error('Error sharing screen:', error);
        return; // Don't update state if there was an error
      }
    }

    setScreenSharingEnabled(!screenSharingEnabled);
  };

  // Leave the channel
  const leaveChannel = async () => {
    // Stop and close all local tracks
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    if (screenTrack) {
      screenTrack.stop();
      screenTrack.close();
    }

    // Leave the channel
    try {
      await client.leave();

      // Reset state
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      setScreenTrack(null);
      setRemoteUsers([]);
      setJoinState('pending');
    } catch (error) {
      console.error('Error leaving channel:', error);
    }
  };

  const getMissingCredentialsMessage = () => {
    // Determine which credentials are missing
    const missingItems = [];
    if (!streamData) missingItems.push("Stream configuration");
    else {
      if (!streamData.appId) missingItems.push("Agora App ID");
      if (!streamData.channelName) missingItems.push("Channel name");
      if (!streamData.token) missingItems.push("Access token");
    }

    return `Missing: ${missingItems.join(", ")}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Video Display Area */}
      <div className="flex-grow relative bg-black">
        {/* Loading state */}
        {joinState === 'pending' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
            <div className="text-white flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
              <p>Connecting to stream...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {joinState === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
            <div className="text-white flex flex-col items-center max-w-lg text-center p-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mb-4">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p className="mb-4">Failed to connect to stream</p>
              <p className="text-gray-400 text-sm mb-6">{getMissingCredentialsMessage()}</p>
              <div className="text-gray-300 text-sm mb-6">
                <p>This application requires Agora credentials to enable live streaming.</p>
                <p>Please set up Agora in your environment configuration.</p>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Remote Users */}
        {remoteUsers.length > 0 ? (
          <div className="h-full w-full">
            {/* Main Video (first remote user with video) */}
            {remoteUsers.some(user => user.videoTrack) ? (
              <div className="h-full w-full relative">
                <div id={`remote-video-${remoteUsers.find(user => user.videoTrack)?.uid}`} className="h-full w-full"></div>
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-900">
                <div className="text-white text-center">
                  <VideoOff size={64} className="mx-auto mb-4" />
                  <p className="text-xl">No video available</p>
                </div>
              </div>
            )}

            {/* Smaller videos for additional users */}
            {remoteUsers.length > 1 && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {remoteUsers.slice(0, 3).map((user, index) => (
                  <div key={user.uid} className="w-32 h-24 bg-gray-800 rounded overflow-hidden">
                    {user.videoTrack ? (
                      <div id={`remote-video-small-${user.uid}`} className="w-full h-full"></div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <VideoOff size={24} />
                      </div>
                    )}
                  </div>
                ))}
                {remoteUsers.length > 3 && (
                  <div className="w-32 h-24 bg-gray-800 rounded overflow-hidden flex items-center justify-center text-white">
                    +{remoteUsers.length - 3} more
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-900">
            <div className="text-white text-center">
              <Users size={64} className="mx-auto mb-4" />
              <p className="text-xl">Waiting for participants to join...</p>
            </div>
          </div>
        )}

        {/* Local Video (if host) */}
        {isHost && (
          <div className="absolute bottom-4 left-4 w-48 h-36 bg-gray-900 rounded overflow-hidden">
            {videoEnabled ? (
              <div ref={localVideoRef} className="w-full h-full"></div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <VideoOff size={32} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      {isHost && (
        <div className="bg-gray-900 p-4 flex justify-center space-x-4">
          <button
            onClick={toggleAudio}
            className={`rounded-full p-3 ${audioEnabled ? 'bg-indigo-600' : 'bg-red-600'}`}
          >
            {audioEnabled ? <Mic size={24} className="text-white" /> : <MicOff size={24} className="text-white" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`rounded-full p-3 ${videoEnabled ? 'bg-indigo-600' : 'bg-red-600'}`}
          >
            {videoEnabled ? <Video size={24} className="text-white" /> : <VideoOff size={24} className="text-white" />}
          </button>

          <button
            onClick={toggleScreenSharing}
            className={`rounded-full p-3 ${screenSharingEnabled ? 'bg-indigo-600' : 'bg-gray-700'}`}
          >
            <ScreenShare size={24} className="text-white" />
          </button>

          <button
            onClick={leaveChannel}
            className="rounded-full p-3 bg-red-600"
          >
            <Phone size={24} className="text-white transform rotate-135" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AgoraStreamManager;
