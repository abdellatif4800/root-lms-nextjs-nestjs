import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Node, type Edge } from "@xyflow/react";

// 1. Extend Record<string, unknown> to satisfy XYFlow v12
export interface TutorialNodeData extends Record<string, unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tutorial: any;
}

interface RoadmapState {
  nodes: Node[];
  edges: Edge[];
  currentNode: Node | null;
}

const initialState: RoadmapState = {
  nodes: [],
  edges: [],
  currentNode: null,
};

export const roadmapSlice = createSlice({
  name: "roadmaps",
  initialState,
  reducers: {
    addTutorialNode: (state, action: PayloadAction<{ tutorial: any; position?: { x: number; y: number } }>) => {
      const id = `t${state.nodes.length + 1}`;
      const newNode: Node<TutorialNodeData> = {
        id,
        type: "tutorial",
        position: action.payload.position || { x: 100, y: 100 },
        data: { tutorial: action.payload.tutorial },
      };

      // Bypassing Immer's deeply nested WritableDraft inference limits
      state.nodes.push(newNode as any);
      state.currentNode = newNode as any;
    },

    // 2. Added the missing addNode reducer
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload as any);
    },

    updateNode: (state, action: PayloadAction<{ id: string; changes: Partial<Node> }>) => {
      const index = state.nodes.findIndex(n => n.id === action.payload.id);
      if (index !== -1) {
        // Cast the merged result to avoid Partial<Node> optional 'id' errors
        state.nodes[index] = { ...state.nodes[index], ...action.payload.changes } as any;
        if (state.currentNode?.id === action.payload.id) {
          state.currentNode = state.nodes[index] as any;
        }
      }
    },

    setCurrentNode: (state, action: PayloadAction<Node | null>) => {
      state.currentNode = action.payload as any;
    },

    removeNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter(n => n.id !== action.payload) as any;
      if (state.currentNode?.id === action.payload) state.currentNode = null;
      state.edges = state.edges.filter(e => e.source !== action.payload && e.target !== action.payload) as any;
    },

    addEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload as any);
    },

    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload as any;
    },

    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload as any;
      state.currentNode = null;
    },

    updateEdge: (state, action: PayloadAction<{ id: string; changes: Partial<Edge> }>) => {
      const index = state.edges.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.edges[index] = { ...state.edges[index], ...action.payload.changes } as any;
      }
    },

    removeEdge: (state, action: PayloadAction<string>) => {
      state.edges = state.edges.filter(e => e.id !== action.payload) as any;
    }
  },
});

export const {
  addTutorialNode,
  addNode,
  updateNode,
  removeNode,
  setCurrentNode,
  addEdge,
  setEdges,
  setNodes,
  updateEdge,
  removeEdge
} = roadmapSlice.actions;

export default roadmapSlice.reducer;
