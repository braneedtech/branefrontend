import React from 'react'
import learningnwimage from "../../assets/learningnwimg.svg"
import './learningnw.css'
const LearningNetwork = () => {
  return (
    <div className='learningnetwork'>
      <div className='learningnetwork__container'>
        <img src={learningnwimage} alt="Coming Soon" />
        <div className='learningnetwork__container__text'>Coming Soon</div>
      </div>
    </div>
  )
}

export default LearningNetwork
