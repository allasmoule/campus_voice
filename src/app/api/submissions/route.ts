import { NextResponse } from "next/server";

// In-memory store for MVP
const submissions: Array<Record<string, unknown>> = [];

// Simple moderation: check for patterns that suggest naming individuals
function moderateContent(text: string): { safe: boolean; flags: string[] } {
  const flags: string[] = [];

  // Check for patterns like "Professor X", "Dr. X", "Dean X"
  const namePatterns = /\b(professor|prof\.|dr\.|dean|president|chair)\s+[A-Z][a-z]+/gi;
  if (namePatterns.test(text)) {
    flags.push("Possible name reference detected");
  }

  // Check for direct accusation language
  const accusationPatterns = /\b(he|she|they)\s+(abused|harassed|assaulted|discriminated|threatened|bullied)\b/gi;
  if (accusationPatterns.test(text)) {
    flags.push("Direct accusation language detected");
  }

  // Check for defamatory patterns
  const defamationPatterns = /\b(is a|is an)\s+(racist|predator|abuser|criminal|fraud)\b/gi;
  if (defamationPatterns.test(text)) {
    flags.push("Potentially defamatory language detected");
  }

  return { safe: flags.length === 0, flags };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { narrativeText, category, role, institutionType, academicArea } = body;

    if (!narrativeText || narrativeText.trim().length < 20) {
      return NextResponse.json(
        { error: "Please provide a more detailed experience (at least 20 characters)" },
        { status: 400 }
      );
    }

    // Run moderation
    const moderation = moderateContent(narrativeText);

    const submission = {
      id: `sub_${Date.now()}`,
      narrativeText,
      category,
      role,
      institutionType,
      academicArea,
      status: moderation.safe ? "PENDING" : "FLAGGED",
      moderationFlags: moderation.flags,
      createdAt: new Date().toISOString(),
    };

    submissions.push(submission);

    if (!moderation.safe) {
      return NextResponse.json(
        {
          message: "Your submission has been received but flagged for review.",
          flags: moderation.flags,
          suggestion: "Please ensure you are not including names or making direct accusations about identifiable individuals.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Thank you. Your experience has been submitted for review." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
