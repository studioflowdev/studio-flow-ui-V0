"use client"

import { useState, useEffect } from "react"
import {
  DollarSign,
  Plus,
  Download,
  Upload,
  Calculator,
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Edit,
  Save,
  X,
  FileText,
  BarChart3,
  Users,
  Camera,
  MapPin,
  Palette,
  Settings,
  Sparkles,
  Target,
  Filter,
  ChevronDown,
  ChevronUp,
  Copy,
  Trash2,
} from "lucide-react"

interface BudgetLineItem {
  id: string
  lineNumber: number
  category: string
  subcategory: string
  description: string
  crew?: number
  days?: number
  rate?: number
  overtime?: number
  estimatedTotal: number
  actualTotal: number
  notes: string
  aiGenerated: boolean
  lastUpdated: string
  source?: string // Which module provided data
}

interface BudgetCategory {
  id: string
  name: string
  code: string
  estimatedTotal: number
  actualTotal: number
  variance: number
  variancePercent: number
  items: BudgetLineItem[]
  color: string
  icon: any
}

interface AIBudgetSuggestion {
  type: "estimate" | "optimization" | "alert" | "comparison"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  estimatedSavings?: number
  confidence: number
  action?: string
  lineItems?: string[]
}

const MOCK_STORE: Record<string, BudgetCategory[]> = {}

export default function BudgetModule({ searchQuery = "", projectId = "1" }: { searchQuery?: string; projectId?: string }) {
  const [budgetData, setBudgetData] = useState<BudgetCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<AIBudgetSuggestion[]>([])
  const [viewMode, setViewMode] = useState<"detailed" | "summary" | "comparison">("detailed")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showVarianceOnly, setShowVarianceOnly] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGeneratingEstimates, setIsGeneratingEstimates] = useState(false)

  // Initialize budget data based on the PDF structure
  useEffect(() => {
    if (MOCK_STORE[projectId]) {
      setBudgetData(MOCK_STORE[projectId])
      setExpandedCategories(new Set(["pre-production", "production"]))
      generateAISuggestions(MOCK_STORE[projectId])
      return
    }

    const initialBudgetData: BudgetCategory[] = [
      {
        id: "pre-production",
        name: "Pre-Production & Wrap",
        code: "A",
        estimatedTotal: 40767,
        actualTotal: 0,
        variance: -40767,
        variancePercent: -100,
        color: "bg-blue-500",
        icon: FileText,
        items: [
          {
            id: "line_1",
            lineNumber: 1,
            category: "pre-production",
            subcategory: "crew",
            description: "Line Producer",
            crew: 1,
            days: 25,
            rate: 400,
            estimatedTotal: 10000,
            actualTotal: 0,
            notes: "",
            aiGenerated: false,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "line_2",
            lineNumber: 2,
            category: "pre-production",
            subcategory: "crew",
            description: "Assistant Director",
            crew: 1,
            days: 5,
            rate: 150,
            estimatedTotal: 750,
            actualTotal: 0,
            notes: "",
            aiGenerated: false,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "line_3",
            lineNumber: 3,
            category: "pre-production",
            subcategory: "crew",
            description: "Dir. of Photography",
            crew: 1,
            days: 5,
            rate: 400,
            estimatedTotal: 2000,
            actualTotal: 0,
            notes: "",
            aiGenerated: false,
            lastUpdated: new Date().toISOString(),
          },
          // Add more pre-production items...
        ],
      },
      {
        id: "production",
        name: "Production Shoot",
        code: "B",
        estimatedTotal: 320675,
        actualTotal: 0,
        variance: -320675,
        variancePercent: -100,
        color: "bg-green-500",
        icon: Camera,
        items: [
          {
            id: "line_51",
            lineNumber: 51,
            category: "production",
            subcategory: "crew",
            description: "Line Producer",
            crew: 1,
            days: 25,
            rate: 800,
            estimatedTotal: 20000,
            actualTotal: 0,
            notes: "",
            aiGenerated: false,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "line_52",
            lineNumber: 52,
            category: "production",
            subcategory: "crew",
            description: "Assistant Director",
            crew: 1,
            days: 25,
            rate: 350,
            estimatedTotal: 8750,
            actualTotal: 0,
            notes: "",
            aiGenerated: false,
            lastUpdated: new Date().toISOString(),
          },
          // Add more production items...
        ],
      },
      {
        id: "materials-expenses",
        name: "Materials & Expenses",
        code: "C",
        estimatedTotal: 30400,
        actualTotal: 0,
        variance: -30400,
        variancePercent: -100,
        color: "bg-purple-500",
        icon: Settings,
        items: [
          {
            id: "line_101",
            lineNumber: 101,
            category: "materials-expenses",
            subcategory: "transportation",
            description: "Auto Rentals",
            estimatedTotal: 2500,
            actualTotal: 0,
            notes: "",
            aiGenerated: false,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "line_102",
            lineNumber: 102,
            category: "materials-expenses",
            subcategory: "travel",
            description: "Air Fares (6 people x $550)",
            crew: 6,
            rate: 550,
            estimatedTotal: 3300,
            actualTotal: 0,
            notes: "",
            aiGenerated: false,
            lastUpdated: new Date().toISOString(),
          },
          // Add more materials & expenses items...
        ],
      },
      {
        id: "location-expenses",
        name: "Location Expenses",
        code: "D",
        estimatedTotal: 119380,
        actualTotal: 0,
        variance: -119380,
        variancePercent: -100,
        color: "bg-yellow-500",
        icon: MapPin,
        items: [
          {
            id: "line_114",
            lineNumber: 114,
            category: "location-expenses",
            subcategory: "fees",
            description: "Location Fees",
            estimatedTotal: 25000,
            actualTotal: 0,
            notes: "",
            aiGenerated: false,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "line_115",
            lineNumber: 115,
            category: "location-expenses",
            subcategory: "permits",
            description: "Permits",
            estimatedTotal: 10000,
            actualTotal: 0,
            notes: "",
            aiGenerated: false,
            lastUpdated: new Date().toISOString(),
          },
          // Add more location expenses...
        ],
      },
      {
        id: "props-wardrobe",
        name: "Props/Wardrobe/Animals",
        code: "E",
        estimatedTotal: 75500,
        actualTotal: 0,
        variance: -75500,
        variancePercent: -100,
        color: "bg-red-500",
        icon: Palette,
        items: [
          {
            id: "line_140",
            lineNumber: 140,
            category: "props-wardrobe",
            subcategory: "props",
            description: "Prop Rental",
            estimatedTotal: 2000,
            actualTotal: 0,
            notes: "",
            aiGenerated: false,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "line_144",
            lineNumber: 144,
            category: "props-wardrobe",
            subcategory: "vehicles",
            description: "Picture Vehicles (6 destroyed vehicles)",
            crew: 6,
            estimatedTotal: 65000,
            actualTotal: 0,
            notes: "",
            aiGenerated: false,
            lastUpdated: new Date().toISOString(),
          },
          // Add more props/wardrobe items...
        ],
      },
      {
        id: "equipment-rental",
        name: "Equipment Rental",
        code: "I",
        estimatedTotal: 99500,
        actualTotal: 0,
        variance: -99500,
        variancePercent: -100,
        color: "bg-indigo-500",
        icon: Camera,
        items: [
          {
            id: "line_193",
            lineNumber: 193,
            category: "equipment-rental",
            subcategory: "camera",
            description: "Camera Rental",
            estimatedTotal: 48000,
            actualTotal: 0,
            notes: "",
            aiGenerated: false,
            lastUpdated: new Date().toISOString(),
            source: "gear-management",
          },
          {
            id: "line_195",
            lineNumber: 195,
            category: "equipment-rental",
            subcategory: "lighting",
            description: "Lighting Rental (except 1 big HMI)",
            estimatedTotal: 2500,
            actualTotal: 0,
            notes: "",
            aiGenerated: false,
            lastUpdated: new Date().toISOString(),
            source: "gear-management",
          },
          // Add more equipment rental items...
        ],
      },
      {
        id: "talent",
        name: "Talent",
        code: "M",
        estimatedTotal: 277459,
        actualTotal: 0,
        variance: -277459,
        variancePercent: -100,
        color: "bg-pink-500",
        icon: Users,
        items: [
          {
            id: "line_234",
            lineNumber: 234,
            category: "talent",
            subcategory: "principals",
            description: "O/C Principal #1",
            crew: 1,
            days: 20,
            rate: 1000,
            estimatedTotal: 20000,
            actualTotal: 0,
            notes: "",
            aiGenerated: false,
            lastUpdated: new Date().toISOString(),
            source: "cast-management",
          },
          {
            id: "line_235",
            lineNumber: 235,
            category: "talent",
            subcategory: "principals",
            description: "O/C Principal #2",
            crew: 1,
            days: 17,
            rate: 1000,
            estimatedTotal: 17000,
            actualTotal: 0,
            notes: "",
            aiGenerated: false,
            lastUpdated: new Date().toISOString(),
            source: "cast-management",
          },
          // Add more talent items...
        ],
      },
    ]

    // Customize for different projects
    if (projectId === "2") {
      initialBudgetData.forEach(cat => {
        cat.estimatedTotal = Math.round(cat.estimatedTotal * 0.7);
        cat.actualTotal = Math.round(cat.actualTotal * 0.7);
        cat.items.forEach(item => {
          item.estimatedTotal = Math.round(item.estimatedTotal * 0.7);
          item.actualTotal = Math.round(item.actualTotal * 0.7);
        });
      });
    } else if (projectId === "3") {
      initialBudgetData.forEach(cat => {
        cat.estimatedTotal = Math.round(cat.estimatedTotal * 0.4);
        cat.actualTotal = Math.round(cat.actualTotal * 0.4);
        cat.items.forEach(item => {
          item.estimatedTotal = Math.round(item.estimatedTotal * 0.4);
          item.actualTotal = Math.round(item.actualTotal * 0.4);
        });
      });
    }

    MOCK_STORE[projectId] = initialBudgetData // Store it

    setBudgetData(initialBudgetData)
    setExpandedCategories(new Set(["pre-production", "production"]))

    // Generate initial AI suggestions
    generateAISuggestions(initialBudgetData)
  }, [projectId])

  // Sync back to store on change
  useEffect(() => {
    if (budgetData.length > 0 && projectId) {
      MOCK_STORE[projectId] = budgetData;
    }
  }, [budgetData, projectId]);

  // Add this useEffect after the existing useEffect for initializing budget data
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the budget table rows
      const target = event.target as HTMLElement
      const isTableRow = target.closest("tr")
      const isEditButton = target.closest("button")?.querySelector("svg")?.classList.contains("lucide-edit")

      // If clicking outside table rows or not on an edit button, exit edit mode
      if (!isTableRow || (!isEditButton && editingItem)) {
        setEditingItem(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [editingItem])

  // Generate AI suggestions based on budget data and other modules
  const generateAISuggestions = (data: BudgetCategory[]) => {
    const suggestions: AIBudgetSuggestion[] = [
      {
        type: "optimization",
        title: "Equipment Rental Optimization",
        description: "Based on gear management data, consolidating camera rentals could save 15% on equipment costs.",
        impact: "high",
        estimatedSavings: 7200,
        confidence: 85,
        action: "Review gear consolidation",
        lineItems: ["line_193"],
      },
      {
        type: "estimate",
        title: "Crew Rate Analysis",
        description: "Current crew rates are 12% below industry standard. Consider adjusting for competitive hiring.",
        impact: "medium",
        confidence: 78,
        action: "Review crew rates",
        lineItems: ["line_1", "line_51"],
      },
      {
        type: "alert",
        title: "Location Budget Risk",
        description:
          "Location expenses represent 13% of total budget. Weather delays could impact costs significantly.",
        impact: "high",
        confidence: 92,
        action: "Add contingency",
        lineItems: ["line_114", "line_115"],
      },
      {
        type: "comparison",
        title: "Talent Cost Benchmark",
        description: "Talent costs are within 5% of similar productions. Cast management data suggests good value.",
        impact: "low",
        confidence: 88,
        lineItems: ["line_234", "line_235"],
      },
    ]

    setAiSuggestions(suggestions)
  }

  // Calculate totals
  const calculateTotals = () => {
    const totalEstimated = budgetData.reduce((sum, category) => sum + category.estimatedTotal, 0)
    const totalActual = budgetData.reduce((sum, category) => sum + category.actualTotal, 0)
    const totalVariance = totalActual - totalEstimated
    const variancePercent = totalEstimated > 0 ? (totalVariance / totalEstimated) * 100 : 0

    return { totalEstimated, totalActual, totalVariance, variancePercent }
  }

  // Filter budget items
  const getFilteredCategories = () => {
    let filtered = budgetData

    if (filterCategory !== "all") {
      filtered = filtered.filter((category) => category.id === filterCategory)
    }

    if (showVarianceOnly) {
      filtered = filtered.filter((category) => Math.abs(category.variance) > 0)
    }

    if (searchQuery) {
      filtered = filtered.map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subcategory.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      }))
    }

    return filtered
  }

  // Update line item
  const updateLineItem = (categoryId: string, itemId: string, updates: Partial<BudgetLineItem>) => {
    setBudgetData((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
            ...category,
            items: category.items.map((item) =>
              item.id === itemId
                ? {
                  ...item,
                  ...updates,
                  lastUpdated: new Date().toISOString(),
                }
                : item,
            ),
          }
          : category,
      ),
    )
  }

  // Add new line item
  const addLineItem = (categoryId: string) => {
    const category = budgetData.find((cat) => cat.id === categoryId)
    if (!category) return

    const newItem: BudgetLineItem = {
      id: `line_${Date.now()}`,
      lineNumber: Math.max(...category.items.map((item) => item.lineNumber)) + 1,
      category: categoryId,
      subcategory: "misc",
      description: "New Line Item",
      estimatedTotal: 0,
      actualTotal: 0,
      notes: "",
      aiGenerated: false,
      lastUpdated: new Date().toISOString(),
    }

    setBudgetData((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
            ...cat,
            items: [...cat.items, newItem],
          }
          : cat,
      ),
    )
  }

  // Generate AI estimates
  const generateAIEstimates = async (prompt: string) => {
    setIsGeneratingEstimates(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock AI response - in real implementation, this would call an AI service
    const aiEstimates = [
      {
        categoryId: "equipment-rental",
        itemId: "line_193",
        estimatedTotal: 42000,
        notes: "AI suggests 12% reduction based on current market rates and bulk rental discounts",
        confidence: 87,
      },
      {
        categoryId: "location-expenses",
        itemId: "line_114",
        estimatedTotal: 22000,
        notes: "AI analysis of similar locations suggests 12% savings possible",
        confidence: 82,
      },
    ]

    // Apply AI estimates
    aiEstimates.forEach(({ categoryId, itemId, estimatedTotal, notes }) => {
      updateLineItem(categoryId, itemId, {
        estimatedTotal,
        notes: `${notes} (AI Generated)`,
        aiGenerated: true,
      })
    })

    setIsGeneratingEstimates(false)
    setAiPrompt("")
  }

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const totals = calculateTotals()
  const filteredCategories = getFilteredCategories()

  // Render line item row
  const renderLineItem = (item: BudgetLineItem, categoryId: string) => {
    const isEditing = editingItem === item.id
    const variance = item.actualTotal - item.estimatedTotal
    const variancePercent = item.estimatedTotal > 0 ? (variance / item.estimatedTotal) * 100 : 0

    return (
      <tr
        key={item.id}
        className={`border-b border-white/10 hover:bg-white/5 cursor-pointer ${item.aiGenerated ? "bg-purple-500/10" : ""}`}
        onClick={() => setEditingItem(item.id)}
      >
        <td className="px-4 py-3 text-white/70 text-sm">{item.lineNumber}</td>
        <td className="px-4 py-3">
          {isEditing ? (
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateLineItem(categoryId, item.id, { description: e.target.value })}
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm w-full"
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">{item.description}</span>
              {item.aiGenerated && <Brain className="h-4 w-4 text-purple-400" title="AI Generated" />}
              {item.source && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                  {item.source.replace("-", " ")}
                </span>
              )}
            </div>
          )}
        </td>
        <td className="px-4 py-3 text-center">
          {isEditing ? (
            <input
              type="number"
              value={item.crew || ""}
              onChange={(e) =>
                updateLineItem(categoryId, item.id, { crew: Number.parseInt(e.target.value) || undefined })
              }
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm w-16"
            />
          ) : (
            <span className="text-white/70 text-sm">{item.crew || "-"}</span>
          )}
        </td>
        <td className="px-4 py-3 text-center">
          {isEditing ? (
            <input
              type="number"
              value={item.days || ""}
              onChange={(e) =>
                updateLineItem(categoryId, item.id, { days: Number.parseInt(e.target.value) || undefined })
              }
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm w-16"
            />
          ) : (
            <span className="text-white/70 text-sm">{item.days || "-"}</span>
          )}
        </td>
        <td className="px-4 py-3 text-right">
          {isEditing ? (
            <input
              type="number"
              value={item.rate || ""}
              onChange={(e) =>
                updateLineItem(categoryId, item.id, { rate: Number.parseInt(e.target.value) || undefined })
              }
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm w-20"
            />
          ) : (
            <span className="text-white/70 text-sm">{item.rate ? `$${item.rate.toLocaleString()}` : "-"}</span>
          )}
        </td>
        <td className="px-4 py-3 text-right">
          {isEditing ? (
            <input
              type="number"
              value={item.estimatedTotal}
              onChange={(e) =>
                updateLineItem(categoryId, item.id, { estimatedTotal: Number.parseInt(e.target.value) || 0 })
              }
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm w-24"
            />
          ) : (
            <span className="text-white font-medium">${item.estimatedTotal.toLocaleString()}</span>
          )}
        </td>
        <td className="px-4 py-3 text-right">
          {isEditing ? (
            <input
              type="number"
              value={item.actualTotal}
              onChange={(e) =>
                updateLineItem(categoryId, item.id, { actualTotal: Number.parseInt(e.target.value) || 0 })
              }
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm w-24"
            />
          ) : (
            <span className="text-white font-medium">${item.actualTotal.toLocaleString()}</span>
          )}
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <span
              className={`font-medium ${variance > 0 ? "text-red-400" : variance < 0 ? "text-green-400" : "text-white/70"}`}
            >
              {variance !== 0 ? `$${Math.abs(variance).toLocaleString()}` : "-"}
            </span>
            {variance !== 0 && <span className="text-xs text-white/50">({variancePercent.toFixed(1)}%)</span>}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1 rounded hover:bg-green-500/20 transition-colors"
                >
                  <Save className="h-4 w-4 text-green-400" />
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1 rounded hover:bg-red-500/20 transition-colors"
                >
                  <X className="h-4 w-4 text-red-400" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditingItem(item.id)}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  <Edit className="h-4 w-4 text-white/70" />
                </button>
                <button className="p-1 rounded hover:bg-white/10 transition-colors">
                  <Copy className="h-4 w-4 text-white/70" />
                </button>
                <button className="p-1 rounded hover:bg-red-500/20 transition-colors">
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Production Budget</h1>
          <p className="text-white/70">Comprehensive budget tracking with AI-powered estimates and analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIAssistant(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            <Brain className="h-4 w-4" />
            AI Budget Assistant
          </button>
          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            <Upload className="h-4 w-4" />
            Import
          </button>
        </div>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-5 w-5 text-blue-400" />
            <span className="text-white/70 text-sm">Total Estimated</span>
          </div>
          <p className="text-white font-bold text-2xl">${totals.totalEstimated.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            <span className="text-white/70 text-sm">Total Actual</span>
          </div>
          <p className="text-white font-bold text-2xl">${totals.totalActual.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            {totals.totalVariance >= 0 ? (
              <TrendingUp className="h-5 w-5 text-red-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-green-400" />
            )}
            <span className="text-white/70 text-sm">Variance</span>
          </div>
          <p className={`font-bold text-2xl ${totals.totalVariance >= 0 ? "text-red-400" : "text-green-400"}`}>
            {totals.totalVariance >= 0 ? "+" : ""}${totals.totalVariance.toLocaleString()}
          </p>
          <p className="text-white/60 text-sm">{totals.variancePercent.toFixed(1)}%</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-purple-400" />
            <span className="text-white/70 text-sm">Budget Health</span>
          </div>
          <p
            className={`font-bold text-2xl ${Math.abs(totals.variancePercent) < 5 ? "text-green-400" : Math.abs(totals.variancePercent) < 15 ? "text-yellow-400" : "text-red-400"}`}
          >
            {Math.abs(totals.variancePercent) < 5
              ? "Excellent"
              : Math.abs(totals.variancePercent) < 15
                ? "Good"
                : "At Risk"}
          </p>
        </div>
      </div>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">AI Budget Intelligence</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiSuggestions.slice(0, 4).map((suggestion, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  {suggestion.type === "optimization" && <Sparkles className="h-4 w-4 text-blue-400" />}
                  {suggestion.type === "alert" && <AlertTriangle className="h-4 w-4 text-red-400" />}
                  {suggestion.type === "estimate" && <Calculator className="h-4 w-4 text-green-400" />}
                  {suggestion.type === "comparison" && <BarChart3 className="h-4 w-4 text-purple-400" />}
                  <h3 className="text-white font-medium text-sm">{suggestion.title}</h3>
                  <span className="text-xs text-white/50">({suggestion.confidence}% confidence)</span>
                </div>
                <p className="text-white/70 text-xs mb-2">{suggestion.description}</p>
                <div className="flex items-center justify-between">
                  {suggestion.estimatedSavings && (
                    <span className="text-green-400 text-xs font-medium">
                      Save: ${suggestion.estimatedSavings.toLocaleString()}
                    </span>
                  )}
                  {suggestion.action && (
                    <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs transition-colors">
                      {suggestion.action}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-white/70" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            >
              <option value="all">All Categories</option>
              {budgetData.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-white/70 text-sm">
            <input
              type="checkbox"
              checked={showVarianceOnly}
              onChange={(e) => setShowVarianceOnly(e.target.checked)}
              className="rounded"
            />
            Show variance only
          </label>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1 border border-white/20">
            <button
              onClick={() => setViewMode("detailed")}
              className={`px-3 py-2 rounded-md transition-colors ${viewMode === "detailed" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                }`}
            >
              Detailed
            </button>
            <button
              onClick={() => setViewMode("summary")}
              className={`px-3 py-2 rounded-md transition-colors ${viewMode === "summary" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                }`}
            >
              Summary
            </button>
            <button
              onClick={() => setViewMode("comparison")}
              className={`px-3 py-2 rounded-md transition-colors ${viewMode === "comparison" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                }`}
            >
              Comparison
            </button>
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="space-y-4">
        {filteredCategories.map((category) => {
          const isExpanded = expandedCategories.has(category.id)
          const variancePercent = category.estimatedTotal > 0 ? (category.variance / category.estimatedTotal) * 100 : 0

          return (
            <div
              key={category.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
            >
              {/* Category Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {category.code}. {category.name}
                    </h3>
                    <p className="text-white/60 text-sm">{category.items.length} line items</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-white font-medium">${category.estimatedTotal.toLocaleString()}</p>
                    <p className="text-white/60 text-sm">Estimated</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">${category.actualTotal.toLocaleString()}</p>
                    <p className="text-white/60 text-sm">Actual</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${category.variance >= 0 ? "text-red-400" : "text-green-400"}`}>
                      {category.variance >= 0 ? "+" : ""}${category.variance.toLocaleString()}
                    </p>
                    <p className="text-white/60 text-sm">({variancePercent.toFixed(1)}%)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        addLineItem(category.id)
                      }}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Plus className="h-4 w-4 text-white/70" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-white/70" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-white/70" />
                    )}
                  </div>
                </div>
              </div>

              {/* Category Items */}
              {isExpanded && (
                <div className="border-t border-white/10">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-4 py-3 text-left text-white/70 text-sm font-medium">#</th>
                          <th className="px-4 py-3 text-left text-white/70 text-sm font-medium">Description</th>
                          <th className="px-4 py-3 text-center text-white/70 text-sm font-medium">Crew</th>
                          <th className="px-4 py-3 text-center text-white/70 text-sm font-medium">Days</th>
                          <th className="px-4 py-3 text-right text-white/70 text-sm font-medium">Rate</th>
                          <th className="px-4 py-3 text-right text-white/70 text-sm font-medium">Estimated</th>
                          <th className="px-4 py-3 text-right text-white/70 text-sm font-medium">Actual</th>
                          <th className="px-4 py-3 text-right text-white/70 text-sm font-medium">Variance</th>
                          <th className="px-4 py-3 text-center text-white/70 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>{category.items.map((item) => renderLineItem(item, category.id))}</tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Brain className="h-8 w-8 text-purple-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">AI Budget Assistant</h2>
                    <p className="text-white/70">Get intelligent budget estimates and optimization suggestions</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIAssistant(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm">What would you like help with?</label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/50 resize-none mt-2"
                    rows={3}
                    placeholder="e.g., 'Estimate crew costs for 25-day shoot' or 'Optimize equipment rental budget'"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <Calculator className="h-4 w-4 text-blue-400" />
                      <span className="text-white font-medium text-sm">Generate Estimates</span>
                    </div>
                    <p className="text-white/60 text-xs">Create budget estimates based on project data</p>
                  </button>
                  <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-white font-medium text-sm">Optimize Costs</span>
                    </div>
                    <p className="text-white/60 text-xs">Find cost-saving opportunities and efficiencies</p>
                  </button>
                  <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="h-4 w-4 text-purple-400" />
                      <span className="text-white font-medium text-sm">Compare Budgets</span>
                    </div>
                    <p className="text-white/60 text-xs">Compare with industry standards and similar projects</p>
                  </button>
                  <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-white font-medium text-sm">Risk Analysis</span>
                    </div>
                    <p className="text-white/60 text-xs">Identify potential budget risks and contingencies</p>
                  </button>
                </div>

                <button
                  onClick={() => generateAIEstimates(aiPrompt)}
                  disabled={!aiPrompt.trim() || isGeneratingEstimates}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-all duration-300 font-medium"
                >
                  {isGeneratingEstimates ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating AI Estimates...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 inline mr-2" />
                      Generate AI Recommendations
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
