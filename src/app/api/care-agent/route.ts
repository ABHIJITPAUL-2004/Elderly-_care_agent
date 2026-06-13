import { NextResponse } from "next/server";

import { parsePatientRequestBody, runCareAgentForPatient } from "@/lib/utils/agents";
import { checkRateLimitPlaceholder } from "@/lib/utils/rate-limit";
import { createSafeErrorResponse } from "@/lib/utils/errors";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("api/care-agent");

export async function POST(request: Request) {
  try {
    const body = parsePatientRequestBody(await request.json());
    const rateLimit = checkRateLimitPlaceholder(`care:${body.patientId}`);

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    logger.info("Care agent request accepted", { patientId: body.patientId });
    const result = await runCareAgentForPatient(body.patientId);
    return NextResponse.json(result);
  } catch (error) {
    logger.error("Care agent request failed", { error });
    return createSafeErrorResponse(error);
  }
}
