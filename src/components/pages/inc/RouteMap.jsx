import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  Handle,
  Position,
} from 'reactflow';
import PropTypes from 'prop-types';
import 'reactflow/dist/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Function to generate nodes and edges
const generateNodesAndEdges = (data) => {
  let nodes = [];
  let edges = [];
  let yPosition = 50;
  let left = true;
  let activityCount = 1;
  let prevNodeId = null;

  data?.itineraryPlan.days.forEach((day, dayIndex) => {
    day.activities.forEach((activity, index) => {
      const nodeId = `d${dayIndex + 1}-a${index + 1}`;

      nodes.push({
        id: nodeId,
        data: {
          number: activityCount,
          time: activity.time,
          activity: activity.activity,
          location: activity.location,
          entry_fee: activity.entry_fee,
          duration: activity.duration,
          parking: activity.parking,
          booking_link: activity.booking_link,
        },
        position: { x: left ? 100 : 300, y: yPosition },
        type: 'customNode',
      });

      // Create edges connecting activities sequentially
      if (prevNodeId) {
        edges.push({
          id: `e${prevNodeId}-${nodeId}`,
          source: prevNodeId,
          target: nodeId,
          animated: true,
          style: { stroke: '#007bff', strokeWidth: 2 },
        });
      }

      prevNodeId = nodeId;
      left = !left;
      yPosition += 100;
      activityCount++;
    });

    prevNodeId = null; // Reset for the next day
  });

  return { nodes, edges };
};

// Custom Node Component with Tooltip
const CustomNode = ({ data }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Numbered Circle (Only this connects to other nodes) */}
      <div
        style={{
          width: 35,
          height: 35,
          borderRadius: '50%',
          backgroundColor: '#007bff',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 'bold',
          position: 'relative',
          cursor: 'pointer',
          zIndex: -1,
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#007bff' }}
        />
        {data.number}
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: '#007bff' }}
        />
      </div>
      <div style={{ marginLeft: 15, fontSize: 14, fontWeight: 'bold' }}>
        {data.activity}
      </div>

      {/* Tooltip beside the point */}
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: '-10px',
            backgroundColor: '#fff',
            border: '1px solid #007bff',
            borderRadius: 12,
            padding: '16px',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            minWidth: '260px',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#007bff' }}>
            {data.activity}
          </div>
          <div style={{ fontSize: 14, color: '#555', margin: '4px 0' }}>
            📍 {data.location}
          </div>
          <div style={{ fontSize: 14, color: '#777' }}>⏰ {data.time}</div>
          <div style={{ fontSize: 14, color: '#777' }}>⏳ {data.duration}</div>
          <div style={{ fontSize: 14, color: '#777' }}>💰 {data.entry_fee}</div>
          {/* <div style={{ fontSize: 14, color: '#777' }}>🚖 {data.transport}</div> */}
          <div style={{ fontSize: 14, color: '#777' }}>🅿️ {data.parking}</div>
          <a
            href={data.booking_link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: 10,
              fontSize: 14,
              textDecoration: 'none',
              backgroundColor: '#007bff',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: 6,
              textAlign: 'center',
            }}
          >
            🎟️ Book Now
          </a>
        </div>
      )}
    </div>
  );
};

// ✅ PropTypes Validation
CustomNode.propTypes = {
  data: PropTypes.shape({
    number: PropTypes.number.isRequired,
    time: PropTypes.string.isRequired,
    activity: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    entry_fee: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    parking: PropTypes.string.isRequired,
    booking_link: PropTypes.string.isRequired,
  }).isRequired,
};

const FlowMap = (itineraryPlan) => {
  const { nodes, edges } = generateNodesAndEdges(itineraryPlan);
  const [graphNodes, setNodes] = useState(nodes);
  const [graphEdges, setEdges] = useState(edges);
  console.log(setNodes);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div className="container mt-4">
      <h3 className="text-center">Travel Plan</h3>
      <div style={{ height: 500, border: '1px solid #ddd' }}>
        <ReactFlow
          nodes={graphNodes}
          edges={graphEdges}
          onConnect={onConnect}
          nodeTypes={{ customNode: CustomNode }}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowMap;
