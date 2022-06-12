import React, { useEffect, useState } from 'react';
import './LeaderBoard.pcss';
import { LeaderInfo } from './components/LeaderInfo';
import { leaderboardApi } from '../../api/leaderBoard';

type Leader = {
  playerName: string;
  login: string;
  snakeLength: number;
  position: number;
};

type Leaders = Leader[];

const LeaderBoard = () => {
  const [leaders, setLeaders] = useState<Leaders>([]);

  useEffect(() => {
    const collectedLeaders = [];
    async function fetchLeaders() {
      const newleaders = await leaderboardApi.getAllLeaderboard({
        ratingFieldName: 'snakeScore',
        cursor: 0,
        limit: 10,
      });
      if (newleaders && newleaders.length > 0) {
        newleaders.forEach((leader, i) => {
          collectedLeaders.push({
            playerName: leader.data.firstName,
            login: leader.data.login,
            snakeLength: leader.data.snakeScore,
            position: i + 1,
          });
        });
      }
      setLeaders(collectedLeaders);
    }
    fetchLeaders();
  }, []);

  return (
    <div className="leaderboard">
      <div className="leaderboard__tbl">
        <div className="leaderboard__raw_header">
          <div className="leaderboard__cell_player">Игрок</div>
          <div className="leaderboard__cell_snakelength">Длина змейки</div>
        </div>
        {leaders.map((leader, i) => (
          <LeaderInfo
            key={`${leader.login}${i + 1}`}
            position={i + 1}
            userName={leader.playerName}
            login={leader.login}
            snakeLength={leader.snakeLength}
          />
        ))}
      </div>
    </div>
  );
};

export default LeaderBoard;
