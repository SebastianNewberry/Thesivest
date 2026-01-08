import { createServerFn } from "@tanstack/react-start";
import { getAllUsers } from "../data-access/users.server";

export const debugFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const users = await getAllUsers();
    return { success: true, count: users.length, users: users.slice(0, 2) };
  } catch (e: any) {
    return { success: false, error: e.message, stack: e.stack };
  }
});
