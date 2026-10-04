/**
 * Server-only storage for indicator requests (Admin SDK, bypasses rules).
 * Collection: `indicatorRequests`, one document per request, keyed by uid.
 * Status is changed by the team, not the member — there is no member-facing
 * update path.
 */
import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase-admin";
import type { IndicatorRequest, IndicatorRequestStatus } from "./types";
import type { ValidRequest } from "./indicator-request-input";

const COLLECTION = "indicatorRequests";
const STATUSES: IndicatorRequestStatus[] = ["PENDING", "REVIEWING", "APPROVED", "COMPLETED"];

export type SerializedRequest = Omit<IndicatorRequest, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

function serialize(id: string, d: DocumentData): SerializedRequest {
  const createdAt: Date = d.createdAt?.toDate?.() ?? new Date();
  const updatedAt: Date = d.updatedAt?.toDate?.() ?? createdAt;
  return {
    id,
    kind: d.kind === "access" ? "access" : "custom",
    indicatorId: d.indicatorId ?? undefined,
    indicatorName: d.indicatorName ?? undefined,
    market: d.market ?? undefined,
    style: d.style ?? undefined,
    timeframes: Array.isArray(d.timeframes) ? d.timeframes : [],
    details: typeof d.details === "string" ? d.details : "",
    status: STATUSES.includes(d.status) ? d.status : "PENDING",
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}

export async function listRequestsForUser(uid: string): Promise<SerializedRequest[]> {
  // Filter only (no orderBy) so this needs no composite index; sorted here.
  const snap = await getAdminFirestore().collection(COLLECTION).where("uid", "==", uid).get();
  return snap.docs
    .map((doc) => serialize(doc.id, doc.data()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function hasOpenAccessRequest(uid: string, indicatorId: string): Promise<boolean> {
  const existing = await listRequestsForUser(uid);
  return existing.some((r) => r.kind === "access" && r.indicatorId === indicatorId && r.status !== "COMPLETED");
}

export async function createRequest(
  user: { uid: string; email: string },
  value: ValidRequest,
): Promise<SerializedRequest> {
  const ref = getAdminFirestore().collection(COLLECTION).doc();
  await ref.set({
    ...value,
    uid: user.uid,
    email: user.email,
    status: "PENDING",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  const now = new Date().toISOString();
  return { ...value, id: ref.id, status: "PENDING", createdAt: now, updatedAt: now };
}
