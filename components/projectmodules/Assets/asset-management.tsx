"use client"

import { useState, useRef, useEffect } from "react"
import {
    Folder,
    File,
    Upload,
    Search,
    Grid,
    List,
    MoreVertical,
    Download,
    Trash2,
    FileText,
    Image as ImageIcon,
    Video,
    Music,
    Plus,
    ChevronRight,
    FolderPlus
} from "lucide-react"

interface Asset {
    id: string
    name: string
    type: "image" | "video" | "audio" | "document" | "other"
    url: string
    size: string
    dateAdded: string
    folderId: string
}

interface AssetFolder {
    id: string
    name: string
    parentId: string | null
}

interface AssetManagementProps {
    projectId?: string
}

export default function AssetManagement({ projectId }: AssetManagementProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [assets, setAssets] = useState<Asset[]>([
        // Mock data
        { id: "1", name: "Concept Art 01.jpg", type: "image", url: "/placeholder.svg", size: "2.4 MB", dateAdded: "2023-10-15", folderId: "f1" },
        { id: "2", name: "Script v1.pdf", type: "document", url: "#", size: "156 KB", dateAdded: "2023-10-12", folderId: "f2" },
        { id: "3", name: "Location Scout.mp4", type: "video", url: "#", size: "45.2 MB", dateAdded: "2023-10-18", folderId: "f3" },
    ])
    const [folders, setFolders] = useState<AssetFolder[]>([
        { id: "root", name: "Root", parentId: null }, // Virtual root
        { id: "f1", name: "Images", parentId: null },
        { id: "f2", name: "Scripts", parentId: null },
        { id: "f3", name: "Dailies", parentId: null },
        { id: "f4", name: "Audio", parentId: null },
    ])

    const fileInputRef = useRef<HTMLInputElement>(null)

    const getCurrentFolderAssets = () => {
        return assets.filter(asset => asset.folderId === (currentFolderId || "root") || (!currentFolderId && !folders.find(f => f.id === asset.folderId)?.parentId))
        // Simplification: if currentFolderId is null, show top level. 
        // Actually, let's refine:
        // If currentFolderId is null, show folders with parentId null. 
        // And assets with folderId null (if any, though we usually put them in folders).
    }

    const getBreadcrumbs = () => {
        if (!currentFolderId) return [{ id: null, name: "All Assets" }]

        const breadcrumbs = []
        let current = folders.find(f => f.id === currentFolderId)
        while (current) {
            breadcrumbs.unshift(current)
            current = folders.find(f => f.id === current?.parentId)
        }
        return [{ id: null, name: "All Assets" }, ...breadcrumbs]
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const newAsset: Asset = {
                id: `asset_${Date.now()}`,
                name: file.name,
                type: file.type.startsWith("image") ? "image" : file.type.startsWith("video") ? "video" : file.type.startsWith("audio") ? "audio" : "document",
                url: URL.createObjectURL(file),
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                dateAdded: new Date().toISOString().split("T")[0],
                folderId: currentFolderId || "root" // Default to root or current
            }
            setAssets([...assets, newAsset])
        }
    }

    const renderAssetIcon = (type: string) => {
        switch (type) {
            case "image": return <ImageIcon className="h-8 w-8 text-blue-400" />
            case "video": return <Video className="h-8 w-8 text-purple-400" />
            case "audio": return <Music className="h-8 w-8 text-pink-400" />
            default: return <FileText className="h-8 w-8 text-gray-400" />
        }
    }

    return (
        <div className="h-full flex flex-col bg-slate-900 text-white">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {getBreadcrumbs().map((crumb, index, arr) => (
                        <div key={crumb.id || "root-crumb"} className="flex items-center">
                            <button
                                onClick={() => setCurrentFolderId(crumb.id as string)}
                                className={`text-sm hover:text-blue-400 transition-colors ${index === arr.length - 1 ? "font-bold text-white" : "text-white/60"}`}
                            >
                                {crumb.name}
                            </button>
                            {index < arr.length - 1 && <ChevronRight className="h-4 w-4 text-white/40 mx-1" />}
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500/50 w-64"
                        />
                    </div>
                    <div className="h-6 w-px bg-white/10 mx-2" />
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
                    >
                        <Grid className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
                    >
                        <List className="h-4 w-4" />
                    </button>
                    <div className="h-6 w-px bg-white/10 mx-2" />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Upload className="h-4 w-4" />
                        Upload
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Folders */}
                <div className="mb-8">
                    <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">Folders</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {folders.filter(f => f.parentId === currentFolderId).map(folder => (
                            <button
                                key={folder.id}
                                onClick={() => setCurrentFolderId(folder.id)}
                                className="group flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <Folder className="h-8 w-8 text-yellow-500/80 group-hover:text-yellow-500 transition-colors" />
                                <span className="text-sm font-medium truncate">{folder.name}</span>
                            </button>
                        ))}
                        <button
                            className="flex items-center gap-3 p-3 border border-dashed border-white/20 rounded-lg hover:border-white/40 hover:bg-white/5 transition-all text-white/60 hover:text-white"
                        >
                            <FolderPlus className="h-8 w-8" />
                            <span className="text-sm font-medium">New Folder</span>
                        </button>
                    </div>
                </div>

                {/* Files */}
                <div>
                    <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">Files</h3>
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {assets.filter(a => a.folderId === (currentFolderId || "root") || (!currentFolderId && !a.folderId)).map(asset => (
                                <div key={asset.id} className="group relative bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all">
                                    <div className="aspect-square flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                        {asset.type === "image" ? (
                                            <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                                        ) : (
                                            renderAssetIcon(asset.type)
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-medium truncate mb-1" title={asset.name}>{asset.name}</p>
                                        <div className="flex items-center justify-between text-xs text-white/50">
                                            <span>{asset.size}</span>
                                            <span>{asset.dateAdded}</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button className="p-1.5 bg-black/60 rounded-md hover:bg-black/80 text-white">
                                            <Download className="h-3 w-3" />
                                        </button>
                                        <button className="p-1.5 bg-black/60 rounded-md hover:bg-red-900/80 text-white">
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {assets.filter(a => a.folderId === (currentFolderId || "root") || (!currentFolderId && !a.folderId)).map(asset => (
                                <div key={asset.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        {renderAssetIcon(asset.type)}
                                        <div>
                                            <p className="text-sm font-medium text-white">{asset.name}</p>
                                            <p className="text-xs text-white/50 capitalize">{asset.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs text-white/50 w-20 text-right">{asset.size}</span>
                                        <span className="text-xs text-white/50 w-24 text-right">{asset.dateAdded}</span>
                                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
                                            <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white">
                                                <Download className="h-4 w-4" />
                                            </button>
                                            <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-red-400">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {assets.filter(a => a.folderId === (currentFolderId || "root") || (!currentFolderId && !a.folderId)).length === 0 && (
                        <div className="text-center py-12 text-white/30 border-2 border-dashed border-white/10 rounded-lg">
                            <Folder className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p>No files in this folder</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
