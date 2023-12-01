import branelogo from "../../../assets/Branenewlogo.png";
function MultipleChoiceQuestion({
  question,
  options,
  selectedOption,
  onOptionChange,
}) {
  return (
    <div className="Questions">
      <h2>{question}</h2>
      <hr className="question-divider" />
      <ul style={{ listStyle: "none" }}>
        {options.map((option, index) => (
          <li key={index} className={selectedOption === option ? "selected-list-item" : ""}>
            <label>
              <input
                type="radio"
                className="purple-radio"
                value={option}
                checked={selectedOption === option}
                onChange={() => onOptionChange(option)}
              />
              {option}
            </label>
          </li>
        ))}
      </ul>


    </div>
  );
}
export default MultipleChoiceQuestion;
