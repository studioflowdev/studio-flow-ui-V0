"use client"

import { useState, useRef, useEffect } from "react"
import {
    Settings,
    Image as ImageIcon,
    Type,
    Calendar,
    DollarSign,
    Users,
    Upload,
    Check,
    RotateCcw,
    Save
} from "lucide-react"

import { type Project } from "../../../lib/db"

interface ProjectSettingsProps {
    currentProject: Project | null
    onUpdateProject?: (project: Project, updates: Partial<Project>) => void
}

interface BackgroundOption {
    id: string
    name: string
    type: "image" | "gradient" | "color"
    value: string
    thumbnail: string
    isCustom?: boolean
}

export default function ProjectSettings({ currentProject, onUpdateProject }: ProjectSettingsProps) {
    const [activeTab, setActiveTab] = useState<"general" | "background" | "team">("general")
    const [projectTitle, setProjectTitle] = useState(currentProject?.title || "")
    const [projectGenre, setProjectGenre] = useState(currentProject?.genre || "")
    const [projectStatus, setProjectStatus] = useState(currentProject?.status || "development")
    const [selectedBackground, setSelectedBackground] = useState<string>("default")
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (currentProject) {
            setProjectTitle(currentProject.title || "")
            setProjectGenre(currentProject.genre || "")
            setProjectStatus(currentProject.status || "development")
        }
    }, [currentProject])

    // Background options (simplified subset)
    const backgroundOptions: BackgroundOption[] = [
        {
            id: "default",
            name: "Studio Flow Default",
            type: "image",
            value: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
            thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=300&auto=format&fit=crop",
        },
        {
            id: "cinema",
            name: "Cinema Hall",
            type: "image",
            value: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
            thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300&auto=format&fit=crop",
        },
        {
            id: "abstract-neon",
            name: "Abstract Neon",
            type: "image",
            value: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
            thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=300&auto=format&fit=crop",
        },
        {
            id: "studio-set",
            name: "Film Set",
            type: "image",
            value: "https://images.unsplash.com/photo-1598899134739-967d8d565e22",
            thumbnail: "https://images.unsplash.com/photo-1598899134739-967d8d565e22?q=80&w=300&auto=format&fit=crop",
        },
        {
            id: "minimal-gradient",
            name: "Deep Ocean",
            type: "gradient",
            value: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
            thumbnail: "/gradients/ocean.png", // Fallback will be handled or used as color
            isCustom: false
        },
        {
            id: "sunset-vibes",
            name: "Sunset Vibes",
            type: "gradient",
            value: "linear-gradient(to right, #ff5f6d, #ffc371)",
            thumbnail: "",
            isCustom: false
        },
        {
            id: "northern-lights",
            name: "Northern Lights",
            type: "gradient",
            value: "linear-gradient(to right, #00c6ff, #0072ff)",
            thumbnail: "",
            isCustom: false
        },
        {
            id: "midnight-city",
            name: "Midnight City",
            type: "gradient",
            value: "linear-gradient(to right, #232526, #414345)",
            thumbnail: "",
            isCustom: false
        },
        {
            id: "noir-city",
            name: "Noir City",
            type: "image",
            value: "https://images.unsplash.com/photo-1480796927426-f609979314bd",
            thumbnail: "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=300&auto=format&fit=crop",
        },
        {
            id: "scifi-corridor",
            name: "Sci-Fi Corridor",
            type: "image",
            value: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5",
            thumbnail: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=300&auto=format&fit=crop",
        },
    ]

    const handleSaveGeneral = () => {
        if (onUpdateProject && currentProject) {
            onUpdateProject(currentProject, {
                title: projectTitle,
                genre: projectGenre,
                status: projectStatus,
            })
        }
    }

    const handleBackgroundChange = (bg: BackgroundOption) => {
        setSelectedBackground(bg.id)
        if (onUpdateProject && currentProject) {
            onUpdateProject(currentProject, {
                backgroundImage: bg.value,
                backgroundType: bg.type
            })
        }
    }

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
                <div className="space-y-4 max-w-xl">
                    <div>
                        <label className="block text-white/70 text-sm mb-2">Project Title</label>
                        <input
                            type="text"
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-white/70 text-sm mb-2">Genre</label>
                        <input
                            type="text"
                            value={projectGenre}
                            onChange={(e) => setProjectGenre(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-white/70 text-sm mb-2">Status</label>
                        <select
                            value={projectStatus}
                            onChange={(e) => setProjectStatus(e.target.value as Project['status'])}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                        >
                            <option value="development">Development</option>
                            <option value="pre-production">Pre-Production</option>
                            <option value="production">Production</option>
                            <option value="post-production">Post-Production</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <button
                        onClick={handleSaveGeneral}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors mt-4"
                    >
                        <Save className="h-4 w-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )

    const renderBackgroundSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Project Background</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {backgroundOptions.map((bg) => (
                        <div
                            key={bg.id}
                            className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedBackground === bg.id ? "border-blue-400" : "border-white/20 hover:border-white/40"
                                }`}
                            onClick={() => handleBackgroundChange(bg)}
                        >
                            <div className="aspect-video relative">
                                {bg.type === "image" ? (
                                    <img src={bg.thumbnail || "/placeholder.svg"} alt={bg.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full" style={{ background: bg.value }}></div>
                                )}
                                {selectedBackground === bg.id && (
                                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                        <Check className="h-6 w-6 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="p-2">
                                <p className="text-white text-xs font-medium truncate">{bg.name}</p>
                            </div>
                        </div>
                    ))}
                    {/* Upload placeholder */}
                    <div
                        className="aspect-video border-2 border-dashed border-white/40 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/60 hover:bg-white/5 transition-all"
                    >
                        <Upload className="h-6 w-6 text-white/70 mb-2" />
                        <span className="text-white/70 text-xs">Upload Image</span>
                    </div>
                </div>
            </div>
        </div>
    )

    const tabs = [
        { id: "general", label: "General", icon: Settings },
        { id: "background", label: "Background", icon: ImageIcon },
        { id: "team", label: "Team", icon: Users },
    ]

    if (!currentProject) {
        return <div className="text-white p-6">Please select a project to edit settings.</div>
    }

    return (
        <div className="flex h-full">
            {/* Project Settings Sidebar */}
            <div className="w-64 bg-white/5 border-r border-white/10 p-4 h-full">
                <h2 className="text-xl font-bold text-white mb-6">Project Settings</h2>
                <nav className="space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto h-full">
                {activeTab === "general" && renderGeneralSettings()}
                {activeTab === "background" && renderBackgroundSettings()}
                {activeTab === "team" && <div className="text-white">Team Management (Migrated)</div>}
            </div>
        </div>
    )
}
