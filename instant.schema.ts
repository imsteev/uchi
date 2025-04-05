// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.any(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    notes: i.entity({
      body: i.string(),
      createdAt: i.date(),
      createdBy: i.string(),
    }),
  },
  links: {
    notesUser: {
      forward: { on: "notes", has: "one", label: "user" },
      reverse: { on: "$users", has: "many", label: "userNotes" },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
