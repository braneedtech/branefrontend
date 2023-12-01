import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const PieComponent = ({ level, correct, wrong }) => {
  const pieChartData = {
    labels: ['Correct Answers', 'Wrong Answers'],
    datasets: [
      {
        data: [correct, wrong],
        backgroundColor: ['#73d673', '#df676e'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const options = {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        fontColor: 'rgb(255, 99, 132)'
      }
    }
  };

  return (
    <div
      className='Dashboard__Content__Academics__Container--specialskills-pie-Div'
      style={{ height: "200px", width: "200px" }} >
      <Doughnut data={pieChartData}
        options={options}
      />
    </div>
  );
};

export default PieComponent;
