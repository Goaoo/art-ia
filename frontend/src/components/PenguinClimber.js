import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import GameUI from './GameUI';
import GameOver from './GameOver';
import PlayerSetup from './PlayerSetup';
import gameService from '../services/gameService';
import './PenguinClimber.css';

const PenguinClimber = () => {
  const [gameState, setGameState] = useState('setup'); // 'setup', 'playing', 'paused', 'gameOver'
  const [player, setPlayer] = useState(null);
  const [session, setSession] = useState(null);
  const [gameElements, setGameElements] = useState(null);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [lives, setLives] = useState(3);
  const [jumps, setJumps] = useState(0);
  const [powerUps, setPowerUps] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [collectibles, setCollectibles] = useState({ fish: 0, coins: 0, gems: 0 });
  const [loading, setLoading] = useState(false);

  const handleScoreUpdate = useCallback((points) => {
    setScore(prev => prev + points);
  }, []);

  const handleDistanceUpdate = useCallback((dist) => {
    setDistance(prev => prev + dist);
  }, []);

  const handleJump = useCallback(() => {
    setJumps(prev => prev + 1);
    // Check for 100 jumps achievement
    if (jumps + 1 === 100) {
      setAchievements(prev => [...prev, mockGameData.achievements.find(a => a.id === '100_jumps')]);
    }
  }, [jumps]);

  const handleCollectible = useCallback((type) => {
    setCollectibles(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    
    // Add score based on collectible type
    const points = type === 'fish' ? 10 : type === 'coins' ? 5 : type === 'gems' ? 25 : 0;
    handleScoreUpdate(points);
  }, [handleScoreUpdate]);

  const handlePowerUp = useCallback((powerUpId) => {
    const powerUp = mockGameData.powerUps.find(p => p.id === powerUpId);
    if (powerUp) {
      setPowerUps(prev => ({
        ...prev,
        [powerUpId]: Date.now() + powerUp.duration
      }));
    }
  }, []);

  const handleGameOver = useCallback(() => {
    setGameState('gameOver');
  }, []);

  const handleRestart = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setDistance(0);
    setLives(3);
    setJumps(0);
    setPowerUps({});
    setCollectibles({ fish: 0, coins: 0, gems: 0 });
  }, []);

  const handlePause = useCallback(() => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  }, []);

  return (
    <div className="penguin-climber">
      <div className="game-container">
        <GameUI 
          score={score}
          distance={distance}
          lives={lives}
          jumps={jumps}
          powerUps={powerUps}
          achievements={achievements}
          collectibles={collectibles}
          onPause={handlePause}
          gameState={gameState}
        />
        
        {gameState === 'gameOver' ? (
          <GameOver 
            score={score}
            distance={distance}
            jumps={jumps}
            collectibles={collectibles}
            achievements={achievements}
            onRestart={handleRestart}
          />
        ) : (
          <GameBoard 
            gameState={gameState}
            onScoreUpdate={handleScoreUpdate}
            onDistanceUpdate={handleDistanceUpdate}
            onJump={handleJump}
            onCollectible={handleCollectible}
            onPowerUp={handlePowerUp}
            onGameOver={handleGameOver}
            powerUps={powerUps}
            lives={lives}
            setLives={setLives}
          />
        )}
      </div>
    </div>
  );
};

export default PenguinClimber;