import React from 'react'
import LevelContainer from './LevelContainer'
import BarComponent from './BarComponent'


const DashboardAcademics = ({ levelsDataAcademics }) => {
  const levelsdataAcadmics = {
    tableheading: ["", "No of Iterations", "Time Taken", "Grade"],
    levels: levelsDataAcademics?.levels,
    iterations: levelsDataAcademics.iterations,
    grade: levelsDataAcademics?.grades,
    time: levelsDataAcademics?.times
  }
  const barChartData = {
    labels: levelsdataAcadmics.levels,
    datasets: [
      {
        label: "No of Iterations",
        backgroundColor: "#426be3",
        hoverBackgroundColor: "#1a4feb",
        data: levelsdataAcadmics.iterations,
        barPercentage: 0.4,
      },
    ],
  };

  const barChartAreaData = {
    labels: ["City", "District", "State", "Country"],
    datasets: [
      {
        label: "Rank",
        backgroundColor: "#426be3",
        hoverBackgroundColor: "#1a4feb",
        data: [17, 53, 89, 543],
        barPercentage: 0.4,
      },
    ],
  };
  return (
    <section className='Dashboard__Content__Academics'>
      <article className='Dashboard__Content__Academics__Container'>
        <article className='Dashboard__Content__Academics__Container--levels'>
          {
            (levelsDataAcademics && Object.keys(levelsDataAcademics).length === 5) ? (
              <LevelContainer levelsdata={levelsdataAcadmics} />
            ) : (
              <></>
            )
          }
        </article>
        <article className='Dashboard__Content__Academics__Container--charts'>
          <BarComponent barData={barChartData} title={"No of Iterations"}></BarComponent>
          <BarComponent barData={barChartAreaData} title={"Your Rank"}></BarComponent>
          {/* Barchart  */}
          {/*  Barchart */}
        </article>
      </article>

    </section>
  )
}

export default DashboardAcademics
