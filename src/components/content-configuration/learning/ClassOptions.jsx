import React from "react";
import loader from "../../../assets/loading/loader.gif";
import { Link } from "react-router-dom";

const ClassOptions = ({ content_types }) => {
  const labelsArray = content_types[0]?.labels;

  return (
    <>
      {labelsArray && labelsArray.length > 0 && (
        <ul className="landing__content__types">
          {labelsArray.map((label, index) => (
            <li key={index}>
              <Link to={`/takelesson/${label.toLowerCase()}`}>
                <div>{label}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default ClassOptions;
