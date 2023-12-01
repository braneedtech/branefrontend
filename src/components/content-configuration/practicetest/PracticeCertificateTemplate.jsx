import React, { useEffect, useState } from 'react';
import './PracticeCertificate.css';
import twitter from '../../../assets/twitter.png';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
const getStarRating = (grade) => {
  if (grade === 1) return '⭐️⭐️⭐️⭐️⭐️';
  else if (grade === 2) return '⭐️⭐️⭐️⭐️';
  else if (grade === 3) return '⭐️⭐️⭐️';
  else if (grade === 4) return '⭐️⭐️';
  else if (grade === 5) return '⭐️';
  else return '';
};

const PracticeCertificateTemplate = ({ studentName, courseName, chapterName, subjectName, topicName, mobileno, childIndex, completionDate, grade, level }) => {
  const starRating = getStarRating(grade);
  const navigate = useNavigate()
  const [apiCallMade, setApiCallMade] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  let pdfObject;


  // useEffect(() => {
  //   speakCongratulations(studentName);
  // }, [studentName]);
  useEffect(() => {
    speakCongratulations(studentName);
    clearlocalStorage();
  }, [studentName])

  const clearlocalStorage = () => {
    localStorage.removeItem("isSubmitted")
    localStorage.removeItem("timer")
    localStorage.removeItem("questions")
    localStorage.removeItem("totalTime")
    localStorage.removeItem("answers")
    localStorage.removeItem("submitCount")
    localStorage.removeItem("correctlyAnswered")
    localStorage.removeItem("elapsedTime")
    localStorage.removeItem("completed")
    localStorage.removeItem("totalSubmissions")
    localStorage.removeItem("attempts")
    localStorage.removeItem("results")
    localStorage.removeItem("userSequences")

  }


  const downloadPDF = async () => {
    const customWidth = 800;
    const customHeight = 550;
    const certificateElement = document.getElementById('certificate');
    pdfObject = new jsPDF('landscape', 'pt', [customWidth, customHeight]);

    try {
      const canvas = await html2canvas(certificateElement);
      const imgData = canvas.toDataURL('image/png');
      pdfObject.addImage(imgData, 'PNG', 0, 0, customWidth, customHeight);
      const blob = pdfObject.output('blob');
      pdfObject.save(`${studentName}_${subjectName}_${chapterName}_${topicName}_${level}.pdf`);
    } catch (error) {
      console.error('Error generating and sending PDF:', error);
    }
  }

  const speakCongratulations = (studentName) => {
    const message = new SpeechSynthesisUtterance(
      `Congratulations ${studentName} on your course completion. Here's your certificate.`
    );
    window.speechSynthesis.speak(message);
  };

  return (
    <>
      <div
        className='certificate_buttons'
        style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="GoBackButton">
          <Link
            to={`/practice-test`}
          >
            <div>
              <i className="bi bi-arrow-left-circle" style={{ fontSize: "1.5rem" }}></i>{" "}
              Go Back
            </div>
          </Link>
        </div>
        <button onClick={downloadPDF}><i className="bi bi-download"></i> Download Certificate</button>
      </div>
      <div className="certificate" id="certificate">
        <h1>CERTIFICATE OF COMPLETION</h1>
        <p>Presented To</p>
        <h1 className='name'>{studentName}</h1>
        <p>For successfully completing {level} in topic</p>
        <h2>
          {topicName} <br></br>{starRating}
        </h2>
        <p>in {chapterName} - {subjectName} on {completionDate}</p>
        Provided By
        <h2>Brane Education</h2>
        <img src={twitter} alt="Twitter Logo" />
        <div className='signature'>
          <h4>Signature of Manager</h4>
        </div>
      </div>
    </>
  );
};

export default PracticeCertificateTemplate;
