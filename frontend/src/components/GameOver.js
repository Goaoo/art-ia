import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import './GameOver.css';

const GameOver = ({ score, distance, jumps, collectibles, achievements, onRestart, player }) => {
  const formatDistance = (dist) => Math.floor(dist) + 'm';
  
  const getScoreRank = (score) => {
    if (score >= 10000) return { rank: 'Master Climber', color: 'bg-purple-500' };
    if (score >= 5000) return { rank: 'Expert', color: 'bg-blue-500' };
    if (score >= 2000) return { rank: 'Advanced', color: 'bg-green-500' };
    if (score >= 1000) return { rank: 'Intermediate', color: 'bg-yellow-500' };
    return { rank: 'Beginner', color: 'bg-gray-500' };
  };

  const scoreRank = getScoreRank(score);

  return (
    <div className="game-over">
      <div className="game-over-content">
        <Card className="game-over-card">
          <CardHeader className="game-over-header">
            <CardTitle className="game-over-title">
              🐧 Game Over! 🏔️
            </CardTitle>
            <div className="final-score">
              <span className="score-number">{score.toLocaleString()}</span>
              <Badge className={`score-rank ${scoreRank.color}`}>
                {scoreRank.rank}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="game-over-stats">
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-icon">📏</div>
                <div className="stat-info">
                  <span className="stat-label">Distance Climbed</span>
                  <span className="stat-value">{formatDistance(distance)}</span>
                </div>
              </div>
              
              <div className="stat-box">
                <div className="stat-icon">🦘</div>
                <div className="stat-info">
                  <span className="stat-label">Total Jumps</span>
                  <span className="stat-value">{jumps}</span>
                </div>
              </div>
              
              <div className="stat-box">
                <div className="stat-icon">🐟</div>
                <div className="stat-info">
                  <span className="stat-label">Fish Collected</span>
                  <span className="stat-value">{collectibles.fish}</span>
                </div>
              </div>
              
              <div className="stat-box">
                <div className="stat-icon">🪙</div>
                <div className="stat-info">
                  <span className="stat-label">Coins Collected</span>
                  <span className="stat-value">{collectibles.coins}</span>
                </div>
              </div>
              
              <div className="stat-box">
                <div className="stat-icon">💎</div>
                <div className="stat-info">
                  <span className="stat-label">Gems Collected</span>
                  <span className="stat-value">{collectibles.gems}</span>
                </div>
              </div>
            </div>

            {achievements.length > 0 && (
              <div className="achievements-section">
                <h3 className="achievements-title">🏆 Achievements Unlocked</h3>
                <div className="achievements-grid">
                  {achievements.map(achievement => (
                    <Badge key={achievement.id} variant="outline" className="achievement-badge">
                      {achievement.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="action-buttons">
              <Button 
                onClick={onRestart} 
                className="restart-button"
                size="lg"
              >
                🔄 Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameOver;