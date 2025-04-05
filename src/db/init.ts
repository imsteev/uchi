import { init } from "@instantdb/react";
import schema from "../../instant.schema.ts";

export const db = init({
  appId: "28659409-309d-4398-9037-d3dd0f84abbb",
  schema,
});
