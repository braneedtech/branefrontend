import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
// import "./accountsetting.css";
import "./settings.css";
function PersonalInfo() {
  const { student } = StudentDetailsCustomHook();
  let personal_info = student;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [updatedChildData, setUpdatedChildData] = useState({});
  let shouldRender = true; // Define shouldRender flag
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const parentsmobileno = personal_info.mobileno;
      const childindex = personal_info.childIndex;
      try {
        const response = await axios.get(
          `http://127.0.0.1:8080/personal-info`,
          {
            params: {
              parentsmobileno,
              childindex,
            },
          }
        );
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [personal_info.mobileno, personal_info.childIndex]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedChildData({ ...updatedChildData, [name]: value });
  };

  const customKeyNames = {
    childname:"Name",
    childsurname:"Surname",
    childdob:"Date of Birth",
    childgender:"Gender",
    childnationality:"Nationality",
    childclass:"Class",
    childsyllabus:"Syllabus",
    childschool:"School",
    mediumofinstruction:"Medium Of Instruction",
    firstlanguage:"First Language",
    secondlanguage:"Second Language",
    thirdlanguage:"Third Language"

  
    // Add more mappings as needed
  };
  const handleSave = async () => {
    const parentsmobileno = personal_info.mobileno;
    const childindex = personal_info.childIndex;
    try {
      const response = await axios.put(
        `http://127.0.0.1:8080/personal-info`,
        {
          ...data,
          ...updatedChildData,
        },
        {
          params: {
            parentsmobileno,
            childindex,
          },
        }
      );
      // console.log("fgh",response)
      // console.log("asd",response.data)
      // console.log(data)
      setData(data);
      setIsDataUpdated(true);
      setIsEditing(false);
    } catch (error) {
      setError(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="landingpage__rightbox">
      <div className="landingpage__rightbox__title">
        <h4>Child Personal Information</h4>
      </div>
      <div className="landingpage__rightbox__personaldata">
        {isDataUpdated && (
          <div
            style={{
              color: "green",
              display: "flex",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            Data updated successfully it reflects here soon..!
            <i className="bi bi-check2-circle"></i>
          </div>
        )}
        {/* <form>
          {Object.entries(data).map(([key, value]) => {
            if (key === "childpassword") {
              shouldRender = false; // Set shouldRender to false when key is 'childpassword'
            }

            if (!shouldRender) {
              return null; // Skip rendering for subsequent elements after childpassword
            }

            return (
              <div key={key}>
                <label>
                  <div style={{color:'#603e9f',fontWeight:'400'}}>{key}:</div>
                  {isEditing ? (
                    <input
                      type="text"
                      name={key}
                    
                      value={
                        updatedChildData[key] !== undefined
                          ? updatedChildData[key]
                          : value
                      }
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{value}</span>
                  )}
                </label>
              </div>
            );
          })}
        </form> */}
        <form>
          {Object.entries(data).map(([key, value]) => {
            const customLabel = customKeyNames[key] || key; // Use custom label or original key
            if (key === "childpassword") {
              shouldRender = false;
            }

            if (!shouldRender) {
              return null;
            }

            return (
              <div key={key}>
                <label>
                  <div style={{ color: "#603e9f", fontWeight: "400" }}>
                    {customLabel}:
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      name={key}
                      value={
                        updatedChildData[key] !== undefined
                          ? updatedChildData[key]
                          : value
                      }
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{value}</span>
                  )}
                </label>
              </div>
            );
          })}
        </form>
        {isEditing ? (
          <button type="button" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default PersonalInfo;
