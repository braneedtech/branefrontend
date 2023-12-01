import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const BarComponent = ({barData, title}) => {


    const barChartOptions = {
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div
            className='Dashboard__Content__Academics__Container--charts-bar'
        >
            <div>
                {title}

            </div>
            <Bar data={barData} options={barChartOptions}
                height={200}
            />
        </div>
    );
};

export default BarComponent;
