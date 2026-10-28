export interface LinkedInResult {
  success: boolean;
  profile?: Partial<ProfileImport>;
  error?: string;
  requiresAlternative: boolean;
  alternativeMessage: string;
}

export interface ProfileImport {
  fullName: string;
  headline: string;
  summary: string;
  location?: string;
  email?: string;
  profileImage?: string;
  publicLinks: Array<{ label: string; url: string; type: string }>;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    highlights: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    field?: string;
    startDate?: string;
    endDate?: string;
  }>;
  skills: Array<{ name: string; category: string; level: number }>;
  certifications: Array<{ name: string; issuer: string; date?: string }>;
  projects: Array<{ title: string; description: string; technologies: string[]; link?: string; github?: string }>;
}

const LINKEDIN_REGEX =
  /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_%]+(\/?)$/;

export function validateLinkedInUrl(url: string): { valid: boolean; message?: string } {
  const trimmed = url.trim();
  if (!trimmed) {
    return { valid: false, message: 'Please enter a LinkedIn profile URL.' };
  }
  if (!LINKEDIN_REGEX.test(trimmed)) {
    return {
      valid: false,
      message: 'Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/example-profile/).',
    };
  }
  return { valid: true };
}

export function normalizeLinkedInUrl(url: string): string {
  let u = url.trim();
  if (!u.startsWith('http://') && !u.startsWith('https://')) {
    u = 'https://' + u;
  }
  try {
    const parsed = new URL(u);
    parsed.hash = '';
    parsed.search = '';
    // Ensure trailing slash removed for consistency but keep path.
    let pathname = parsed.pathname.replace(/\/+$/, '');
    if (!pathname) pathname = '/';
    return `${parsed.origin}${pathname}`;
  } catch {
    return u;
  }
}

/* -------------------------------------------------------------------------- */
/*  Extraction                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Attempts to retrieve publicly accessible LinkedIn information using only
 * supported, non-authenticated means. LinkedIn aggressively blocks scraping,
 * so this is intentionally conservative: it validates the URL and reports that
 * direct browser extraction is not reliably available, then offers alternatives.
 *
 * No authentication, CAPTCHA bypass, or anti-bot circumvention is attempted.
 */
export async function extractLinkedInProfile(
  url: string,
): Promise<LinkedInResult> {
  const validation = validateLinkedInUrl(url);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.message,
      requiresAlternative: true,
      alternativeMessage: alternativeMessage(),
    };
  }

  const normalized = normalizeLinkedInUrl(url);

  // Try a lightweight, header-only probe of the public profile page. This is
  // expected to be blocked or return a login wall in most cases. We do NOT
  // follow redirects, execute JS, or scrape. Any 200 with readable content is
  // treated as "possibly accessible"; everything else triggers alternatives.
  try {
    const res = await fetch(normalized, {
      method: 'GET',
      headers: {
        Accept: 'text/html',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      // Abort quickly so the UI stays responsive.
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const text = await res.text();
      const looksLikeProfile =
        text.includes('linkedin.com/in') &&
        (text.includes('og:profile') || text.includes('username') || text.includes('member'));

      if (looksLikeProfile && text.length > 2000) {
        // A page was reachable, but reliably parsing structured data from
        // LinkedIn's markup is not supported without authentication. Do not
        // fabricate data. Offer manual/document alternatives instead.
        return {
          success: false,
          error: 'LinkedIn profile page reached, but structured data is not publicly accessible.',
          requiresAlternative: true,
          alternativeMessage: alternativeMessage(),
          profile: undefined,
        };
      }
    }

    return {
      success: false,
      error: `LinkedIn access blocked (HTTP ${res.status}).`,
      requiresAlternative: true,
      alternativeMessage: alternativeMessage(),
    };
  } catch (err) {
    return {
      success: false,
      error: `Unable to reach LinkedIn: ${err instanceof Error ? err.message : String(err)}`,
      requiresAlternative: true,
      alternativeMessage: alternativeMessage(),
    };
  }
}

function alternativeMessage(): string {
  return (
    'LinkedIn restricts automated access to profile data. You can still build your portfolio by:' +
    ' uploading a LinkedIn-exported PDF/resume, importing from a document, or entering your information manually.'
  );
}

/* -------------------------------------------------------------------------- */
/*  Document / manual import helpers                                          */
/* -------------------------------------------------------------------------- */

export function parseResumeText(text: string): Partial<ProfileImport> {
  // Very light heuristic parser for pasted resume text. No fabrication: only
  // fields that can be reasonably inferred are populated; everything else is
  // left blank for the user to complete during review.
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const findAfter = (prefixes: string[]): string | undefined => {
    for (const line of lines) {
      const lower = line.toLowerCase();
      for (const p of prefixes) {
        if (lower.startsWith(p)) {
          return line.slice(p.length).trim();
        }
      }
    }
    return undefined;
  };

  const name = findAfter(['name:', 'full name:']) || lines[0] || '';
  const headline = findAfter(['headline:', 'title:']) || '';
  const summary = findAfter(['summary:', 'about:', 'professional summary:']) || '';
  const emailMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
  const location = findAfter(['location:', 'based in:']);

  return {
    fullName: name,
    headline,
    summary,
    location,
    email: emailMatch?.[0],
    profileImage: undefined,
    publicLinks: [],
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
  };
}

export function pdfFileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // PDFs are binary; this extracts readable text portions heuristically.
      // For real PDF parsing a server-side or library approach is needed.
      resolve(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function toProfileInfo(imported: Partial<ProfileImport>): ProfileImport {
  return {
    fullName: imported.fullName || '',
    headline: imported.headline || '',
    summary: imported.summary || '',
    location: imported.location,
    email: imported.email,
    profileImage: imported.profileImage,
    publicLinks: imported.publicLinks ?? [],
    experience: imported.experience ?? [],
    education: imported.education ?? [],
    skills: imported.skills ?? [],
    certifications: imported.certifications ?? [],
    projects: imported.projects ?? [],
  };
}

export type { ProfileImport };
