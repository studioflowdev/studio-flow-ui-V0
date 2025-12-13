
import React, { useState } from 'react';
import { Sparkles, Video, Image as ImageIcon, Maximize2, X, ChevronDown } from 'lucide-react';
import { AssetUploader } from './asset-uploader';
import { GenerationPanel } from './generation-panel';
import { geminiService } from '../lib/geminiService';
import { db, type GeneratedAsset } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function ContentFlow({ onClose, projectId }: { onClose?: () => void, projectId?: string }) {
    const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [selectedModel, setSelectedModel] = useState('Gemini 3 Pro Image (Nano-Banana Pro)');
    const [error, setError] = useState<string | null>(null);

    // Live Project Data
    const project = useLiveQuery(
        () => (projectId ? db.projects.get(projectId) : undefined),
        [projectId]
    );

    // Inputs
    const [sceneScript, setSceneScript] = useState("");
    const [characterDetails, setCharacterDetails] = useState("");
    const [actionDetails, setActionDetails] = useState("");
    const [visualStyle, setVisualStyle] = useState("");

    // Assets
    const [assets, setAssets] = useState<{ id: string, type: string, base64: string, selected?: boolean }[]>([]);

    // Generation
    const [isGenerating, setIsGenerating] = useState(false);
    // const [generatedResults, setGeneratedResults] = useState<any[]>([]); // REPLACED BY DB
    const [currentResult, setCurrentResult] = useState<GeneratedAsset | null>(null);

    // Sync current result when project loads if not set
    // (Optional: Load last item)


    // Handlers
    const handleAssetUpload = async (files: FileList) => {
        // Convert to base64
        const newAssets = await Promise.all(Array.from(files).map(async (file) => {
            return new Promise<{ id: string, type: string, base64: string }>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        id: Math.random().toString(36).substr(2, 9),
                        type: file.type.startsWith('video') ? 'video' : 'image',
                        base64: reader.result as string
                    });
                };
                reader.readAsDataURL(file);
            });
        }));

        setAssets(prev => [...prev, ...newAssets]);
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            // 1. Filter selected assets
            const selectedAssets = assets.filter(a => a.selected);

            // 2. Analyze assets (if selected)
            let assetDescriptions: string[] = [];
            if (selectedAssets.length > 0) {
                const analysis = await geminiService.analyzeImageAssets(selectedAssets);
                assetDescriptions = analysis.map(a => a.description);
            }

            // 3. Refine Prompt
            const { technical_prompt } = await geminiService.refinePromptForGeneration({
                script: sceneScript,
                characterDetails,
                actionCamera: actionDetails,
                visualStyle,
                assetDescriptions
            });

            // 4. Generate
            const url = await geminiService.generateMedia({
                type: activeTab,
                prompt: technical_prompt,
                aspectRatio,
                model: selectedModel
            });

            // 5. Update State & DB
            const result: GeneratedAsset = {
                id: Date.now().toString(),
                type: activeTab,
                url,
                prompt: technical_prompt,
                timestamp: new Date(),
                model: selectedModel
            };

            // setGeneratedResults(prev => [...prev, result]); // Local state removed
            if (projectId) {
                db.transaction('rw', db.projects, async () => {
                    const proj = await db.projects.get(projectId);
                    if (proj) {
                        const history = proj.generationHistory || [];
                        await db.projects.update(projectId, { generationHistory: [...history, result] });
                    }
                });
            }

            setCurrentResult(result);

        } catch (error: any) {
            console.error("Generation failed:", error);
            setError(error.message || "Generation failed");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRefine = async (feedback: string) => {
        setIsGenerating(true);
        setError(null);
        try {
            // Real Image-to-Image Refinement
            // We pass the CURRENT image as a reference to ensure consistency
            const sourceImage = currentResult?.url;

            // Note: For real API, we just separate the new instruction. 
            // The service handles merging [Instruction + Image]
            const refinementPrompt = feedback;

            const url = await geminiService.generateMedia({
                type: activeTab,
                prompt: refinementPrompt,
                aspectRatio,
                model: selectedModel,
                sourceImage: sourceImage // Passing the image for consistency
            });

            const result: GeneratedAsset = {
                id: Date.now().toString(),
                type: activeTab,
                url,
                prompt: `Refined: "${feedback}"`, // Display the refinement action
                timestamp: new Date(),
                model: selectedModel
            };

            if (projectId) {
                db.transaction('rw', db.projects, async () => {
                    const proj = await db.projects.get(projectId);
                    if (proj) {
                        const history = proj.generationHistory || [];
                        await db.projects.update(projectId, { generationHistory: [...history, result] });
                    }
                });
            }

            setCurrentResult(result);
        } catch (error: any) {
            console.error("Refinement failed:", error);
            setError(error.message || "Refinement failed");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = (item: any) => {
        // In a real app, this would save to the server/db
        console.log("Saving item to project assets:", item);
        // show success checkmark or notification?
    };

    return (
        <div className="flex flex-col h-full text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 backdrop-blur-xl rounded-t-xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">Content Flow</h2>
                        <p className="text-white/50 text-xs">Context-Aware Media Generator</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    {/* Mode Switcher */}
                    <div className="flex bg-black/20 p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => setActiveTab('image')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${activeTab === 'image' ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
                        >
                            <ImageIcon className="h-3 w-3" />
                            Image
                        </button>
                        <button
                            onClick={() => setActiveTab('video')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${activeTab === 'video' ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
                        >
                            <Video className="h-3 w-3" />
                            Video
                        </button>
                    </div>

                    {onClose && (
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <X className="h-5 w-5 text-white/70" />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT INPUT PANEL */}
                <div className="w-[400px] flex flex-col border-r border-white/10 bg-black/20 overflow-y-auto custom-scrollbar">

                    <div className="p-4 space-y-6 pb-24">

                        {/* Scene Context */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-white/90">Scene & Location</h3>
                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/50">Context</span>
                            </div>
                            <textarea
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 min-h-[80px]"
                                placeholder="Describe the scene setting, time of day, and location details..."
                                value={sceneScript}
                                onChange={(e) => setSceneScript(e.target.value)}
                            />
                            <AssetUploader
                                assets={assets.filter(a => !a.type)} // Hack for proto: assumes all uploaded here are location refs or general
                                onAdd={(f) => handleAssetUpload(f)}
                                onRemove={(id) => setAssets(prev => prev.filter(a => a.id !== id))}
                                onToggleSelection={(id) => setAssets(prev => prev.map(a => a.id === id ? { ...a, selected: !a.selected } : a))}
                                label="Location Refs"
                            />
                        </div>

                        <div className="h-px bg-white/5" />

                        {/* Character Context */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-white/90">Characters</h3>
                            </div>
                            <textarea
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 min-h-[80px]"
                                placeholder="Character descriptions, clothing, emotions..."
                                value={characterDetails}
                                onChange={(e) => setCharacterDetails(e.target.value)}
                            />
                        </div>
                        <div className="h-px bg-white/5" />

                        {/* Visual Style */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-white/90">Visual Style</h3>
                            </div>
                            <textarea
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 min-h-[60px]"
                                placeholder="Cinematic style, lens type, color grading..."
                                value={visualStyle}
                                onChange={(e) => setVisualStyle(e.target.value)}
                            />
                            <AssetUploader
                                assets={assets} // Displaying all for now in proto
                                onAdd={(f) => handleAssetUpload(f)}
                                onRemove={(id) => setAssets(prev => prev.filter(a => a.id !== id))}
                                onToggleSelection={(id) => setAssets(prev => prev.map(a => a.id === id ? { ...a, selected: !a.selected } : a))}
                                label="Style Refs"
                            />
                        </div>


                    </div>

                    {/* Footer Actions */}
                    <div className="sticky bottom-0 p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl z-10 space-y-3">
                        <div className="flex gap-2">
                            <select
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                            >
                                <option value="16:9">16:9 Cinematic</option>
                                <option value="9:16">9:16 Social</option>
                                <option value="4:3">4:3 Analog</option>
                                <option value="1:1">1:1 Square</option>
                            </select>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <Sparkles className="h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    Generate {activeTab === 'image' ? 'Image' : 'Video'}
                                </>
                            )}
                        </button>

                        <div className="flex items-center gap-2 text-[10px] text-white/40 px-1">
                            <span>Model:</span>
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="bg-transparent border-none text-white/60 hover:text-white focus:outline-none cursor-pointer max-w-[200px]"
                            >
                                <option value="Gemini 3 Pro Image (Nano-Banana Pro)">Gemini 3 Pro Image (Nano-Banana Pro)</option>
                                <option value="Gemini 2.5 Flash Image">Gemini 2.5 Flash Image</option>
                                <option value="Gemini 2.0 Flash Exp">Gemini 2.0 Flash Exp</option>
                            </select>
                            <span className="ml-auto">Cost: ~0.04 Credits</span>
                        </div>
                    </div>

                </div>

                {/* RIGHT OUTPUT PANEL */}
                <div className="flex-1 p-6 bg-black/10">
                    <GenerationPanel
                        isLoading={isGenerating}
                        currentResult={currentResult}
                        history={project?.generationHistory || []}
                        onRefine={handleRefine}
                        onSelectHistory={setCurrentResult}
                        onSave={handleSave}
                        selectedModel={selectedModel}
                        error={error}
                    />
                </div>

            </div>
        </div>
    );
}
