import React from 'react'



const LevelContainer = ({levelsdata}) => {
    return (
        <div className='Dashboard__Content__Academics__Container--levels-box'>
            <div className='Dashboard__Content__Academics__Container--levels-box-heading'>
                Assessment
            </div>
            <table text-align='center'>
                <thead>
                    <tr>
                        {
                            levelsdata.tableheading.map((element, index)=>(
                                <th key={index}>{element}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        levelsdata.levels.map((element, index)=>(
                            <tr key={index}>
                                <td>{levelsdata.levels[index]}</td>
                                <td>{levelsdata.iterations[index]}</td>
                                <td>{levelsdata.time[index]}</td>
                                <td>{levelsdata.grade[index]}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default LevelContainer
