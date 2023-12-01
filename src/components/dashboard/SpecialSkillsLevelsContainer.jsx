import React from 'react'

const SpecialSkillsLevelsContainer = ({ levelsdata }) => {
    return (
        <div className='Dashboard__Content__Academics__Container--levels-box'>
            <div className='Dashboard__Content__Academics__Container--levels-box-heading'>
                Assessment
            </div>
            <table text-align='center' cellSpacing="15px" cellPadding="10px">
                <thead>
                    <tr>
                        {
                            levelsdata.tableheading.map((element, index) => (
                                <th key={index}>{element}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        levelsdata.levels.map((element, index) => (
                            <tr key={index}>
                                <td>{levelsdata.levels[index]}</td>
                                <td>{levelsdata.score[index]}</td>
                                <td>{levelsdata.correct[index]}</td>
                                <td>{levelsdata.wrong[index]}</td>
                                <td>{levelsdata.time[index]}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default SpecialSkillsLevelsContainer

