import React from 'react';
import './Penguin.css';

const Penguin = ({ position, powerUps }) => {
  const hasShield = powerUps.shield && powerUps.shield > Date.now();
  const hasSpeed = powerUps.speed && powerUps.speed > Date.now();
  const hasJumpBoost = powerUps.jump_boost && powerUps.jump_boost > Date.now();

  return (
    <div 
      className={`penguin ${hasShield ? 'shield-active' : ''} ${hasSpeed ? 'speed-active' : ''} ${hasJumpBoost ? 'jump-active' : ''}`}
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="penguin-body">
        <div className="penguin-head">
          <div className="penguin-eye left"></div>
          <div className="penguin-eye right"></div>
          <div className="penguin-beak"></div>
        </div>
        <div className="penguin-belly"></div>
        <div className="penguin-wing left"></div>
        <div className="penguin-wing right"></div>
        <div className="penguin-feet">
          <div className="penguin-foot left"></div>
          <div className="penguin-foot right"></div>
        </div>
      </div>
      {hasShield && <div className="shield-effect"></div>}
      {hasSpeed && <div className="speed-effect"></div>}
      {hasJumpBoost && <div className="jump-effect"></div>}
    </div>
  );
};

export default Penguin;