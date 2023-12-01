import React, { useState } from 'react';
import LevelContainer from './LevelContainer';
import PieComponent from './PieComponent';
import SpecialSkillsLevelsContainer from './SpecialSkillsLevelsContainer';
import BarComponent from './BarComponent';

const DashboardSpecialSkills = ({levelsdataSpecialskills}) => {
  // const levelsdataSpecialskills = {
  //   tableheading: ["", "Total Score", "Corrected Answers", "Wrong Answers", "Time Taken"],
  //   levels: ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"],
  //   score: [60, 80, 40, 80, 100],
  //   correct: [3, 4, 2, 4, 5],
  //   wrong: [2, 1, 3, 1, 0],
  //   time: ["30 min 10 sec", "21 min 10 sec", "50 min 10 sec", "20 min 30 sec", "17 min 27 sec"]
  // };

  const barChartData = {
    labels: levelsdataSpecialskills.levels,
    datasets: [
      {
        label: "Corrected Answers",
        backgroundColor: "#73d673",
        hoverBackgroundColor: "#0b66e6",
        data: levelsdataSpecialskills.correct,
      },
      {
        label: "Wrong Answers",
        backgroundColor: "#df676e",
        hoverBackgroundColor: "#d9234a",
        data: levelsdataSpecialskills.wrong,
      },
      {
        label: "Percentage",
        backgroundColor: "#4d90f1",
        hoverBackgroundColor: "#50b551",
        data: levelsdataSpecialskills.score,
      },
    ],
  };



  const [selectedLevel, setSelectedLevel] = useState(levelsdataSpecialskills.levels[0]);

  const [corrected, setCorrected] = useState(levelsdataSpecialskills.correct[0])
  const [wrong, setWrong] = useState(levelsdataSpecialskills.wrong[0])

  const handleLevelClick = (level, index) => {
    setSelectedLevel(level);
    setCorrected(levelsdataSpecialskills.correct[index])
    setWrong(levelsdataSpecialskills.wrong[index])

  };



  return (
    <section className='Dashboard__Content__Academics'>

      <article className='Dashboard__Content__Academics__Container'>
        <article className='Dashboard__Content__Academics__Container--levels'>
          <SpecialSkillsLevelsContainer
            levelsdata={levelsdataSpecialskills}
            selectedLevel={selectedLevel}
            onLevelClick={handleLevelClick}
          />
        </article>
        <article className='Dashboard__Content__Academics__Container--specialskills'>
          <article className='Dashboard__Content__Academics__Container--specialskills-pie'>
            <article className='Dashboard__Content__Academics__Container--specialskills-pie-levels'>
              {levelsdataSpecialskills.levels.map((ele, ind) => (
                <div
                  key={ind}
                  className={`Dashboard__Content__Academics__Container--specialskills-pie-levels-btn ${ele === selectedLevel ? 'active' : ''}`}
                  onClick={() => handleLevelClick(ele, ind)}
                >
                  {ele}
                </div>
              ))}
            </article>
            <article>
              <PieComponent level={selectedLevel} correct={corrected} wrong={wrong} />
            </article>
          </article>
          <article className='Dashboard__Content__Academics__Container--specialskills-barchart'>
                <BarComponent barData = {barChartData} title = {"Listening Skills"} />
          </article>
        </article>
      </article>
    </section>
  );
};

export default DashboardSpecialSkills;
