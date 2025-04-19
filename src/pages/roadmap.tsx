"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import cytoscape from "cytoscape"
import dagre from "cytoscape-dagre"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheckCircle,
  faSearch,
  faPlus,
  faMinus,
  faRedo,
  faInfoCircle,
  faDownload,
  faList,
  faProjectDiagram,
  faRocket,
  faCode,
  faGraduationCap,
  faServer,
  faLink,
  faPalette,
  faShieldAlt,
  faMobile,
  faCloud,
  faDatabase,
  faShip,
} from "@fortawesome/free-solid-svg-icons"
import { faDocker } from "@fortawesome/free-brands-svg-icons"

// Register the dagre layout extension for cytoscape
if (typeof window !== "undefined") {
  cytoscape.use(dagre)
}

// Define types for roadmap data
type RoadmapType =
  | "frontend"
  | "backend"
  | "devops"
  | "python"
  | "nodejs"
  | "blockchain"
  | "qa"
  | "react"
  | "angular"
  | "vue"
  | "javascript"
  | "java"
  | "golang"
  | "design-system"
  | "system-design"
  | "computer-science"
  | "cyber-security"
  | "android"
  | "aws"
  | "docker"
  | "graphql"
  | "kubernetes"

interface RoadmapNode {
  id: string
  data: {
    label: string
    description?: string
  }
  type?: string
  position?: {
    x: number
    y: number
  }
}

interface RoadmapEdge {
  id?: string
  source: string
  target: string
  from?: string
  to?: string
  type?: string
}

interface RoadmapData {
  title?: string
  description?: string
  nodes: RoadmapNode[]
  edges: RoadmapEdge[]
}

interface RoadmapOption {
  value: RoadmapType
  label: string
  description: string
  color: string
  icon: any
}

const ColorfulRoadmap: React.FC = () => {
  const [roadmapType, setRoadmapType] = useState<RoadmapType>("frontend")
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [completedSkills, setCompletedSkills] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("graph")
  const [roadmapTitle, setRoadmapTitle] = useState<string>("Frontend Developer")
  const containerRef = useRef<HTMLDivElement>(null)
  const cy = useRef<any>(null)

  // Available roadmap options with descriptions, theme colors, and icons
  const roadmapOptions: RoadmapOption[] = [
    {
      value: "frontend",
      label: "Frontend Developer",
      description: "HTML, CSS, JavaScript, and modern frameworks",
      color: "#FF6B6B", // Vibrant red
      icon: faCode,
    },
    {
      value: "backend",
      label: "Backend Developer",
      description: "Server-side programming and databases",
      color: "#4ECDC4", // Teal
      icon: faServer,
    },
    {
      value: "devops",
      label: "DevOps Engineer",
      description: "CI/CD, infrastructure, and deployment",
      color: "#45B7D1", // Blue
      icon: faRocket,
    },
    {
      value: "python",
      label: "Python Developer",
      description: "Python programming and frameworks",
      color: "#9775FA", // Purple
      icon: faCode,
    },
    {
      value: "nodejs",
      label: "Node.js Developer",
      description: "Server-side JavaScript with Node.js",
      color: "#7ED957", // Green
      icon: faCode,
    },
    {
      value: "blockchain",
      label: "Blockchain Developer",
      description: "Blockchain technologies and smart contracts",
      color: "#FFD166", // Yellow
      icon: faLink,
    },
    {
      value: "qa",
      label: "QA Engineer",
      description: "Testing methodologies and tools",
      color: "#F78FB3", // Pink
      icon: faCheckCircle,
    },
    {
      value: "react",
      label: "React Developer",
      description: "React library and ecosystem",
      color: "#61DAFB", // React blue
      icon: faCode,
    },
    {
      value: "angular",
      label: "Angular Developer",
      description: "Angular framework and ecosystem",
      color: "#DD0031", // Angular red
      icon: faCode,
    },
    {
      value: "vue",
      label: "Vue Developer",
      description: "Vue.js framework and ecosystem",
      color: "#42B883", // Vue green
      icon: faCode,
    },
    {
      value: "javascript",
      label: "JavaScript Developer",
      description: "JavaScript language and ecosystem",
      color: "#F7DF1E", // JS yellow
      icon: faCode,
    },
    {
      value: "java",
      label: "Java Developer",
      description: "Java programming and frameworks",
      color: "#007396", // Java blue
      icon: faCode,
    },
    {
      value: "golang",
      label: "Go Developer",
      description: "Go programming language",
      color: "#00ADD8", // Go blue
      icon: faCode,
    },
    {
      value: "design-system",
      label: "Design System",
      description: "Building and maintaining design systems",
      color: "#FF9A8B", // Coral
      icon: faPalette,
    },
    {
      value: "system-design",
      label: "System Design",
      description: "Designing scalable systems and architecture",
      color: "#FF8E53", // Orange
      icon: faProjectDiagram,
    },
    {
      value: "computer-science",
      label: "Computer Science",
      description: "CS fundamentals and algorithms",
      color: "#6A67CE", // Indigo
      icon: faGraduationCap,
    },
    {
      value: "cyber-security",
      label: "Cyber Security",
      description: "Security principles and practices",
      color: "#FF5757", // Red
      icon: faShieldAlt,
    },
    {
      value: "android",
      label: "Android Developer",
      description: "Android app development",
      color: "#3DDC84", // Android green
      icon: faMobile,
    },
    {
      value: "aws",
      label: "AWS Cloud",
      description: "Amazon Web Services",
      color: "#FF9900", // AWS orange
      icon: faCloud,
    },
    {
      value: "docker",
      label: "Docker",
      description: "Containerization with Docker",
      color: "#2496ED", // Docker blue
      icon: faDocker,
    },
    {
      value: "graphql",
      label: "GraphQL",
      description: "API query language",
      color: "#E535AB", // GraphQL pink
      icon: faDatabase,
    },
    {
      value: "kubernetes",
      label: "Kubernetes",
      description: "Container orchestration",
      color: "#326CE5", // Kubernetes blue
      icon: faShip,
    },
  ]



  // Get the current roadmap color theme
  const getCurrentRoadmapColor = () => {
    const roadmap = roadmapOptions.find((option) => option.value === roadmapType)
    return roadmap ? roadmap.color : "#3B82F6"
  }

  // Map of roadmap types to their respective file paths/formats
  const roadmapSourceMap: Record<RoadmapType, string[]> = {
    frontend: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/frontend/frontend.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/frontend.json",
    ],
    backend: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/backend/backend.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/backend.json",
    ],
    devops: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/devops/devops.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/devops.json",
    ],
    python: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/python/python.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/python.json",
    ],
    nodejs: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/nodejs/nodejs.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/nodejs.json",
    ],
    blockchain: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/blockchain/blockchain.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/blockchain.json",
    ],
    qa: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/qa/qa.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/qa.json",
    ],
    react: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/react/react.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/react.json",
    ],
    angular: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/angular/angular.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/angular.json",
    ],
    vue: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/vue/vue.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/vue.json",
    ],
    javascript: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/javascript/javascript.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/javascript.json",
    ],
    java: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/java/java.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/java.json",
    ],
    golang: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/golang/golang.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/golang.json",
    ],
    "design-system": [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/design-system/design-system.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/design-system.json",
    ],
    "system-design": [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/system-design/system-design.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/system-design.json",
    ],
    "computer-science": [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/computer-science/computer-science.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/computer-science.json",
    ],
    "cyber-security": [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/cyber-security/cyber-security.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/cyber-security.json",
    ],
    android: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/android/android.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/android.json",
    ],
    aws: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/aws/aws.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/aws.json",
    ],
    docker: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/docker/docker.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/docker.json",
    ],
    graphql: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/graphql/graphql.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/graphql.json",
    ],
    kubernetes: [
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/kubernetes/kubernetes.json",
      "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/public/jsons/kubernetes.json",
    ],
  }

  // Normalize roadmap data to handle different formats
  const normalizeRoadmapData = (data: any): RoadmapData => {
    // If data already has nodes and edges in the expected format
    if (data.nodes && data.edges) {
      return {
        title: data.title || "",
        description: data.description || "",
        nodes: data.nodes.map((node: any) => ({
          id: node.id,
          data: {
            label: node.data?.label || node.name || node.text || "",
            description: node.data?.description || node.description || "",
          },
          type: node.type || node.category || "default",
        })),
        edges: data.edges.map((edge: any) => ({
          id: edge.id || `${edge.source || edge.from}-${edge.target || edge.to}`,
          source: edge.source || edge.from,
          target: edge.target || edge.to,
          type: edge.type || "default",
        })),
      }
    }

    // Handle alternative format (mockup)
    if (data.mockup) {
      const nodes = data.mockup.nodes.map((node: any) => ({
        id: node.id,
        data: {
          label: node.text || node.name || "",
          description: node.description || "",
        },
        type: node.category || "default",
      }))

      const edges = data.mockup.connections.map((conn: any) => ({
        id: `${conn.from}-${conn.to}`,
        source: conn.from,
        target: conn.to,
        type: conn.connectionType || "default",
      }))

      return {
        title: data.title || "",
        description: data.description || "",
        nodes,
        edges,
      }
    }

    // Handle other formats or return empty data
    return {
      title: data.title || "",
      description: data.description || "",
      nodes: [],
      edges: [],
    }
  }

  // Fetch roadmap data with improved error handling and fallback mechanism
  const fetchRoadmapData = async (type: RoadmapType) => {
    setLoading(true)
    setError(null)

    // Try each URL in the source map until one works
    const urls = roadmapSourceMap[type]
    let success = false

    for (const url of urls) {
      try {
        console.log(`Trying to fetch roadmap data from: ${url}`)
        const response = await axios.get(url)
        const normalizedData = normalizeRoadmapData(response.data)

        // Only set data if we have nodes
        if (normalizedData.nodes.length > 0) {
          setRoadmapData(normalizedData)

          // Update roadmap title
          const selectedRoadmap = roadmapOptions.find((option) => option.value === type)
          if (selectedRoadmap) {
            setRoadmapTitle(selectedRoadmap.label)
          }

          success = true
          break
        }
      } catch (err) {
        console.warn(`Failed to fetch from ${url}:`, err)
        // Continue to next URL
      }
    }

    if (!success) {
      setError("Failed to load roadmap data. Please try again later or select a different roadmap.")
    }

    setLoading(false)
  }

  // Load saved progress from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSkills = localStorage.getItem(`roadmap-${roadmapType}-skills`)
      if (savedSkills) {
        setCompletedSkills(new Set(JSON.parse(savedSkills)))
      } else {
        setCompletedSkills(new Set())
      }
    }
  }, [roadmapType])

  // Fetch roadmap data when type changes
  useEffect(() => {
    fetchRoadmapData(roadmapType)
  }, [roadmapType])

  // Generate and initialize Cytoscape graph when data is loaded
  useEffect(() => {
    if (!roadmapData || !containerRef.current || activeTab !== "graph" || typeof window === "undefined") return

    // Create Cytoscape elements from roadmap data
    const elements: any[] = []
    const themeColor = getCurrentRoadmapColor()

    // Generate a color palette based on the theme color
    const generateColorPalette = (baseColor: string, count: number) => {
      // Simple function to generate a palette - in a real app you might use a library
      const colors = []
      const hslRegex = /hsl$$(\d+),\s*([\d.]+)%,\s*([\d.]+)%$$/

      // Convert hex to HSL for easier manipulation
      const hexToHSL = (hex: string) => {
        // Convert hex to RGB first
        let r = 0,
          g = 0,
          b = 0
        if (hex.length === 4) {
          r = Number.parseInt(hex[1] + hex[1], 16)
          g = Number.parseInt(hex[2] + hex[2], 16)
          b = Number.parseInt(hex[3] + hex[3], 16)
        } else if (hex.length === 7) {
          r = Number.parseInt(hex.substring(1, 3), 16)
          g = Number.parseInt(hex.substring(3, 5), 16)
          b = Number.parseInt(hex.substring(5, 7), 16)
        }

        // Convert RGB to HSL
        r /= 255
        g /= 255
        b /= 255
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        let h = 0,
          s = 0,
          l = (max + min) / 2

        if (max !== min) {
          const d = max - min
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0)
              break
            case g:
              h = (b - r) / d + 2
              break
            case b:
              h = (r - g) / d + 4
              break
          }
          h /= 6
        }

        return { h: h * 360, s: s * 100, l: l * 100 }
      }

      const hsl = hexToHSL(baseColor)

      // Generate colors with different hues
      for (let i = 0; i < count; i++) {
        const newHue = (hsl.h + (i * 360) / count) % 360
        colors.push(`hsl(${newHue}, ${hsl.s}%, ${hsl.l}%)`)
      }

      return colors
    }

    // Generate a palette of colors for nodes
    const nodeColors = generateColorPalette(themeColor, 5)

    // Function to get a color based on node type and depth
    const getNodeColor = (node: any, depth: number) => {
      const nodeType = node.type || "default"
      const isCompleted = completedSkills.has(node.id)

      // Base colors for different node types
      let bgColor
      let borderColor
      const textColor = "#ffffff" // White text for better contrast
      let borderWidth = 2

      // Assign colors based on node type and depth
      if (nodeType === "core" || node.id.includes("core") || nodeType === "recommended-basic") {
        bgColor = nodeColors[0]
        borderColor = themeColor
      } else if (nodeType === "recommended" || node.id.includes("recommended") || nodeType === "recommended-advanced") {
        bgColor = nodeColors[1]
        borderColor = nodeColors[0]
      } else if (nodeType === "optional" || node.id.includes("optional")) {
        bgColor = nodeColors[2]
        borderColor = nodeColors[1]
      } else {
        // Use depth to determine color for other nodes
        const colorIndex = depth % nodeColors.length
        bgColor = nodeColors[colorIndex]
        borderColor = nodeColors[(colorIndex + 1) % nodeColors.length]
      }

      // If completed, add a special border
      if (isCompleted) {
        borderColor = "#22c55e" // Green
        borderWidth = 3
        // Add a slight glow effect
        bgColor = bgColor.replace(")", ", 0.9)")
      }

      return { bgColor, borderColor, textColor, borderWidth }
    }

    // Calculate node depths (distance from root nodes)
    const calculateNodeDepths = () => {
      const depths: Record<string, number> = {}
      const visited = new Set<string>()
      const queue: { id: string; depth: number }[] = []

      // Find root nodes (nodes with no incoming edges)
      const hasIncomingEdge = new Set<string>()
      roadmapData.edges.forEach((edge) => {
        hasIncomingEdge.add(edge.target)
      })

      // Add root nodes to queue
      roadmapData.nodes.forEach((node) => {
        if (!hasIncomingEdge.has(node.id)) {
          queue.push({ id: node.id, depth: 0 })
          visited.add(node.id)
        }
      })

      // BFS to calculate depths
      while (queue.length > 0) {
        const { id, depth } = queue.shift()!
        depths[id] = depth

        // Find outgoing edges
        roadmapData.edges
          .filter((edge) => edge.source === id)
          .forEach((edge) => {
            if (!visited.has(edge.target)) {
              queue.push({ id: edge.target, depth: depth + 1 })
              visited.add(edge.target)
            }
          })
      }

      // Assign default depth for any nodes not visited
      roadmapData.nodes.forEach((node) => {
        if (!depths[node.id]) {
          depths[node.id] = 0
        }
      })

      return depths
    }

    const nodeDepths = calculateNodeDepths()

    // Add nodes to elements with colorful styling
    roadmapData.nodes.forEach((node) => {
      const depth = nodeDepths[node.id] || 0
      const { bgColor, borderColor, textColor, borderWidth } = getNodeColor(node, depth)

      // Create the node
      elements.push({
        data: {
          id: node.id,
          label: node.data.label,
          description: node.data.description || "",
          completed: completedSkills.has(node.id),
          bgColor,
          textColor,
          borderColor,
          borderWidth,
          nodeType: node.type || "default",
          depth,
        },
        group: "nodes",
      })
    })

    // Generate edge colors based on source and target nodes
    const getEdgeStyle = (sourceId: string, targetId: string) => {
      const sourceNode = roadmapData.nodes.find((n) => n.id === sourceId)
      const targetNode = roadmapData.nodes.find((n) => n.id === targetId)
      const sourceType = sourceNode?.type || "default"
      const targetType = targetNode?.type || "default"

      const sourceDepth = nodeDepths[sourceId] || 0
      const targetDepth = nodeDepths[targetId] || 0

      let edgeStyle = "solid"
      let edgeWidth = 2

      // Get colors from the nodes
      const sourceColor = getNodeColor(sourceNode || {}, sourceDepth).bgColor
      const targetColor = getNodeColor(targetNode || {}, targetDepth).bgColor

      // Create a gradient between source and target colors
      const edgeColor = `linear-gradient(${sourceColor}, ${targetColor})`

      // If optional path, use dotted line
      if (sourceType === "optional" || targetType === "optional") {
        edgeStyle = "dotted"
      }

      // If both nodes are completed, make the edge thicker
      if (completedSkills.has(sourceId) && completedSkills.has(targetId)) {
        edgeWidth = 3
      }

      return { edgeStyle, edgeColor, edgeWidth }
    }

    // Add edges to elements with colorful styling
    roadmapData.edges.forEach((edge) => {
      const sourceId = edge.source || edge.from
      const targetId = edge.target || edge.to

      if (sourceId && targetId) {
        const { edgeStyle, edgeColor, edgeWidth } = getEdgeStyle(sourceId, targetId)

        elements.push({
          data: {
            id: edge.id || `${sourceId}-${targetId}`,
            source: sourceId,
            target: targetId,
            style: edgeStyle,
            color: edgeColor,
            width: edgeWidth,
          },
          group: "edges",
        })
      }
    })

    // Initialize Cytoscape with enhanced styling
    cy.current = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "text-valign": "center",
            "text-halign": "center",
            "background-color": "data(bgColor)",
            color: "data(textColor)",
            "border-color": "data(borderColor)",
            "border-width": "data(borderWidth)",
            padding: "12px",
            shape: "roundrectangle",
            width: "label",
            height: "label",
            "text-wrap": "wrap",
            "text-max-width": "200px",
            "font-size": "13px",
            "text-margin-y": 5,
            "shadow-blur": 10,
            "shadow-color": "#00000040",
            "shadow-opacity": 0.8,
            "shadow-offset-x": 0,
            "shadow-offset-y": 4,
            "text-outline-color": "#00000033",
            "text-outline-width": 1,
          },
        },
        {
          selector: "edge",
          style: {
            width: "data(width)",
            "line-color": "data(color)",
            "target-arrow-color": "data(color)",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "arrow-scale": 0.8,
            "line-style": "data(style)",
          },
        },
        {
          selector: "node.highlight",
          style: {
            "border-color": "#3b82f6",
            "border-width": 3,
            "background-color": "#eff6ff",
            "shadow-blur": 20,
            "shadow-color": "#3b82f680",
            "shadow-opacity": 1,
            "shadow-offset-x": 0,
            "shadow-offset-y": 0,
            "text-outline-color": "#ffffff",
            "text-outline-width": 2,
          },
        },
        {
          selector: "node:selected",
          style: {
            "border-color": "#6366f1",
            "border-width": 3,
            "background-color": "#eef2ff",
            "shadow-blur": 20,
            "shadow-color": "#6366f180",
            "shadow-opacity": 1,
          },
        },
        {
          selector: "edge.highlight",
          style: {
            "line-color": "#3b82f6",
            "target-arrow-color": "#3b82f6",
            width: 3,
            "shadow-blur": 5,
            "shadow-color": "#3b82f680",
            "shadow-opacity": 1,
          },
        },
      ],
      layout: {
        name: "dagre",
        rankDir: "TB", // Top to Bottom layout
        nodeSep: 80,
        rankSep: 150,
        padding: 50,
        animate: true,
        animationDuration: 800,
        fit: true,
      },
      wheelSensitivity: 0.3,
      minZoom: 0.2,
      maxZoom: 3,
    })

    // Add node click event to toggle completion
    cy.current.on("tap", "node", (event: any) => {
      const nodeId = event.target.id()
      toggleSkill(nodeId)
    })

    // Add node hover event to show tooltip
    cy.current.on("mouseover", "node", (event: any) => {
      const node = event.target
      const description = node.data("description")

      if (description && containerRef.current) {
        const tooltip = document.createElement("div")
        tooltip.id = "cy-tooltip"
        tooltip.className = "absolute bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm z-20 max-w-xs"
        tooltip.innerHTML = description

        const renderedPosition = node.renderedPosition()
        const containerRect = containerRef.current.getBoundingClientRect()

        tooltip.style.left = `${renderedPosition.x + containerRect.left}px`
        tooltip.style.top = `${renderedPosition.y + containerRect.top - 50}px`
        tooltip.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)"
        tooltip.style.borderLeft = `4px solid ${node.data("borderColor")}`

        document.body.appendChild(tooltip)
      }
    })

    cy.current.on("mouseout", "node", () => {
      const tooltip = document.getElementById("cy-tooltip")
      if (tooltip) {
        tooltip.remove()
      }
    })

    // Add animation for completed nodes
    const animateCompletedNodes = () => {
      cy.current.nodes().forEach((node: any) => {
        if (node.data("completed")) {
          node.animate({
            style: {
              "border-width": 4,
              "border-opacity": 0.8,
            },
            duration: 1000,
            complete: () => {
              node.animate({
                style: {
                  "border-width": 3,
                  "border-opacity": 1,
                },
                duration: 1000,
                complete: animateCompletedNodes,
              })
            },
          })
        }
      })
    }

    // Start animation
    animateCompletedNodes()

    // Clean up function
    return () => {
      if (cy.current) {
        cy.current.destroy()
      }

      const tooltip = document.getElementById("cy-tooltip")
      if (tooltip) {
        tooltip.remove()
      }
    }
  }, [roadmapData, completedSkills, activeTab])

  // Update node styles when search term changes
  useEffect(() => {
    if (!cy.current || !roadmapData || activeTab !== "graph") return

    // Reset all highlights
    cy.current.elements().removeClass("highlight")

    if (searchTerm) {
      // Find nodes that match the search term
      const matchingNodes = roadmapData.nodes.filter(
        (node) =>
          node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (node.data.description && node.data.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )

      // Highlight matching nodes
      matchingNodes.forEach((node) => {
        const cyNode = cy.current.$(`#${CSS.escape(node.id)}`)
        if (cyNode) {
          cyNode.addClass("highlight")
        }
      })

      // Center the view on the first matching node if any
      if (matchingNodes.length > 0) {
        const firstNode = cy.current.$(`#${CSS.escape(matchingNodes[0].id)}`)
        cy.current.animate({
          center: { eles: firstNode },
          zoom: 1.5,
          duration: 500,
        })
      }
    } else {
      // Reset view if search is cleared
      cy.current.fit()
    }
  }, [searchTerm, roadmapData, activeTab])

  // Save completed skills to localStorage
  const saveCompletedSkills = (skills: Set<string>) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`roadmap-${roadmapType}-skills`, JSON.stringify(Array.from(skills)))
    }
  }

  // Toggle skill completion status
  const toggleSkill = (nodeId: string) => {
    setCompletedSkills((prev) => {
      const newSet = new Set(prev)

      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }

      saveCompletedSkills(newSet)
      return newSet
    })
  }

  // Export progress as JSON
  const exportProgress = () => {
    if (!roadmapData) return

    const exportData = {
      roadmapType,
      roadmapTitle,
      completedSkills: Array.from(completedSkills),
      totalSkills: roadmapData.nodes.length,
      exportDate: new Date().toISOString(),
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `${roadmapType}-progress.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  // Calculate progress percentage
  const progressPercentage = roadmapData ? Math.round((completedSkills.size / roadmapData.nodes.length) * 100) : 0

  // Reset the view to fit all elements
  const resetView = () => {
    if (cy.current) {
      cy.current.fit()
    }
  }

  // Zoom in
  const zoomIn = () => {
    if (cy.current) {
      cy.current.zoom(cy.current.zoom() * 1.2)
    }
  }

  // Zoom out
  const zoomOut = () => {
    if (cy.current) {
      cy.current.zoom(cy.current.zoom() / 1.2)
    }
  }

  // Group skills by category
  const getSkillsByCategory = () => {
    if (!roadmapData) return {}

    const categories: Record<string, RoadmapNode[]> = {
      "Core Skills": [],
      Recommended: [],
      Optional: [],
      Other: [],
    }

    roadmapData.nodes.forEach((node) => {
      const nodeType = node.type || ""

      if (nodeType.includes("core") || node.id.includes("core") || nodeType === "recommended-basic") {
        categories["Core Skills"].push(node)
      } else if (
        nodeType.includes("recommended") ||
        node.id.includes("recommended") ||
        nodeType === "recommended-advanced"
      ) {
        categories["Recommended"].push(node)
      } else if (nodeType.includes("optional") || node.id.includes("optional")) {
        categories["Optional"].push(node)
      } else {
        categories["Other"].push(node)
      }
    })

    // Remove empty categories
    Object.keys(categories).forEach((key) => {
      if (categories[key].length === 0) {
        delete categories[key]
      }
    })

    return categories
  }

  // Custom CSS for the component
  const styles = `
    .roadmap-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    #cy-tooltip {
      transition: all 0.2s ease;
      pointer-events: none;
      z-index: 9999;
      animation: fadeIn 0.2s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
      100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }

    .node-pulse {
      animation: pulse 1.5s infinite;
    }

    .progress-bar-gradient {
      background: linear-gradient(90deg, #4ade80 0%, #3b82f6 50%, #8b5cf6 100%);
    }

    .roadmap-card {
      transition: all 0.3s ease;
    }

    .roadmap-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .category-badge {
      background: linear-gradient(45deg, #3b82f6, #8b5cf6);
    }

    .completed-badge {
      background: linear-gradient(45deg, #10b981, #4ade80);
    }

    /* Custom scrollbar for better UX */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #a1a1a1;
    }
  `

  return (
    <div className="py-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <style>{styles}</style>
      <div className="container mx-auto px-4">
        {/* Roadmap selection and search controls */}
        <div className="mb-6 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                {roadmapTitle} Roadmap
              </h3>
              <p className="text-sm text-gray-500">Track your progress toward career goals</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search skills..."
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 pr-3 py-2 text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <select
                value={roadmapType}
                onChange={(e) => setRoadmapType(e.target.value as RoadmapType)}
                className="block rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 pl-3 pr-10 text-sm"
                style={{
                  background: `linear-gradient(45deg, ${getCurrentRoadmapColor()}20, white)`,
                  borderLeft: `4px solid ${getCurrentRoadmapColor()}`,
                }}
              >
                {roadmapOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-lg font-medium text-gray-800">Your Progress</p>
              <p className="text-sm text-gray-600">
                Completed <span className="font-bold text-blue-600">{completedSkills.size}</span> of{" "}
                <span className="font-bold text-blue-600">{roadmapData?.nodes.length || 0}</span> skills
              </p>
            </div>
            <div className="w-full sm:w-1/2">
              <div className="bg-gray-100 overflow-hidden h-5 rounded-full">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-in-out progress-bar-gradient"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Advanced</span>
              </div>
            </div>
            <button
              onClick={exportProgress}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md"
              title="Export your progress"
            >
              <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
              <span>Export Progress</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <div
                className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 opacity-70"
                style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
              ></div>
            </div>
            <p className="ml-4 text-lg font-medium text-gray-700">Loading roadmap...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 my-6 shadow-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading roadmap</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={() => fetchRoadmapData(roadmapType)}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs for different views */}
        {!loading && !error && roadmapData && (
          <div>
            <div className="mb-4 border-b border-gray-200">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                <li className="mr-2">
                  <button
                    className={`inline-block p-4 rounded-t-lg ${
                      activeTab === "graph"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                        : "text-gray-500 hover:text-gray-600 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab("graph")}
                  >
                    <FontAwesomeIcon icon={faProjectDiagram} className="h-4 w-4 mr-2" />
                    Graph View
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    className={`inline-block p-4 rounded-t-lg ${
                      activeTab === "list"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                        : "text-gray-500 hover:text-gray-600 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab("list")}
                  >
                    <FontAwesomeIcon icon={faList} className="h-4 w-4 mr-2" />
                    List View
                  </button>
                </li>
              </ul>
            </div>

            {/* Graph View */}
            {activeTab === "graph" && (
              <div className="relative">
                {/* Graph controls */}
                <div className="absolute top-4 right-4 flex space-x-2 z-10">
                  <button
                    onClick={zoomIn}
                    className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    title="Zoom in"
                  >
                    <FontAwesomeIcon icon={faPlus} className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={zoomOut}
                    className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    title="Zoom out"
                  >
                    <FontAwesomeIcon icon={faMinus} className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={resetView}
                    className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    title="Reset view"
                  >
                    <FontAwesomeIcon icon={faRedo} className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Legend */}
                <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Legend</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-xs">
                      <div
                        className="w-5 h-5 rounded-md mr-2"
                        style={{ background: "linear-gradient(45deg, #FF6B6B, #FF8E8E)" }}
                      ></div>
                      <span>Core Skills</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div
                        className="w-5 h-5 rounded-md mr-2"
                        style={{ background: "linear-gradient(45deg, #4ECDC4, #7DDFD9)" }}
                      ></div>
                      <span>Recommended Skills</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div
                        className="w-5 h-5 rounded-md mr-2"
                        style={{ background: "linear-gradient(45deg, #9775FA, #B59DFC)" }}
                      ></div>
                      <span>Optional Skills</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div
                        className="w-5 h-5 rounded-md mr-2 border-2 border-green-500"
                        style={{ background: "linear-gradient(45deg, #F3F4F6, #FFFFFF)" }}
                      ></div>
                      <span>Completed Skills</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Click a skill to mark as completed</p>
                  </div>
                </div>

                {/* Cytoscape graph container */}
                <div
                  ref={containerRef}
                  className="border border-gray-200 rounded-lg bg-white shadow-xl"
                  style={{ height: "75vh", background: "linear-gradient(to bottom right, #f9fafb, #f3f4f6)" }}
                ></div>

                {/* Tip overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-full text-sm z-10 flex items-center gap-2 shadow-lg">
                  <FontAwesomeIcon icon={faInfoCircle} className="h-4 w-4" />
                  <span>Drag to pan, scroll to zoom, click skills to mark as completed</span>
                </div>
              </div>
            )}

            {/* List View */}
            {activeTab === "list" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Skills Checklist</h3>

                {/* Search results count when searching */}
                {searchTerm && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm border-l-4 border-blue-500">
                    <p className="text-blue-700">
                      Found{" "}
                      <span className="font-bold">
                        {
                          roadmapData.nodes.filter(
                            (node) =>
                              node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (node.data.description &&
                                node.data.description.toLowerCase().includes(searchTerm.toLowerCase())),
                          ).length
                        }
                      </span>{" "}
                      skills matching "{searchTerm}"
                    </p>
                  </div>
                )}

                {Object.entries(getSkillsByCategory()).map(([category, nodes]) => {
                  // Filter nodes based on search term
                  const filteredNodes = searchTerm
                    ? nodes.filter(
                        (node) =>
                          node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (node.data.description &&
                            node.data.description.toLowerCase().includes(searchTerm.toLowerCase())),
                      )
                    : nodes

                  // Skip empty categories after filtering
                  if (filteredNodes.length === 0) return null

                  // Get color for category
                  let categoryColor = "#3B82F6" // Default blue
                  if (category === "Core Skills") categoryColor = "#FF6B6B"
                  if (category === "Recommended") categoryColor = "#4ECDC4"
                  if (category === "Optional") categoryColor = "#9775FA"

                  return (
                    <div key={category} className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="text-base font-medium text-gray-800">{category}</h4>
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ background: `linear-gradient(45deg, ${categoryColor}, ${categoryColor}CC)` }}
                        >
                          {nodes.filter((node) => completedSkills.has(node.id)).length}/{nodes.length}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {filteredNodes
                          .sort((a, b) => a.data.label.localeCompare(b.data.label))
                          .map((node) => {
                            const isCompleted = completedSkills.has(node.id)
                            return (
                              <div
                                key={node.id}
                                className={`flex items-center text-sm p-3 rounded-lg cursor-pointer transition-all roadmap-card ${
                                  isCompleted
                                    ? "bg-gradient-to-r from-green-50 to-blue-50 border border-green-200"
                                    : "hover:bg-gray-50 border border-gray-100"
                                }`}
                                onClick={() => toggleSkill(node.id)}
                              >
                                <div
                                  className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                                    isCompleted ? "bg-green-100 border-green-500 text-green-600" : "border-gray-300"
                                  }`}
                                >
                                  {isCompleted && <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4" />}
                                </div>
                                <div>
                                  <span className={isCompleted ? "text-green-800 font-medium" : "font-medium"}>
                                    {node.data.label}
                                  </span>
                                  {node.data.description && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{node.data.description}</p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )
                })}

                {/* No results message */}
                {searchTerm &&
                  Object.values(getSkillsByCategory()).every(
                    (nodes) =>
                      nodes.filter(
                        (node) =>
                          node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (node.data.description &&
                            node.data.description.toLowerCase().includes(searchTerm.toLowerCase())),
                      ).length === 0,
                  ) && (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No skills found matching "{searchTerm}"</p>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-500 font-medium"
                      >
                        Clear search
                      </button>
                    </div>
                  )}
              </div>
            )}

            {/* If there is a description for the roadmap, show it */}
            {roadmapData.description && (
              <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">About This Roadmap</h3>
                <p className="text-gray-700">{roadmapData.description}</p>
                <p className="mt-2 text-sm text-gray-500">
                  This roadmap is based on content from{" "}
                  <a
                    href="https://roadmap.sh"
                    className="text-blue-600 hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    roadmap.sh
                  </a>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ColorfulRoadmap