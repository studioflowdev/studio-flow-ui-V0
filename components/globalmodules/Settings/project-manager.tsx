"use client"

import { useState } from "react"
import {
    Settings,
    Plus, // Added
    Folder,
    Download,
    Archive,
    Trash2,
    Upload,
    MoreVertical,
    FileBox,
    RefreshCw,
    Search,
    Filter
} from "lucide-react"
import { useProjectActions } from "../../hooks/useProjectActions"

interface Project {
    id: string
    title: string
    status: string
    lastActivity: string
    size?: string
}

interface ProjectManagerProps {
    onNavigateToProject?: (projectId: string) => void
}

export default function ProjectManager({ onNavigateToProject }: ProjectManagerProps) {
    const [projects, setProjects] = useState<Project[]>([
        { id: "1", title: "Midnight Chronicles", status: "production", lastActivity: "2 min ago", size: "1.2 GB" },
        { id: "2", title: "Urban Legends", status: "development", lastActivity: "2 days ago", size: "450 MB" },
        { id: "3", title: "Neon Nights", status: "post-production", lastActivity: "1 week ago", size: "3.4 GB" },
    ])
    const [searchQuery, setSearchQuery] = useState("")

    const { isExporting, exportProject, archiveProject, deleteProject } = useProjectActions()

    const handleExportProject = (project: Project) => {
        exportProject(project)
    }

    const handleArchiveProject = (id: string) => {
        const project = projects.find(p => p.id === id)
        if (project) {
            archiveProject(project, (pid, newStatus) => {
                setProjects(projects.map(p => p.id === pid ? { ...p, status: newStatus } : p))
            })
        }
    }

    const handleDeleteProject = (id: string) => {
        const project = projects.find(p => p.id === id)
        if (project) {
            deleteProject(project, (pid) => {
                setProjects(projects.filter(p => p.id !== pid))
            })
        }
    }

    return (
        <div className="h-full flex flex-col text-white">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold mb-1">Project Management</h2>
                    <p className="text-white/60 text-sm">Manage, archive, and export your projects</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                        />
                    </div>
                    <button
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm shadow-lg hover:shadow-blue-500/25"
                        onClick={() => alert("New Project Wizard starting...")}
                    >
                        <Plus className="h-4 w-4" />
                        New Project
                    </button>
                    <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-lg transition-colors text-sm">
                        <Upload className="h-4 w-4" />
                        Import
                    </button>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 font-medium text-sm text-white/60">Project Name</th>
                            <th className="p-4 font-medium text-sm text-white/60">Status</th>
                            <th className="p-4 font-medium text-sm text-white/60">Size</th>
                            <th className="p-4 font-medium text-sm text-white/60">Last Activity</th>
                            <th className="p-4 font-medium text-sm text-white/60 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map((project) => (
                            <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                                            <FileBox className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{project.title}</div>
                                            <div className="text-xs text-white/50">ID: {project.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs border ${project.status === "production" ? "bg-green-500/10 border-green-500/20 text-green-400" :
                                        project.status === "development" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                                            project.status === "archived" ? "bg-gray-500/10 border-gray-500/20 text-gray-400" :
                                                "bg-purple-500/10 border-purple-500/20 text-purple-400"
                                        } `}>
                                        {project.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-white/70">{project.size}</td>
                                <td className="p-4 text-sm text-white/70">{project.lastActivity}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onNavigateToProject?.(project.id)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                                            title="Project Settings"
                                        >
                                            <Settings className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleExportProject(project)}
                                            disabled={isExporting === project.id}
                                            className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                                            title="Export Project"
                                        >
                                            {isExporting === project.id ? (
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Download className="h-4 w-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleArchiveProject(project.id)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-yellow-400 transition-colors"
                                            title="Archive Project"
                                        >
                                            <Archive className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProject(project.id)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-red-400 transition-colors"
                                            title="Delete Project"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
