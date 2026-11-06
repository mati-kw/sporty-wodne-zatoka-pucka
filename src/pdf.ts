import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { fileSlug } from "./letter";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 56;
const MARGIN_TOP = 54;
const MARGIN_BOTTOM = 52;
const INK = rgb(0.1, 0.14, 0.16);
const MUTED = rgb(0.28, 0.34, 0.36);
const RULE = rgb(0.11, 0.32, 0.36);

type Fonts = { regular: PDFFont; bold: PDFFont };

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = [];
  for (const raw of text.split("\n")) {
    const words = raw.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) <= width) {
        line = next;
        continue;
      }
      if (line) lines.push(line);
      if (font.widthOfTextAtSize(word, size) <= width) {
        line = word;
        continue;
      }
      let chunk = "";
      for (const char of word) {
        const trial = chunk + char;
        if (font.widthOfTextAtSize(trial, size) > width && chunk) {
          lines.push(chunk);
          chunk = char;
        } else {
          chunk = trial;
        }
      }
      line = chunk;
    }
    if (line) lines.push(line);
  }
  return lines;
}

const LETTER_TITLE =
  "Uwagi i wnioski do projektu planu ochrony obszaru Natura 2000 Zatoka Pucka PLB220005";

export async function buildPdf(text: string, name: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  pdf.setTitle(LETTER_TITLE);
  pdf.setAuthor(name.trim() || "Wnioskodawca");
  pdf.setSubject("Uwagi do projektu planu ochrony obszaru Natura 2000 Zatoka Pucka PLB220005");
  pdf.setCreator("Uwagi do planu ochrony Zatoki Puckiej");

  const [regularBytes, boldBytes] = await Promise.all([
    fetch("/fonts/DejaVuSans.ttf").then((response) => {
      if (!response.ok) throw new Error("Brak czcionki DejaVuSans.ttf");
      return response.arrayBuffer();
    }),
    fetch("/fonts/DejaVuSans-Bold.ttf").then((response) => {
      if (!response.ok) throw new Error("Brak czcionki DejaVuSans-Bold.ttf");
      return response.arrayBuffer();
    }),
  ]);
  const fonts: Fonts = {
    regular: await pdf.embedFont(regularBytes, { subset: true }),
    bold: await pdf.embedFont(boldBytes, { subset: true }),
  };

  const pages: PDFPage[] = [];
  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  pages.push(page);
  let y = PAGE_HEIGHT - MARGIN_TOP;
  const width = PAGE_WIDTH - MARGIN_X * 2;

  const newPage = () => {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);
    y = PAGE_HEIGHT - MARGIN_TOP;
  };

  const ensure = (height: number) => {
    if (y - height < MARGIN_BOTTOM) newPage();
  };

  const drawLines = (lines: string[], font: PDFFont, size: number, color = INK, gap = 3) => {
    const leading = size + gap;
    for (const line of lines) {
      ensure(leading);
      page.drawText(line, { x: MARGIN_X, y: y - size, size, font, color });
      y -= leading;
    }
  };

  const paragraph = (text: string, font: PDFFont, size: number, color = INK, gap = 3) => {
    drawLines(wrap(text, font, size, width), font, size, color, gap);
  };

  const gap = (amount: number) => {
    y -= amount;
  };

  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  let signatureNext = false;
  for (const block of blocks) {
    if (signatureNext) {
      gap(22);
      ensure(24);
      page.drawLine({
        start: { x: MARGIN_X, y },
        end: { x: MARGIN_X + 200, y },
        thickness: 0.6,
        color: INK,
      });
      gap(6);
      paragraph(block, fonts.regular, 11);
      signatureNext = false;
      continue;
    }
    if (block === "Z poważaniem,") {
      gap(8);
      paragraph(block, fonts.regular, 11);
      signatureNext = true;
      continue;
    }
    if (block.startsWith("Uwagi i wnioski")) {
      paragraph(block, fonts.bold, 13, INK, 4);
      gap(6);
      ensure(8);
      page.drawRectangle({
        x: MARGIN_X,
        y: y - 1,
        width: 128,
        height: 2,
        color: RULE,
      });
      gap(12);
      continue;
    }
    if (block.startsWith("Wnioskodawca:")) {
      const [head, ...rest] = block.split("\n");
      paragraph(head, fonts.bold, 11);
      if (rest.some((line) => line.trim())) paragraph(rest.join("\n"), fonts.regular, 11);
      gap(10);
      continue;
    }
    const heading = /^\d+\.\s/.test(block);
    const muted = block.startsWith("Dotyczy zapisu:") || block.startsWith("wyłożonego do konsultacji");
    paragraph(block, heading ? fonts.bold : fonts.regular, muted ? 10 : 11, muted ? MUTED : INK);
    gap(heading ? 6 : 8);
  }

  pages.forEach((item, index) => {
    const label = `${index + 1} / ${pages.length}`;
    const size = 8;
    const textWidth = fonts.regular.widthOfTextAtSize(label, size);
    item.drawText(label, {
      x: PAGE_WIDTH - MARGIN_X - textWidth,
      y: 28,
      size,
      font: fonts.regular,
      color: MUTED,
    });
    item.drawText("Uwagi do projektu planu ochrony · Zatoka Pucka PLB220005", {
      x: MARGIN_X,
      y: 28,
      size,
      font: fonts.regular,
      color: MUTED,
    });
  });

  return pdf.save();
}

export function downloadPdf(bytes: Uint8Array, name: string) {
  const copy = new Uint8Array(bytes);
  const blob = new Blob([copy.buffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `uwagi-zatoka-pucka-${fileSlug(name)}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
