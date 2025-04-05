import { db } from "@/db/init";
import { id } from "@instantdb/react";
import { useEffect, useState } from "react";

export default function Notes() {
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
        createdBy: "1",
        createdAt: new Date().getTime(),
      })
    ).catch(console.log);
  };

  return (
    <div>
      <h1>Notes</h1>
      <div>Existing notes</div>
      <button onClick={() => setDialogOpen((prev) => !prev)}>open</button>
      <dialog open={dialogOpen}>
        <div>Add Note</div>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={handleAddNote}>Add</button>
      </dialog>
      {data?.notes.map((note) => <div key={note.id}>{note.body}</div>)}
      {isLoading && "Loading..."}
      {error && "Error loading notes: " + error.message}
    </div>
  );
}
