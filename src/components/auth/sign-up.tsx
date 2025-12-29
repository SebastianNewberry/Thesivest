import { useForm } from "@tanstack/react-form";
import { authClient } from "@/lib/auth-client";
import { signUpSchema } from "@/lib/auth-schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export function SignUp() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("=== SIGN UP STARTED ===");
      console.log("Form values:", value);
      setAuthError("");
      setIsSubmitting(true);

      // Combine firstName and lastName for Better Auth's name field
      const fullName = `${value.firstName} ${value.lastName}`.trim();
      console.log("Full name to send:", fullName);

      try {
        console.log("Calling authClient.signUp.email...");
        const result = await authClient.signUp.email(
          {
            email: value.email,
            password: value.password,
            name: fullName,
          },
          {
            onRequest: () => {
              console.log("authClient: onRequest - Setting submitting to true");
              setIsSubmitting(true);
            },
            onSuccess: async () => {
              console.log("✅ authClient: onSuccess - Sign up successful!");
              console.log("Result:", result);
              setIsSubmitting(false);
              // Avatar is generated automatically in auth hook
              console.log("Navigating to home...");
              navigate({ to: "/" });
            },
            onError: (ctx) => {
              console.error("❌ authClient: onError - Sign up failed");
              console.error("Error context:", ctx);
              console.error("Error message:", ctx.error.message);
              setAuthError(ctx.error.message || "Failed to create account");
              setIsSubmitting(false);
            },
          }
        );
        console.log("authClient.signUp.email completed");
      } catch (error) {
        console.error("❌ SIGN UP CATCH - Unexpected error:", error);
        setAuthError("An unexpected error occurred. Please try again.");
        setIsSubmitting(false);
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full bg-card/50 backdrop-blur-xl border-border shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("=== FORM SUBMIT ===");
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field name="firstName">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>First Name</Label>
                  <Input
                    id={field.name}
                    type="text"
                    placeholder="John"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`bg-background/50 border-input transition-all focus:ring-2 focus:ring-primary/20 ${
                      field.state.meta.errors.length > 0
                        ? "border-destructive focus:ring-destructive/20"
                        : ""
                    }`}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive font-medium">
                      {typeof field.state.meta.errors[0] === "string"
                        ? field.state.meta.errors[0]
                        : field.state.meta.errors[0]?.message ||
                          "Invalid value"}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="lastName">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Last Name</Label>
                  <Input
                    id={field.name}
                    type="text"
                    placeholder="Doe"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`bg-background/50 border-input transition-all focus:ring-2 focus:ring-primary/20 ${
                      field.state.meta.errors.length > 0
                        ? "border-destructive focus:ring-destructive/20"
                        : ""
                    }`}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive font-medium">
                      {typeof field.state.meta.errors[0] === "string"
                        ? field.state.meta.errors[0]
                        : field.state.meta.errors[0]?.message ||
                          "Invalid value"}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="name@example.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`bg-background/50 border-input transition-all focus:ring-2 focus:ring-primary/20 ${
                      field.state.meta.errors.length > 0
                        ? "border-destructive focus:ring-destructive/20"
                        : ""
                    }`}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive font-medium">
                      {typeof field.state.meta.errors[0] === "string"
                        ? field.state.meta.errors[0]
                        : field.state.meta.errors[0]?.message ||
                          "Invalid value"}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Password</Label>
                  <Input
                    id={field.name}
                    type="password"
                    showPasswordToggle
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`bg-background/50 border-input transition-all focus:ring-2 focus:ring-primary/20 ${
                      field.state.meta.errors.length > 0
                        ? "border-destructive focus:ring-destructive/20"
                        : ""
                    }`}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive font-medium">
                      {typeof field.state.meta.errors[0] === "string"
                        ? field.state.meta.errors[0]
                        : field.state.meta.errors[0]?.message ||
                          "Invalid value"}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters with uppercase,
                    lowercase, and a number
                  </p>
                </div>
              )}
            </form.Field>

            {authError && (
              <div className="text-destructive text-sm text-center bg-destructive/10 p-2 rounded-md font-medium">
                {authError}
              </div>
            )}

            <form.Subscribe
              selector={(state) => [state.isSubmitting, state.canSubmit, isSubmitting]}
              children={([formIsSubmitting, canSubmit, submitting]) => (
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                  disabled={submitting || !canSubmit}
                >
                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign Up
                  {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              )}
            />
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(formIsSubmitting) => (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="bg-background/50 hover:bg-muted"
                  disabled={formIsSubmitting}
                >
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="bg-background/50 hover:bg-muted"
                  disabled={formIsSubmitting}
                >
                  Github
                </Button>
              </div>
            )}
          />
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground gap-1">
          Already have an account?
          <Link
            to="/login"
            className="text-primary hover:text-primary/80 font-semibold transition-colors hover:underline"
          >
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
