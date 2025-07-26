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

  // Initialize game elements
  useEffect(() => {
    const loadGameElements = async () => {
      try {
        const elements = await gameService.getGameElements();
        setGameElements(elements);
      } catch (error) {
        console.error('Failed to load game elements:', error);
      }
    };
    loadGameElements();
  }, []);

  const handlePlayerReady = useCallback(async (playerData) => {
    setPlayer(playerData);
    setLoading(true);
    
    try {
      const newSession = await gameService.createGameSession(playerData.id);
      setSession(newSession);
      setGameState('playing');
    } catch (error) {
      console.error('Failed to create game session:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleScoreUpdate = useCallback(async (points) => {
    if (!session) return;
    
    const newScore = score + points;
    setScore(newScore);
    
    // Update session in backend
    try {
      await gameService.updateGameSession(session.id, { score: newScore });
    } catch (error) {
      console.error('Failed to update score:', error);
    }
  }, [session, score]);

  const handleDistanceUpdate = useCallback(async (dist) => {
    if (!session) return;
    
    const newDistance = distance + dist;
    setDistance(newDistance);
    
    // Update session in backend periodically (every 10 distance units)
    if (Math.floor(newDistance) % 10 === 0) {
      try {
        await gameService.updateGameSession(session.id, { distance: newDistance });
      } catch (error) {
        console.error('Failed to update distance:', error);
      }
    }
  }, [session, distance]);

  const handleJump = useCallback(async () => {
    if (!session) return;
    
    const newJumps = jumps + 1;
    setJumps(newJumps);
    
    // Check for 100 jumps achievement
    if (newJumps === 100) {
      try {
        const unlockedAchievements = await gameService.checkAchievements(session.id);
        setAchievements(prev => [...prev, ...unlockedAchievements]);
      } catch (error) {
        console.error('Failed to check achievements:', error);
      }
    }
    
    // Update session in backend periodically (every 10 jumps)
    if (newJumps % 10 === 0) {
      try {
        await gameService.updateGameSession(session.id, { jumps: newJumps });
      } catch (error) {
        console.error('Failed to update jumps:', error);
      }
    }
  }, [session, jumps]);

  const handleCollectible = useCallback(async (type) => {
    if (!session) return;
    
    const newCollectibles = {
      ...collectibles,
      [type]: collectibles[type] + 1
    };
    setCollectibles(newCollectibles);
    
    // Add score based on collectible type
    const points = type === 'fish' ? 10 : type === 'coins' ? 5 : type === 'gems' ? 25 : 0;
    await handleScoreUpdate(points);
    
    // Update session in backend
    try {
      await gameService.updateGameSession(session.id, { collectibles: newCollectibles });
    } catch (error) {
      console.error('Failed to update collectibles:', error);
    }
  }, [session, collectibles, handleScoreUpdate]);

  const handlePowerUp = useCallback(async (powerUpId) => {
    if (!gameElements || !session) return;
    
    const powerUp = gameElements.powerUps.find(p => p.id === powerUpId);
    if (powerUp) {
      setPowerUps(prev => ({
        ...prev,
        [powerUpId]: Date.now() + powerUp.duration
      }));
      
      // Track power-up usage
      try {
        const currentSession = await gameService.getGameSession(session.id);
        const updatedPowerUps = [...(currentSession.power_ups_used || []), powerUpId];
        await gameService.updateGameSession(session.id, { 
          power_ups_used: updatedPowerUps 
        });
      } catch (error) {
        console.error('Failed to update power-ups:', error);
      }
    }
  }, [session, gameElements]);

  const handleGameOver = useCallback(async () => {
    if (!session) return;
    
    setGameState('gameOver');
    
    try {
      // Update final session data
      await gameService.updateGameSession(session.id, {
        score,
        distance,
        jumps,
        collectibles,
        game_state: 'gameOver'
      });
      
      // End the session
      const endedSession = await gameService.endGameSession(session.id);
      setSession(endedSession);
      
      // Check final achievements
      const finalAchievements = await gameService.checkAchievements(session.id);
      setAchievements(prev => [...prev, ...finalAchievements]);
    } catch (error) {
      console.error('Failed to end game session:', error);
    }
  }, [session, score, distance, jumps, collectibles]);

  const handleRestart = useCallback(async () => {
    if (!player) return;
    
    setLoading(true);
    
    try {
      // Create new session
      const newSession = await gameService.createGameSession(player.id);
      setSession(newSession);
      
      // Reset game state
      setGameState('playing');
      setScore(0);
      setDistance(0);
      setLives(3);
      setJumps(0);
      setPowerUps({});
      setAchievements([]);
      setCollectibles({ fish: 0, coins: 0, gems: 0 });
    } catch (error) {
      console.error('Failed to restart game:', error);
    } finally {
      setLoading(false);
    }
  }, [player]);

  const handlePause = useCallback(async () => {
    if (!session) return;
    
    const newState = gameState === 'playing' ? 'paused' : 'playing';
    setGameState(newState);
    
    try {
      await gameService.updateGameSession(session.id, { game_state: newState });
    } catch (error) {
      console.error('Failed to update game state:', error);
    }
  }, [session, gameState]);

  // Loading state
  if (loading) {
    return (
      <div className="penguin-climber">
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-penguin">🐧</div>
            <div className="loading-text">Setting up your climb...</div>
          </div>
        </div>
      </div>
    );
  }

  // Player setup state
  if (gameState === 'setup') {
    return <PlayerSetup onPlayerReady={handlePlayerReady} />;
  }

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
          player={player}
        />
        
        {gameState === 'gameOver' ? (
          <GameOver 
            score={score}
            distance={distance}
            jumps={jumps}
            collectibles={collectibles}
            achievements={achievements}
            onRestart={handleRestart}
            player={player}
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
            gameElements={gameElements}
          />
        )}
      </div>
    </div>
  );
};

export default PenguinClimber;