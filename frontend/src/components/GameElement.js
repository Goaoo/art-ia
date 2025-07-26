import React from 'react';
import './GameElement.css';

const GameElement = ({ element }) => {
  const getElementIcon = () => {
    switch(element.id) {
      // Power-ups
      case 'jump_boost': return '⬆️';
      case 'speed': return '💨';
      case 'shield': return '🛡️';
      case 'magnet': return '🧲';
      case 'double_jump': return '⏫';
      case 'slow_time': return '⏱️';
      case 'extra_life': return '❤️';
      case 'score_multiplier': return '✨';
      
      // Obstacles
      case 'ice_block': return '🧊';
      case 'falling_rock': return '🪨';
      case 'wind_gust': return '💨';
      case 'spike': return '⚡';
      case 'moving_platform': return '📦';
      case 'crumbling_ledge': return '🧱';
      case 'snowball': return '⛄';
      
      // Collectibles
      case 'fish': return '🐟';
      case 'coins': return '🪙';
      case 'gems': return '💎';
      case 'heart': return '💗';
      case 'star': return '⭐';
      
      default: return '❓';
    }
  };

  const getElementClass = () => {
    let baseClass = 'game-element';
    if (element.type === 'powerUp') baseClass += ' power-up';
    else if (element.type === 'obstacle') baseClass += ' obstacle';
    else if (element.type === 'collectible') baseClass += ' collectible';
    return baseClass;
  };

  return (
    <div 
      className={getElementClass()}
      style={{ 
        left: element.x, 
        top: element.y,
        transform: 'translate(-50%, -50%)'
      }}
      title={element.name}
    >
      <div className="element-icon">
        {getElementIcon()}
      </div>
      <div className="element-glow"></div>
    </div>
  );
};

export default GameElement;