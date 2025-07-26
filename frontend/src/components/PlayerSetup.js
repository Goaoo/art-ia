import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import gameService from '../services/gameService';
import './PlayerSetup.css';

const PlayerSetup = ({ onPlayerReady }) => {
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const player = await gameService.getOrCreatePlayer(playerName.trim());
      onPlayerReady(player);
    } catch (err) {
      setError('Failed to create player. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="player-setup">
      <div className="setup-background">
        <div className="setup-container">
          <Card className="setup-card">
            <CardHeader className="setup-header">
              <CardTitle className="setup-title">
                🐧 Penguin Climber 🏔️
              </CardTitle>
              <p className="setup-subtitle">
                Ready to climb the icy peaks? Enter your name to begin!
              </p>
            </CardHeader>
            
            <CardContent className="setup-content">
              <form onSubmit={handleSubmit} className="setup-form">
                <div className="form-group">
                  <Label htmlFor="playerName" className="form-label">
                    Player Name
                  </Label>
                  <Input
                    id="playerName"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name..."
                    className="name-input"
                    maxLength={20}
                    disabled={loading}
                  />
                </div>
                
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
                
                <Button
                  type="submit"
                  className="start-button"
                  disabled={loading || !playerName.trim()}
                  size="lg"
                >
                  {loading ? '🎮 Setting up...' : '🚀 Start Climbing!'}
                </Button>
              </form>
              
              <div className="game-info">
                <div className="info-item">
                  <span className="info-icon">🎯</span>
                  <span>Climb as high as you can!</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">🏆</span>
                  <span>Unlock achievements & power-ups</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">🎮</span>
                  <span>Use arrow keys or WASD to move</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlayerSetup;