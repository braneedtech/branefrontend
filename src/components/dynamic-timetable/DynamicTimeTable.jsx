import React from 'react'
import './dynamictimetable.css'
import dynamictimetableimg from "../../assets/dynamictimetable.svg"
const DynamicTimeTable = () => {
  return (
    <div className='dynamictimetable'>
      <div className='dynamictimetable__container'>
        <img src={dynamictimetableimg} alt="Coming Soon" />
        <div className='dynamictimetable__container__text'>Coming Soon</div>
      </div>
    </div>
  )
}

export default DynamicTimeTable
