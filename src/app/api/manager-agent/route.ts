import { NextResponse } from "next/server";

import { parsePatientRequestBody, runManagerAgentForPatient } from "@/lib/utils/agents";
import { checkRateLimitPlaceholder } from "@/lib/utils/rate-limit";
import { createSafeErrorResponse } from "@/lib/utils/errors";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("api/manager-agent");

export async function POST(request: Request) {
  try {
    const body = parsePatientRequestBody(await request.json());
    const rateLimit = checkRateLimitPlaceholder(`manager:${body.patientId}`);

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    logger.info("Manager agent request accepted", { patientId: body.patientId });
    const result = await runManagerAgentForPatient(body.patientId);
    return NextResponse.json(result);
  } catch (error) {
    logger.error("Manager agent request failed", { error });
    return createSafeErrorResponse(error);
  }
}
