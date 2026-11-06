import { POINTS, POSTAL, ROLE_FIELD, formatPolishDate, type Point } from "./content";

export type PointAnswers = {
  enabled: boolean;
  fields: Record<string, string>;
  included: Record<string, boolean>;
};

export type FormState = {
  name: string;
  address: string;
  city: string;
  date: string;
  role: string;
  points: Record<string, PointAnswers>;
  extra: string;
};

export type LetterSection = {
  heading: string;
  paragraphs: string[];
};

export type Letter = {
  dateline: string;
  recipient: string[];
  applicant: string[];
  title: string;
  intro: string;
  sections: LetterSection[];
  closing: string;
  signature: string;
};

/** Each question draws its own example. A fresh deck of 1–4 is shuffled so the same number is not repeated next door. */
function demoPicker(): () => number {
  let deck: number[] = [];
  let previous = -1;
  return () => {
    if (deck.length === 0) {
      deck = [0, 1, 2, 3];
      for (let index = deck.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(Math.random() * (index + 1));
        const held = deck[index];
        deck[index] = deck[swap];
        deck[swap] = held;
      }
      const last = deck.length - 1;
      if (deck[last] === previous) {
        const swap = Math.floor(Math.random() * last);
        const held = deck[last];
        deck[last] = deck[swap];
        deck[swap] = held;
      }
    }
    previous = deck.pop() ?? 0;
    return previous;
  };
}

export function emptyState(date: string): FormState {
  const nextDemo = demoPicker();
  const role = ROLE_FIELD.demos[nextDemo()];
  const points: FormState["points"] = {};
  for (const point of POINTS) {
    const fields: Record<string, string> = {};
    const included: Record<string, boolean> = {};
    for (const field of point.fields) {
      fields[field.id] = field.demos[nextDemo()];
      included[field.id] = true;
    }
    points[point.id] = { enabled: point.defaultOn, fields, included };
  }
  return {
    name: "",
    address: "",
    city: "",
    date,
    role,
    points,
    extra: "",
  };
}

export function warnings(state: FormState): string[] {
  const notes: string[] = [];
  if (!state.name.trim()) {
    notes.push("W nagłówku nie ma imienia i nazwiska albo nazwy podmiotu. Obwieszczenie tego wymaga.");
  }
  if (!state.address.trim()) {
    notes.push("W nagłówku nie ma adresu korespondencyjnego. Obwieszczenie tego wymaga.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(state.date)) {
    notes.push("Data pisma jest pusta.");
  }
  return notes;
}

function withTerminal(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return /[.!?…]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

export function joinLead(lead: string, answer: string): string {
  let body = answer.trim().replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
  const duplicated = body.toLowerCase().startsWith(lead.toLowerCase());
  if (duplicated) body = body.slice(lead.length).trim();
  const [first, ...rest] = body.split(/\n+/).map((part) => part.trim()).filter(Boolean);
  if (!first) return withTerminal(lead);
  const opening = withTerminal(`${lead} ${first}`);
  const more = rest.map(withTerminal);
  return [opening, ...more].join("\n\n");
}

export function sectionParagraphs(
  point: Point,
  fields: Record<string, string>,
  included: Record<string, boolean>,
): string[] {
  return point.fields.flatMap((field) => {
    if (field.optional && included[field.id] === false) return [];
    const answer = (fields[field.id] ?? "").trim();
    if (!answer) return [];
    return joinLead(field.lead, answer).split("\n\n").filter(Boolean);
  });
}

export function buildLetter(state: FormState): Letter {
  const city = state.city.trim();
  const dateline = city
    ? `${city}, ${formatPolishDate(state.date)}`
    : formatPolishDate(state.date);

  const sections: LetterSection[] = POINTS.filter((point) => state.points[point.id]?.enabled).map(
    (point, index) => ({
      heading: `${index + 1}. ${point.label}`,
      paragraphs: [
        `Dotyczy zapisu: ${point.citation}`,
        ...sectionParagraphs(
          point,
          state.points[point.id]?.fields ?? {},
          state.points[point.id]?.included ?? {},
        ),
      ],
    }),
  );

  const extra = state.extra.trim();
  if (extra) {
    sections.push({
      heading: `${sections.length + 1}. Uwaga dodatkowa`,
      paragraphs: [withTerminal(extra)],
    });
  }

  return {
    dateline,
    recipient: POSTAL,
    applicant: [state.name.trim(), state.address.trim()].filter(Boolean),
    title: "Uwagi i wnioski do projektu planu ochrony obszaru Natura 2000 Zatoka Pucka PLB220005",
    intro: state.role.trim() ? joinLead("Składam uwagi jako", state.role) : "",
    sections,
    closing:
      "Proszę o rozpatrzenie powyższych uwag i wniosków w raporcie z udziału społecznego oraz o uwzględnienie ich w dalszych pracach nad planem ochrony.",
    signature: state.name.trim(),
  };
}

export function letterPlainText(letter: Letter): string {
  const lines = [
    letter.dateline,
    "",
    ...letter.recipient,
    "",
    "Wnioskodawca:",
    ...letter.applicant,
    "",
    letter.title,
    "",
    "wyłożonego do konsultacji przez Dyrektora Urzędu Morskiego w Gdyni (uwagi do 13 listopada 2026 r.)",
    "",
  ];
  if (letter.intro) lines.push(letter.intro, "");
  for (const section of letter.sections) {
    lines.push(section.heading, "");
    for (const paragraph of section.paragraphs) lines.push(paragraph, "");
  }
  lines.push(letter.closing, "", "Z poważaniem,", letter.signature);
  return lines.join("\n");
}

export function fileSlug(name: string): string {
  const map: Record<string, string> = {
    ą: "a",
    ć: "c",
    ę: "e",
    ł: "l",
    ń: "n",
    ó: "o",
    ś: "s",
    ź: "z",
    ż: "z",
  };
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (char) => map[char] ?? char)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "uwagi";
}
