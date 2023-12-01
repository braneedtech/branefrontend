import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { Link } from 'react-router-dom';
import StudentDetailsCustomHook from '../../context-api/StudentDetailsCustomHook';

const AccordionData = ({ portfolio_data, certificate_count, activeKey, setActiveKey }) => {
  const { student } = StudentDetailsCustomHook();

  return (
    <>
      <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
        {console.log(`Current Active Key: ${activeKey}`)}
        {portfolio_data &&
          portfolio_data.map((element, index) => (
            <Accordion.Item eventKey={String(index)} key={index}>
              <Accordion.Header>
                <img src={element.icon} alt={element.title} />
                {element.title}
              </Accordion.Header>
              <Accordion.Body>
                <ul>
                  {element &&
                    element?.content &&
                    element.content.map((ele, ind) => (
                      <Link
                        to={getLinkPath(element.title, ele)}
                        key={ind}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {
                          ele === "My Certificates" ?
                            <li>
                              {ele}
                              <sup>
                                {
                                  certificate_count
                                }
                              </sup>
                            </li> :
                            <li>{ele}</li>
                        }
                      </Link>
                    ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
    </>
  );
};

const getLinkPath = (section, item) => {
  // Customize this function to generate the correct route based on the section and item
  if (section === 'Academics') {
    return `/portfolio/chapters/${item}`;
  } else if (section === 'Sports') {
    return `/portfolio/sports/${item}`;
  } else if (section === 'Special Skills') {
    return `/portfolio/specialskills/${item}`;
  }
  else if (section === 'Health & Wellness') {
    return `/portfolio/health/${item}`
  }
  else if (section === 'Life Skills') {
    return `/portfolio/lifeskills/${item}`
  }
  else if (section === 'My Account' && item === 'My Certificates') {
    return `/portfolio/myaccount`;
  }
  else if (section === "My Account" && item === "Personal Information") {

    return `/portfolio/personalinfo`;

  }
  else if (section === "Language Lab") {
    return `/portfolio/language-lab`
  } else if (section === "Fine Arts") {
    return `/portfolio/fine-arts`
  }
  else if (section === "Platform Supports") {
    return `/portfolio/platform-supports`
  }

  else if (section === "My Account" && item === "Profile Information") {

    return `/portfolio/profileinfo`;

  } else if (section === "My Account" && item === "Subscription Details") {

    return `/portfolio/subscription`;

  } else {
    // Add more conditions if needed
    return '';
  }
};

export default AccordionData;
