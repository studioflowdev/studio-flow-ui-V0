
import Dexie, { type EntityTable } from 'dexie';

interface TeamMember {
    id?: string;
    name: string;
    role: string;
    avatar: string;
}

interface Project {
    id: string;
    title: string;
    type?: string;
    status: "development" | "pre-production" | "production" | "post-production" | "completed" | "archived";
    progress?: number;
    budget?: number;
    budgetUsed?: number;
    daysRemaining?: number;
    totalDays?: number;
    director?: string;
    producer?: string;
    genre?: string;
    format?: string;
    lastActivity?: string;
    thumbnail?: string;
    priority?: "high" | "medium" | "low";
    aiInsights?: string[];
    team?: TeamMember[];
    calendars?: string[];
    contacts?: string[];
    backgroundImage?: string;
    backgroundType?: "image" | "gradient" | "color";
    backgroundColor?: string;
    startDate?: string;
    endDate?: string;
    tasks?: { total: number; completed: number; pending: number; blocked: number };
    nextMilestone?: string;
    description?: string;
    size?: string; // Keep for compatibility if needed, though not in page.tsx interface
    isMock?: boolean;
}

interface BudgetLineItem {
    id: string;
    lineNumber: number;
    category: string;
    subcategory: string;
    description: string;
    crew?: number;
    days?: number;
    rate?: number;
    overtime?: number;
    estimatedTotal: number;
    actualTotal: number;
    notes: string;
    aiGenerated: boolean;
    lastUpdated: string;
    source?: string;
    isMock?: boolean;
}

// We'll store budget items flattened, keyed by project ID
interface BudgetLineItemWithProject extends BudgetLineItem {
    projectId: string;
}

const db = new Dexie('StudioFlowDB') as Dexie & {
    projects: EntityTable<Project, 'id'>;
    budgetItems: EntityTable<BudgetLineItemWithProject, 'id'>;
};

// Schema definition
db.version(2).stores({
    projects: 'id, title, status, lastActivity, isMock',
    budgetItems: 'id, projectId, category, subcategory, description, isMock'
});

// Seed function to be called by components if DB is empty
export const seedMockData = async () => {
    const count = await db.projects.count();
    if (count > 0) return;

    const mockProjects: Project[] = [
        {
            id: "1",
            title: "Midnight Chronicles",
            status: "production",
            priority: "high",
            progress: 65,
            startDate: "2024-03-01",
            endDate: "2024-08-15",
            budget: 15000000,
            budgetUsed: 8400000,
            team: [
                { id: "1", name: "Sarah J.", role: "Director", avatar: "SJ" },
                { id: "2", name: "Mike R.", role: "Producer", avatar: "MR" },
                { id: "3", name: "Elena K.", role: "DoP", avatar: "EK" },
                { id: "4", name: "David L.", role: "Editor", avatar: "DL" },
            ],
            tasks: { total: 145, completed: 82, pending: 63, blocked: 4 },
            nextMilestone: "Principal Photography Wrap",
            daysRemaining: 42,
            totalDays: 120,
            lastActivity: "2 hours ago",
            thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
            description: "A cyberpunk noir thriller set in 2089 Tokyo.",
            backgroundType: "image",
            backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
            backgroundColor: "",
            calendars: ["cal_1", "cal_2"],
            isMock: true,
            size: "1.2 GB"
        },
        {
            id: "2",
            title: "Urban Legends",
            type: "Series",
            genre: "Horror Anthology",
            format: "Limited Series",
            status: "development",
            priority: "medium",
            progress: 25,
            startDate: "2024-06-01",
            endDate: "2024-12-20",
            budget: 8000000,
            budgetUsed: 450000,
            team: [
                { id: "5", name: "Chris P.", role: "Showrunner", avatar: "CP" },
                { id: "6", name: "Anna M.", role: "Writer", avatar: "AM" },
            ],
            tasks: { total: 85, completed: 20, pending: 60, blocked: 5 },
            nextMilestone: "Script Lockdown",
            daysRemaining: 180,
            totalDays: 200,
            lastActivity: "1 day ago",
            thumbnail: "https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?q=80&w=800&auto=format&fit=crop",
            description: "An anthology series exploring modern urban myths.",
            backgroundType: "gradient",
            backgroundImage: "",
            backgroundColor: "linear-gradient(to right, #243B55, #141E30)",
            calendars: [],
            isMock: true,
            size: "450 MB"
        },
        {
            id: "3",
            title: "Neon Nights",
            type: "Commercial",
            genre: "Tech Commercial",
            format: "30s Spot",
            status: "post-production",
            priority: "low",
            progress: 90,
            budget: 500000,
            budgetUsed: 450000,
            daysRemaining: 5,
            totalDays: 14,
            lastActivity: "1 week ago",
            backgroundType: "color",
            backgroundColor: "#f59e0b",
            description: "High energy tech commercial.",
            isMock: true,
            size: "3.4 GB"
        },
    ];

    await db.projects.bulkAdd(mockProjects);

    // Note: We won't seed budget items here. 
    // We'll let the budget module seed them when a project is opened to allow for dynamic generation 
    // based on the multiplier logic we saw in the original file, 
    // or we can refactor that generator to save to DB on first load.
};

export { db };
export type { Project, BudgetLineItem, BudgetLineItemWithProject };
