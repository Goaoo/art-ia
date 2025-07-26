from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class PowerUp(BaseModel):
    id: str
    name: str
    type: str = "powerUp"
    duration: int
    description: str

class Obstacle(BaseModel):
    id: str
    name: str
    type: str = "obstacle"
    description: str

class Collectible(BaseModel):
    id: str
    name: str
    type: str = "collectible"
    subType: str
    points: int
    description: str

class Achievement(BaseModel):
    id: str
    name: str
    description: str
    reward: str
    unlocked: bool = False
    unlocked_at: Optional[datetime] = None

class GameSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_id: str
    score: int = 0
    distance: float = 0.0
    jumps: int = 0
    lives: int = 3
    collectibles: Dict[str, int] = Field(default_factory=lambda: {"fish": 0, "coins": 0, "gems": 0})
    achievements_unlocked: List[str] = Field(default_factory=list)
    power_ups_used: List[str] = Field(default_factory=list)
    game_state: str = "playing"  # playing, paused, gameOver
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None
    duration: Optional[int] = None  # in seconds

class GameSessionCreate(BaseModel):
    player_id: str

class GameSessionUpdate(BaseModel):
    score: Optional[int] = None
    distance: Optional[float] = None
    jumps: Optional[int] = None
    lives: Optional[int] = None
    collectibles: Optional[Dict[str, int]] = None
    achievements_unlocked: Optional[List[str]] = None
    power_ups_used: Optional[List[str]] = None
    game_state: Optional[str] = None

class Player(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    total_score: int = 0
    best_score: int = 0
    total_distance: float = 0.0
    best_distance: float = 0.0
    total_jumps: int = 0
    total_games: int = 0
    achievements: List[Achievement] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_played: Optional[datetime] = None

class PlayerCreate(BaseModel):
    name: str

class PlayerStats(BaseModel):
    player_id: str
    total_score: int
    best_score: int
    total_distance: float
    best_distance: float
    total_jumps: int
    total_games: int
    achievements_count: int
    rank: int

class Leaderboard(BaseModel):
    top_scores: List[Dict[str, Any]]
    top_distances: List[Dict[str, Any]]
    top_jumpers: List[Dict[str, Any]]

class GameElements(BaseModel):
    powerUps: List[PowerUp]
    obstacles: List[Obstacle]
    collectibles: List[Collectible]
    achievements: List[Achievement]