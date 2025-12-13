
import React, { useState } from 'react';
import { Download, Save, Share2, MessageSquare, Loader2, PlayCircle, History, Maximize2 } from 'lucide-react';
import { GenerationRequest } from '../lib/geminiService';

interface GeneratedResult {
    id: string;
    type: 'image' | 'video';
    url: string; // or base64
    prompt: string;
    timestamp: Date;
}

interface GenerationPanelProps {
    isLoading: boolean;
    currentResult: GeneratedResult | null;
    history: GeneratedResult[];
    onRefine: (feedback: string) => void;
    onSelectHistory: (item: GeneratedResult) => void;
}


export function GenerationPanel({ isLoading, currentResult, history, onRefine, onSelectHistory, onSave, selectedModel = "Model", error }: GenerationPanelProps & { onSave: (item: GeneratedResult) => void, selectedModel?: string, error?: string | null }) {
    const [refinementText, setRefinementText] = useState("");
    const [isMaximized, setIsMaximized] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    const handleRefineSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (refinementText.trim()) {
            onRefine(refinementText);
            setRefinementText("");
        }
    };

    const handleDownload = async () => {
        if (!currentResult) return;
        try {
            const response = await fetch(currentResult.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `generated-${currentResult.type}-${Date.now()}.${currentResult.type === 'video' ? 'mp4' : 'png'}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (e) {
            console.error("Download failed:", e);
            // Fallback for direct link
            window.open(currentResult.url, '_blank');
        }
    };

    const containerClass = isMaximized
        ? "fixed inset-0 z-[100] bg-black/95 flex flex-col p-8"
        : "flex flex-col h-full bg-black/20 rounded-xl overflow-hidden border border-white/10";

    return (
        <div className={containerClass}>
            {isMaximized && (
                <button
                    onClick={() => setIsMaximized(false)}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                    <Maximize2 className="h-6 w-6 transform rotate-180" /> {/* simple close/shrink icon placeholder */}
                </button>
            )}

            {/* Main Display Area */}
            <div className={`flex-1 relative bg-black/40 flex items-center justify-center min-h-[300px] ${isMaximized ? 'h-[80vh]' : ''}`}>
                {isLoading ? (
                    <div className="flex flex-col items-center gap-3 text-purple-400">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="text-sm font-medium animate-pulse">
                            {currentResult?.type === 'video' ? `Rendering Video (${selectedModel})...` : `Generating Image (${selectedModel})...`}
                        </span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center gap-3 text-red-400 p-6 text-center">
                        <div className="bg-red-500/10 p-4 rounded-full">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">Generation Failed</h3>
                        <p className="text-sm text-white/60 max-w-sm font-mono bg-black/40 p-2 rounded border border-white/10 break-all">
                            {error}
                        </p>
                        <p className="text-xs text-white/40 mt-2">Check availability for: {selectedModel}</p>
                    </div>
                ) : currentResult ? (
                    <div className="relative w-full h-full group flex flex-col">
                        {/* Media Container */}
                        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                            {currentResult.type === 'video' ? (
                                <video
                                    src={currentResult.url}
                                    controls
                                    autoPlay
                                    loop
                                    className="max-w-full max-h-full object-contain shadow-2xl"
                                />
                            ) : (
                                <img
                                    src={currentResult.url}
                                    alt={currentResult.prompt}
                                    className="max-w-full max-h-full object-contain shadow-2xl"
                                />
                            )}
                        </div>

                        {/* Overlay Actions - Always visible on hover or persistent if useful */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                            <button
                                onClick={handleDownload}
                                className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10 shadow-lg"
                                title="Download"
                            >
                                <Download className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => onSave(currentResult)}
                                className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10 shadow-lg"
                                title="Save to Assets"
                            >
                                <Save className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10 shadow-lg"
                                title={isMaximized ? "Exit Full Screen" : "Full Screen"}
                            >
                                <Maximize2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4">
                            <PlayCircle className="h-8 w-8 text-white/20" />
                        </div>
                        <h3 className="text-white font-medium mb-1">Ready to Create</h3>
                        <p className="text-white/50 text-sm max-w-[200px] mx-auto">
                            Configure your inputs and click generate to see the magic happen.
                        </p>
                    </div>
                )}
            </div>

            {/* Prompt & Controls Section */}
            <div className="border-t border-white/10 bg-white/5 p-4 space-y-4">

                {/* Prompt Toggle/Display */}
                {currentResult && (
                    <div className="space-y-2">
                        <button
                            onClick={() => setShowPrompt(!showPrompt)}
                            className="text-xs text-white/50 hover:text-white flex items-center gap-1 transition-colors"
                        >
                            {showPrompt ? 'Hide Prompt' : 'Show Technical Prompt'}
                        </button>
                        {showPrompt && (
                            <div className="bg-black/40 p-3 rounded-lg border border-white/10 text-xs text-white/80 animate-in fade-in slide-in-from-top-1 space-y-2">
                                <div className="flex items-center gap-2 text-[10px] text-green-400 uppercase tracking-wider font-semibold">
                                    <span>✓ Verified Generation</span>
                                    <span className="text-white/30">|</span>
                                    <span className="text-white/60">Model: {selectedModel || 'Unknown'}</span>
                                </div>
                                <p>{currentResult.prompt}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Refinement Input */}
                <form onSubmit={handleRefineSubmit} className="relative">
                    <input
                        type="text"
                        value={refinementText}
                        onChange={(e) => setRefinementText(e.target.value)}
                        placeholder="Refine result (e.g., 'Make it darker', 'Add rain')..."
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-4 pr-10 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                        disabled={isLoading || !currentResult}
                    />
                    <button
                        type="submit"
                        disabled={!refinementText.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-purple-400 hover:text-purple-300 disabled:opacity-50 transition-colors"
                    >
                        <MessageSquare className="h-4 w-4" />
                    </button>
                </form>

                {/* History Carousel */}
                {history.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-xs text-white/50 uppercase tracking-wider font-medium">
                            <History className="h-3 w-3" />
                            <span>Session History</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-1">
                            {history.slice().reverse().map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onSelectHistory(item)}
                                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border transition-all ${currentResult?.id === item.id ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    {item.type === 'video' ? (
                                        <video src={item.url} className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={item.url} className="w-full h-full object-cover" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
