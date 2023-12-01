import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Languages.module.css'; // Importing the CSS module

const COLORS = ['#bbf7d0', '#99f6e4', '#bfdbfe', '#ddd6fe', '#f5d0fe', '#fed7aa', '#fee2e2'];
const TAGS = ['English', 'తెలుగు', 'हिन्दी', 'मराठी', 'ಕನ್ನಡ', 'தமிழ்', 'ગુજરાતી','বাংলা', 'অসমীয়া', 'മലയാളം', 'ਪੰਜਾਬੀ','ଓଡ଼ିଆ'];
const DURATION = 20000;
const ROWS = 1;
const TAGS_PER_ROW = 18;

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const shuffle = (arr) => [...arr].sort( () => .5 - Math.random() );

const InfiniteLoopSlider = ({ children, duration, reverse = false }) => {
  return (
    <div className={styles.loopSlider} style={{
        '--duration': `${duration}ms`,
        '--direction': 'reverse' 
      }}>
      <div className={styles.inner}>
        {children}
        {children}
      </div>
    </div>
  );
};

const Tag = ({ text }) => (
  <div className={styles.tag}><span></span> {text}</div>
);

const Languages = () => (
  <div className={styles.languages}>
    <header>
      <h1>Languages Supported</h1>
      {/* <p>We Support multiple languages</p> */}
    </header>
    <div className={styles.tagList}>
      {[...new Array(ROWS)].map((_, i) => (
        <InfiniteLoopSlider key={i} duration={random(DURATION - 5000, DURATION + 5000)} reverse={i % 2}>
          {shuffle(TAGS).slice(0, TAGS_PER_ROW).map(tag => (
            <Tag text={tag} key={tag} />
          ))}
        </InfiniteLoopSlider>
      ))}
      <div className={styles.fade}/>
    </div>
  </div>
);

// ReactDOM.render(
//   <Languages />,
//   document.getElementById('root')
// );

export default Languages;
