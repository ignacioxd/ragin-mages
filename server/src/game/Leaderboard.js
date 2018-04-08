export default class Leaderboard {
  constructor(playerManager) {
    this.playerManager = playerManager;
    this.leaderboardArray = []
    this.leaderboardMap = new Map();
  }

  update(player) {
    if(this.leaderboardMap.get(player.id)) { //Player is already on leaderboard, so make sure we're up to date
      this.sort();
      return true;
    }
    else if(this.leaderboardArray.length < 10) { //We could still use more leaders
      this.leaderboardArray.push(player);
      this.leaderboardMap.set(player.id, player);
      this.sort();
      return true;
    }
    else if(this.leaderboardArray[9].kills < player.kills) { //We have a new leader
      let old = this.leaderboardArray.pop();
      this.leaderboardMap.delete(old.id);
      this.leaderboardArray.push(player);
      this.leaderboardMap.set(player.id, player);
      this.sort();
      return true;
    }
    return false;
  }

  remove(player) {
    if(this.leaderboardMap.get(player.id)) { //Only do this if the player is on the leaderboard
      const delIndex = this.leaderboardArray.findIndex((value) =>  value.id == player.id);
      if(delIndex > -1) {
        this.leaderboardArray.splice(delIndex, 1);
        this.leaderboardMap.delete(player.id);
      }

      //Find the highest ranking player that is not on the leaderboard, so that we always have 10
      let leader = null;
      for(let [socket, potentialLeader] of this.playerManager.players) {
        if(potentialLeader.kills > 0 && !this.leaderboardMap.get(potentialLeader.id) && (leader && potentialLeader.kills > leader.kills)) {
          leader = potentialLeader;
        }
      }
      if(leader) {
        this.leaderboardArray.push(leader);
        this.leaderboardMap.set(leader.id, leader);
        this.sort();
      }

      return true;
    }
    return false;
  }

  sort() {
    this.leaderboardArray.sort(function(char1, char2)  {
      if (char1.kills < char2.kills)
        return 1;
      if (char1.kills > char2.kills)
        return -1;
      return 0;
    });
    for(let i = 0; i < this.leaderboardArray.length; i++) {
      this.leaderboardArray[i].currentRank = i + 1;
      //Lower value is higher ranking  ¯\(°_o)/¯
      if(!this.leaderboardArray[i].highestRank || this.leaderboardArray[i].highestRank > this.leaderboardArray[i].currentRank) {
        this.leaderboardArray[i].highestRank = this.leaderboardArray[i].currentRank;
      }
    }
  }

  getArray() {
    let leaders = [];
    for(const player of this.leaderboardArray) {
      leaders.push({
        id: player.id,
        handle: player.handle,
        character: player.character,
        kills: player.kills,
        currentRank: player.currentRank,
        highestRank: player.highestRank
      });
    }
    return leaders;
  }

}