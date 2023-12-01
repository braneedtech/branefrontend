import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import brane_get_service from '../../services/brane_get_service';
import { end_point } from '../../constants/urls';
import loader from "../../assets/loading/loader.gif";
import StudentDetailsCustomHook from '../context-api/StudentDetailsCustomHook';
import DashboardAcademics from './DashboardAcademics';
import './Dashboard.css';
import DashboardSpecialSkills from './DashboardSpecialSkills';
import AcademicsIcon from '../../assets/academicsicon.png';
import SpecialSkillsIcon from '../../assets/specialskillsicon.png';
import logouticon from '../../assets/logouticon.png';
import { useNavigate } from 'react-router-dom';
import dashboardnotfound from '../../assets/dashboardnotfound.svg'

const DashboardComponent = ({updateLoginStatus}) => {
    const { student } = StudentDetailsCustomHook();
    const navigate = useNavigate()
    let results = {};
    let totalData = {};
    let academics = {};
    let specialskills = {};

    // State to hold Academics data
    const [AcademicsData, setAcademicsData] = useState({});
    const [specialskillsData, setSpecialSkillsData] = useState()

    // State to check if special skills are clicked
    const [specialskillsClick, setSpecialSkillsClick] = useState(false);

    const [openCategories, setOpenCategories] = useState([]);

    const handleCategoryHover = (category) => {
        setOpenCategories((prevOpenCategories) => [...prevOpenCategories, category]);
    };

    const handleCategoryLeave = () => {
        setOpenCategories([]);
    };

    const handleCategoryLeaveAcademics = (subject) => {
        setOpenCategories((prevOpenCategories) => {
            const isSubjectHovered = prevOpenCategories.some(category => category in totalData["Academics"][subject]);
            return isSubjectHovered ? prevOpenCategories : [];
        });
    };

    const [breadcrumb, setBreadcrumb] = useState([]);


    const handleCategoryClick = (category) => {
        setOpenCategories((prevOpenCategories) => {
            if (prevOpenCategories.includes(category)) {
                return prevOpenCategories.filter((cat) => cat !== category);
            } else {
                // Update breadcrumb based on the selected category
                setBreadcrumb(category === 'Special Skills' ? [category] : []);
                return [category];
            }
        });
    };

    const handleCategoryAcademicsClick = (category) => {
        setOpenCategories((prevOpenCategories) => {
            if (prevOpenCategories.includes(category)) {
                return prevOpenCategories.filter((cat) => cat !== category);
            } else {
                // Update breadcrumb when a category is clicked
                setBreadcrumb((prevBreadcrumb) => [...prevBreadcrumb, category]);
                return [...prevOpenCategories, category];
            }
        });
    };

    // const handleCategoryClick = (category) => {
    //     setOpenCategories((prevOpenCategories) => {
    //         if (prevOpenCategories.includes(category)) {
    //             return prevOpenCategories.filter((cat) => cat !== category);
    //         } else {
    //             return [category];
    //         }
    //     });
    // };

    // const handleCategoryAcademicsClick = (category) => {
    //     setOpenCategories((prevOpenCategories) => {
    //         if (prevOpenCategories.includes(category)) {
    //             return prevOpenCategories.filter((cat) => cat !== category);
    //         } else {
    //             return [...prevOpenCategories, category];
    //         }
    //     });
    // };
    let success
    const { data, error, isLoading } = useQuery(
        [
            "Dashboard_Data",
            `${end_point}/get-dashboard-data?mobileno=${student?.mobileno}&childIndex=${student?.childIndex}`,
        ],
        brane_get_service
    );

    if (!isLoading && error == null) {
        const { data: alias } = data;
        results = alias;
        success = results?.success
        if (success) {
            results = results?.data;
            const { name, class: studentClass, _id, 'Medium of Instruction': moi, ...restData } = results;
            totalData = restData;
            academics = results.hasOwnProperty("Academics") ? results["Academics"] : {};

            specialskills = results.hasOwnProperty("Special Skills") ? results["Special Skills"] : {};
        }
    }

    // Set default Academics data on component mount
    useEffect(() => {
        if (academics) {
            const firstSubject = Object.keys(academics)[0];

            if (academics[firstSubject]) {
                const firstChapter = Object.keys(academics[firstSubject])[0];

                if (academics[firstSubject][firstChapter]) {
                    const firstTopic = Object.keys(academics[firstSubject][firstChapter])[0];

                    const levelsData = academics[firstSubject][firstChapter][firstTopic];
                    const allLevels = Object.keys(levelsData);
                    const allGrades = [];
                    const allTimes = [];
                    let allIterations = [];

                    allLevels.forEach((level) => {
                        const levelData = levelsData[level];
                        allIterations = allIterations.concat(levelData.iterations);
                        allGrades.push(levelData.grade);
                        allTimes.push(levelData.time);
                    });

                    setAcademicsData({
                        tableheading: ["", "No of Iterations", "Time Taken", "Grade"],
                        levels: allLevels || [],
                        iterations: allIterations || [],
                        grades: allGrades || [],
                        times: allTimes || [],
                    });
                }
            }
        }
    }, [academics]);

    const handleOnSpecialSkill = (skill) => {
        const levels = specialskills && Object.keys(specialskills[skill]);
        const score = levels.map((level) => specialskills[skill][level]["Corrected Answers"]);
        const correct = levels.map((level) => specialskills[skill][level]["Corrected Answers"]);
        const wrong = levels.map((level) => specialskills[skill][level]["Wrong Answers"]);
        const time = levels.map((level) => specialskills[skill][level]["Time Taken"]);

        setSpecialSkillsData({
            tableheading: ["", "Total Score", "Corrected Answers", "Wrong Answers", "Time Taken"],
            levels: levels,
            score: score,
            correct: correct,
            wrong: wrong,
            time: time,
            name: skill
        });
        setBreadcrumb(['Special Skills', skill]);

        setSpecialSkillsClick(true);
    };

    const handleTopicClick = (subject, chapter, topic) => {
        if (
            totalData["Academics"] &&
            totalData["Academics"][subject] &&
            totalData["Academics"][subject][chapter] &&
            totalData["Academics"][subject][chapter][topic]
        ) {
            const topicData = totalData["Academics"][subject][chapter][topic];

            const allLevels = Object.keys(topicData);
            const allGrades = [];
            const allTimes = [];
            let allIterations = [];

            allLevels.forEach((level) => {
                const levelData = topicData[level];
                allIterations = allIterations.concat(levelData.iterations);
                allGrades.push(levelData.grade);
                allTimes.push(levelData.time);
            });

            setAcademicsData({
                tableheading: ["", "No of Iterations", "Time Taken", "Grade"],
                levels: allLevels || [],
                iterations: allIterations || [],
                grades: allGrades || [],
                times: allTimes || [],
            });
            setBreadcrumb(['Academics', subject, chapter, topic]);
            // Set specialskillsClick to false when a topic is clicked
            setSpecialSkillsClick(false);
        }
    };

    const getInitials = (name) => {
        // Extract the first letter of each word in the name
        const initials = name.split(" ").map((word) => word[0]).join("");
        return initials.toUpperCase();
    };

    const renderProfileImage = () => {
        // If there is a profile image, display it
        if (student?.profile_img) {
            return (
                <img
                    src={student?.profile_img}
                    className="landing__leftbox__portfolio__profile__userimage"
                    alt="Profile"
                />
            );
        }

        // If there is no profile image, display the first letter with a background color
        const initials = getInitials(student?.student_name);
        return (
            <div
                className="landing__leftbox__portfolio__profile__initials"
            >
                {initials}
            </div>
        );
    };

    return (
        <>
            {!isLoading ? (
                error != null ? (
                    <p>{JSON.stringify(error.message)}</p>
                ) : (
                    (results && success) ? (
                        <>
                            <section className='Dashboard'>
                                <section className='Dashboard__leftmenu'>
                                    <section className='Dashboard__leftmenu__Container'>
                                        <article className='Dashboard__leftmenu__Container__top'>
                                            <article className='Dashboard__leftmenu__Container__top-logo'>
                                                <img
                                                    src="https://braneeducation.s3.ap-south-1.amazonaws.com/Homepage_images/logo/Branenewlogo.png"
                                                    alt="Brane Logo"
                                                />
                                            </article>
                                            <article className='Dashboard__leftmenu__Container__top-profile'>
                                                <div className='Dashboard__leftmenu__Container__top-profile-image'>
                                                    {renderProfileImage()}
                                                </div>
                                                <div className="Dashboard__leftmenu__Container__top-profile-username">{student?.student_name}</div>
                                                <div className="Dashboard__leftmenu__Container__top-profile-class">{student?.schooling}</div>
                                            </article>
                                            <article className='Dashboard__leftmenu__Container__top-dash'></article>
                                        </article>
                                        <article className='Dashboard__leftmenu__Container__mid'>
                                            {totalData &&
                                                Object.keys(totalData).map((ele, ind) => (
                                                    <div
                                                        key={ind}
                                                    >
                                                        <div className="dropdown-container">
                                                            <span
                                                                onClick={() => handleCategoryClick(ele)}
                                                            >
                                                                {
                                                                    ele === "Academics" && <img src={AcademicsIcon} alt='logo' />
                                                                }
                                                                {
                                                                    ele === "Special Skills" && <img src={SpecialSkillsIcon} alt='logo' />
                                                                }
                                                                {ele}
                                                            </span>
                                                            {openCategories.includes(ele) && totalData[ele] && (
                                                                <div className="dropdown-box">
                                                                    {ele === 'Academics' && (
                                                                        <ul>
                                                                            {Object.keys(totalData[ele]).map((subject, subjectIndex) => (
                                                                                <li key={subjectIndex} >
                                                                                    <span
                                                                                        onClick={() => handleCategoryAcademicsClick(subject)}
                                                                                    >
                                                                                        {subject}
                                                                                    </span>
                                                                                    {openCategories.includes(subject) && totalData[ele][subject] && (
                                                                                        <ul className="dropdown-box">
                                                                                            {Object.keys(totalData[ele][subject]).map((chapter, chapterIndex) => (
                                                                                                <li
                                                                                                    key={chapterIndex}
                                                                                                >
                                                                                                    <span
                                                                                                        onClick={() => handleCategoryAcademicsClick(chapter)}
                                                                                                    >{chapter}</span>
                                                                                                    {openCategories.includes(chapter) && totalData[ele][subject][chapter] && (
                                                                                                        <ul className="dropdown-box">
                                                                                                            <ul>
                                                                                                                {Object.keys(totalData[ele][subject][chapter]).map((topic, topicIndex) => (
                                                                                                                    <li key={topicIndex}
                                                                                                                        onClick={() => handleTopicClick(subject, chapter, topic)}
                                                                                                                    >{topic}</li>
                                                                                                                ))}
                                                                                                            </ul>
                                                                                                        </ul>
                                                                                                    )}
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul>
                                                                                    )}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    )}

                                                                    {ele === 'Special Skills' && (
                                                                        <ul>
                                                                            {Object.keys(totalData[ele]).map((skill, skillIndex) => (
                                                                                <li key={skillIndex}
                                                                                    onMouseEnter={() => handleCategoryHover(skill)}
                                                                                    onClick={() => handleOnSpecialSkill(skill)}
                                                                                >
                                                                                    <span>
                                                                                        {skill}
                                                                                    </span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </article>

                                        <article className='Dashboard__leftmenu__Container__bottom'
                                            onClick={()=>{
                                                navigate("/");
                                                updateLoginStatus(false)
                                            }}
                                        >
                                            <img src={logouticon} alt="logouticon" />
                                            Logout
                                        </article>
                                    </section>
                                </section>

                                <section className='Dashboard__Content'>
                                    <section className='Dashboard__Content__title'>
                                        <article onClick={() => {
                                            navigate('/portfolio')
                                        }}>
                                            <i className='bi bi-arrow-left-circle'></i>
                                            GoBack
                                        </article>
                                        <article>Dashboard</article>
                                        <article>iconicon</article>
                                    </section>
                                    <article className='Dashboard__Content__Academics__Breadcrum'>
                                        {breadcrumb.join(" > ")}
                                    </article>
                                    {specialskillsClick ? (
                                        <DashboardSpecialSkills levelsdataSpecialskills={specialskillsData} />
                                    ) : (
                                        <DashboardAcademics
                                            levelsDataAcademics={AcademicsData}
                                        />
                                    )}
                                </section>
                            </section>
                        </>
                    ) : (
                        <>
                            <section className='Dashboard__Content'
                                style={{ width: "100vw" }}
                            >
                                <article className='Dashboard__Content__title'>
                                    <article onClick={() => {
                                        navigate('/portfolio')
                                    }}>
                                        <i className='bi bi-arrow-left-circle'></i>
                                        GoBack
                                    </article>
                                </article>
                                <article className="Dashboard__Content__nodatafound">
                                    <img src={dashboardnotfound} alt="Data Not found" />
                                    <button
                                        onClick={() => {
                                            navigate('/portfolio')
                                        }}
                                    >
                                        Continue
                                    </button>
                                </article>
                            </section>
                        </>
                    )

                )
            ) : (
                <>
                    <img src={loader} alt="Error" width={200} height={200}></img>
                </>
            )}
        </>
    );
};

export default DashboardComponent;
