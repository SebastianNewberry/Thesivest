import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getUserProfile,
  getUserProfileByUsername,
  getUserTradeHistory,
  getUserActiveTrades,
  getUserClosedTrades,
  getUserPerformanceMetrics,
  addEducation,
  updateEducation,
  deleteEducation,
  addCertification,
  updateCertification,
  deleteCertification,
} from "../data-access/profiles";

// Get profile by ID
export const getProfileFn = createServerFn({ method: "GET" })
  .inputValidator((z) =>
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ input: { id } }) => {
    return await getUserProfile(id);
  });

// Get profile by username
export const getProfileByUsernameFn = createServerFn({ method: "GET" })
  .inputValidator((z) =>
    z.object({
      username: z.string(),
    })
  )
  .handler(async ({ input: { username } }) => {
    return await getUserProfileByUsername(username);
  });

// Get trade history
export const getTradeHistoryFn = createServerFn({ method: "GET" })
  .inputValidator((z) =>
    z.object({
      userId: z.string(),
      limit: z.number().optional(),
    })
  )
  .handler(async ({ input: { userId, limit } }) => {
    return await getUserTradeHistory(userId, limit);
  });

// Get active trades
export const getActiveTradesFn = createServerFn({ method: "GET" })
  .inputValidator((z) =>
    z.object({
      userId: z.string(),
    })
  )
  .handler(async ({ input: { userId } }) => {
    return await getUserActiveTrades(userId);
  });

// Get closed trades
export const getClosedTradesFn = createServerFn({ method: "GET" })
  .inputValidator((z) =>
    z.object({
      userId: z.string(),
      limit: z.number().optional(),
    })
  )
  .handler(async ({ input: { userId, limit } }) => {
    return await getUserClosedTrades(userId, limit);
  });

// Get performance metrics
export const getPerformanceMetricsFn = createServerFn({ method: "GET" })
  .inputValidator((z) =>
    z.object({
      userId: z.string(),
    })
  )
  .handler(async ({ input: { userId } }) => {
    return await getUserPerformanceMetrics(userId);
  });

// Add education
export const addEducationFn = createServerFn({ method: "POST" })
  .inputValidator((z) =>
    z.object({
      userId: z.string(),
      school: z.string(),
      degree: z.string(),
      field: z.string().optional(),
      startDate: z.date(),
      endDate: z.date().optional(),
      current: z.boolean().default(false),
      gpa: z.string().optional(),
      honors: z.string().optional(),
      activities: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    await addEducation(input.userId, input);
    return { success: true };
  });

// Update education
export const updateEducationFn = createServerFn({ method: "PUT" })
  .inputValidator((z) =>
    z.object({
      educationId: z.string(),
      school: z.string().optional(),
      degree: z.string().optional(),
      field: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      current: z.boolean().optional(),
      gpa: z.string().optional(),
      honors: z.string().optional(),
      activities: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    const { educationId, ...data } = input;
    await updateEducation(educationId, data);
    return { success: true };
  });

// Delete education
export const deleteEducationFn = createServerFn({ method: "DELETE" })
  .inputValidator((z) =>
    z.object({
      educationId: z.string(),
    })
  )
  .handler(async ({ input: { educationId } }) => {
    await deleteEducation(educationId);
    return { success: true };
  });

// Add certification
export const addCertificationFn = createServerFn({ method: "POST" })
  .inputValidator((z) =>
    z.object({
      userId: z.string(),
      name: z.string(),
      organization: z.string(),
      issueDate: z.date(),
      expirationDate: z.date().optional(),
      credentialId: z.string().optional(),
      credentialUrl: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    await addCertification(input.userId, input);
    return { success: true };
  });

// Update certification
export const updateCertificationFn = createServerFn({ method: "PUT" })
  .inputValidator((z) =>
    z.object({
      certificationId: z.string(),
      name: z.string().optional(),
      organization: z.string().optional(),
      issueDate: z.date().optional(),
      expirationDate: z.date().optional(),
      credentialId: z.string().optional(),
      credentialUrl: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    const { certificationId, ...data } = input;
    await updateCertification(certificationId, data);
    return { success: true };
  });

// Delete certification
export const deleteCertificationFn = createServerFn({ method: "DELETE" })
  .inputValidator((z) =>
    z.object({
      certificationId: z.string(),
    })
  )
  .handler(async ({ input: { certificationId } }) => {
    await deleteCertification(certificationId);
    return { success: true };
  });

