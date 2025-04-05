import { db } from "@/db/init";
import { useAuth } from "@clerk/clerk-react";
import { id } from "@instantdb/react";
import { useEffect, useRef, useState } from "react";

export default function Notes() {
  const { userId } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [text, setText] = useState("");

  // useEffect(() => {
  //   // transact! 🔥
  //   console.log("adding");
  //   db.transact(db.tx.notes[id()].update({ body: "first note" })).catch(
  //     console.log
  //   );
  // }, [db]);

  const query = { notes: {} };
  const { isLoading, error, data } = db.useQuery(query);

  const handleAddNote = () => {
    db.transact(
      db.tx.notes[id()].update({
        body: text,
        createdBy: userId!,
        createdAt: new Date().getTime(),
      })
    ).catch(console.log);
  };

  const dialogRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      var rect = dialogRef.current.getBoundingClientRect();
      var isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!isInDialog) {
        setDialogOpen(false);
        dialogRef.current.close();
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  return (
    <div>
      <h1>Notes</h1>
      <button onClick={() => setDialogOpen((prev) => !prev)}>New Note</button>
      <dialog open={dialogOpen} ref={dialogRef}>
        <div>Add Note</div>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={handleAddNote}>Add</button>
      </dialog>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          gap: "2rem",
          padding: "2rem",
        }}
      >
        {data?.notes.map((note) => <div key={note.id}>{note.body}</div>)}
      </div>
      {isLoading && "Loading..."}
      {error && "Error loading notes: " + error.message}
    </div>
  );
}
