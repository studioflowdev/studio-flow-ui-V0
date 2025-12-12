import type React from "react"
import { Calendar, Clock, CheckCircle, AlertTriangle, Users, MapPin } from "lucide-react"

const ScheduleModule: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Schedule</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-blue-400" />
            <span className="text-white/70 text-xs">Today</span>
          </div>
          <p className="text-white font-bold text-lg">8</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-white/70 text-xs">This Week</span>
          </div>
          <p className="text-white font-bold text-lg">24</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-white/70 text-xs">Completed</span>
          </div>
          <p className="text-white font-bold text-lg">156</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-white/70 text-xs">Overdue</span>
          </div>
          <p className="text-white font-bold text-lg">3</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-purple-400" />
            <span className="text-white/70 text-xs">Team</span>
          </div>
          <p className="text-white font-bold text-lg">12</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-orange-400" />
            <span className="text-white/70 text-xs">Locations</span>
          </div>
          <p className="text-white font-bold text-lg">5</p>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/20 text-white">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">Meeting with Client A</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">2023-12-15</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Completed
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a href="#" className="text-blue-500 hover:text-blue-700">
                  Edit
                </a>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">Prepare Presentation</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">2023-12-20</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  In Progress
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a href="#" className="text-blue-500 hover:text-blue-700">
                  Edit
                </a>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">Finalize Report</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">2023-12-22</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  Overdue
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a href="#" className="text-blue-500 hover:text-blue-700">
                  Edit
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ScheduleModule
