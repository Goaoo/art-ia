from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime

from models.game_models import *
from services.game_service import GameService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Penguin Climber Game API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Initialize game service
game_service = GameService(db)

# Dependency to get game service
async def get_game_service():
    return game_service

# Game Elements Routes
@api_router.get("/game-elements", response_model=GameElements)
async def get_game_elements(service: GameService = Depends(get_game_service)):
    """Get all game elements (power-ups, obstacles, collectibles, achievements)"""
    return await service.get_game_elements()

# Player Routes
@api_router.post("/players", response_model=Player)
async def create_player(player_data: PlayerCreate, service: GameService = Depends(get_game_service)):
    """Create a new player"""
    return await service.create_player(player_data)

@api_router.get("/players/{player_id}", response_model=Player)
async def get_player(player_id: str, service: GameService = Depends(get_game_service)):
    """Get player by ID"""
    player = await service.get_player(player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

@api_router.get("/players/name/{player_name}", response_model=Player)
async def get_or_create_player(player_name: str, service: GameService = Depends(get_game_service)):
    """Get player by name or create if doesn't exist"""
    return await service.get_or_create_player(player_name)

@api_router.get("/players/{player_id}/stats", response_model=PlayerStats)
async def get_player_stats(player_id: str, service: GameService = Depends(get_game_service)):
    """Get detailed player statistics"""
    stats = await service.get_player_stats(player_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Player not found")
    return stats

# Game Session Routes
@api_router.post("/sessions", response_model=GameSession)
async def create_game_session(session_data: GameSessionCreate, service: GameService = Depends(get_game_service)):
    """Create a new game session"""
    return await service.create_game_session(session_data)

@api_router.get("/sessions/{session_id}", response_model=GameSession)
async def get_game_session(session_id: str, service: GameService = Depends(get_game_service)):
    """Get game session by ID"""
    session = await service.get_game_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Game session not found")
    return session

@api_router.put("/sessions/{session_id}", response_model=GameSession)
async def update_game_session(
    session_id: str, 
    update_data: GameSessionUpdate, 
    service: GameService = Depends(get_game_service)
):
    """Update game session"""
    session = await service.update_game_session(session_id, update_data)
    if not session:
        raise HTTPException(status_code=404, detail="Game session not found")
    return session

@api_router.post("/sessions/{session_id}/end", response_model=GameSession)
async def end_game_session(session_id: str, service: GameService = Depends(get_game_service)):
    """End game session and update player stats"""
    session = await service.end_game_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Game session not found")
    return session

@api_router.get("/sessions/{session_id}/achievements", response_model=List[Achievement])
async def check_achievements(session_id: str, service: GameService = Depends(get_game_service)):
    """Check and unlock achievements for a session"""
    return await service.check_achievements(session_id)

# Leaderboard Routes
@api_router.get("/leaderboard", response_model=Leaderboard)
async def get_leaderboard(limit: int = 10, service: GameService = Depends(get_game_service)):
    """Get leaderboard with top players"""
    return await service.get_leaderboard(limit)

# Health check
@api_router.get("/")
async def root():
    return {"message": "Penguin Climber API is running!", "status": "healthy"}

@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "service": "Penguin Climber Game API"
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)