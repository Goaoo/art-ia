from motor.motor_asyncio import AsyncIOMotorDatabase
from models.game_models import *
from typing import List, Optional, Dict, Any
from datetime import datetime
import asyncio

class GameService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.players = db.players
        self.sessions = db.game_sessions
        self.achievements = db.achievements
        
    async def get_game_elements(self) -> GameElements:
        """Get all game elements (power-ups, obstacles, collectibles, achievements)"""
        power_ups = [
            PowerUp(id="jump_boost", name="Jump Boost", duration=10000, description="Jump higher for 10 seconds"),
            PowerUp(id="speed", name="Speed Boost", duration=8000, description="Move faster for 8 seconds"),
            PowerUp(id="shield", name="Shield", duration=15000, description="Protect from obstacles for 15 seconds"),
            PowerUp(id="magnet", name="Magnet", duration=12000, description="Attract collectibles for 12 seconds"),
            PowerUp(id="double_jump", name="Double Jump", duration=20000, description="Jump twice in mid-air for 20 seconds"),
            PowerUp(id="slow_time", name="Slow Time", duration=6000, description="Slow down time for 6 seconds"),
            PowerUp(id="extra_life", name="Extra Life", duration=0, description="Gain an extra life"),
            PowerUp(id="score_multiplier", name="Score Multiplier", duration=15000, description="Double score for 15 seconds")
        ]
        
        obstacles = [
            Obstacle(id="ice_block", name="Ice Block", description="Slippery ice that can make you fall"),
            Obstacle(id="falling_rock", name="Falling Rock", description="Dangerous falling rocks"),
            Obstacle(id="wind_gust", name="Wind Gust", description="Strong wind that pushes you around"),
            Obstacle(id="spike", name="Spike", description="Sharp spikes that damage you"),
            Obstacle(id="moving_platform", name="Moving Platform", description="Platform that moves unpredictably"),
            Obstacle(id="crumbling_ledge", name="Crumbling Ledge", description="Weak ledge that breaks under weight"),
            Obstacle(id="snowball", name="Snowball", description="Rolling snowball that blocks your path")
        ]
        
        collectibles = [
            Collectible(id="fish", name="Fish", subType="fish", points=10, description="Delicious fish worth 10 points"),
            Collectible(id="coins", name="Coins", subType="coins", points=5, description="Shiny coins worth 5 points"),
            Collectible(id="gems", name="Gems", subType="gems", points=25, description="Precious gems worth 25 points"),
            Collectible(id="heart", name="Heart", subType="heart", points=0, description="Restore health"),
            Collectible(id="star", name="Star", subType="star", points=50, description="Special star worth 50 points")
        ]
        
        achievements = [
            Achievement(id="100_jumps", name="100 Jumps", description="Make 100 jumps in a single game", reward="Jump Boost Power-up"),
            Achievement(id="fish_collector", name="Fish Collector", description="Collect 50 fish", reward="Magnet Power-up"),
            Achievement(id="coin_master", name="Coin Master", description="Collect 100 coins", reward="Score Multiplier"),
            Achievement(id="gem_hunter", name="Gem Hunter", description="Collect 20 gems", reward="Extra Life"),
            Achievement(id="distance_walker", name="Distance Walker", description="Climb 1000m in a single game", reward="Shield Power-up"),
            Achievement(id="score_achiever", name="Score Achiever", description="Reach 5000 points", reward="Double Jump"),
            Achievement(id="survivor", name="Survivor", description="Survive for 5 minutes", reward="Slow Time Power-up"),
            Achievement(id="power_user", name="Power User", description="Use 10 different power-ups", reward="All Power-ups Unlocked")
        ]
        
        return GameElements(
            powerUps=power_ups,
            obstacles=obstacles,
            collectibles=collectibles,
            achievements=achievements
        )
    
    async def create_player(self, player_data: PlayerCreate) -> Player:
        """Create a new player"""
        player = Player(name=player_data.name)
        await self.players.insert_one(player.dict())
        return player
    
    async def get_player(self, player_id: str) -> Optional[Player]:
        """Get player by ID"""
        player_data = await self.players.find_one({"id": player_id})
        if player_data:
            return Player(**player_data)
        return None
    
    async def get_or_create_player(self, player_name: str) -> Player:
        """Get player by name or create if doesn't exist"""
        player_data = await self.players.find_one({"name": player_name})
        if player_data:
            return Player(**player_data)
        else:
            return await self.create_player(PlayerCreate(name=player_name))
    
    async def create_game_session(self, session_data: GameSessionCreate) -> GameSession:
        """Create a new game session"""
        session = GameSession(player_id=session_data.player_id)
        await self.sessions.insert_one(session.dict())
        return session
    
    async def get_game_session(self, session_id: str) -> Optional[GameSession]:
        """Get game session by ID"""
        session_data = await self.sessions.find_one({"id": session_id})
        if session_data:
            return GameSession(**session_data)
        return None
    
    async def update_game_session(self, session_id: str, update_data: GameSessionUpdate) -> Optional[GameSession]:
        """Update game session"""
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        
        if update_dict:
            await self.sessions.update_one(
                {"id": session_id},
                {"$set": update_dict}
            )
        
        return await self.get_game_session(session_id)
    
    async def end_game_session(self, session_id: str) -> Optional[GameSession]:
        """End game session and update player stats"""
        session = await self.get_game_session(session_id)
        if not session:
            return None
        
        # Update session end time
        end_time = datetime.utcnow()
        duration = int((end_time - session.started_at).total_seconds())
        
        await self.sessions.update_one(
            {"id": session_id},
            {"$set": {
                "ended_at": end_time,
                "duration": duration,
                "game_state": "gameOver"
            }}
        )
        
        # Update player stats
        await self.update_player_stats(session.player_id, session)
        
        return await self.get_game_session(session_id)
    
    async def update_player_stats(self, player_id: str, session: GameSession):
        """Update player statistics after game session"""
        player = await self.get_player(player_id)
        if not player:
            return
        
        # Update player stats
        update_data = {
            "total_score": player.total_score + session.score,
            "best_score": max(player.best_score, session.score),
            "total_distance": player.total_distance + session.distance,
            "best_distance": max(player.best_distance, session.distance),
            "total_jumps": player.total_jumps + session.jumps,
            "total_games": player.total_games + 1,
            "last_played": datetime.utcnow()
        }
        
        await self.players.update_one(
            {"id": player_id},
            {"$set": update_data}
        )
    
    async def check_achievements(self, session_id: str) -> List[Achievement]:
        """Check and unlock achievements for a session"""
        session = await self.get_game_session(session_id)
        if not session:
            return []
        
        player = await self.get_player(session.player_id)
        if not player:
            return []
        
        unlocked_achievements = []
        game_elements = await self.get_game_elements()
        
        for achievement in game_elements.achievements:
            if achievement.id in session.achievements_unlocked:
                continue
                
            unlocked = False
            
            # Check achievement conditions
            if achievement.id == "100_jumps" and session.jumps >= 100:
                unlocked = True
            elif achievement.id == "fish_collector" and session.collectibles.get("fish", 0) >= 50:
                unlocked = True
            elif achievement.id == "coin_master" and session.collectibles.get("coins", 0) >= 100:
                unlocked = True
            elif achievement.id == "gem_hunter" and session.collectibles.get("gems", 0) >= 20:
                unlocked = True
            elif achievement.id == "distance_walker" and session.distance >= 1000:
                unlocked = True
            elif achievement.id == "score_achiever" and session.score >= 5000:
                unlocked = True
            elif achievement.id == "survivor" and session.duration and session.duration >= 300:  # 5 minutes
                unlocked = True
            elif achievement.id == "power_user" and len(set(session.power_ups_used)) >= 10:
                unlocked = True
            
            if unlocked:
                achievement.unlocked = True
                achievement.unlocked_at = datetime.utcnow()
                unlocked_achievements.append(achievement)
                
                # Add to session achievements
                await self.sessions.update_one(
                    {"id": session_id},
                    {"$push": {"achievements_unlocked": achievement.id}}
                )
        
        return unlocked_achievements
    
    async def get_leaderboard(self, limit: int = 10) -> Leaderboard:
        """Get leaderboard with top players"""
        # Top scores
        top_scores_cursor = self.players.find().sort("best_score", -1).limit(limit)
        top_scores = []
        async for player in top_scores_cursor:
            top_scores.append({
                "name": player["name"],
                "score": player["best_score"],
                "id": player["id"]
            })
        
        # Top distances  
        top_distances_cursor = self.players.find().sort("best_distance", -1).limit(limit)
        top_distances = []
        async for player in top_distances_cursor:
            top_distances.append({
                "name": player["name"],
                "distance": player["best_distance"],
                "id": player["id"]
            })
        
        # Top jumpers
        top_jumpers_cursor = self.players.find().sort("total_jumps", -1).limit(limit)
        top_jumpers = []
        async for player in top_jumpers_cursor:
            top_jumpers.append({
                "name": player["name"],
                "jumps": player["total_jumps"],
                "id": player["id"]
            })
        
        return Leaderboard(
            top_scores=top_scores,
            top_distances=top_distances,
            top_jumpers=top_jumpers
        )
    
    async def get_player_stats(self, player_id: str) -> Optional[PlayerStats]:
        """Get detailed player statistics"""
        player = await self.get_player(player_id)
        if not player:
            return None
        
        # Calculate rank (simplified)
        higher_score_count = await self.players.count_documents({"best_score": {"$gt": player.best_score}})
        rank = higher_score_count + 1
        
        return PlayerStats(
            player_id=player_id,
            total_score=player.total_score,
            best_score=player.best_score,
            total_distance=player.total_distance,
            best_distance=player.best_distance,
            total_jumps=player.total_jumps,
            total_games=player.total_games,
            achievements_count=len(player.achievements),
            rank=rank
        )