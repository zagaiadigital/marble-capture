import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import {
    prepareUpload,
    uploadVideoDirect,
    generateHighResPano,
    pollOperation,
    generateInpaintPano,
    extractWorldResult
} from '../services/worldLabs';
import PhotoSphereEditor from '../components/PhotoSphereEditor';
import {
    RotateCcw,
    Sparkles,
    Video,
    Upload,
    Loader2,
    Globe,
    AlertTriangle,
    X,
    Paintbrush,
    Wand2,
} from 'lucide-react';

const PHASE_CONFIG = {
    upload: { icon: Upload, color: 'text-neon-amber', label: 'UPLOADING VIDEO' },
    generateDraft: { icon: Loader2, color: 'text-neon-amber', label: 'Stitching & Rendering High-Res 360 Image (Takes ~5 minutes)...' },
    inpaint: { icon: Wand2, color: 'text-neon-amber', label: 'PROCESSING AI EDIT...' },
};

export default function ReviewScreen() {
    const { videoFile, resetCapture, setScreen, setWorldResult, SCREENS } = useAppContext();

    // Workflows states
    const [progress, setProgress] = useState(null); // { phase, detail, percentage }
    const [error, setError] = useState(null);
    const [panoUrl, setPanoUrl] = useState(null); // The working 360 image

    // Sub-components state
    const [isEditing, setIsEditing] = useState(false);
    const [showPromptInput, setShowPromptInput] = useState(false);
    const [cropData, setCropData] = useState(null);
    const [editPrompt, setEditPrompt] = useState("");
    const [markers, setMarkers] = useState([]);

    // Start Step 1 automatically (Extract Draft Pano from Video, or use Image directly)
    useEffect(() => {
        if (!videoFile || error) return;

        // Prevent double fire in strict mode
        if (panoUrl || progress) return;

        if (videoFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPanoUrl(reader.result);
            };
            reader.readAsDataURL(videoFile);
            return;
        }

        const extractDraftPano = async () => {
            setError(null);
            try {
                // Phase 1 A: Prepare
                setProgress({ phase: 'upload', detail: 'Preparing upload url...', percentage: 0 });
                const authAndUploadInfo = await prepareUpload(videoFile.name || 'capture.mp4');

                const mediaAssetId = authAndUploadInfo.media_asset.media_asset_id || authAndUploadInfo.media_asset.id;
                const uploadUrl = authAndUploadInfo.upload_info.upload_url;
                const requiredHeaders = authAndUploadInfo.upload_info.required_headers || {};

                // Phase 1 B: Direct Upload
                await uploadVideoDirect(videoFile, uploadUrl, requiredHeaders, (percentage) => {
                    setProgress({ phase: 'upload', detail: `Uploading Video (${percentage}%)...`, percentage });
                });

                // Phase 2: Trigger mode A
                setProgress({ phase: 'generateDraft', detail: 'Processing high-res 360 extraction...', percentage: 100 });
                const operationId = await generateHighResPano(mediaAssetId);

                // Phase 3: Poll
                setProgress({ phase: 'generateDraft', detail: 'Generating 360 draft outline...' });
                const result = await pollOperation(operationId, (description) => {
                    setProgress({ phase: 'generateDraft', detail: description });
                });

                const extractedResult = await extractWorldResult(result);
                if (extractedResult.panoUrl) {
                    setPanoUrl(extractedResult.panoUrl);
                    setProgress(null); // Stop processing UI, show Studio
                } else {
                    throw new Error("Draft generation succeeded but returned no pano_url.");
                }

            } catch (err) {
                console.error('Draft Extraction failed:', err);
                setError(err.message);
                setProgress(null);
            }
        };

        extractDraftPano();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoFile]);

    // Step 3 (Editing Loop) - Save Extraction
    const handleExtractionComplete = (data) => {
        setCropData(data);
        setIsEditing(false);
        setShowPromptInput(true);
    };

    // Step 3 (Editing Loop) - Call API Mode B
    const handleGenerateEdit = async () => {
        if (!editPrompt.trim() || !cropData || !panoUrl) return;

        setShowPromptInput(false);
        setError(null);
        setProgress({ phase: 'inpaint', detail: 'Processing Edit request...' });

        try {
            const response = await fetch('/api/edit-area', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: editPrompt.trim(),
                    base64Image: cropData.base64Crop,
                    pitch: cropData.pitch,
                    yaw: cropData.yaw
                })
            });

            if (!response.ok) throw new Error('Failed to generate edit');

            const data = await response.json();

            // Re-apply prefix for browser rendering
            const renderableImage = "data:image/jpeg;base64," + data.editedImage;

            setMarkers(prev => [...prev, {
                id: `edited-${Date.now()}`,
                position: { pitch: cropData.pitch, yaw: cropData.yaw },
                image: renderableImage,
                size: { width: cropData.width, height: cropData.height },
                anchor: 'center center',
            }]);

            setCropData(null);
            setEditPrompt("");
            setProgress(null);
        } catch (err) {
            console.error('Inpaint Edition failed:', err);
            setError(err.message);
            setProgress(null);
        }
    };

    // Step 4 (Finalization) - Export and navigate
    const handleFinishAndExport = () => {
        if (!panoUrl) return;
        setWorldResult({ panoUrl, markers }); // Agora preserva os móveis adicionados
        setScreen(SCREENS.RESULT);
    };

    if (!videoFile) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-cyber-bg px-6 text-center">
                <AlertTriangle className="w-12 h-12 text-neon-red mb-4" />
                <p className="text-white mb-4">No video selected.</p>
                <button
                    onClick={resetCapture}
                    className="px-6 py-2 glass rounded-xl text-cyber-text hover:text-white"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Processing Overlay (Upload, Polling Draft, Polling Inpaint, Polling Final)
    if (progress && !error) {
        const phaseConfig = PHASE_CONFIG[progress.phase] || PHASE_CONFIG.upload;
        const PhaseIcon = phaseConfig.icon;

        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-cyber-bg px-6">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 rounded-full bg-neon-green/5 animate-ping" style={{ animationDuration: '3s' }} />
                </div>
                <div className="relative z-10 flex flex-col items-center animate-fade-in">
                    <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center mb-6 relative">
                        <PhaseIcon
                            className={`w-8 h-8 ${phaseConfig.color} ${progress.percentage !== undefined ? 'animate-pulse' : 'animate-spin'}`}
                            strokeWidth={1.5}
                        />
                    </div>
                    <span className="font-mono text-xs text-cyber-text-dim uppercase tracking-widest mb-2 text-center max-w-[250px]">
                        {phaseConfig.label}
                    </span>
                    <p className="text-white text-sm text-center max-w-xs mb-6">
                        {progress.detail}
                    </p>
                    {progress.phase === 'upload' && progress.percentage !== undefined && (
                        <div className="w-64 mb-4">
                            <div className="h-1.5 bg-cyber-surface rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-neon-green rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress.percentage}%` }}
                                />
                            </div>
                            <p className="font-mono text-[10px] text-cyber-text-dim mt-1.5 text-center">
                                {progress.percentage}%
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }


    // Studio View
    return (
        <div className="h-full w-full flex flex-col bg-cyber-bg overflow-auto relative">
            <div className="glass px-4 py-4 flex items-center justify-between shrink-0 safe-area-top z-10">
                <div>
                    <h2 className="text-lg font-bold text-white">360 Studio</h2>
                    <p className="text-xs font-mono text-cyber-text-dim">
                        DRAFT EXTRACTED · READY TO EDIT
                    </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
                    <Video className="w-5 h-5 text-neon-green" strokeWidth={1.5} />
                </div>
            </div>

            {error && (
                <div className="mx-3 mt-3 px-4 py-3 rounded-xl bg-neon-red/10 border border-neon-red/20 flex items-start gap-3 animate-fade-in relative z-10">
                    <AlertTriangle className="w-4 h-4 text-neon-red shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-neon-red mb-1">Process Failed</p>
                        <p className="text-[11px] font-mono text-neon-red/70 break-words">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="shrink-0">
                        <X className="w-4 h-4 text-neon-red/50 hover:text-neon-red" />
                    </button>
                </div>
            )}

            <div className="flex-1 relative w-full h-full overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                    {panoUrl ? (
                        <PhotoSphereEditor
                            panoUrl={panoUrl}
                            isEditing={isEditing}
                            onCancelEdit={() => setIsEditing(false)}
                            onExtractionComplete={handleExtractionComplete}
                            markers={markers}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black rounded-2xl border border-cyber-border shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                            <span className="text-cyber-text-dim">Studio Loading...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Prompt Input Modal Overlay */}
            {showPromptInput && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass w-full max-w-sm rounded-2xl p-5 border border-neon-green/30">
                        <h3 className="text-white font-bold mb-2">Edit Additions</h3>
                        <p className="text-xs text-cyber-text-dim mb-4">
                            Describe what you want the AI to place in the painted mask area (e.g. "Wooden bookshelves", "Neon sign").
                        </p>
                        <input
                            type="text"
                            autoFocus
                            placeholder="Prompt..."
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            className="w-full bg-cyber-surface border border-cyber-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green mb-4 text-sm"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPromptInput(false)}
                                className="flex-1 py-2 rounded-xl text-cyber-text hover:text-white glass text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateEdit}
                                disabled={!editPrompt.trim()}
                                className="flex-1 bg-neon-green text-black py-2 rounded-xl text-sm font-bold disabled:opacity-50"
                            >
                                Apply Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dock de ações sobreposto na base da tela */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-4 flex flex-col gap-2 z-10 bg-black/80 backdrop-blur-md border-t border-cyber-border/50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 glass py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white transition-all hover:bg-white/10"
                    >
                        <Paintbrush className="w-4 h-4 text-neon-amber" strokeWidth={2} />
                        Edit (AI)
                    </button>

                    <button
                        onClick={handleFinishAndExport}
                        className="flex-1 bg-neon-green text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all active:scale-[0.98]"
                    >
                        <Upload className="w-4 h-4" strokeWidth={2} />
                        Export
                    </button>
                </div>

                <button
                    onClick={resetCapture}
                    className="w-full py-2 flex items-center justify-center gap-2 text-[11px] font-medium text-cyber-text-dim hover:text-white transition-colors"
                >
                    <RotateCcw className="w-3 h-3" strokeWidth={1.5} />
                    Restart Process
                </button>
            </div>
        </div>
    );
}
