import React, { useState } from 'react';
import { CheckCircle2, PlayCircle, AlertCircle, Lock, Sparkles, Layers } from 'lucide-react';

export const SkillGraph = ({ graphData, onSelectSkill }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        No graph data available for this role.
      </div>
    );
  }

  // Pre-calculate visual coordinates in a clean DAG hierarchy
  const nodes = graphData.nodes;
  const edges = graphData.edges;

  // Group nodes into layers based on prerequisite depth
  const nodeDepth = {};
  nodes.forEach(n => { nodeDepth[n.id] = 0; });

  // Compute depth via edges
  edges.forEach(e => {
    if (nodeDepth[e.target] !== undefined && nodeDepth[e.source] !== undefined) {
      nodeDepth[e.target] = Math.max(nodeDepth[e.target], nodeDepth[e.source] + 1);
    }
  });

  const layers = {};
  nodes.forEach(n => {
    const d = nodeDepth[n.id] || 0;
    if (!layers[d]) layers[d] = [];
    layers[d].push(n);
  });

  const layerKeys = Object.keys(layers).sort((a, b) => Number(a) - Number(b));

  const nodePositions = {};
  const canvasWidth = 720;
  const canvasHeight = Math.max(480, layerKeys.length * 130 + 60);

  layerKeys.forEach((layerKey, lIdx) => {
    const layerNodes = layers[layerKey];
    const y = 60 + lIdx * 120;
    const spacing = canvasWidth / (layerNodes.length + 1);
    layerNodes.forEach((node, nIdx) => {
      nodePositions[node.id] = {
        x: (nIdx + 1) * spacing,
        y: y
      };
    });
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'mastered':
        return {
          bg: 'fill-emerald-500/10 stroke-emerald-500',
          text: 'text-emerald-500',
          badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300',
          icon: CheckCircle2
        };
      case 'gap':
        return {
          bg: 'fill-amber-500/10 stroke-amber-500',
          text: 'text-amber-500',
          badge: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300',
          icon: AlertCircle
        };
      case 'locked':
        return {
          bg: 'fill-slate-500/10 stroke-slate-400',
          text: 'text-slate-400',
          badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300',
          icon: Lock
        };
      default:
        return {
          bg: 'fill-sky-500/10 stroke-sky-500',
          text: 'text-sky-500',
          badge: 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-300',
          icon: PlayCircle
        };
    }
  };

  return (
    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-4 overflow-hidden shadow-sm">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center space-x-2 font-bold text-slate-700 dark:text-slate-300">
          <Layers className="w-4 h-4 text-brand-500" />
          <span>Interactive Skill Prerequisite Map</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Mastered</span>
          </span>
          <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Target Gap (Ready)</span>
          </span>
          <span className="flex items-center space-x-1 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span>Blocked / Missing Prereq</span>
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          className="min-w-[640px] w-full h-auto select-none"
        >
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
            </linearGradient>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Edges (Curves) */}
          {edges.map((edge) => {
            const src = nodePositions[edge.source];
            const dst = nodePositions[edge.target];
            if (!src || !dst) return null;

            // Quadratic bezier curve
            const midY = (src.y + dst.y) / 2;
            const pathData = `M ${src.x} ${src.y} C ${src.x} ${midY}, ${dst.x} ${midY}, ${dst.x} ${dst.y}`;

            return (
              <path
                key={edge.id}
                d={pathData}
                fill="none"
                stroke="url(#edgeGrad)"
                strokeWidth="2"
                strokeDasharray="4 2"
                markerEnd="url(#arrow)"
                className="transition-all duration-300 hover:stroke-brand-500"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const isSelected = selectedNode?.id === node.id;
            const style = getStatusColor(node.status);
            const Icon = style.icon;

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => {
                  setSelectedNode(node);
                  if (onSelectSkill) onSelectSkill(node.id);
                }}
                className="cursor-pointer group"
              >
                {/* Outer halo */}
                <circle
                  r={isSelected ? "34" : "28"}
                  className={`${style.bg} transition-all duration-200 stroke-2 group-hover:scale-110`}
                />
                <circle
                  r={isSelected ? "30" : "24"}
                  className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-800 transition-all"
                />
                {/* Node Center Icon */}
                <foreignObject x="-10" y="-10" width="20" height="20">
                  <div className={`flex items-center justify-center ${style.text}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </foreignObject>

                {/* Node Label Text */}
                <text
                  y="42"
                  textAnchor="middle"
                  className="text-[11px] font-bold fill-slate-800 dark:fill-slate-200 tracking-wide"
                >
                  {node.label}
                </text>
                <text
                  y="54"
                  textAnchor="middle"
                  className="text-[9px] fill-slate-400 capitalize"
                >
                  {node.difficulty}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedNode.label}</h4>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(selectedNode.status).badge}`}>
                {selectedNode.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Difficulty: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedNode.difficulty}</span> | Priority: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedNode.priority || 'Normal'}</span>
            </p>
          </div>
          <button
            onClick={() => onSelectSkill && onSelectSkill(selectedNode.id)}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white flex items-center space-x-1.5 shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Practice Skill</span>
          </button>
        </div>
      )}
    </div>
  );
};
