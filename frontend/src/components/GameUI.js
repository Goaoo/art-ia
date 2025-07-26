import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import './GameUI.css';

const GameUI = ({ 
  score, 
  distance, 
  lives, 
  jumps, 
  powerUps, 
  achievements, 
  collectibles, 
  onPause, 
  gameState,
  player 
}) => {
  const formatDistance = (dist) => Math.floor(dist) + 'm';
  const formatTime = (timestamp) => {
    const remaining = Math.max(0, timestamp - Date.now());
    return Math.ceil(remaining / 1000) + 's';
  };

  const activePowerUps = Object.entries(powerUps).filter(([_, timestamp]) => timestamp > Date.now());

  return (
    <div className="game-ui">
      <div className="ui-top">
        <Card className="stats-card">
          <CardContent className="stats-content">
            <div className="stat-item">
              <span className="stat-label">Score</span>
              <span className="stat-value">{score.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Distance</span>
              <span className="stat-value">{formatDistance(distance)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Lives</span>
              <span className="stat-value">{'❤️'.repeat(lives)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Jumps</span>
              <span className="stat-value">{jumps}</span>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={onPause} 
          className="pause-button"
          variant={gameState === 'paused' ? 'default' : 'outline'}
        >
          {gameState === 'paused' ? '▶️ Resume' : '⏸️ Pause'}
        </Button>
      </div>

      <div className="ui-bottom">
        <Card className="collectibles-card">
          <CardContent className="collectibles-content">
            <div className="collectible-item">
              <span>🐟 {collectibles.fish}</span>
            </div>
            <div className="collectible-item">
              <span>🪙 {collectibles.coins}</span>
            </div>
            <div className="collectible-item">
              <span>💎 {collectibles.gems}</span>
            </div>
          </CardContent>
        </Card>

        {activePowerUps.length > 0 && (
          <Card className="powerups-card">
            <CardContent className="powerups-content">
              <div className="powerups-title">Active Power-ups:</div>
              <div className="powerups-list">
                {activePowerUps.map(([powerUpId, timestamp]) => (
                  <Badge key={powerUpId} variant="secondary" className="powerup-badge">
                    {powerUpId.replace('_', ' ')} ({formatTime(timestamp)})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {achievements.length > 0 && (
          <Card className="achievements-card">
            <CardContent className="achievements-content">
              <div className="achievements-title">Recent Achievements:</div>
              <div className="achievements-list">
                {achievements.slice(-3).map(achievement => (
                  <Badge key={achievement.id} variant="default" className="achievement-badge">
                    🏆 {achievement.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GameUI;