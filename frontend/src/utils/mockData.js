// Mock data for the penguin climbing game
export const mockGameData = {
  powerUps: [
    { id: 'jump_boost', name: 'Jump Boost', type: 'powerUp', duration: 10000, description: 'Jump higher for 10 seconds' },
    { id: 'speed', name: 'Speed Boost', type: 'powerUp', duration: 8000, description: 'Move faster for 8 seconds' },
    { id: 'shield', name: 'Shield', type: 'powerUp', duration: 15000, description: 'Protect from obstacles for 15 seconds' },
    { id: 'magnet', name: 'Magnet', type: 'powerUp', duration: 12000, description: 'Attract collectibles for 12 seconds' },
    { id: 'double_jump', name: 'Double Jump', type: 'powerUp', duration: 20000, description: 'Jump twice in mid-air for 20 seconds' },
    { id: 'slow_time', name: 'Slow Time', type: 'powerUp', duration: 6000, description: 'Slow down time for 6 seconds' },
    { id: 'extra_life', name: 'Extra Life', type: 'powerUp', duration: 0, description: 'Gain an extra life' },
    { id: 'score_multiplier', name: 'Score Multiplier', type: 'powerUp', duration: 15000, description: 'Double score for 15 seconds' }
  ],
  
  obstacles: [
    { id: 'ice_block', name: 'Ice Block', type: 'obstacle', description: 'Slippery ice that can make you fall' },
    { id: 'falling_rock', name: 'Falling Rock', type: 'obstacle', description: 'Dangerous falling rocks' },
    { id: 'wind_gust', name: 'Wind Gust', type: 'obstacle', description: 'Strong wind that pushes you around' },
    { id: 'spike', name: 'Spike', type: 'obstacle', description: 'Sharp spikes that damage you' },
    { id: 'moving_platform', name: 'Moving Platform', type: 'obstacle', description: 'Platform that moves unpredictably' },
    { id: 'crumbling_ledge', name: 'Crumbling Ledge', type: 'obstacle', description: 'Weak ledge that breaks under weight' },
    { id: 'snowball', name: 'Snowball', type: 'obstacle', description: 'Rolling snowball that blocks your path' }
  ],
  
  collectibles: [
    { id: 'fish', name: 'Fish', type: 'collectible', subType: 'fish', points: 10, description: 'Delicious fish worth 10 points' },
    { id: 'coins', name: 'Coins', type: 'collectible', subType: 'coins', points: 5, description: 'Shiny coins worth 5 points' },
    { id: 'gems', name: 'Gems', type: 'collectible', subType: 'gems', points: 25, description: 'Precious gems worth 25 points' },
    { id: 'heart', name: 'Heart', type: 'collectible', subType: 'heart', points: 0, description: 'Restore health' },
    { id: 'star', name: 'Star', type: 'collectible', subType: 'star', points: 50, description: 'Special star worth 50 points' }
  ],
  
  achievements: [
    { id: '100_jumps', name: '100 Jumps', description: 'Make 100 jumps in a single game', reward: 'Jump Boost Power-up' },
    { id: 'fish_collector', name: 'Fish Collector', description: 'Collect 50 fish', reward: 'Magnet Power-up' },
    { id: 'coin_master', name: 'Coin Master', description: 'Collect 100 coins', reward: 'Score Multiplier' },
    { id: 'gem_hunter', name: 'Gem Hunter', description: 'Collect 20 gems', reward: 'Extra Life' },
    { id: 'distance_walker', name: 'Distance Walker', description: 'Climb 1000m in a single game', reward: 'Shield Power-up' },
    { id: 'score_achiever', name: 'Score Achiever', description: 'Reach 5000 points', reward: 'Double Jump' },
    { id: 'survivor', name: 'Survivor', description: 'Survive for 5 minutes', reward: 'Slow Time Power-up' },
    { id: 'power_user', name: 'Power User', description: 'Use 10 different power-ups', reward: 'All Power-ups Unlocked' }
  ]
};