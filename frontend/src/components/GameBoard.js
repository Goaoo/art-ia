import React, { useState, useEffect, useCallback, useRef } from 'react';
import Penguin from './Penguin';
import GameElement from './GameElement';
import { mockGameData } from '../utils/mockData';
import './GameBoard.css';

const GameBoard = ({ 
  gameState, 
  onScoreUpdate, 
  onDistanceUpdate, 
  onJump, 
  onCollectible, 
  onPowerUp, 
  onGameOver,
  powerUps,
  lives,
  setLives
}) => {
  const [penguinPosition, setPenguinPosition] = useState({ x: 400, y: 500 });
  const [elements, setElements] = useState([]);
  const [cameraY, setCameraY] = useState(0);
  const [keys, setKeys] = useState({});
  const gameLoopRef = useRef();
  const lastUpdateRef = useRef(Date.now());

  const generateRandomElement = useCallback(() => {
    const allElements = [...mockGameData.powerUps, ...mockGameData.obstacles, ...mockGameData.collectibles];
    const randomElement = allElements[Math.floor(Math.random() * allElements.length)];
    return {
      ...randomElement,
      x: Math.random() * 700 + 50,
      y: Math.random() * 200 + 100,
      id: Date.now() + Math.random()
    };
  }, []);

  const generateElements = useCallback(() => {
    const newElements = [];
    for (let i = 0; i < 5; i++) {
      newElements.push(generateRandomElement());
    }
    setElements(newElements);
  }, [generateRandomElement]);

  const handleKeyDown = useCallback((e) => {
    setKeys(prev => ({ ...prev, [e.key]: true }));
  }, []);

  const handleKeyUp = useCallback((e) => {
    setKeys(prev => ({ ...prev, [e.key]: false }));
  }, []);

  const checkCollision = useCallback((penguin, element) => {
    const penguinRect = { x: penguin.x, y: penguin.y, width: 60, height: 60 };
    const elementRect = { x: element.x, y: element.y, width: 40, height: 40 };
    
    return penguinRect.x < elementRect.x + elementRect.width &&
           penguinRect.x + penguinRect.width > elementRect.x &&
           penguinRect.y < elementRect.y + elementRect.height &&
           penguinRect.y + penguinRect.height > elementRect.y;
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const now = Date.now();
    const deltaTime = now - lastUpdateRef.current;
    lastUpdateRef.current = now;

    setPenguinPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;

      // Handle input
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        newX = Math.max(0, newX - 5);
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        newX = Math.min(740, newX + 5);
      }
      if (keys[' '] || keys['ArrowUp'] || keys['w'] || keys['W']) {
        newY = Math.max(0, newY - 8);
        onJump();
      }

      // Auto-climb effect
      newY = Math.max(0, newY - 1);

      // Update camera to follow penguin
      setCameraY(prev => {
        const targetY = newY - 400;
        return targetY;
      });

      // Update distance
      onDistanceUpdate(0.1);

      return { x: newX, y: newY };
    });

    // Check collisions
    setElements(prev => {
      const newElements = [];
      prev.forEach(element => {
        if (checkCollision(penguinPosition, element)) {
          if (element.type === 'powerUp') {
            onPowerUp(element.id);
          } else if (element.type === 'collectible') {
            onCollectible(element.subType);
          } else if (element.type === 'obstacle') {
            // Check if penguin has shield
            const hasShield = powerUps.shield && powerUps.shield > Date.now();
            if (!hasShield) {
              setLives(prev => prev - 1);
              if (lives <= 1) {
                onGameOver();
              }
            }
          }
        } else {
          // Keep element if not collided
          newElements.push(element);
        }
      });

      // Add new elements as penguin climbs
      while (newElements.length < 8) {
        const newElement = generateRandomElement();
        newElement.y = Math.random() * 200 + (cameraY - 200);
        newElements.push(newElement);
      }

      return newElements;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, keys, penguinPosition, checkCollision, onJump, onDistanceUpdate, onPowerUp, onCollectible, onGameOver, powerUps, lives, setLives, generateRandomElement, cameraY]);

  useEffect(() => {
    generateElements();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  }, [gameState, gameLoop]);

  return (
    <div className="game-board" tabIndex="0">
      <div className="game-world" style={{ transform: `translateY(${cameraY}px)` }}>
        <div className="mountain-bg"></div>
        <Penguin 
          position={penguinPosition} 
          powerUps={powerUps}
        />
        {elements.map(element => (
          <GameElement 
            key={element.id} 
            element={element} 
          />
        ))}
      </div>
      <div className="controls-hint">
        <p>🎮 Use Arrow Keys or WASD to move, Space to jump!</p>
      </div>
    </div>
  );
};

export default GameBoard;