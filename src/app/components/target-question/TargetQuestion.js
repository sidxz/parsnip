import { RadioButton } from "primereact/radiobutton";
import React from "react";

const TargetQuestion = () => {
  const [selectedOption, setSelectedOption] = React.useState(null);

  let question = {
    id: "2A1",
    question: "Humans-Contributes to durable cure?",
    questionDesc:
      "Does the treatment contribute to a long-lasting cure for the condition?",
    options: [
      {
        id: "2A1a",
        option: "Yes",
        value: 1,
        description:
          "A compound that engages the target was shown to be active in an Mtb assay under other NR conditions.  Please describe conditions.",
      },
      {
        id: "2A1b",
        option: "No",
        value: 0,
        description:
          "A compound that engages the target was shown to be inactive in an Mtb assay under other NR conditions. Please describe conditions.",
      },
      {
        id: "2A1c",
        option: "Uncertain",
        value: 0.5,
        description:
          " No compound that engages the target has been tested in an Mtb assay under other NR conditions.  Alternatively, the level of target engagement for a particular compound that has been tested in an Mtb assay under other NR conditions is uncertain.  Please describe conditions.",
      },
    ],
  };

  return (
    <div className="flex">
      <div className="flex flex-column gap-2">
        <div className="font-bold">{question.id}</div>
        <div className="font-bold">{question.question}</div>
        <div className="text-sm text-700">{question.questionDesc}</div>
        <div className="flex gap-2 mt-2">
          {question.options.map((option) => (
            <div
              key={option.id}
              className="border-1 flex-column surface-border border-round p-3 flex gap-2 w-30rem"
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
                  {option.option}
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
