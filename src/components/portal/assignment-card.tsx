"use client";

import { useState, useTransition } from "react";
import { submitAssignmentResponse } from "@/app/[locale]/(portal)/student/assignments/actions";
import { Button } from "@/components/ui/button";
import type { Assignment, AssignmentSubmission } from "@/types/database";

export function AssignmentCard({
  assignment,
  submission,
  locale,
}: {
  assignment: Assignment;
  submission: AssignmentSubmission | null;
  locale: string;
}) {
  const [text, setText] = useState(submission?.response_text ?? "");
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(submission?.status === "submitted" || submission?.status === "graded");

  const title = locale === "vi" ? assignment.title_vi : assignment.title_en || assignment.title_vi;
  const instructions = locale === "vi" ? assignment.instructions_vi : assignment.instructions_en || assignment.instructions_vi;

  return (
    <div className="rounded-2xl border border-espresso-100/70 bg-cream-50 p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-espresso-900">{title}</h3>
        <span className="rounded-full bg-cream-200 px-3 py-1 text-xs font-medium text-espresso-500 capitalize">
          {submission?.status ?? "pending"}
        </span>
      </div>
      {instructions && <p className="mt-2 text-sm text-espresso-500">{instructions}</p>}
      {assignment.due_at && (
        <p className="mt-1 text-xs text-espresso-400">Due {new Date(assignment.due_at).toLocaleDateString()}</p>
      )}

      {submission?.status === "graded" ? (
        <div className="mt-4 rounded-xl bg-cream-100 p-4">
          <p className="text-sm font-semibold text-espresso-800">Grade: {submission.grade ?? "—"}</p>
          {submission.feedback_vi && <p className="mt-1 text-sm text-espresso-500">{submission.feedback_vi}</p>}
        </div>
      ) : (
        <div className="mt-4">
          <textarea
            className="w-full rounded-xl border border-espresso-100 bg-cream-50 px-4 py-3 text-sm text-espresso-800 focus:border-terracotta-400 focus:outline-none"
            rows={3}
            placeholder="Write your response..."
            value={text}
            disabled={submitted}
            onChange={(e) => setText(e.target.value)}
          />
          {!submitted && (
            <Button
              size="sm"
              className="mt-3"
              disabled={pending || !text.trim()}
              onClick={() =>
                startTransition(async () => {
                  const result = await submitAssignmentResponse(assignment.id, text);
                  if (result.ok) setSubmitted(true);
                })
              }
            >
              Submit
            </Button>
          )}
          {submitted && <p className="mt-2 text-sm text-green-700">Submitted — waiting for your teacher.</p>}
        </div>
      )}
    </div>
  );
}
