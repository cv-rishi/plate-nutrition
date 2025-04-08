import React, { useState, useEffect, useRef, useCallback } from 'react';
// import axios from 'axios'; // Or use fetch

interface CameraDevice {
  id: string;
  label: string;
}

interface NutritionResult {
  // Define the structure of the data you expect from your backend
  foodItem: string;
  calories: number;
  protein: number;
  // ... other nutritional info
  confidenceScore: number;
  rating: number; // Star rating
}

const UserWebDashboard: React.FC = () => {
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Store as base64 data URL or blob URL
  const [results, setResults] = useState<NutritionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null); // null = unknown, true = granted, false = denied/unavailable
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // For capturing frame

  // --- Permission Handling ---
  const checkAndRequestPermissions = useCallback(async () => {
    setErrorMessage(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('Camera access is not supported by this browser.');
        setPermissionGranted(false);
        return;
    }
    try {
        // Check permission status first
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName }); // Cast needed for older TS versions
        if (permissionStatus.state === 'granted') {
            setPermissionGranted(true);
            loadDevices(); // Load devices if permission already granted
        } else if (permissionStatus.state === 'prompt') {
            setPermissionGranted(null); // Still need to ask
             // Optional: show a message explaining why you need camera before requesting
            requestCameraAccess(); // Or trigger this via a user action like a button press
        } else { // denied
            setErrorMessage('Camera permission was denied. Please enable it in your browser settings.');
            setPermissionGranted(false);
        }

        permissionStatus.onchange = () => {
             if(permissionStatus.state === 'granted') {
                setPermissionGranted(true);
                loadDevices();
             } else {
                setPermissionGranted(false);
                setErrorMessage('Camera permission status changed.');
                stopStream(); // Stop stream if permission revoked
             }
        }

    } catch (error) {
        console.error("Error checking/requesting permissions:", error);
        setErrorMessage('Error checking camera permissions.');
        setPermissionGranted(false);
    }
  }, []);

  const requestCameraAccess = async () => {
     try {
        // Requesting access here will trigger the prompt if state was 'prompt'
        await navigator.mediaDevices.getUserMedia({ video: true });
        setPermissionGranted(true);
        loadDevices(); // Load devices after getting permission
     } catch(error: any) {
        console.error("Error getting user media:", error);
         if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
           setErrorMessage('You denied camera access. Please enable it in browser settings.');
         } else {
           setErrorMessage(`Could not access camera: ${error.message}`);
         }
        setPermissionGranted(false);
     }
  }


  // --- Device Handling ---
  const loadDevices = useCallback(async () => {
    try {
        await navigator.mediaDevices.getUserMedia({ video: true }); // Ensure permission is active before enumerating
        const availableDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = availableDevices
            .filter(device => device.kind === 'videoinput')
            .map(device => ({ id: device.deviceId, label: device.label || `Camera ${devices.length + 1}` }));
        setDevices(videoDevices);
        if (videoDevices.length > 0 && !selectedDeviceId) {
            setSelectedDeviceId(videoDevices[0].id); // Select the first camera by default
        }
    } catch (error) {
        console.error("Error loading devices:", error);
        setErrorMessage('Could not load camera devices.');
        setPermissionGranted(false); // Likely permission issue
    }
  }, [selectedDeviceId]); // dependency added


  // --- Stream Handling ---
  const startStream = useCallback(async () => {
    if (stream) { // Stop previous stream if changing device
        stopStream();
    }
    if (selectedDeviceId && permissionGranted) {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: selectedDeviceId } }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error("Error starting stream:", error);
            setErrorMessage('Could not start camera stream.');
             setPermissionGranted(false); // Might be a permission issue again
        }
    }
  }, [selectedDeviceId, permissionGranted]); // Added stream to dependencies

  const stopStream = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
         if (videoRef.current) {
             videoRef.current.srcObject = null;
         }
    }
  };

  // --- Effects ---
  useEffect(() => {
    checkAndRequestPermissions(); // Check permissions on component mount
    // Cleanup function to stop stream when component unmounts
    return () => {
        stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount


  useEffect(() => {
    if (permissionGranted && selectedDeviceId) {
      startStream(); // Start stream when permission is granted and a device is selected
    } else {
        stopStream(); // Stop if permission lost or no device
    }
    // Include startStream in dependencies if needed, ensure useCallback covers its own deps
  }, [permissionGranted, selectedDeviceId, startStream]);

  // --- Capture & Upload ---
  const captureImage = () => {
    setResults(null); // Clear previous results
    setErrorMessage(null);
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            // Get image data (e.g., as base64 data URL)
            const imageDataUrl = canvas.toDataURL('image/jpeg'); // Or image/png
            setCapturedImage(imageDataUrl);
            // Send to backend
            uploadImage(imageDataUrl);
        }
    }
  };

  const uploadImage = async (imageDataUrl: string) => {
    setIsLoading(true);
    try {
        // Assuming your backend expects a POST request with JSON payload
        const response = await fetch('/api/analyze-food', { // Replace with your actual backend endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization header if needed:
                // 'Authorization': `Bearer ${your_jwt_token}`
            },
            body: JSON.stringify({ image: imageDataUrl }), // Send base64 string
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data: NutritionResult = await response.json();
        setResults(data);

    } catch (error: any) {
        console.error("Error uploading image:", error);
        setErrorMessage(`Failed to get analysis: ${error.message}`);
        setResults(null);
    } finally {
        setIsLoading(false);
    }
  };

  // --- Rendering ---
  return (
    <div>
      <h2>User Web Dashboard</h2>

      {errorMessage && <p style={{ color: 'red' }}>Error: {errorMessage}</p>}

      {!permissionGranted && permissionGranted !== null && (
         <button onClick={requestCameraAccess}>Grant Camera Permission</button>
      )}


      {permissionGranted && (
        <div>
           {/* Camera Selection Dropdown */}
           <label htmlFor="camera-select">Select Camera:</label>
           <select
             id="camera-select"
             value={selectedDeviceId ?? ''}
             onChange={(e) => setSelectedDeviceId(e.target.value)}
             disabled={devices.length === 0}
           >
             {devices.map(device => (
               <option key={device.id} value={device.id}>
                 {device.label}
               </option>
             ))}
           </select>

           {/* Video Preview */}
           <div style={{ position: 'relative', width: '640px', height: '480px', border:'1px solid black', margin: '10px 0' }}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline // Important for mobile browsers
                    style={{ width: '100%', height: '100%' }}
                    muted // Often required for autoplay
                />
                {/* Hidden canvas for capturing */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
           </div>


           {/* Capture Button */}
           <button onClick={captureImage} disabled={!stream || isLoading}>
             {isLoading ? 'Analyzing...' : 'Take Picture & Analyze'}
           </button>

           {/* Display Captured Image (Optional) */}
           {/* {capturedImage && <img src={capturedImage} alt="Captured" width="320" />} */}

           {/* Display Results */}
           {isLoading && <p>Loading results...</p>}
           {results && (
             <div>
               <h3>Analysis Results</h3>
               <p>Food Item: {results.foodItem}</p>
               <p>Calories: {results.calories}</p>
               <p>Protein: {results.protein}</p>
               {/* ... other results */}
               <p>Confidence: {results.confidenceScore}</p>
               <p>Rating: {'⭐'.repeat(results.rating)}</p> {/* Example star rating */}
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default UserWebDashboard;
