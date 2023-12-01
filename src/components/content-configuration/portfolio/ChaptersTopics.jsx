import React, { useCallback, useContext } from "react";
import Accordion from "react-bootstrap/Accordion";
import { Link } from "react-router-dom";
import { end_point } from "../../../constants/urls.jsx";
import { useQuery } from "react-query";
import loader from "../../../assets/loading/loader.gif";
import brane_get_service from "../../../services/brane_get_service";
import { useParams } from "react-router-dom";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook.jsx";
import arrowicon from "../../../assets/arrowicon.svg";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic.jsx";

const ChaptersTopics = () => {
  const { subjectcontext, updateSubjectContext } = useContext(
    Subject_Chapter_Topic
  );
  const { student } = StudentDetailsCustomHook();
  const { subject } = useParams();

  const handleTopicClick = useCallback((chapter, topic) => {
    // Update the context with chapter and topic only if they are different from the current values
    if (chapter !== subjectcontext.chapter || topic !== subjectcontext.topic) {
      updateSubjectContext({
        subject: subject,
        chapter: chapter,
        topic: topic,
      });
    }
  });


  const { data, error, isLoading } = useQuery(
    [
      "chapters_topics",
      `${end_point}/chapters_topics?curriculum=${student.curriculum}&medium_of_instruction=${student.medium_of_instruction}&schooling=${student.schooling}&subject=${subject}`,
    ],
    brane_get_service
  );

  let chapters_topics_data = {};
  let chapters_topics = {};
  if (!isLoading && error == null) {
    const { data: alias } = data;
    chapters_topics_data = alias;
    chapters_topics = chapters_topics_data?.chapters_topics;
  }

  return (
    <>
      {!isLoading ? (
        error != null ? (
          <p>{JSON.stringify(error.message)}</p>
        ) : (
          <>
            <div className="landing__rightbox__content--breadcrum">
              <span>Academics</span> 
              <i className="bi bi-caret-right-fill"></i>
              <span>{subject}</span>
            </div>
            <div>
              <Accordion className="Accordionitem">
                {chapters_topics &&
                  chapters_topics.map((element, index) => (
                    <Accordion.Item key={index} eventKey={index}>
                      <Accordion.Header>
                        Chapter {index + 1} {": "} {element.chapter}
                      </Accordion.Header>
                      <Accordion.Body>
                        <ul className="landing__rightbox__content__topicslist">
                          {element &&
                            element.topics.map((ele, ind) => (
                              <Link
                                to={`/takelesson/`}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                }}
                                key={ind}
                                onClick={() =>
                                  handleTopicClick(element.chapter, ele)
                                }
                              >
                                <li className="clickable-li">
                                  Topic {ind + 1}
                                  {": "}
                                  {ele}
                                  <img
                                    src={arrowicon}
                                    className="arrowicon"
                                  ></img>
                                </li>
                              </Link>
                            ))}
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
              </Accordion>
            </div>
          </>
        )
      ) : (
        <>
          <img
            src={loader}
            alt="Error"
            width={250}
            height={250}
            className="loader-content"
          ></img>
        </>
      )}
    </>
  );
};

export default ChaptersTopics;
