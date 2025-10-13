'use client';
import React from 'react';
import TargetQuestion from '../target-question/TargetQuestion';
import { useQuestionStore } from '@/app/stores/useQuestionStore';
import Loading from '../ui/Loading';

const TargetQuestionnaire = () => {
  const { questions, loading, loadQuestions, error } = useQuestionStore();

  React.useEffect(() => {
    // load once on mount
    loadQuestions();
    console.log(questions);
  }, [loadQuestions]);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-column gap-2 m-2 w-full align-items-center border-0">
      {questions.map((q) => (
        <TargetQuestion question={q} key={q.id} />
      ))}
    </div>
  );
};

export default TargetQuestionnaire;
