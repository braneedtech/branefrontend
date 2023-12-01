import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import uploadImage from '../../../assets/uploadImage.svg';
import axios from 'axios';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const Questions_Generator = () => {
    const [text, setText] = useState('');
    const [pdfUploaded, setPdfUploaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // let questions = []
    const [questions, setQuestions] = useState([]);

    const extractText = async (file) => {
        try {
            const reader = new FileReader();

            reader.onload = async (event) => {
                const arrayBuffer = event.target.result;
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;

                let extractedText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item) => item.str).join(' ');
                    extractedText += pageText + '\n'; // Adding a new line for each page
                }

                setText(extractedText);
                setPdfUploaded(true);
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error extracting PDF text: ', error);
            setText('Error extracting text from PDF.');
            setPdfUploaded(false);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            extractText(file);
        }
    };

    const handleGenerateQuestions = async () => {
        try {
            setIsLoading(true);
            // Send the text to the API and handle the response
            const response = await axios.post(`http://localhost:8000/generate_questions/`, {
                "text": text.replace(/[^\w\s]/gi, '')
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (response?.statusText === "OK") {
                if (response && response.data) {
                    // questions = response?.data?.questions
                    // questions = questions[0] || []
                    setQuestions(response.data.questions[0] || []);
                }
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Error calling API: ', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="questions-generator">
            <div className="questions_generator">
                <div className="questions_generator__contentupload__upload__box">
                    <img src={uploadImage} className="img" />
                    <div className="questions_generator__contentupload__upload-container">
                        <div className="questions_generator__contentupload__upload__heading">Select PDF file to Upload</div>
                        <div className="questions_generator__contentupload__upload__desc">file size should be less than 10MB</div>
                    </div>
                    <label htmlFor="file-upload" className="custom-file-upload">
                        SELECT FILE
                    </label>
                    <input id="file-upload" onChange={handleFileChange} type="file" accept=".pdf" />
                </div>
                <div className="questions_generator__generatebtn">
                    <button onClick={handleGenerateQuestions} disabled={!pdfUploaded || isLoading}>
                        {isLoading ? 'Generating...' : 'Generate Questions'}
                    </button>
                </div>
            </div>
            <div>
                <div style={{border:"2px solid black", padding:".5rem",marginRight:"2%",marginTop:"2%"}}>
                    {questions && (questions.map((ele, index) => (
                        <div key={index}>{ele}</div>
                    )))}
                </div>
            </div>
        </div>
    );
};

export default Questions_Generator;
