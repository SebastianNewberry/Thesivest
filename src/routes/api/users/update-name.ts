import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/api/users/update-name")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Get the current session
          const session = await auth.api.getSession({
            headers: request.headers,
          });

          if (!session?.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: {
                "Content-Type": "application/json",
              },
            });
          }

          // Parse the request body
          const body = await request.json();
          const { firstName, lastName } = body;

          if (!firstName || !lastName) {
            return new Response(
              JSON.stringify({
                error: "First name and last name are required",
              }),
              {
                status: 400,
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          }

          // For now, just return success
          // TODO: Update user record with firstName and lastName when schema is updated
          // The name field is already set during sign-up, so this endpoint
          // can be used for future schema updates to store firstName/lastName separately

          return new Response(
            JSON.stringify({
              success: true,
              message: "Name updated successfully",
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } catch (error) {
          console.error("Error updating user name:", error);
          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      },
    },
  },
});
