"use client"

import { useState } from "react"
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Star,
  Edit,
  Filter,
  MoreHorizontal,
  User,
  Building,
  Camera,
  Briefcase,
  Award,
  MessageSquare,
  ExternalLink,
  X,
  Folder,
} from "lucide-react"

interface Contact {
  id: string
  name: string
  role: string
  company: string
  department: string
  email: string
  phone: string
  location: string
  avatar?: string
  rating: number
  projects: string[]
  skills: string[]
  availability: "available" | "busy" | "unavailable"
  lastContact: string
  notes: string
  socialLinks: {
    linkedin?: string
    imdb?: string
    website?: string
  }
  type: "cast" | "crew" | "vendor" | "client" | "agent"
  verified: boolean
}

interface ContactsManagerProps {
  currentProject?: any
}

export default function ContactsManager({ currentProject }: ContactsManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "cast" | "crew" | "vendor" | "client" | "agent">("all")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showProjectOnly, setShowProjectOnly] = useState(false)

  // Sample contacts data
  const contacts: Contact[] = [
    {
      id: "1",
      name: "Emma Stone",
      role: "Lead Actress",
      company: "CAA",
      department: "Talent",
      email: "emma.stone@caa.com",
      phone: "+1 (555) 123-4567",
      location: "Los Angeles, CA",
      avatar: "ES",
      rating: 5,
      projects: ["Midnight Chronicles", "Urban Legends"],
      skills: ["Drama", "Comedy", "Action"],
      availability: "busy",
      lastContact: "2 days ago",
      notes: "Excellent performance in dramatic roles. Available for Q3 2024.",
      socialLinks: {
        imdb: "https://imdb.com/name/nm1297015",
        linkedin: "https://linkedin.com/in/emmastone",
      },
      type: "cast",
      verified: true,
    },
    {
      id: "2",
      name: "Marcus Rodriguez",
      role: "Director of Photography",
      company: "Freelance",
      department: "Camera",
      email: "marcus.dp@gmail.com",
      phone: "+1 (555) 234-5678",
      location: "New York, NY",
      avatar: "MR",
      rating: 5,
      projects: ["Summer Vibes", "Midnight Chronicles"],
      skills: ["Cinematography", "Lighting", "Color Grading"],
      availability: "available",
      lastContact: "1 week ago",
      notes: "Exceptional eye for visual storytelling. Owns RED camera package.",
      socialLinks: {
        website: "https://marcusrodriguezdp.com",
        linkedin: "https://linkedin.com/in/marcusrodriguez",
      },
      type: "crew",
      verified: true,
    },
    {
      id: "3",
      name: "Sarah Chen",
      role: "Sound Designer",
      company: "Audio Dynamics",
      department: "Post-Production",
      email: "sarah@audiodynamics.com",
      phone: "+1 (555) 345-6789",
      location: "San Francisco, CA",
      avatar: "SC",
      rating: 4,
      projects: ["Urban Legends"],
      skills: ["Sound Design", "Audio Mixing", "Foley"],
      availability: "available",
      lastContact: "3 days ago",
      notes: "Specializes in horror and thriller sound design. Quick turnaround.",
      socialLinks: {
        website: "https://audiodynamics.com",
      },
      type: "crew",
      verified: true,
    },
    {
      id: "4",
      name: "Apex Equipment Rental",
      role: "Equipment Vendor",
      company: "Apex Equipment",
      department: "Rentals",
      email: "rentals@apexequipment.com",
      phone: "+1 (555) 456-7890",
      location: "Los Angeles, CA",
      avatar: "AE",
      rating: 4,
      projects: ["Midnight Chronicles", "Summer Vibes"],
      skills: ["Camera Rental", "Lighting", "Grip Equipment"],
      availability: "available",
      lastContact: "5 days ago",
      notes: "Reliable equipment rental house. Good rates for long-term rentals.",
      socialLinks: {
        website: "https://apexequipment.com",
      },
      type: "vendor",
      verified: true,
    },
    {
      id: "5",
      name: "Netflix Studios",
      role: "Distribution Partner",
      company: "Netflix",
      department: "Content Acquisition",
      email: "content@netflix.com",
      phone: "+1 (555) 567-8901",
      location: "Los Gatos, CA",
      avatar: "NF",
      rating: 5,
      projects: ["Summer Vibes"],
      skills: ["Distribution", "Streaming", "Global Reach"],
      availability: "busy",
      lastContact: "1 day ago",
      notes: "Interested in exclusive streaming rights for comedy series.",
      socialLinks: {
        website: "https://netflix.com",
      },
      type: "client",
      verified: true,
    },
    {
      id: "6",
      name: "Michael Torres",
      role: "Talent Agent",
      company: "WME",
      department: "Talent",
      email: "mtorres@wmeagency.com",
      phone: "+1 (555) 678-9012",
      location: "Beverly Hills, CA",
      avatar: "MT",
      rating: 4,
      projects: ["Midnight Chronicles"],
      skills: ["Talent Representation", "Negotiations", "Casting"],
      availability: "available",
      lastContact: "4 days ago",
      notes: "Represents A-list talent. Good relationships with major studios.",
      socialLinks: {
        linkedin: "https://linkedin.com/in/michaeltorres",
      },
      type: "agent",
      verified: true,
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "cast":
        return User
      case "crew":
        return Camera
      case "vendor":
        return Building
      case "client":
        return Briefcase
      case "agent":
        return Award
      default:
        return User
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "unavailable":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredContacts = contacts.filter((contact) => {
    const matchesType = filterType === "all" || contact.type === filterType
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesProject = !showProjectOnly || !currentProject || currentProject.contacts?.includes(contact.id)

    return matchesType && matchesSearch && matchesProject
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Contacts Manager</h1>
          <p className="text-white/70">Manage your production network and industry connections</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
            Add Contact
          </button>
          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
            <Users className="h-4 w-4" />
            Import
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "Total Contacts", value: contacts.length, icon: Users, color: "text-blue-400" },
          {
            label: "Cast",
            value: contacts.filter((c) => c.type === "cast").length,
            icon: User,
            color: "text-purple-400",
          },
          {
            label: "Crew",
            value: contacts.filter((c) => c.type === "crew").length,
            icon: Camera,
            color: "text-green-400",
          },
          {
            label: "Vendors",
            value: contacts.filter((c) => c.type === "vendor").length,
            icon: Building,
            color: "text-yellow-400",
          },
          {
            label: "Available",
            value: contacts.filter((c) => c.availability === "available").length,
            icon: Star,
            color: "text-green-400",
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <span className="text-white/70 text-sm">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 w-80"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-white/10 border border-white/20 rounded-lg text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            <option value="all">All Types</option>
            <option value="cast">Cast</option>
            <option value="crew">Crew</option>
            <option value="vendor">Vendors</option>
            <option value="client">Clients</option>
            <option value="agent">Agents</option>
          </select>
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
            <Filter className="h-4 w-4" />
          </button>
          {currentProject && (
            <button
              onClick={() => setShowProjectOnly(!showProjectOnly)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showProjectOnly ? "bg-blue-500 text-white" : "bg-white/10 text-white/70 hover:text-white"
              }`}
            >
              <Folder className="h-4 w-4" />
              {currentProject.title} Only
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid" ? "bg-white/20 text-white" : "bg-white/10 text-white/70 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list" ? "bg-white/20 text-white" : "bg-white/10 text-white/70 hover:text-white"
            }`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Contacts Grid/List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 min-h-[600px] p-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredContacts.map((contact) => {
              const TypeIcon = getTypeIcon(contact.type)
              return (
                <div
                  key={contact.id}
                  className="bg-white/5 rounded-lg border border-white/10 p-4 hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {contact.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">{contact.name}</h3>
                        <p className="text-white/70 text-xs">{contact.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <TypeIcon className="h-4 w-4 text-white/50" />
                      {contact.verified && <Star className="h-3 w-3 text-yellow-400 fill-current" />}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-white/70">
                    <div className="flex items-center gap-2">
                      <Building className="h-3 w-3" />
                      <span className="truncate">{contact.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{contact.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < contact.rating ? "text-yellow-400 fill-current" : "text-gray-400"}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(contact.availability)}`}></div>
                      <span className="text-xs text-white/60 capitalize">{contact.availability}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-1">
                    <button className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-1 px-2 rounded text-xs transition-colors">
                      <Mail className="h-3 w-3 mx-auto" />
                    </button>
                    <button className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 py-1 px-2 rounded text-xs transition-colors">
                      <Phone className="h-3 w-3 mx-auto" />
                    </button>
                    <button className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 py-1 px-2 rounded text-xs transition-colors">
                      <MessageSquare className="h-3 w-3 mx-auto" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredContacts.map((contact) => {
              const TypeIcon = getTypeIcon(contact.type)
              return (
                <div
                  key={contact.id}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {contact.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium">{contact.name}</h3>
                      <TypeIcon className="h-4 w-4 text-white/50" />
                      {contact.verified && <Star className="h-3 w-3 text-yellow-400 fill-current" />}
                    </div>
                    <p className="text-white/70 text-sm">
                      {contact.role} • {contact.company}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span>{contact.location}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < contact.rating ? "text-yellow-400 fill-current" : "text-gray-400"}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(contact.availability)}`}></div>
                      <span className="capitalize">{contact.availability}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded transition-colors">
                      <Mail className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded transition-colors">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {selectedContact.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedContact.name}</h2>
                    <p className="text-white/70">{selectedContact.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-2">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-white/50" />
                        <span className="text-white">{selectedContact.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-white/50" />
                        <span className="text-white">{selectedContact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-white/50" />
                        <span className="text-white">{selectedContact.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-white/50" />
                        <span className="text-white">{selectedContact.company}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedContact.skills.map((skill, i) => (
                        <span key={i} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-2">Projects</h3>
                    <div className="space-y-1">
                      {selectedContact.projects.map((project, i) => (
                        <div key={i} className="text-white/80 text-sm">
                          • {project}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-2">Rating & Availability</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white/70 text-sm">Rating:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < selectedContact.rating ? "text-yellow-400 fill-current" : "text-gray-400"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/70 text-sm">Status:</span>
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${getAvailabilityColor(selectedContact.availability)}`}
                          ></div>
                          <span className="text-white capitalize">{selectedContact.availability}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/70 text-sm">Last Contact:</span>
                        <span className="text-white">{selectedContact.lastContact}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-2">Social Links</h3>
                    <div className="flex gap-2">
                      {selectedContact.socialLinks.linkedin && (
                        <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      )}
                      {selectedContact.socialLinks.imdb && (
                        <button className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      )}
                      {selectedContact.socialLinks.website && (
                        <button className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-2">Notes</h3>
                    <p className="text-white/80 text-sm bg-white/5 rounded p-3">{selectedContact.notes}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Send Email
                </button>
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Call
                </button>
                <button className="px-4 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
