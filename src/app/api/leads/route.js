import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeIndianPhone } from "@/lib/phone";
import { checkRateLimit, isDuplicateSubmission } from "@/lib/rateLimit";
import { isSupabaseConfigured, getSupabaseServerClient } from "@/lib/supabaseServer";

// Server-side Zod validation schema
const leadSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(20),
  category: z.string().max(100).optional().default("General Solar Enquiry"),
  source: z.enum(["popup", "quote", "contact"]).default("quote"),
  page_path: z.string().max(255).optional().default("/"),
  language: z.enum(["en", "hi"]).default("en"),
  consent: z.literal(true),
  email: z.string().email().max(150).optional().or(z.literal("")),
  city: z.string().max(100).optional().default(""),
  monthly_bill: z.string().max(50).optional().default(""),
  message: z.string().max(1000).optional().default(""),
  honeypot: z.string().max(0).optional(),
});

// Helper to strip control characters and sanitize strings
function sanitizeString(str) {
  if (typeof str !== "string") return "";
  // Strip null bytes, control characters except standard whitespace
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
}

export async function POST(request) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  try {
    // 1. IP identification & Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const rateLimit = await checkRateLimit(ip, 5, 60);
    if (!rateLimit.allowed) {
      console.warn(`[${requestId}] Rate limit exceeded`);
      return NextResponse.json(
        {
          ok: false,
          code: "RATE_LIMITED",
          message: "Too many requests. Please wait a moment before trying again.",
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          code: "INVALID_JSON",
          message: "Malformed request payload.",
        },
        { status: 400 }
      );
    }

    // 3. Honeypot check (bot prevention)
    if (body.honeypot && body.honeypot.length > 0) {
      console.warn(`[${requestId}] Honeypot triggered, silently dropping`);
      // Return 200 to confuse bots
      return NextResponse.json({
        ok: true,
        code: "LEAD_RECORDED",
        message: "Enquiry submitted successfully.",
      });
    }

    // 4. Validate with Zod
    const parseResult = leadSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          code: "VALIDATION_FAILED",
          message: "Please ensure all required fields are filled correctly.",
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // 5. Phone validation and normalization
    const { isValid, normalized } = normalizeIndianPhone(data.phone);
    if (!isValid) {
      return NextResponse.json(
        {
          ok: false,
          code: "INVALID_PHONE",
          message: "Please enter a valid 10-digit Indian mobile number.",
        },
        { status: 400 }
      );
    }

    // 6. Deduplication check (same phone + source within 10 minutes)
    const isDupe = await isDuplicateSubmission(normalized, data.source);
    if (isDupe) {
      return NextResponse.json(
        {
          ok: true,
          code: "DUPLICATE_RECENT",
          message:
            "Your enquiry was already received recently. Our solar engineering team will contact you shortly.",
        },
        { status: 200 }
      );
    }

    // 7. Check Supabase Configuration
    if (!isSupabaseConfigured()) {
      console.warn(`[${requestId}] Supabase credentials not configured (503)`);
      return NextResponse.json(
        {
          ok: false,
          code: "BACKEND_NOT_CONFIGURED",
          message:
            "Database storage is not configured for this solar website deployment. Please contact us directly via WhatsApp or phone.",
        },
        { status: 503 }
      );
    }

    // 8. Insert Record into Supabase
    const supabase = getSupabaseServerClient();
    const userAgent = request.headers.get("user-agent") || "";

    const leadRecord = {
      name: sanitizeString(data.name),
      phone: normalized,
      category: sanitizeString(data.category),
      source: data.source,
      page_path: sanitizeString(data.page_path),
      language: data.language,
      consent: true,
      consent_at: new Date().toISOString(),
      user_agent: sanitizeString(userAgent).substring(0, 255),
      status: "new",
    };

    // Include optional fields if provided
    if (data.email) leadRecord.email = sanitizeString(data.email);
    if (data.city) leadRecord.city = sanitizeString(data.city);
    if (data.monthly_bill) leadRecord.monthly_bill = sanitizeString(data.monthly_bill);
    if (data.message) leadRecord.message = sanitizeString(data.message);

    const { error: insertError } = await supabase.from("leads").insert([leadRecord]);

    if (insertError) {
      console.error(`[${requestId}] Supabase insert error:`, insertError.code);
      return NextResponse.json(
        {
          ok: false,
          code: "STORAGE_ERROR",
          message: "Failed to store lead details. Please try again or reach us on WhatsApp.",
        },
        { status: 500 }
      );
    }

    // 9. Optional Email notification hook (behind RESEND_API_KEY env flag)
    if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Solar Leads <notifications@aurasunsolar.com>",
            to: process.env.NOTIFICATION_EMAIL,
            subject: `New Solar Lead: ${leadRecord.name} (${leadRecord.category})`,
            text: `New Lead Details:\n\nName: ${leadRecord.name}\nPhone: ${leadRecord.phone}\nCategory: ${leadRecord.category}\nSource: ${leadRecord.source}\nCity: ${leadRecord.city || "N/A"}\nMonthly Bill: ${leadRecord.monthly_bill || "N/A"}\nMessage: ${leadRecord.message || "N/A"}`,
          }),
        });
      } catch {
        // Non-blocking notification error
      }
    }

    return NextResponse.json(
      {
        ok: true,
        code: "LEAD_RECORDED",
        message: "Enquiry submitted successfully. Our engineers will get in touch shortly.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[${requestId}] Unhandled API error:`, error?.message);
    return NextResponse.json(
      {
        ok: false,
        code: "SERVER_ERROR",
        message: "An internal server error occurred.",
      },
      { status: 500 }
    );
  }
}
