import { NextResponse } from "next/server";

import { runAnalyzeAgentPipeline, parseAnalyzeRequestBody } from "@/lib/utils/agents";
import { checkRateLimitPlaceholder } from "@/lib/utils/rate-limit";
import { createSafeErrorResponse } from "@/lib/utils/errors";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("api/analyze");

export async function POST(request: Request) {
  try {
    const body = parseAnalyzeRequestBody(await request.json());
    const rateLimit = checkRateLimitPlaceholder(`analyze:${body.patientId}`);

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    logger.info("Analyze request accepted", { patientId: body.patientId });
    const result = await runAnalyzeAgentPipeline(body.patientId);
    return NextResponse.json(result);
  } catch (error) {
    logger.error("Analyze request failed", { error });
    return createSafeErrorResponse(error);
  }
}
