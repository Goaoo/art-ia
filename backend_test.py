#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Penguin Climber Game
Tests all endpoints and game flow as specified in the review request.
"""

import asyncio
import aiohttp
import json
import os
from datetime import datetime
from typing import Dict, Any, List

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        pass
    return "http://localhost:8001"

BASE_URL = get_backend_url() + "/api"

class PenguinClimberAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = None
        self.test_results = []
        self.created_players = []
        self.created_sessions = []
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        self.test_results.append({
            "test": test_name,
            "status": status,
            "success": success,
            "details": details
        })
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
    
    async def make_request(self, method: str, endpoint: str, data: Dict = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{self.base_url}{endpoint}"
        try:
            if method.upper() == "GET":
                async with self.session.get(url) as response:
                    response_data = await response.json()
                    return response.status < 400, response_data, response.status
            elif method.upper() == "POST":
                async with self.session.post(url, json=data) as response:
                    response_data = await response.json()
                    return response.status < 400, response_data, response.status
            elif method.upper() == "PUT":
                async with self.session.put(url, json=data) as response:
                    response_data = await response.json()
                    return response.status < 400, response_data, response.status
        except Exception as e:
            return False, {"error": str(e)}, 500
    
    async def test_game_elements_api(self):
        """Test 1: Game Elements API - Verify all 20 elements are returned"""
        print("\n=== Testing Game Elements API ===")
        
        success, data, status = await self.make_request("GET", "/game-elements")
        
        if not success:
            self.log_test("Game Elements API", False, f"Request failed with status {status}: {data}")
            return
        
        # Verify structure
        required_keys = ["powerUps", "obstacles", "collectibles", "achievements"]
        missing_keys = [key for key in required_keys if key not in data]
        if missing_keys:
            self.log_test("Game Elements API", False, f"Missing keys: {missing_keys}")
            return
        
        # Count elements
        powerups_count = len(data.get("powerUps", []))
        obstacles_count = len(data.get("obstacles", []))
        collectibles_count = len(data.get("collectibles", []))
        achievements_count = len(data.get("achievements", []))
        total_count = powerups_count + obstacles_count + collectibles_count + achievements_count
        
        # Verify counts (8 powerups, 7 obstacles, 5 collectibles, 8 achievements = 28 total)
        expected_counts = {
            "powerUps": 8,
            "obstacles": 7, 
            "collectibles": 5,
            "achievements": 8
        }
        
        count_issues = []
        for element_type, expected_count in expected_counts.items():
            actual_count = len(data.get(element_type, []))
            if actual_count != expected_count:
                count_issues.append(f"{element_type}: expected {expected_count}, got {actual_count}")
        
        if count_issues:
            self.log_test("Game Elements API", False, f"Count mismatches: {'; '.join(count_issues)}")
        else:
            self.log_test("Game Elements API", True, f"All elements present: {powerups_count} powerups, {obstacles_count} obstacles, {collectibles_count} collectibles, {achievements_count} achievements")
    
    async def test_player_management(self):
        """Test 2: Player Management APIs"""
        print("\n=== Testing Player Management ===")
        
        # Test creating a player
        player_name = "PenguinMaster2024"
        success, player_data, status = await self.make_request("POST", "/players", {"name": player_name})
        
        if not success:
            self.log_test("Create Player", False, f"Failed to create player: {player_data}")
            return
        
        player_id = player_data.get("id")
        if not player_id:
            self.log_test("Create Player", False, "No player ID returned")
            return
        
        self.created_players.append(player_id)
        self.log_test("Create Player", True, f"Created player {player_name} with ID {player_id}")
        
        # Test getting player by name
        success, retrieved_player, status = await self.make_request("GET", f"/players/name/{player_name}")
        
        if not success:
            self.log_test("Get Player by Name", False, f"Failed to get player by name: {retrieved_player}")
        elif retrieved_player.get("id") != player_id:
            self.log_test("Get Player by Name", False, f"Player ID mismatch: expected {player_id}, got {retrieved_player.get('id')}")
        else:
            self.log_test("Get Player by Name", True, f"Successfully retrieved player {player_name}")
        
        # Test getting player stats
        success, stats_data, status = await self.make_request("GET", f"/players/{player_id}/stats")
        
        if not success:
            self.log_test("Get Player Stats", False, f"Failed to get player stats: {stats_data}")
        else:
            required_stats = ["player_id", "total_score", "best_score", "total_distance", "best_distance", "total_jumps", "total_games", "achievements_count", "rank"]
            missing_stats = [stat for stat in required_stats if stat not in stats_data]
            if missing_stats:
                self.log_test("Get Player Stats", False, f"Missing stats fields: {missing_stats}")
            else:
                self.log_test("Get Player Stats", True, f"All stats fields present for player {player_id}")
        
        return player_id
    
    async def test_game_session_management(self, player_id: str):
        """Test 3: Game Session Management"""
        print("\n=== Testing Game Session Management ===")
        
        # Test creating a new game session
        success, session_data, status = await self.make_request("POST", "/sessions", {"player_id": player_id})
        
        if not success:
            self.log_test("Create Game Session", False, f"Failed to create session: {session_data}")
            return None
        
        session_id = session_data.get("id")
        if not session_id:
            self.log_test("Create Game Session", False, "No session ID returned")
            return None
        
        self.created_sessions.append(session_id)
        self.log_test("Create Game Session", True, f"Created session {session_id} for player {player_id}")
        
        # Test getting game session
        success, retrieved_session, status = await self.make_request("GET", f"/sessions/{session_id}")
        
        if not success:
            self.log_test("Get Game Session", False, f"Failed to get session: {retrieved_session}")
        elif retrieved_session.get("id") != session_id:
            self.log_test("Get Game Session", False, f"Session ID mismatch")
        else:
            self.log_test("Get Game Session", True, f"Successfully retrieved session {session_id}")
        
        # Test updating game session multiple times
        updates = [
            {"score": 150, "distance": 25.5, "jumps": 10},
            {"score": 350, "distance": 55.2, "jumps": 25, "collectibles": {"fish": 5, "coins": 12, "gems": 2}},
            {"score": 750, "distance": 120.8, "jumps": 50, "collectibles": {"fish": 15, "coins": 30, "gems": 5}},
            {"score": 1500, "distance": 250.0, "jumps": 105, "collectibles": {"fish": 55, "coins": 105, "gems": 22}}
        ]
        
        for i, update_data in enumerate(updates, 1):
            success, updated_session, status = await self.make_request("PUT", f"/sessions/{session_id}", update_data)
            
            if not success:
                self.log_test(f"Update Game Session #{i}", False, f"Failed to update session: {updated_session}")
            else:
                # Verify the update was applied
                verification_success = True
                for key, expected_value in update_data.items():
                    if key == "collectibles":
                        actual_collectibles = updated_session.get("collectibles", {})
                        for collectible_type, expected_count in expected_value.items():
                            if actual_collectibles.get(collectible_type, 0) != expected_count:
                                verification_success = False
                                break
                    elif updated_session.get(key) != expected_value:
                        verification_success = False
                        break
                
                if verification_success:
                    self.log_test(f"Update Game Session #{i}", True, f"Session updated successfully with {update_data}")
                else:
                    self.log_test(f"Update Game Session #{i}", False, f"Update verification failed")
        
        return session_id
    
    async def test_achievements_system(self, session_id: str):
        """Test 4: Achievements System"""
        print("\n=== Testing Achievements System ===")
        
        # Test checking achievements
        success, achievements_data, status = await self.make_request("GET", f"/sessions/{session_id}/achievements")
        
        if not success:
            self.log_test("Check Achievements", False, f"Failed to check achievements: {achievements_data}")
            return
        
        if not isinstance(achievements_data, list):
            self.log_test("Check Achievements", False, f"Expected list of achievements, got {type(achievements_data)}")
            return
        
        # Based on our test updates, we should have unlocked some achievements:
        # - 100_jumps (we had 105 jumps)
        # - fish_collector (we had 55 fish)  
        # - coin_master (we had 105 coins)
        # - gem_hunter (we had 22 gems)
        
        expected_achievements = ["100_jumps", "fish_collector", "coin_master", "gem_hunter"]
        unlocked_achievement_ids = [ach.get("id") for ach in achievements_data if ach.get("unlocked")]
        
        unlocked_expected = [ach_id for ach_id in expected_achievements if ach_id in unlocked_achievement_ids]
        
        if len(unlocked_expected) > 0:
            self.log_test("Achievement Unlocking", True, f"Unlocked {len(unlocked_expected)} expected achievements: {unlocked_expected}")
        else:
            self.log_test("Achievement Unlocking", False, f"No expected achievements unlocked. Got: {unlocked_achievement_ids}")
        
        # Test specific achievement conditions
        achievement_tests = [
            ("100 Jumps Achievement", "100_jumps" in unlocked_achievement_ids),
            ("Fish Collector Achievement", "fish_collector" in unlocked_achievement_ids),
            ("Coin Master Achievement", "coin_master" in unlocked_achievement_ids),
            ("Gem Hunter Achievement", "gem_hunter" in unlocked_achievement_ids)
        ]
        
        for test_name, condition in achievement_tests:
            self.log_test(test_name, condition, "Achievement unlocked as expected" if condition else "Achievement not unlocked")
    
    async def test_end_game_session(self, session_id: str):
        """Test ending game session"""
        print("\n=== Testing End Game Session ===")
        
        success, ended_session, status = await self.make_request("POST", f"/sessions/{session_id}/end")
        
        if not success:
            self.log_test("End Game Session", False, f"Failed to end session: {ended_session}")
            return
        
        # Verify session is marked as ended
        if ended_session.get("game_state") != "gameOver":
            self.log_test("End Game Session", False, f"Game state not set to gameOver: {ended_session.get('game_state')}")
        elif not ended_session.get("ended_at"):
            self.log_test("End Game Session", False, "No end timestamp set")
        else:
            self.log_test("End Game Session", True, f"Session {session_id} ended successfully")
    
    async def test_leaderboard_system(self):
        """Test 5: Leaderboard System"""
        print("\n=== Testing Leaderboard System ===")
        
        success, leaderboard_data, status = await self.make_request("GET", "/leaderboard")
        
        if not success:
            self.log_test("Get Leaderboard", False, f"Failed to get leaderboard: {leaderboard_data}")
            return
        
        # Verify leaderboard structure
        required_keys = ["top_scores", "top_distances", "top_jumpers"]
        missing_keys = [key for key in required_keys if key not in leaderboard_data]
        
        if missing_keys:
            self.log_test("Leaderboard Structure", False, f"Missing leaderboard keys: {missing_keys}")
        else:
            self.log_test("Leaderboard Structure", True, "All leaderboard categories present")
        
        # Verify each category is a list
        for category in required_keys:
            if not isinstance(leaderboard_data.get(category), list):
                self.log_test(f"Leaderboard {category}", False, f"{category} is not a list")
            else:
                self.log_test(f"Leaderboard {category}", True, f"{category} contains {len(leaderboard_data[category])} entries")
    
    async def test_complete_game_flow(self):
        """Test 6: Complete Game Flow"""
        print("\n=== Testing Complete Game Flow ===")
        
        # Create player
        flow_player_name = "FlowTestPlayer2024"
        success, player_data, status = await self.make_request("POST", "/players", {"name": flow_player_name})
        
        if not success:
            self.log_test("Complete Flow - Create Player", False, f"Failed to create player: {player_data}")
            return
        
        player_id = player_data.get("id")
        self.created_players.append(player_id)
        self.log_test("Complete Flow - Create Player", True, f"Created player {flow_player_name}")
        
        # Create session
        success, session_data, status = await self.make_request("POST", "/sessions", {"player_id": player_id})
        
        if not success:
            self.log_test("Complete Flow - Create Session", False, f"Failed to create session: {session_data}")
            return
        
        session_id = session_data.get("id")
        self.created_sessions.append(session_id)
        self.log_test("Complete Flow - Create Session", True, f"Created session {session_id}")
        
        # Update session multiple times (simulate gameplay)
        game_updates = [
            {"score": 100, "distance": 15.0, "jumps": 8},
            {"score": 300, "distance": 45.0, "jumps": 25, "collectibles": {"fish": 3, "coins": 8}},
            {"score": 800, "distance": 95.0, "jumps": 55, "collectibles": {"fish": 12, "coins": 25, "gems": 3}},
            {"score": 2000, "distance": 180.0, "jumps": 110, "collectibles": {"fish": 60, "coins": 110, "gems": 25}},
            {"score": 5500, "distance": 1200.0, "jumps": 150, "collectibles": {"fish": 80, "coins": 150, "gems": 30}}
        ]
        
        for i, update in enumerate(game_updates, 1):
            success, updated_session, status = await self.make_request("PUT", f"/sessions/{session_id}", update)
            if success:
                self.log_test(f"Complete Flow - Update #{i}", True, f"Game update {i} successful")
            else:
                self.log_test(f"Complete Flow - Update #{i}", False, f"Game update {i} failed")
        
        # Check achievements
        success, achievements, status = await self.make_request("GET", f"/sessions/{session_id}/achievements")
        if success:
            unlocked_count = len([ach for ach in achievements if ach.get("unlocked")])
            self.log_test("Complete Flow - Check Achievements", True, f"Found {unlocked_count} unlocked achievements")
        else:
            self.log_test("Complete Flow - Check Achievements", False, "Failed to check achievements")
        
        # End session
        success, ended_session, status = await self.make_request("POST", f"/sessions/{session_id}/end")
        if success:
            self.log_test("Complete Flow - End Session", True, "Session ended successfully")
        else:
            self.log_test("Complete Flow - End Session", False, "Failed to end session")
        
        # Verify player stats were updated
        success, final_stats, status = await self.make_request("GET", f"/players/{player_id}/stats")
        if success and final_stats.get("total_games", 0) > 0:
            self.log_test("Complete Flow - Player Stats Update", True, f"Player stats updated: {final_stats.get('total_games')} games played")
        else:
            self.log_test("Complete Flow - Player Stats Update", False, "Player stats not updated properly")
    
    async def test_health_endpoints(self):
        """Test health and root endpoints"""
        print("\n=== Testing Health Endpoints ===")
        
        # Test root endpoint
        success, root_data, status = await self.make_request("GET", "/")
        if success and "message" in root_data:
            self.log_test("Root Endpoint", True, f"Root endpoint working: {root_data.get('message')}")
        else:
            self.log_test("Root Endpoint", False, f"Root endpoint failed: {root_data}")
        
        # Test health endpoint
        success, health_data, status = await self.make_request("GET", "/health")
        if success and health_data.get("status") == "healthy":
            self.log_test("Health Endpoint", True, f"Health check passed: {health_data.get('service')}")
        else:
            self.log_test("Health Endpoint", False, f"Health check failed: {health_data}")
    
    async def run_all_tests(self):
        """Run all tests in sequence"""
        print(f"🐧 Starting Penguin Climber Backend API Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Test health endpoints first
        await self.test_health_endpoints()
        
        # Test game elements API
        await self.test_game_elements_api()
        
        # Test player management and get player ID
        player_id = await self.test_player_management()
        
        if player_id:
            # Test game session management
            session_id = await self.test_game_session_management(player_id)
            
            if session_id:
                # Test achievements system
                await self.test_achievements_system(session_id)
                
                # End the session
                await self.test_end_game_session(session_id)
        
        # Test leaderboard system
        await self.test_leaderboard_system()
        
        # Test complete game flow
        await self.test_complete_game_flow()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("🐧 PENGUIN CLIMBER BACKEND API TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total*100):.1f}%" if total > 0 else "0%")
        
        print("\nDetailed Results:")
        for result in self.test_results:
            print(f"{result['status']}: {result['test']}")
            if result['details'] and not result['success']:
                print(f"   Error: {result['details']}")
        
        print("\n" + "=" * 60)
        
        if passed == total:
            print("🎉 ALL TESTS PASSED! Backend API is working correctly.")
        else:
            print(f"⚠️  {total - passed} tests failed. Please check the issues above.")
        
        print("=" * 60)

async def main():
    """Main test runner"""
    async with PenguinClimberAPITester() as tester:
        await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())