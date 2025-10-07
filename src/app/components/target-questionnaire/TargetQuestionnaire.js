import React from 'react';
import { Card } from 'primereact/card';
import TargetQuestion from '../target-question/TargetQuestion';

const questions = [
  "What is the main objective of this promotion?",
  "Who is the target audience for this promotion?",
  "What channels will be used to promote?",
  "What is the expected duration of the promotion?",
  "What is the budget allocated for this promotion?",
  "What are the key performance indicators (KPIs)?",
  "Are there any legal or compliance considerations?",
  "What creative assets are required?",
  "How will success be measured?",
  "Who are the stakeholders involved?"
];

const TargetQuestionnaire = () => (
    <div className='flex flex-column gap-2 m-2 w-full align-items-center'>
      {questions.map((q, idx) => (
        <div className="flex" key={idx}> <TargetQuestion question={q} /> </div>
      ))}
    </div>
);

export default TargetQuestionnaire;