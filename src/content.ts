export const DEADLINE_LABEL = "13 listopada 2026";
export const DEADLINE_ISO = "2026-11-13T23:59:59+01:00";

export const EMAIL = "zarzad@nfos.org.pl";
export const EMAIL_SUBJECT = "Zatoka Pucka";
export const SIGN_URL =
  "https://www.gov.pl/web/gov/podpisz-dokument-elektronicznie-wykorzystaj-podpis-zaufany";

export const POSTAL = [
  "Narodowa Fundacja Ochrony Środowiska",
  "ul. Erazma Ciołka 13",
  "01-445 Warszawa",
];

export const ORAL_PHONE = "602 33 80 91";

export const PLAN_PAGE =
  "https://www.umgdy.gov.pl/fundusz_europejski/opracowanie-projektow-planow-dla-obszarow-natura-2000-bedacych-pod-nadzorem-urzedu-morskiego-w-gdyni/";

export const ORDINANCE_PDF =
  "https://www.umgdy.gov.pl/wp-content/uploads/2017/06/PO_5_2014.pdf";

export const ANNOUNCEMENT_PDF =
  "https://www.umgdy.gov.pl/wp-content/uploads/2024/09/Obwieszczenie-o-wylozeniu-projektu-planu-ochrony-Zatoka-Pucka_F.pdf";

const ANNEX_3 = "/dokumenty/zalacznik-3.pdf";
const ANNEX_5 = "/dokumenty/zalacznik-5.pdf";
const ANNEX_6 = "/dokumenty/zalacznik-6.pdf";
const ANNEX_8 = "/dokumenty/zalacznik-8.pdf";
const PLAN_UPDATE = "/dokumenty/aktualizacja-planu.pdf";
const DRAFT_REGULATION = "/dokumenty/rozporzadzenie.pdf";

export type Source = { label: string; href: string };

function pdf(href: string, page?: number): string {
  return page ? `${href}#page=${page}` : href;
}

export const IDENTITY_SOURCES: Source[] = [
  { label: "Obwieszczenie o wyłożeniu (PDF, str. 1)", href: pdf(ANNOUNCEMENT_PDF, 1) },
];

export const SIGN_SOURCES: Source[] = [
  { label: "Obwieszczenie, podpis uwag (PDF, str. 2)", href: pdf(ANNOUNCEMENT_PDF, 2) },
];

export const SEND_SOURCES: Source[] = [
  { label: "Obwieszczenie, adres i termin (PDF, str. 1)", href: pdf(ANNOUNCEMENT_PDF, 1) },
];

export const FOOTER_SOURCES: Source[] = [
  { label: "Obwieszczenie o wyłożeniu (PDF)", href: ANNOUNCEMENT_PDF },
  { label: "Projekt rozporządzenia (PDF)", href: DRAFT_REGULATION },
  { label: "Załącznik nr 3 (PDF)", href: ANNEX_3 },
  { label: "Załącznik nr 5 (PDF)", href: ANNEX_5 },
  { label: "Załącznik nr 6 (PDF)", href: ANNEX_6 },
  { label: "Załącznik nr 8 (PDF)", href: ANNEX_8 },
  { label: "Aktualizacja planu ochrony, 22 października 2026 (PDF)", href: PLAN_UPDATE },
  { label: "Zarządzenie porządkowe nr 5/2014 (PDF)", href: ORDINANCE_PDF },
  { label: "Strona Urzędu Morskiego w Gdyni", href: PLAN_PAGE },
];

export type Field = {
  id: string;
  lead: string;
  question: string;
  help: string;
  /** When true, the author can leave this paragraph out of the letter. */
  optional?: boolean;
  demos: readonly [string, string, string, string];
};

export type Point = {
  id: string;
  title: string;
  label: string;
  citation: string;
  facts: string[];
  defaultOn: boolean;
  sources: Source[];
  fields: Field[];
};

export const ROLE_FIELD: Field = {
  id: "role",
  lead: "Składam uwagi jako",
  question: "Kim jesteś przy Zatoce i jak z niej korzystasz?",
  help: "To pierwsze zdanie pisma. Zostaw swój sport, miejsce i to, czy pływasz, uczysz, czy startujesz. Przykład jest do poprawienia.",
  demos: [
    "osoba korzystająca ze sportów wodnych na Zatoce Puckiej. Sprzeciwiam się zapisom, które zamykają tę wodę dla sportów bez silnika.",
    "osoba pływająca po Zatoce Puckiej. Uwagi dotyczą zakazów ruchu rekreacyjnego w miejscach używanych przez sporty wiatrowe.",
    "użytkownik Zatoki Puckiej. Wnioski dotyczą przepisów, które ograniczają kitesurfing, windsurfing i podobne sporty.",
    "osoba uprawiająca sporty wodne na Zatoce Puckiej.",
  ],
};

export const POINTS: Point[] = [
  {
    id: "ryf",
    title: "Ryf Mew i pas 500 m",
    label: "Załącznik nr 5, lp. 3. Rybitwia Mielizna / Ryf Mew i ujście Płutnicy",
    citation:
      "Załącznik nr 5, lp. 3 (Rybitwia Mielizna / Ryf Mew oraz akwen przy ujściu Płutnicy). Projekt wyłącza ten obszar z ruchu turystycznego i rekreacyjnego od 1 marca do 31 października. Zbliżenie się na mniej niż 500 m zostawia służbom ratowniczym, służbom ochrony przyrody, organom kontrolnym i osobom prowadzącym badania. Ruch jednostek, w tym jachtów, łodzi motorowych, kajaków, kitesurfingu i windsurfingu, a także zatrzymywanie się i kotwiczenie w odległości 500 m, są niedozwolone. Nie ma wyjątku dla jednostek szkoleniowych, sędziowskich i asekuracyjnych. Zostaje dopuszczenie wydarzeń okazjonalnych typu „Marsz Śledzia” na Ryf Mew.",
    facts: [
      "Dziś obowiązuje zarządzenie porządkowe nr 5 Dyrektora Urzędu Morskiego w Gdyni z 3 kwietnia 2014 r. (Dz. Urz. Woj. Pomorskiego poz. 1416). § 2 ust. 4 pkt 3 zamyka część Rybitwiej Mielizny od 1 lipca do 31 października. Strefa ma 2 mile morskie długości i 2 kable szerokości, czyli około 3,7 km na 370 m.",
      "§ 2 ust. 9 pkt 1 tego zarządzenia wyłącza z zakazów jednostki oznaczone jako szkoleniowe, sędziowskie i asekuracyjne oraz działania ratujące życie i służby.",
      "Projekt przesuwa początek zakazu na 1 marca i dokłada pas 500 m, w którym nie wolno płynąć, zatrzymać się ani kotwiczyć. Ten sam lp. 3 obejmuje ujście Płutnicy.",
      "Zapis o Ryf Mew jest w projekcie zadaniem opcjonalnym: zależy od tego, czy powstanie rezerwat z lp. 5.",
    ],
    defaultOn: true,
    sources: [
      { label: "Załącznik nr 5, lp. 3 (PDF, str. 5)", href: pdf(ANNEX_5, 5) },
      { label: "Zarządzenie porządkowe nr 5/2014, § 2 (PDF, str. 2)", href: pdf(ORDINANCE_PDF, 2) },
    ],
    fields: [
      {
        id: "because",
        lead: "Sprzeciwiam się temu zapisowi, ponieważ",
        question:
          "Dlaczego ten zakaz jest za szeroki na wodzie, z której korzystasz?",
        help: "Napisz o swoim miejscu, o miesiącach przed 1 lipca, kiedy woda jest dziś otwarta, i o łodzi szkoleniowej, jeśli z niej korzystasz. Przykład podmień na swój brzeg.",
        demos: [
          "zakaz od 1 marca do 31 października i pas 500 m są szersze niż dzisiejsze zamknięcie od 1 lipca. Zapis obejmuje też ujście Płutnicy i nie zostawia wyjątku dla jednostek szkoleniowych oraz asekuracyjnych.",
          "przesunięcie zakazu na 1 marca zamyka wodę, która dziś jest otwarta przez wiosnę. Dopuszczenie „Marszu Śledzia” nie zastępuje zwykłego pływania.",
          "pas 500 m przez osiem miesięcy jest dalej idący niż obowiązująca strefa o szerokości 2 kabli. Zapis jest przy tym zadaniem opcjonalnym, zależnym od rezerwatu.",
          "zakaz od marca i pas 500 m są za szerokie wobec zasad obowiązujących dziś.",
        ],
      },
      {
        id: "request",
        lead: "Wnoszę o",
        question: "Czego dokładnie żądasz zamiast tego zapisu?",
        help: "Konkret: jaki okres, jaki pas, jaki wyjątek albo jaki korytarz dla sportów bez silnika. Ten wniosek można wyłączyć.",
        optional: true,
        demos: [
          "utrzymanie zakazu od 1 lipca do 31 października, w granicach z zarządzenia z 2014 r.",
          "przywrócenie wyjątku dla jednostek szkoleniowych i asekuracyjnych oraz o krótszy okres zakazu.",
          "węższy pas ochronny i pozostawienie wody otwartej przed 1 lipca.",
          "pozostawienie dzisiejszego zakazu, od 1 lipca do 31 października.",
        ],
      },
    ],
  },
  {
    id: "rezerwat",
    title: "Rezerwat na Ryf Mew",
    label: "Załącznik nr 5, lp. 5. Rezerwat przyrody „Ryf Mew”",
    citation:
      "Załącznik nr 5, lp. 5. W ciągu 3 lat od przyjęcia planu ma powstać rezerwat przyrody „Ryf Mew”, oznakowany bojami z informacją o zakazie przebywania jednostek pływających i ludzi na jego obszarze. Działanie jest opisane jako stałe. Projekt nie wskazuje miesięcy, w których zakaz miałby ustawać. Zostaje dopuszczenie wydarzeń okazjonalnych typu „Marsz Śledzia”. Obszar rezerwatu to mielizny i łachy opisane współrzędnymi w załączniku, bez osobno wpisanego pasa 500 m.",
    facts: [
      "Zakaz dotyczy przebywania ludzi i jednostek na obszarze rezerwatu, nie tylko żeglugi w sezonie.",
      "Projekt nie wpisuje dat początku i końca tego zakazu. W przeciwieństwie do lp. 3 nie ma tu widełek „od 1 marca do 31 października”.",
      "Pas 500 m z lp. 3 nie jest powtórzony przy rezerwacie. Rezerwat i sezonowy pas 500 m to dwa osobne zapisy.",
    ],
    defaultOn: true,
    sources: [{ label: "Załącznik nr 5, lp. 5 (PDF, str. 9)", href: pdf(ANNEX_5, 9) }],
    fields: [
      {
        id: "because",
        lead: "Sprzeciwiam się temu zapisowi, ponieważ",
        question:
          "Dlaczego stały zakaz przebywania na Ryf Mew, bez wpisanego sezonu, jest dla Ciebie nie do przyjęcia?",
        help: "Zostań przy tym, co projekt mówi: rezerwat w ciągu 3 lat i zakaz ludzi oraz jednostek na jego obszarze, bez wpisanych miesięcy. Napisz, co tracisz.",
        demos: [
          "rezerwat ma powstać w ciągu 3 lat i zakazać ludzi oraz jednostek na swoim obszarze, a projekt nie wpisuje miesięcy, w których ten zakaz miałby ustawać.",
          "zakaz bez dat początku i końca odcina Ryf Mew na stałe. Wydarzenie okazjonalne nie zastępuje sezonu, w którym można tam być.",
          "rezerwat bez wpisanego sezonu idzie dalej niż sezonowy zakaz z lp. 3.",
          "zakaz przebywania na Ryf Mew nie ma wpisanego końca.",
        ],
      },
      {
        id: "request",
        lead: "Wnoszę o",
        question: "Jaki model ochrony proponujesz zamiast całkowitego zakazu?",
        help: "Sezon, sektor albo inne rozwiązanie zamiast zakazu bez dat. Ten wniosek można wyłączyć z pisma.",
        optional: true,
        demos: [
          "ochronę sezonową, ograniczoną do miesięcy, w których ptaki zajmują łachy.",
          "zamknięcie miejsc lęgowych i pozostawienie sektora dla jednostek bez silnika.",
          "wpisanie dat, w których zakaz obowiązuje i w których ustaje.",
          "zakaz sezonowy zamiast zakazu bez dat.",
        ],
      },
    ],
  },
  {
    id: "hel",
    title: "Hel: plaża i 500 m wody",
    label: "Załącznik nr 5, lp. 2. Plaża od portu wojennego w Helu do Ośrodka Prezydenckiego",
    citation:
      "Załącznik nr 5, lp. 2. Plaża i przyległe wydmy od portu wojennego w Helu (54.613536, 18.778931) w kierunku Ośrodka Prezydenckiego (54.632209, 18.769107) mają być wyłączone z ruchu turystycznego i rekreacyjnego od 1 marca do 31 października. Zbliżenie się na mniej niż 500 m oraz ruch jednostek, zatrzymywanie się i kotwiczenie w odległości 500 m są niedozwolone. Wyjątek obejmuje służby ratownicze, służby ochrony przyrody, organy kontrolne i badania naukowe.",
    facts: [
      "Zakaz obejmuje plażę od strony zatoki i pas wody 500 m od wyznaczonego obszaru, przez osiem miesięcy.",
      "W tym lp. nie ma wyjątku dla łodzi szkoleniowych ani dla wydarzeń typu „Marsz Śledzia”.",
      "Oznakowanie bojami i tablicami ma powstać w ciągu dwóch lat od przyjęcia planu.",
    ],
    defaultOn: false,
    sources: [{ label: "Załącznik nr 5, lp. 2 (PDF, str. 3)", href: pdf(ANNEX_5, 3) }],
    fields: [
      {
        id: "because",
        lead: "Sprzeciwiam się temu zapisowi, ponieważ",
        question:
          "Jak korzystasz z plaży helskiej od strony zatoki albo z pasa wody przy niej i co ten zakaz Ci zabiera?",
        help: "Zostaw ten punkt włączony tylko wtedy, gdy ten odcinek jest Twoją wodą albo dojściem do niej.",
        demos: [
          "zapis zamyka plażę i 500 m wody od 1 marca do 31 października, bez wyjątku dla sportów wiatrowych.",
          "osiem miesięcy zakazu jest szersze niż okres, w którym ptaki zajmują ten brzeg.",
          "w tym lp. nie ma wyjątku dla dojścia na wodę ani dla jednostek szkoleniowych.",
          "zakaz plaży i 500 m wody przez osiem miesięcy jest za szeroki.",
        ],
      },
      {
        id: "request",
        lead: "Wnoszę o",
        question: "Jaki dostęp do tej plaży i wody powinien zostać?",
        help: "Krótszy okres, samo miejsce lęgowe albo korytarz wejścia na wodę. Ten wniosek można wyłączyć.",
        optional: true,
        demos: [
          "skrócenie zakazu do okresu, w którym ptaki zajmują plażę.",
          "korytarz wejścia na wodę dla sportów wiatrowych.",
          "zamknięcie miejsca lęgowego zamiast całego pasa 500 m.",
          "krótszy zakaz i dojście do wody.",
        ],
      },
    ],
  },
  {
    id: "brzeg",
    title: "Pas 200 m od brzegu",
    label: "Załącznik nr 3, lp. 5. Obiekty w pasie 200 m od linii brzegu",
    citation:
      "Załącznik nr 3, lp. 5. Warunek 2 nakazuje nielokalizowanie nowych obiektów budowlanych w strefie o szerokości 200 m od linii brzegu Zatoki Puckiej, z wyjątkiem infrastruktury technicznej (w tym tymczasowej i niezwiązanej trwale z gruntem, z wyłączeniem obiektów małej architektury drewnianej). Przy istniejącej zabudowie nie wolno przybliżać linii zabudowy do brzegu. Warunek 3 nakazuje kontrolę legalności istniejącego zagospodarowania, w tym tymczasowych obiektów usługowych, niedopuszczanie do ich legalizacji i dążenie do likwidacji nielegalnego zagospodarowania. Warunek 6 nakazuje nielokalizowanie nowych kąpielisk, pomostów i innych obiektów służących rekreacji na terenach dotąd nieprzeznaczonych na ten cel.",
    facts: [
      "Projekt nie używa słów „namiot”, „wiata” ani „kontener”. Mówi o nowych obiektach budowlanych, także tymczasowych i niezwiązanych trwale z gruntem.",
      "Wyjątek jest wąski: infrastruktura techniczna. Z tego wyjątku wyłączono obiekty małej architektury drewnianej.",
      "Osobno projekt każe badać legalność istniejących obiektów tymczasowych i nie doprowadzać do ich legalizacji.",
    ],
    defaultOn: false,
    sources: [{ label: "Załącznik nr 3, lp. 5 (PDF, str. 2)", href: pdf(ANNEX_3, 2) }],
    fields: [
      {
        id: "because",
        lead: "Sprzeciwiam się temu zapisowi, ponieważ",
        question:
          "Jak ten pas 200 m uderza w bazę, szkółkę albo zaplecze, z którego naprawdę korzystasz?",
        help: "Napisz o zapleczu, z którego naprawdę korzystasz. Projekt nie używa słów „namiot”, „wiata” ani „kontener”.",
        demos: [
          "zakaz w pasie 200 m obejmuje także obiekty tymczasowe, niezwiązane trwale z gruntem. Sezonowe zaplecze sportów wodnych traci wtedy miejsce przy wodzie.",
          "z wyjątku dla infrastruktury technicznej wyłączono małą architekturę drewnianą, a istniejące obiekty tymczasowe mają nie być legalizowane.",
          "osobny warunek zamyka nowe obiekty rekreacji na terenach dotąd nieprzeznaczonych na ten cel.",
          "pas 200 m zamyka sezonowe zaplecze sportów wodnych.",
        ],
      },
      {
        id: "request",
        lead: "Wnoszę o",
        question: "Jakie obiekty w pasie 200 m powinny zostać dopuszczone?",
        help: "Nazwij rodzaj obiektu. Ten wniosek można wyłączyć.",
        optional: true,
        demos: [
          "dopuszczenie sezonowego zaplecza sportów wodnych, bez nowej zabudowy stałej.",
          "wyłączenie dla obiektów tymczasowych, zabieranych po sezonie.",
          "utrzymanie obiektów, które już służą sportom wodnym i nie są zabudową stałą.",
          "zgodę na sezonowe zaplecze w pasie 200 m.",
        ],
      },
    ],
  },
  {
    id: "presja",
    title: "Licznik presji",
    label: "Załącznik nr 8, lp. 1 i aktualizacja planu. Wskaźnik presji rekreacyjnej",
    citation:
      "Załącznik nr 8, lp. 1 oraz aktualizacja planu ochrony z 22 października 2026 r. Wskaźnik presji rekreacyjnej liczy osoby i jednostki w promieniu 1000 m od punktu obserwacyjnego. W dokumentacji planu 1 osoba albo jednostka albo ich brak to presja niska lub jej brak, 2–5 to presja średnia, a powyżej 5 to presja duża. Załącznik nr 6 używa tego wskaźnika przy ocenie gatunków jako „niskiej presji rekreacyjnej” i nie powtarza skali liczbowej. Presja całego obszaru jest wysoka (ocena U2), gdy niska presja albo jej brak występuje na mniej niż 20% punktów. Metoda z załącznika nr 8: 31 punktów, obserwacja przez 15 minut, plaża i pas wody 1000 m, liczenie osób oraz jednostek klasyfikowanych co najmniej jako windsurfing, kitesurfing, SUP, kajak i inne. Kontrole w godzinach 10:00–18:00, co 2 tygodnie, przed weekendem i w weekend, cykl co 3 lata.",
    facts: [
      "Próg „powyżej 5” jest w aktualizacji planu: więcej niż 5 osób albo jednostek w promieniu 1000 m to presja duża w danym punkcie. Załącznik nr 6 mówi o niskiej presji i nie powtarza tej skali.",
      "Punkty stoją wzdłuż brzegu, w tym w Rewie, Chałupach, Kuźnicy, Jastarni i na Helu, oraz trzy na Ryf Mew.",
      "Aktualizacja planu podaje, że na 2026 r. wskaźnik oceniono metodą ekspercką, bo nie było systematycznych danych o liczbie ludzi i jednostek.",
    ],
    defaultOn: true,
    sources: [
      { label: "Załącznik nr 8, metoda liczenia (PDF, str. 1)", href: pdf(ANNEX_8, 1) },
      { label: "Aktualizacja planu, punkty monitoringu (PDF, str. 314)", href: pdf(PLAN_UPDATE, 314) },
      { label: "Aktualizacja planu, skala presji (PDF, str. 316)", href: pdf(PLAN_UPDATE, 316) },
      { label: "Aktualizacja planu, ocena ekspercka (PDF, str. 54)", href: pdf(PLAN_UPDATE, 54) },
      { label: "Załącznik nr 6, wskaźnik przy gatunkach (PDF)", href: ANNEX_6 },
    ],
    fields: [
      {
        id: "because",
        lead: "Uważam ten wskaźnik za wadliwy, ponieważ",
        question:
          "Dlaczego próg „więcej niż 5 w pasie kilometra” nie opisuje presji w miejscu, w którym pływasz?",
        help: "Zostań przy metodzie z projektu: 15 minut, 1000 m, próg powyżej 5. Napisz, ilu ludzi jest na Twojej wodzie w zwykły dzień.",
        demos: [
          "próg powyżej 5 osób albo jednostek w pasie 1000 m nazywa wysoką presją zwykłe pływanie w kilka osób.",
          "15 minut obserwacji i próg powyżej 5 nie odróżniają kilku desek od tłoku. Ocena na 2026 r. była ekspercka, bo liczeń nie było.",
          "przy tym progu prawie każdy punkt wypada jako presja wysoka, a od tego zależy ocena całego obszaru.",
          "więcej niż 5 osób w promieniu kilometra to za niski próg.",
        ],
      },
      {
        id: "request",
        lead: "Wnoszę o",
        question: "Jak ten wskaźnik powinien zostać zmieniony?",
        help: "Inny próg, inny promień albo warunek prawdziwych liczeń. Ten wniosek można wyłączyć.",
        optional: true,
        demos: [
          "odrzucenie progu powyżej 5 osób lub jednostek.",
          "skalę opartą na liczeniach z sezonu, zanim posłuży do zakazów.",
          "osobne liczenie sportów bez silnika.",
          "wyższy próg i prawdziwe liczenia.",
        ],
      },
    ],
  },
  {
    id: "zawody",
    title: "Regaty i zawody",
    label: "Załącznik nr 3, lp. 16. Zgody na imprezy sportowe i regaty",
    citation:
      "Załącznik nr 3, lp. 16. Przy wydawaniu zgód na organizację imprez sportowych i regat na akwenie natężenie ruchu rekreacyjnego (motorowodnego i żeglarskiego) ma być odnoszone do progów wskaźników presji rekreacyjnej określonych dla poszczególnych grup ptaków.",
    facts: [
      "Zapis nie wymienia z nazwy King of the Bay ani Kite Wing Cup. Mówi o zgodach na imprezy sportowe i regaty.",
      "Progi, do których zgoda ma być porównywana, opisuje aktualizacja planu i załącznik nr 8, w tym próg powyżej 5 osób albo jednostek.",
      "Ruch w zdaniu projektu jest nazwany motorowodnym i żeglarskim. Deski wlicza sam wskaźnik presji, który klasyfikuje windsurfing, kitesurfing, SUP i kajak.",
    ],
    defaultOn: true,
    sources: [
      { label: "Załącznik nr 3, lp. 16 (PDF, str. 9)", href: pdf(ANNEX_3, 9) },
      { label: "Załącznik nr 8, klasyfikacja jednostek (PDF, str. 1)", href: pdf(ANNEX_8, 1) },
      { label: "Aktualizacja planu, skala presji (PDF, str. 316)", href: pdf(PLAN_UPDATE, 316) },
    ],
    fields: [
      {
        id: "because",
        lead: "Sprzeciwiam się temu zapisowi, ponieważ",
        question:
          "Których zawodów to dotyczy u Ciebie i dlaczego zgoda nie powinna zależeć od tego licznika?",
        help: "Wpisz nazwę imprezy tylko wtedy, gdy naprawdę w niej jesteś. Punkt można wyłączyć, jeśli zawody Cię nie dotyczą.",
        demos: [
          "zgoda na imprezę sportową nie może zależeć od progu, przy którym kilka jednostek oznacza już presję wysoką.",
          "zapis odnosi zgodę do progów presji, w tym progu powyżej 5. Przy takim progu zgoda pada, zanim flota wypłynie.",
          "wskaźnik wlicza też deski, więc sam start regat przekracza próg wysokiej presji.",
          "zawody nie powinny zależeć od progu powyżej 5 jednostek.",
        ],
      },
      {
        id: "request",
        lead: "Wnoszę o",
        question: "Na jakiej zasadzie zawody powinny dostawać zgodę?",
        help: "Na przykład regulamin i uzgodnienie ze służbami. Ten wniosek można wyłączyć.",
        optional: true,
        demos: [
          "zgody na podstawie regulaminu bezpieczeństwa i uzgodnienia ze służbami.",
          "wyłączenie uzgodnionych imprez spod automatycznego progu presji.",
          "zgodę po uzgodnieniu akwenu i terminu, niezależnie od progu powyżej 5.",
          "zgodę na regaty bez progu powyżej 5 jednostek.",
        ],
      },
    ],
  },
  {
    id: "proporcje",
    title: "Sport bez silnika a jednostki motorowe",
    label: "Załącznik nr 5, lp. 2 i lp. 3 oraz załącznik nr 3, lp. 14",
    citation:
      "Załącznik nr 5, lp. 2 i lp. 3, czytane łącznie z załącznikiem nr 3, lp. 14, oraz z opisem zagrożeń G01.01.01 (motorowe sporty wodne) i G01.01.02 (niemotorowe sporty wodne) w dokumentacji planu. Lp. 14 proponuje dla jednostek motorowych strefy ograniczonej prędkości albo okresowe ograniczenie ruchu w rejonach Ryf Mew, Cypla Rewskiego, Rybitwiej Mielizny i ujścia Redy, a w marcu–lipcu także przy koloniach rybitw i mew. Lp. 2 i lp. 3 wprowadzają zakaz ruchu, w tym kitesurfingu i windsurfingu, w pasie 500 m od 1 marca do 31 października.",
    facts: [
      "W pasie 500 m zakaz obejmuje także łodzie motorowe. Nie pisz, że skutery wodne nie mają tam żadnego zakazu.",
      "Osobny warunek dla jednostek motorowych, w załączniku nr 3 lp. 14, jest inny: strefa ograniczonej prędkości albo ograniczenie okresowe, nie utrata całego sezonu poza tymi strefami.",
      "Dokumentacja planu, w części o turystyce, stwierdza, że szybkie jednostki pływające, szczególnie skutery wodne, wywołują panikę wśród stad ptaków bardziej niż jednostki niezmotoryzowane.",
      "Dziś zarządzenie z 2014 r. już zakazuje ślizgu motorówkom przy brzegu (§ 2 ust. 6) i wyłącza z zakazów łodzie szkoleniowe oraz asekuracyjne (§ 2 ust. 9 pkt 1). Projekt tego wyłączenia nie powtarza.",
    ],
    defaultOn: true,
    sources: [
      { label: "Załącznik nr 5, lp. 2 (PDF, str. 3)", href: pdf(ANNEX_5, 3) },
      { label: "Załącznik nr 5, lp. 3 (PDF, str. 5)", href: pdf(ANNEX_5, 5) },
      { label: "Załącznik nr 3, lp. 14 (PDF, str. 6)", href: pdf(ANNEX_3, 6) },
      { label: "Aktualizacja planu, skutery wodne (PDF, str. 126)", href: pdf(PLAN_UPDATE, 126) },
      { label: "Zarządzenie porządkowe nr 5/2014, § 2 (PDF, str. 2)", href: pdf(ORDINANCE_PDF, 2) },
    ],
    fields: [
      {
        id: "because",
        lead: "Uważam te zapisy za nieproporcjonalne, ponieważ",
        question:
          "Na czym polega dysproporcja, którą widzisz na własnej wodzie?",
        help: "Zestaw miejsce, którego potrzebuje deska, ze strefą prędkości dla silnika. W pasie 500 m silnik też jest zakazany. Tego nie odwracaj.",
        demos: [
          "lp. 2 i lp. 3 zamykają sportom bez silnika pas 500 m na osiem miesięcy. Dla jednostek motorowych osobny warunek, lp. 14, to głównie ograniczenie prędkości albo ograniczenie okresowe.",
          "w pasie 500 m silnik też jest zakazany. Poza tym pasem deska traci miejsce, a szybka jednostka zostaje z limitem prędkości. Dokumentacja sama wskazuje, że skutery płoszą ptaki bardziej.",
          "projekt nie powtarza dzisiejszego wyjątku dla łodzi szkoleniowych i asekuracyjnych, a jednostkom motorowym zostawia łagodniejsze narzędzie.",
          "deska dostaje zakaz miejsca, a silnik poza pasem 500 m dostaje limit prędkości.",
        ],
      },
      {
        id: "request",
        lead: "Wnoszę o",
        question: "Jakie rozróżnienie między deską a silnikiem powinno trafić do planu?",
        help: "Korytarz albo sezon dla deski i ostrzejsza zasada tam, gdzie dokumentacja wskazuje silnik. Ten wniosek można wyłączyć.",
        optional: true,
        demos: [
          "utrzymanie miejsc dla sportów bez silnika i ostrzejsze ograniczenie prędkości jednostek motorowych.",
          "przywrócenie wyjątku dla łodzi szkoleniowych i asekuracyjnych.",
          "korytarze dla sportów wiatrowych oraz limit prędkości dla jednostek motorowych przy skupiskach ptaków.",
          "ten sam ciężar ograniczeń dla deski i dla silnika.",
        ],
      },
    ],
  },
];

export function daysUntilDeadline(now = new Date()): number | null {
  const today = todayIso(now);
  const deadline = DEADLINE_ISO.slice(0, 10);
  if (today > deadline) return null;
  const start = Date.parse(`${today}T00:00:00Z`);
  const end = Date.parse(`${deadline}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000);
}

export function todayIso(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${pick("year")}-${pick("month")}-${pick("day")}`;
}

export function formatPolishDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const months = [
    "stycznia",
    "lutego",
    "marca",
    "kwietnia",
    "maja",
    "czerwca",
    "lipca",
    "sierpnia",
    "września",
    "października",
    "listopada",
    "grudnia",
  ];
  const day = Number(match[3]);
  const month = months[Number(match[2]) - 1] ?? match[2];
  return `${day} ${month} ${match[1]} r.`;
}
