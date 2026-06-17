import { NextResponse } from "next/server";

const surveyResponses: Array<Record<string, unknown>> = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required context fields
    if (!body.institutionType || !body.role || !body.academicArea) {
      return NextResponse.json(
        { error: "Please complete all context fields" },
        { status: 400 }
      );
    }

    const response = {
      id: `survey_${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };

    surveyResponses.push(response);
    console.log(`[Survey] New response (total: ${surveyResponses.length})`);

    return NextResponse.json(
      { message: "Thank you for contributing to this research. Your response is anonymous and confidential." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
