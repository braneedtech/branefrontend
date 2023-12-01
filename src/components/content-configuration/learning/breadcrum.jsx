import React, { useContext } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
// import './BreadcrumbComponent.css';
// import icon from '../../../assets/mathsicon.png';
import { Subject_Chapter_Topic } from '../../context-api/Subject_Chapter_Topic';
import { Link } from 'react-router-dom';
const BreadcrumbComponent = () => {
  const { subjectcontext } = useContext(Subject_Chapter_Topic)
  const { subject, chapter, topic } = subjectcontext

  return (
    <>
      <div
        className='landing__takelesson__MainContainer__breadcrum'
      >
        <div className="landing__takelesson__MainContainer__breadcrum__div1">
          <Link to={`/portfolio/chapters/${subject}`}>{subject}</Link>
          <span>{"    >"}</span>
        </div>
        <div className='landing__takelesson__MainContainer__breadcrum__div2'>
          <Link to={`/portfolio/chapters/${subject}`}>{chapter}</Link>
          <span>{"    >"}</span>
        </div>
        <div className='landing__takelesson__MainContainer__breadcrum__div3'>{topic}</div>
      </div>

    </>

    // <Breadcrumb className="custom-breadcrumb">
    //   <Breadcrumb.Item as={Link} to={`/portfolio/chapters/${subject}`} className="breadcrumb-item">
    //     {subject}
    //   </Breadcrumb.Item>
    //   <Breadcrumb.Item as={Link} to={`/portfolio/chapters/${subject}`} className="breadcrumb-item">{chapter}
    //   </Breadcrumb.Item>
    //   <Breadcrumb.Item  active className="breadcrumb-item">
    //     {topic}
    //   </Breadcrumb.Item>
    // </Breadcrumb>
  );
};

export default BreadcrumbComponent;
