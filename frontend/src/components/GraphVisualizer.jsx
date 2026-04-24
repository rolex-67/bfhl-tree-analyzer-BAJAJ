import React, { useMemo, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

const nodeWidth = 60;
const nodeHeight = 60;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, acyclicer: 'greedy' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    if (!nodeWithPosition) return node;
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const GraphVisualizer = ({ result, rawData }) => {
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!result || !rawData) return { initialNodes: [], initialEdges: [] };

    const nodesMap = new Map();
    const edgesList = [];
    
    const invalidSet = new Set(result.invalid_entries || []);
    const duplicateSet = new Set(result.duplicate_edges || []);

    // Filter valid edges from raw input
    const validEdgesRaw = rawData.filter(edge => {
        const trimmed = typeof edge === 'string' ? edge.trim() : '';
        return trimmed && !invalidSet.has(edge) && !duplicateSet.has(trimmed) && !invalidSet.has(trimmed);
    });

    validEdgesRaw.forEach(edge => {
        const trimmed = edge.trim();
        if(trimmed.length === 4) {
            const u = trimmed[0];
            const v = trimmed[3];
            
            if(!nodesMap.has(u)) nodesMap.set(u, { id: u, data: { label: u }, className: 'glass-node' });
            if(!nodesMap.has(v)) nodesMap.set(v, { id: v, data: { label: v }, className: 'glass-node' });
            
            edgesList.push({
                id: `${u}-${v}`,
                source: u,
                target: v,
                animated: true,
                style: { stroke: '#818cf8', strokeWidth: 2 },
            });
        }
    });

    // Identify which nodes are in a valid tree vs cycle
    const treeNodes = new Set();
    const traverseTree = (treeObj) => {
        for(const key in treeObj) {
            treeNodes.add(key);
            traverseTree(treeObj[key]);
        }
    };
    
    if (result.hierarchies) {
        result.hierarchies.forEach(h => {
            if(!h.has_cycle && h.tree) {
                traverseTree(h.tree);
                treeNodes.add(h.root); // Ensure root is added even if tree object is structured differently
            }
        });
    }

    // Update styling for cycle nodes and edges
    nodesMap.forEach((node, key) => {
        if(!treeNodes.has(key)) {
            node.className = 'glass-node cycle-node';
        }
    });

    edgesList.forEach(edge => {
        if(!treeNodes.has(edge.source) || !treeNodes.has(edge.target)) {
            edge.style = { stroke: '#ef4444', strokeWidth: 2 };
        }
    });

    const { nodes, edges } = getLayoutedElements(Array.from(nodesMap.values()), edgesList);
    return { initialNodes: nodes, initialEdges: edges };
  }, [result, rawData]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (nodes.length === 0) return null;

  return (
    <div style={{ height: '500px', width: '100%' }} className="glass-panel rounded-xl overflow-hidden mt-6 relative border border-slate-700/50 shadow-2xl">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-300 shadow-lg">
        Interactive Graph View
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        colorMode="dark"
        className="bg-slate-900/30"
      >
        <MiniMap 
            zoomable 
            pannable 
            nodeClassName={(node) => node.className === 'glass-node cycle-node' ? 'bg-red-500' : 'bg-indigo-500'} 
            maskColor="rgba(15, 23, 42, 0.7)" 
            className="bg-slate-800 border-slate-700" 
        />
        <Controls className="bg-slate-800 border-slate-700 fill-slate-200" />
        <Background color="#334155" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default GraphVisualizer;
