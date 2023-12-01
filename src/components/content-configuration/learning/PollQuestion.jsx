function PollQuestion({ question, options, onAnswer }) {
    return (
        <div className="poll-question">
            <h3>{question}</h3>
            <div className="poll-options">
            {options.map((option, index) => (
                <button key={index} onClick={() => onAnswer(option)} className="poll-option">
                    {option}
                </button>
            ))}
            </div>
        </div>
    );
}
export default PollQuestion;
