import { NextResponse } from "next/server";
import { requireSignedInUser } from "@/lib/user-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateRequestInput, type IndicatorRequestInput } from "@/lib/zentra/indicator-request-input";
import {
  createRequest,
  hasOpenAccessRequest,
  listRequestsForUser,
} from "@/lib/zentra/indicator-requests-server";

const NOT_CONFIGURED = "Firebase Admin not configured";

function storageError(err: unknown, where: string) {
  console.error(`[indicator-requests ${where}]`, err);
  const notConfigured = err instanceof Error && err.message.includes(NOT_CONFIGURED);
  return NextResponse.json(
    { error: notConfigured ? "Requests are not available right now." : "Could not reach request storage." },
    { status: notConfigured ? 503 : 500 },
  );
}

export async function GET(req: Request) {
  const session = await requireSignedInUser(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    return NextResponse.json({ requests: await listRequestsForUser(session.uid) });
  } catch (err) {
    return storageError(err, "GET");
  }
}

export async function POST(req: Request) {
  const session = await requireSignedInUser(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limit = checkRateLimit(`indicator-request:${session.uid}`, 5, 60 * 60e3);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "You've sent several requests recently. Try again a little later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  let body: IndicatorRequestInput;
  try {
    body = (await req.json()) as IndicatorRequestInput;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = validateRequestInput(body);
  if (!result.ok) {
    return NextResponse.json({ error: "Please check the form.", fields: result.errors }, { status: 400 });
  }

  try {
    if (result.value.kind === "access" && result.value.indicatorId) {
      if (await hasOpenAccessRequest(session.uid, result.value.indicatorId)) {
        return NextResponse.json({ error: "You already have an open request for this indicator." }, { status: 409 });
      }
    }
    const created = await createRequest(session, result.value);
    return NextResponse.json({ request: created }, { status: 201 });
  } catch (err) {
    return storageError(err, "POST");
  }
}
