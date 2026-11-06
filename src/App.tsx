import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DEADLINE_LABEL,
  EMAIL,
  EMAIL_SUBJECT,
  FOOTER_SOURCES,
  IDENTITY_SOURCES,
  ORAL_PHONE,
  POINTS,
  POSTAL,
  ROLE_FIELD,
  SEND_SOURCES,
  SIGN_SOURCES,
  SIGN_URL,
  daysUntilDeadline,
  todayIso,
  type Source,
} from "./content";
import {
  buildLetter,
  emptyState,
  letterPlainText,
  warnings,
  type FormState,
} from "./letter";

const STORAGE_KEY = "zatoka-pucka-uwagi-v4";
const LETTER_KEY = "zatoka-pucka-pismo-v4";

function loadState(): FormState {
  const fresh = emptyState(todayIso());
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh;
    const saved = JSON.parse(raw) as Partial<FormState>;
    const points = { ...fresh.points };
    for (const id of Object.keys(points)) {
      const incoming = saved.points?.[id];
      if (!incoming) continue;
      points[id] = {
        enabled: typeof incoming.enabled === "boolean" ? incoming.enabled : points[id].enabled,
        fields: { ...points[id].fields, ...incoming.fields },
        included: { ...points[id].included, ...incoming.included },
      };
    }
    return {
      ...fresh,
      name: saved.name ?? "",
      address: saved.address ?? "",
      city: saved.city ?? "",
      date: saved.date || fresh.date,
      role: saved.role ?? fresh.role,
      extra: saved.extra ?? "",
      points,
    };
  } catch {
    return fresh;
  }
}

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "true");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="copy icon"
      aria-label={copied ? "Skopiowano" : label}
      onClick={async () => {
        const ok = await copyText(value);
        if (!ok) return;
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5 9.5 17 19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SourcesButton({ items }: { items: readonly Source[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  return (
    <>
      <button type="button" className="sources-btn" onClick={() => dialogRef.current?.showModal()}>
        Źródła
      </button>
      {createPortal(
        <dialog
          ref={dialogRef}
          className="sources-dialog"
          aria-labelledby={titleId}
          onClick={(event) => {
            const dialog = dialogRef.current;
            if (!dialog) return;
            const rect = dialog.getBoundingClientRect();
            const inside =
              event.clientX >= rect.left &&
              event.clientX <= rect.right &&
              event.clientY >= rect.top &&
              event.clientY <= rect.bottom;
            if (!inside) dialog.close();
          }}
        >
          <h2 id={titleId}>Źródła</h2>
          <p className="sources">
            Źródło:{" "}
            {items.map((item, index) => (
              <span key={item.href}>
                {index > 0 ? " · " : null}
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              </span>
            ))}
          </p>
          <form method="dialog">
            <button type="submit" className="sources-close">
              Zamknij
            </button>
          </form>
        </dialog>,
        document.body,
      )}
    </>
  );
}

export function App() {
  const [state, setState] = useState<FormState>(loadState);
  const [pdfError, setPdfError] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [override, setOverride] = useState<string | null>(() => localStorage.getItem(LETTER_KEY));
  const days = daysUntilDeadline();
  const notes = useMemo(() => warnings(state), [state]);
  const generated = useMemo(() => letterPlainText(buildLetter(state)), [state]);
  const letterText = override ?? generated;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (override === null) localStorage.removeItem(LETTER_KEY);
    else localStorage.setItem(LETTER_KEY, override);
  }, [override]);

  const patch = (partial: Partial<FormState>) => {
    setReady(false);
    setState((current) => ({ ...current, ...partial }));
  };

  const patchPoint = (
    id: string,
    partial: { enabled?: boolean; fieldId?: string; value?: string; included?: boolean },
  ) => {
    setReady(false);
    setState((current) => {
      const point = current.points[id];
      if (!point) return current;
      return {
        ...current,
        points: {
          ...current.points,
          [id]: {
            enabled: partial.enabled ?? point.enabled,
            fields:
              partial.fieldId === undefined || partial.value === undefined
                ? point.fields
                : { ...point.fields, [partial.fieldId]: partial.value },
            included:
              partial.fieldId === undefined || partial.included === undefined
                ? point.included
                : { ...point.included, [partial.fieldId]: partial.included },
          },
        },
      };
    });
  };

  const onDownload = async () => {
    if (!letterText.trim()) return;
    setBusy(true);
    setPdfError("");
    try {
      const { buildPdf, downloadPdf } = await import("./pdf");
      const bytes = await buildPdf(letterText, state.name);
      downloadPdf(bytes, state.name);
      setReady(true);
      document.getElementById("podpis")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      setPdfError(error instanceof Error ? error.message : "Nie udało się utworzyć PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <header className="mast">
        <p className="kicker">Konsultacje społeczne · Natura 2000 Zatoka Pucka PLB220005</p>
        <h1>Twoje uwagi do zakazów na Zatoce</h1>
        <p className="lede">
          Przy każdym pytaniu są cztery przykłady sprzeciwu. Przy wejściu każde pytanie dostaje inny wylosowany przykład.
          Możesz go przełączyć, poprawić albo napisać od nowa. Na dole jest całe pismo i tam też da
          się je poprawić przed pobraniem PDF. Przykład warto przepisać własnymi słowami: takie same
          pisma łatwo odłożyć na bok.
        </p>
        <p className={days === null ? "deadline over" : "deadline"}>
          {days === null
            ? `Termin z obwieszczenia minął ${DEADLINE_LABEL}.`
            : days === 0
              ? `Dziś ostatni dzień. Uwagi trzeba wysłać do ${DEADLINE_LABEL}.`
              : `Uwagi przyjmowane są do ${DEADLINE_LABEL}. Zostało ${days} ${days === 1 ? "dzień" : "dni"}.`}
        </p>
      </header>

      <ol className="steps" aria-label="Jak złożyć uwagi">
        <li>
          <span>i</span>
          <div>
            <strong>Około 15 minut</strong>
            <small>tyle trwa napisanie, podpis i wysyłka</small>
          </div>
        </li>
        <li>
          <span>1</span>
          <div>
            <strong>Napisz</strong>
            <small>własnymi słowami, pod numer załącznika</small>
          </div>
        </li>
        <li>
          <span>2</span>
          <div>
            <strong>Podpisz</strong>
            <small>podpisem zaufanym na gov.pl</small>
          </div>
        </li>
        <li>
          <span>3</span>
          <div>
            <strong>Wyślij</strong>
            <small>{EMAIL}</small>
          </div>
        </li>
      </ol>

      <main>
        <section className="card" aria-labelledby="kto">
          <div className="title-row">
            <h2 id="kto">Kto składa uwagi</h2>
            <SourcesButton items={IDENTITY_SOURCES} />
          </div>
          <p className="note">
            Obwieszczenie wymaga imienia i nazwiska albo nazwy podmiotu oraz adresu korespondencyjnego.
            Te dane zostają w tej przeglądarce. Nic nie wysyłamy na serwer.
          </p>
          <label>
            Imię i nazwisko albo nazwa szkoły, klubu lub firmy
            <input
              value={state.name}
              autoComplete="name"
              onChange={(event) => patch({ name: event.target.value })}
            />
          </label>
          <label>
            Adres korespondencyjny
            <textarea
              rows={2}
              value={state.address}
              autoComplete="street-address"
              placeholder="ul. Morska 1, 81-710 Rewa"
              onChange={(event) => patch({ address: event.target.value })}
            />
          </label>
          <div className="split">
            <label>
              Miejscowość przy dacie
              <input
                value={state.city}
                placeholder="Rewa"
                onChange={(event) => patch({ city: event.target.value })}
              />
            </label>
            <label>
              Data pisma
              <input
                type="date"
                value={state.date}
                onChange={(event) => patch({ date: event.target.value })}
              />
            </label>
          </div>
          <Field
            lead={ROLE_FIELD.lead}
            question={ROLE_FIELD.question}
            help={ROLE_FIELD.help}
            demos={ROLE_FIELD.demos}
            value={state.role}
            onChange={(value) => patch({ role: value })}
          />
        </section>

        {POINTS.map((point) => {
          const current = state.points[point.id];
          const enabled = current?.enabled ?? false;
          return (
            <section className={enabled ? "card on" : "card off"} key={point.id} aria-labelledby={point.id}>
              <div className="card-head">
                <div className="title-row">
                  <h2 id={point.id}>{point.title}</h2>
                  <SourcesButton items={point.sources} />
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(event) => patchPoint(point.id, { enabled: event.target.checked })}
                  />
                  Ten zapis mnie dotyczy
                </label>
              </div>
              <p className="label-line">{point.label}</p>
              <ul className="facts">
                {point.facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
              {enabled &&
                point.fields.map((field) => (
                  <Field
                    key={field.id}
                    lead={field.lead}
                    question={field.question}
                    help={field.help}
                    demos={field.demos}
                    value={current?.fields[field.id] ?? ""}
                    onChange={(value) => patchPoint(point.id, { fieldId: field.id, value })}
                    optional={field.optional}
                    included={current?.included[field.id] !== false}
                    onIncluded={(included) => patchPoint(point.id, { fieldId: field.id, included })}
                  />
                ))}
              {!enabled && (
                <p className="skipped">Ten punkt nie wejdzie do pisma. Lepiej go pominąć niż wpisać ogólnik.</p>
              )}
            </section>
          );
        })}

        <section className="card">
          <h2>Uwaga dodatkowa</h2>
          <p className="note">
            Opcjonalnie. Ten akapit wchodzi do pisma tak, jak go napiszesz. Jeśli dotyczy innego
            zapisu, wskaż załącznik i lp.
          </p>
          <textarea
            rows={5}
            value={state.extra}
            placeholder="Załącznik nr …, lp. …: sprzeciwiam się …, ponieważ …. Wnoszę o …."
            onChange={(event) => patch({ extra: event.target.value })}
          />
        </section>

        <section className="card preview" aria-labelledby="pismo">
          <h2 id="pismo">Pismo, które trafi do PDF</h2>
          <p className="note">
            Układa się z odpowiedzi powyżej i jest już pełnym sprzeciwem. Możesz je tutaj poprawić.
            Po ręcznej poprawce odpowiedzi z formularza go nie nadpiszą.
          </p>
          {override !== null && (
            <p className="note">
              To jest wersja poprawiona ręcznie.
              <button type="button" className="textish inline" onClick={() => setOverride(null)}>
                Ułóż ponownie z odpowiedzi
              </button>
            </p>
          )}
          {notes.length > 0 && (
            <ul className="notes">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
          <textarea
            className="letter-edit"
            aria-label="Treść pisma"
            rows={24}
            value={letterText}
            onChange={(event) => {
              const next = event.target.value;
              setOverride(next === generated ? null : next);
              setReady(false);
            }}
          />
          <button type="button" className="download" disabled={busy || !letterText.trim()} onClick={onDownload}>
            {busy ? "Tworzę PDF…" : "Pobierz PDF"}
          </button>
          {pdfError && <p className="pdf-error">{pdfError}</p>}
          <button
            type="button"
            className="textish"
            onClick={() => {
              if (!window.confirm("Wyczyścić wpisane uwagi z tej przeglądarki?")) return;
              localStorage.removeItem(STORAGE_KEY);
              localStorage.removeItem(LETTER_KEY);
              setOverride(null);
              setState(emptyState(todayIso()));
              setReady(false);
            }}
          >
            Wyczyść formularz
          </button>
        </section>

        <section className={ready ? "send show" : "send"} id="podpis" aria-labelledby="dalej">
          <h2 id="dalej">Podpis i wysyłka</h2>
          <p className="note">
            {ready
              ? "PDF jest pobrany. Zostały dwa kroki."
              : "Najpierw pobierz PDF. Potem podpisz plik i wyślij go na adres poniżej."}
          </p>

          <article className="action">
            <p className="step-no">Krok 2</p>
            <div className="title-row">
              <h3>Podpisz pobrany plik</h3>
              <SourcesButton items={SIGN_SOURCES} />
            </div>
            <a className="gov" href={SIGN_URL} target="_blank" rel="noreferrer">
              Podpisz dokument podpisem zaufanym
            </a>
            <p>
              Wejdź na gov.pl, wybierz pobrany PDF i podpisz go profilem zaufanym. Da się to potwierdzić
              w aplikacji mObywatel, w mniej niż minutę. Podpis kwalifikowany nie jest wymagany.
              Obwieszczenie dopuszcza też skan pisma podpisanego własnoręcznie.
            </p>
          </article>

          <article className="action email-action">
            <p className="step-no">Krok 3</p>
            <div className="title-row">
              <h3>Wyślij podpisany PDF</h3>
              <SourcesButton items={SEND_SOURCES} />
            </div>
            <div className="email-line">
              <p className="email">{EMAIL}</p>
              <CopyButton value={EMAIL} label="Kopiuj adres e-mail" />
            </div>
            <a
              className="copy huge"
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}`}
            >
              Otwórz e-mail z tytułem {EMAIL_SUBJECT}
            </a>
            <p>
              Dołącz podpisany PDF. Pismo papierowe można wysłać na {POSTAL.join(", ")}. Ustnie do
              protokołu w siedzibie fundacji, po zgłoszeniu: {ORAL_PHONE}.
            </p>
          </article>
        </section>

        <footer>
          <p>
            Fakty w pytaniach pochodzą z projektu planu ochrony z 22 października 2026 r. i z
            zarządzenia porządkowego nr 5 z 3 kwietnia 2014 r. Sprawdź źródło, zanim wyślesz pismo.
          </p>
          <ul>
            {FOOTER_SOURCES.map((item) => (
              <li key={item.href}>
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </main>
    </>
  );
}

function Field({
  lead,
  question,
  help,
  demos,
  value,
  onChange,
  optional = false,
  included = true,
  onIncluded,
}: {
  lead: string;
  question: string;
  help: string;
  demos: readonly [string, string, string, string];
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
  included?: boolean;
  onIncluded?: (included: boolean) => void;
}) {
  const id = `${lead}-${question}`.replace(/\s+/g, "-").slice(0, 80);
  return (
    <div className={optional && !included ? "field dim" : "field"}>
      {optional && (
        <label className="include">
          <input
            type="checkbox"
            checked={included}
            onChange={(event) => onIncluded?.(event.target.checked)}
          />
          <span>Dołącz ten wniosek do pisma</span>
        </label>
      )}
      <div className="ask">
        <label htmlFor={id}>{question}</label>
        <div className="demos" role="group" aria-label="Przykładowe wersje">
          {demos.map((demo, index) => (
            <button
              key={index}
              type="button"
              className={value === demo ? "demo on" : "demo"}
              onClick={() => onChange(demo)}
            >
              Demo {index + 1}
            </button>
          ))}
        </div>
      </div>
      <p className="stem">
        W piśmie: <span>{lead}</span> …
      </p>
      <textarea id={id} rows={6} value={value} onChange={(event) => onChange(event.target.value)} />
      <p className="help">
        {help} Kliknięcie demo podmienia tekst. Potem możesz go poprawić. Zacznij małą literą, to
        ciąg dalszy zdania.
      </p>
    </div>
  );
}
