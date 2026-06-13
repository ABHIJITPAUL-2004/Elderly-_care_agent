import { NextResponse } from "next/server";

import { parsePatientRequestBody, runSafetyAgentForPatient } from "@/lib/utils/agents";
import { checkRateLimitPlaceholder } from "@/lib/utils/rate-limit";
import { createSafeErrorResponse } from "@/lib/utils/errors";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("api/safety-agent");

export async function POST(request: Request) {
  try {
    const body = parsePatientRequestBody(await request.json());
    const rateLimit = checkRateLimitPlaceholder(`safety:${body.patientId}`);

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    logger.info("Safety agent request accepted", { patientId: body.patientId });
    const result = await runSafetyAgentForPatient(body.patientId);
    return NextResponse.json(result);
  } catch (error) {
    logger.error("Safety agent request failed", { error });
    return createSafeErrorResponse(error);
  }
}
