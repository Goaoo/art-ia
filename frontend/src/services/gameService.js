import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

class GameService {
  constructor() {
    this.currentSession = null;
    this.currentPlayer = null;
  }

  // Player Management
  async getOrCreatePlayer(playerName) {
    try {
      const response = await axios.get(`${API}/players/name/${encodeURIComponent(playerName)}`);
      this.currentPlayer = response.data;
      return response.data;
    } catch (error) {
      console.error('Error getting/creating player:', error);
      throw error;
    }
  }

  async getPlayer(playerId) {
    try {
      const response = await axios.get(`${API}/players/${playerId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting player:', error);
      throw error;
    }
  }

  async getPlayerStats(playerId) {
    try {
      const response = await axios.get(`${API}/players/${playerId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error getting player stats:', error);
      throw error;
    }
  }

  // Game Elements
  async getGameElements() {
    try {
      const response = await axios.get(`${API}/game-elements`);
      return response.data;
    } catch (error) {
      console.error('Error getting game elements:', error);
      throw error;
    }
  }

  // Game Session Management
  async createGameSession(playerId) {
    try {
      const response = await axios.post(`${API}/sessions`, {
        player_id: playerId
      });
      this.currentSession = response.data;
      return response.data;
    } catch (error) {
      console.error('Error creating game session:', error);
      throw error;
    }
  }

  async getGameSession(sessionId) {
    try {
      const response = await axios.get(`${API}/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting game session:', error);
      throw error;
    }
  }

  async updateGameSession(sessionId, updateData) {
    try {
      const response = await axios.put(`${API}/sessions/${sessionId}`, updateData);
      this.currentSession = response.data;
      return response.data;
    } catch (error) {
      console.error('Error updating game session:', error);
      throw error;
    }
  }

  async endGameSession(sessionId) {
    try {
      const response = await axios.post(`${API}/sessions/${sessionId}/end`);
      this.currentSession = response.data;
      return response.data;
    } catch (error) {
      console.error('Error ending game session:', error);
      throw error;
    }
  }

  // Achievements
  async checkAchievements(sessionId) {
    try {
      const response = await axios.get(`${API}/sessions/${sessionId}/achievements`);
      return response.data;
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  }

  // Leaderboard
  async getLeaderboard(limit = 10) {
    try {
      const response = await axios.get(`${API}/leaderboard?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  // Utility methods
  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getCurrentSession() {
    return this.currentSession;
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player;
  }

  setCurrentSession(session) {
    this.currentSession = session;
  }
}

export default new GameService();