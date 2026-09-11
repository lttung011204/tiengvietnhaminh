"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  addTeacherFeedback,
  gradeSubmission,
  assignHomework,
} from "@/app/[locale]/(portal)/teacher/students/[studentId]/actions";

const inputClass =
  "w-full rounded-xl border border-espresso-100 bg-cream-50 px-3.5 py-2.5 text-sm text-espresso-800 focus:border-terracotta-400 focus:outline-none";

export function FeedbackForm({ studentId }: { studentId: string }) {
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <input
        className={inputClass}
        placeholder="Add a note for the parent..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Button
        size="sm"
        disabled={pending || !note.trim()}
        onClick={() =>
          startTransition(async () => {
            const result = await addTeacherFeedback(studentId, note);
            if (result.ok) setNote("");
          })
        }
      >
        Add
      </Button>
    </div>
  );
}

export function GradeForm({ submissionId }: { submissionId: string }) {
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  if (done) return <p className="text-sm text-green-700">Graded.</p>;

  return (
    <div className="mt-3 flex flex-wrap items-end gap-2">
      <div>
        <label className="mb-1 block text-xs text-espresso-400">Grade</label>
        <input className={`${inputClass} w-20`} value={grade} onChange={(e) => setGrade(e.target.value)} />
      </div>
      <div className="flex-1">
        <label className="mb-1 block text-xs text-espresso-400">Feedback</label>
        <input className={inputClass} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
      </div>
      <Button
        size="sm"
        disabled={pending || !grade}
        onClick={() =>
          startTransition(async () => {
            const result = await gradeSubmission(submissionId, Number(grade), feedback);
            if (result.ok) setDone(true);
          })
        }
      >
        Save
      </Button>
    </div>
  );
}

export function AssignHomeworkForm({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [type, setType] = useState<"open_response" | "speaking" | "writing">("open_response");
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
        Assign homework
      </Button>
    );
  }

  return (
    <div className="space-y-2 rounded-xl bg-cream-100 p-4">
      <input className={inputClass} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea
        className={inputClass}
        placeholder="Instructions"
        rows={2}
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
      />
      <select className={inputClass} value={type} onChange={(e) => setType(e.target.value as typeof type)}>
        <option value="open_response">Open response</option>
        <option value="speaking">Speaking</option>
        <option value="writing">Writing</option>
      </select>
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={pending || !title.trim()}
          onClick={() =>
            startTransition(async () => {
              await assignHomework({ studentId, titleVi: title, instructionsVi: instructions, type });
              setOpen(false);
              setTitle("");
              setInstructions("");
            })
          }
        >
          Assign
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
