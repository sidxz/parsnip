import { RadioButton } from "primereact/radiobutton";
import React from "react";

const TargetQuestion = ({ question }) => {

  const [selectedOption, setSelectedOption] = React.useState(null);

  if (!question) {
    return <div>No question data available.</div>;
  }

  if (!question.possibleAnswers || question.possibleAnswers.length === 0) {
    return <div>No options available for this question.</div>;
  }

  return (
    <div className="flex border-1 border-50 border-round p-3 w-full">
      <div className="flex flex-column gap-2">
        <div className="font-bold">{question.identification}</div>
        <div className="font-bold">{question.questionBody}</div>
        <div className="text-sm text-700">{question.toolTip}</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {question.possibleAnswers.map((option) => (
            <div
              key={option.id}
              className="border-1 border-50 flex-column surface-border border-round p-3 flex gap-2 w-30rem"
            >
              <div className="flex align-items-center gap-2">
                <RadioButton
                  inputId={option.id}
                  name={question.id}
                  value={option.id}
                  onChange={(e) => setSelectedOption(e.value)}
                  checked={selectedOption === option.id}
                />
                <label
                  htmlFor={option.id}
                  className="font-medium cursor-pointer"
                >
                  {option.answer}
                </label>
              </div>
              <span className="text-sm text-600 line-height-3">
                {option.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TargetQuestion;
