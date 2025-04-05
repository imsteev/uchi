import { db } from "@/db/init";
import { useAuth } from "@clerk/clerk-react";
import { id } from "@instantdb/react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Notes() {
  const { userId } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const imageDialogRef = useRef<HTMLDialogElement | null>(null);

  const [text, setText] = useState("");

  const {
    isLoading,
    error,
    data: _data,
  } = db.useQuery({
    notes: {
      $: {
        where: {
          createdBy: userId!,
        },
      },
    },
  });

  const onClose = () => {
    dialogRef.current?.close();
    setDialogOpen(false);
    setText("");
  };

  const onCloseImageDialog = () => {
    dialogRef.current?.close();
    setImageDialogOpen(false);
    setText("");
  };

  const notes = useMemo(() => {
    return _data?.notes.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [_data]);

  const handleAddNote = () => {
    const body = text.trim();
    if (!body) {
      return;
    }
    db.transact(
      db.tx.notes[id()].update({
        body,
        createdBy: userId!,
        createdAt: new Date().getTime(),
      })
    )
      .catch(console.log)
      .then(() => onClose());
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const rect = dialogRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        onClose();
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const rect = imageDialogRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        onCloseImageDialog();
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    if (dialogOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [dialogOpen]);

  useEffect(() => {
    if (imageDialogOpen) {
      imageDialogRef.current?.showModal();
    } else {
      imageDialogRef.current?.close();
    }
  }, [imageDialogOpen]);

  const handleAddImage = () => {
    console.log("todo");
  };

  return (
    <div>
      <h1>Notes</h1>
      {/* Actions */}
      <button onClick={() => setDialogOpen((prev) => !prev)}>New Note</button>

      {/* Add Note Dialog */}
      <dialog ref={dialogRef}>
        <div
          style={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <div>Add Note</div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
          />
          <button onClick={handleAddNote}>Add</button>
        </div>
      </dialog>

      {/* Add Image Dialog */}
      <dialog ref={imageDialogRef}>
        <div
          style={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <div>Add Image</div>
          <input type="file" />
          <button onClick={handleAddImage}>Add</button>
        </div>
      </dialog>

      {/* Notes List */}
      <div style={{ textAlign: "left" }}>NEWEST</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "2rem",
          padding: "2rem",
        }}
      >
        {notes?.map((note) => (
          <div
            style={{
              borderRight: "solid 1px",
              borderLeft: "solid 1px",
              borderBottom: "solid 1px",
              borderTop: "solid 1px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",

              padding: "2rem",
              margin: "auto",
              // borderRadius: "12px",
            }}
            key={note.id}
          >
            {note.body}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "right" }}>OLDEST</div>

      {/* Loading & Error */}
      {isLoading && "Loading..."}
      {error && "Error loading notes: " + error.message}
    </div>
  );
}
