/**
 * Turn the text lines of a bank statement into transactions.
 *
 * Supported: Chase, American Express and Discover — credit card and
 * checking/savings statements — plus a generic fallback that picks up any
 * "date … description … amount" row, so other banks often work too.
 *
 * Sign convention for every transaction, whatever the bank prints:
 *   amount > 0  money out (purchase, fee, interest, withdrawal)
 *   amount < 0  money in  (payment to a card, refund, deposit)
 *
 * Built from the banks' published statement layouts, not from a corpus of
 * real statements, so each bank's quirks are handled defensively: anything a
 * parser can't place is skipped rather than guessed.
 */
import { categorizeDetailed, merchantKey, merchantName } from './categorize';

const BANKS = {
  chase: { name: 'Chase', test: /\bchase\b|jpmorgan/i },
  amex: { name: 'American Express', test: /american\s+express|\bamex\b/i },
  discover: { name: 'Discover', test: /\bdiscover\b/i },
  usbank: { name: 'U.S. Bank', test: /u\.\s?s\.\s+bank\b|\busbank\b/i },
  // Recognised for labelling; their rows go through the generic parser.
  wellsfargo: { name: 'Wells Fargo', test: /wells\s+fargo/i },
  bofa: { name: 'Bank of America', test: /bank\s+of\s+america/i },
  capitalone: { name: 'Capital One', test: /capital\s+one/i },
  citi: { name: 'Citi', test: /\bcitibank\b|\bciti\s+(card|double|custom|premier|rewards)/i },
};

const MONTH_NAME = '(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?';

const MONTHS = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

const pad = n => String(n).padStart(2, '0');
const iso = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
const fullYear = y => (y < 100 ? 2000 + y : y);

function validDate(y, m, d) {
  return m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 1990 && y <= 2100;
}

/** "Sep 20 2025", "September 20, 2025", "09/20/25", "09/20/2025" -> {y,m,d} */
function parseLooseDate(str) {
  let m = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (m) return { y: fullYear(+m[3]), m: +m[1], d: +m[2] };
  m = str.match(/([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})/);
  if (m && MONTHS[m[1].toLowerCase()]) return { y: +m[3], m: MONTHS[m[1].toLowerCase()], d: +m[2] };
  return null;
}

/** Statement opening/closing dates, used to put a year on "MM/DD" rows. */
export function findPeriod(text) {
  const patterns = [
    // Discover: "OPEN TO CLOSE DATE: 05/07/2026 - 06/06/2026"
    /open\s+to\s+close\s+date\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})\s*[-–]\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
    // "Account Summary 05/07/2026 - 06/06/2026"
    /account\s+summary\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})\s*[-–]\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
    // Chase credit: "Opening/Closing Date 08/14/25 - 09/13/25"
    /opening\/closing\s+date\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})\s*[-–]\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
    // Chase checking: "September 14, 2025 through October 13, 2025"
    /([A-Z][a-z]+\.?\s+\d{1,2},?\s+\d{4})\s+(?:through|to|-|–)\s+([A-Z][a-z]+\.?\s+\d{1,2},?\s+\d{4})/,
    // Discover: "Open Date: Aug 21 2025 - Close Date: Sep 20 2025"
    /open\s+date\s*:?\s*([A-Za-z]{3,9}\.?\s+\d{1,2},?\s+\d{4})\s*[-–]?\s*close\s+date\s*:?\s*([A-Za-z]{3,9}\.?\s+\d{1,2},?\s+\d{4})/i,
    // Generic "Statement period 08/21/2025 - 09/20/2025" / "Billing Period: …"
    /(?:statement|billing)\s+period\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})\s*(?:-|–|to|through)\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      const a = parseLooseDate(m[1]);
      const b = parseLooseDate(m[2]);
      if (a && b) return { start: a, end: b };
    }
  }
  // Amex: "Closing Date 09/30/25" (opening is roughly a month earlier).
  const close = text.match(/closing\s+date\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i);
  if (close) {
    const b = parseLooseDate(close[1]);
    if (b) return { start: null, end: b };
  }
  return null;
}

// The issuing bank is named in the statement header, before any row can
// mention another bank ("Payment to Chase card" on a U.S. Bank statement), so
// the earliest mention wins.
function detectBank(text, fileName) {
  let best = 'other';
  let bestAt = Infinity;
  Object.entries(BANKS).forEach(([id, bank]) => {
    const m = text.match(bank.test);
    if (m && m.index < bestAt) {
      best = id;
      bestAt = m.index;
    }
  });
  if (best !== 'other') return best;
  const byName = Object.entries(BANKS).find(([, bank]) => bank.test.test(fileName || ''));
  return byName ? byName[0] : 'other';
}

function detectAccountType(text) {
  const debit =
    /(checking|savings)\s+(account|summary)|total\s+checking|beginning\s+balance|deposits\s*\/\s*credits|deposits\s+and\s+additions|atm\s*&\s*debit\s+card\s+withdrawals/i;
  const credit =
    /minimum\s+payment\s+due|credit\s+(limit|access\s+line)|new\s+balance|payment\s+due\s+date|purchase\s+interest|cash\s+advance/i;
  // Judge by the summary at the top: checking statements' fine print often
  // mentions "credit limit" (overdraft lines), which mustn't make them cards.
  const head = text.slice(0, 5000);
  if (/minimum\s+payment\s+due|payment\s+due\s+date/i.test(head)) return 'credit';
  if (debit.test(head) || /\b(checking|savings)\b/i.test(head)) return 'debit';
  if (credit.test(head)) return 'credit';
  if (debit.test(text)) return 'debit';
  return 'credit';
}

const CARD_NAMES = [
  /sapphire\s+(preferred|reserve)/i,
  /freedom\s+(unlimited|flex)/i,
  /\bfreedom\b/i,
  /ink\s+business\s+\w+/i,
  /amazon\s+prime\s+(rewards\s+)?visa/i,
  /prime\s+visa/i,
  /(united|southwest|marriott\s+bonvoy|ihg|disney|aeroplan)\s+[\w\s]{0,20}?card/i,
  /total\s+checking/i,
  /\b(student|premier|smartly|easy|essential|silver|gold|platinum|standard|elite|interest)\s+(checking|savings)\b/i,
  /premier\s+plus\s+checking/i,
  /chase\s+savings/i,
  /(platinum|gold|green)\s+card/i,
  /blue\s+cash\s+(everyday|preferred)/i,
  /delta\s+skymiles\s+\w+/i,
  /hilton\s+honors\s*\w*/i,
  /amazon\s+business\s+\w+/i,
  /discover\s+it(\s+(miles|chrome|student|secured))?/i,
  /cashback\s+debit/i,
];

function detectCardName(text) {
  const head = text.slice(0, 6000);
  for (const re of CARD_NAMES) {
    const m = head.match(re);
    if (m) {
      return m[0]
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
    }
  }
  return '';
}

function detectLast4(text) {
  const head = text.slice(0, 6000);
  // First "Account number …" that is actually followed by digits (the label
  // and the number are sometimes in different columns).
  const labelled = [
    ...head.matchAll(/account\s+(?:number|ending)(?:\s+in)?\s*:?\s*([\dx*•\s-]{4,25})/gi),
  ].find(x => x[1].replace(/\D/g, '').length >= 4);
  const m =
    labelled ||
    head.match(/((?:x{4}|\*{4})[\s-]*(?:x{4}|\*{4})[\s-]*(?:x{4}|\*{4})[\s-]*\d{4})/i) ||
    head.match(/account\s+ending\s+in\s+(\d{4,6})/i);
  if (!m) return '';
  const digits = m[1].replace(/\D/g, '');
  return digits.length >= 4 ? digits.slice(-4) : '';
}

// A money amount: 1,234.56  -1,234.56  $1,234.56  -$1,234.56  ($12.00)  12.00 CR
// A cell that ends in an amount ("$54.31", or "Payments and Credits -$120.00"
// when two columns sit too close to split).
const TRAILING_AMOUNT_RE =
  /(?:^|\s)(\(?[-+]?\s?\$?\s?[-+]?\d{1,3}(?:,\d{3})*\.\d{2}-?\)?(?:\s?CR)?)$/i;
const AMOUNT_RE = /(\(?-?\s?\$?\s?-?\d{1,3}(?:,\d{3})*\.\d{2}(?:-(?![\d]))?\)?(?:\s?CR\b)?)/gi;

function toNumber(raw) {
  const neg = /^\(|-|CR$/i.test(raw.trim()); // "-12.00", "(12.00)", "12.00-", "12.00 CR"
  const n = parseFloat(raw.replace(/[^\d.]/g, ''));
  return neg ? -n : n;
}

/** Leading date on a row: "08/15", "08/15/25", "08/15/2025", optional trailing "*". */
/** …or "Aug 28" / "Sep 1, 2026" (U.S. Bank and others). */
const ROW_DATE_RE = new RegExp(
  `^\\s*(?:(\\d{1,2})\\/(\\d{1,2})(?:\\/(\\d{2,4}))?|${MONTH_NAME}\\s+(\\d{1,2})(?:,?\\s+(\\d{4}))?)\\*?\\s+`,
  'i'
);

function rowDate(dm) {
  if (dm[1]) return { month: +dm[1], day: +dm[2], year: dm[3] ? fullYear(+dm[3]) : null };
  return {
    month: MONTHS[dm[4].slice(0, 3).toLowerCase()],
    day: +dm[5],
    year: dm[6] ? +dm[6] : null,
  };
}

// Lines under a transaction row that carry more of its description (U.S. Bank
// puts "PAYROLL" and debit-card merchants there) — but not headers or totals.
const NOT_CONTINUATION =
  /^(date\b|total\b|subtotal\b|card\s+number|card\s+\d{4}\s+withdrawals|page\s+\d|balance|beginning|ending|deposits|withdrawals|other\s+withdrawals|card\s+withdrawals|checks|fees|interest|daily|this\s+page|continued)/i;

// Reference numbers and IDs that only add noise to a description.
const NOISE_RE =
  /\b(ref\s*[=#]\s*\S+|pmt\s+id=\S+|serial\s+no\.?\s*\S+|on\s+\d{2}\/\d{2}\/\d{2,4}|on\s+\d{6})\b|\b\d{9,}\b/gi;

function yearFor(month, period) {
  if (!period) return new Date().getFullYear();
  const { end } = period;
  // Activity exports run up to the day they were downloaded, so no row can be
  // later than that: a later month is last year.
  if (period.reference) return month > end.m ? end.y - 1 : end.y;
  // A statement covers ~1 month: a month later than the closing month belongs
  // to the previous year (December rows on a January statement).
  return month > end.m + 1 ? end.y - 1 : end.y;
}

/**
 * For activity exports with no statement period ("Discover-RecentActivity-
 * 20261002.pdf"): the export date, from the file name or a date printed near
 * the top, anchors the year of "MM/DD" rows.
 */
function findReferenceDate(text, fileName) {
  const f = (fileName || '').match(/(20\d{2})[-_.]?(\d{2})[-_.]?(\d{2})(?!\d)/);
  if (f && validDate(+f[1], +f[2], +f[3])) return { y: +f[1], m: +f[2], d: +f[3] };
  const head = text.slice(0, 4000);
  const labelled = head.match(
    /(?:as\s+of|printed(?:\s+on)?|generated(?:\s+on)?|downloaded(?:\s+on)?|report\s+date|date)\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{4}|[A-Za-z]{3,9}\.?\s+\d{1,2},?\s+\d{4})/i
  );
  if (labelled) return parseLooseDate(labelled[1]);
  // Otherwise the latest full date near the top.
  const all = [...head.matchAll(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g)]
    .map(m => ({ y: +m[3], m: +m[1], d: +m[2] }))
    .filter(d => validDate(d.y, d.m, d.d))
    .sort((a, b) => b.y - a.y || b.m - a.m || b.d - a.d);
  return all[0] || null;
}

// Lines that look like rows but are summaries, headers or year-to-date totals.
const SKIP_ROW =
  /\btotals?\s+(fees|interest|charges|payments|credits|purchases|deposits|withdrawals|checks|activity|for\s+this\s+period|\w+\s+charged)\b|\b(beginning|ending|new|previous)\s+balance\b|balance\s+forward|minimum\s+payment|year[-\s]to[-\s]date|annual\s+percentage\s+rate|credit\s+limit|available\s+credit|payment\s+due\s+date/i;

const PAYMENT_RE =
  /payment\s*(received|thank\s*you)|thank\s*you|autopay|auto\s*pay|automatic\s+payment|online\s+payment|internet\s+payment|mobile\s+payment|epayment|e-payment|directpay/i;
const INTEREST_RE =
  /interest\s+charge|interest\s+charged|purchase\s+interest|cash\s+advance\s+interest/i;
const FEE_RE =
  /late\s+fee|annual\s+(membership\s+)?fee|membership\s+fee|foreign\s+(transaction\s+)?fee|cash\s+advance\s+fee|balance\s+transfer\s+fee|returned\s+payment\s+fee|overdraft|nsf\s+fee|monthly\s+service\s+fee|service\s+charge|atm\s+fee|wire\s+fee/i;
const CARD_PAYMENT_RE =
  /payment\s+to\s+chase\s+card|chase\s+credit\s+crd|amex\s+epayment|american\s+express\s+ach|discover\s+e-?payment|credit\s+card\s+payment|card\s*services?\s+payment|citi\s+card|capital\s+one\s+(crcardpmt|mobile\s+pmt)|applecard|bank\s+of\s+america\s+credit\s+card/i;
const TRANSFER_RE =
  /online\s+transfer|transfer\s+(to|from)|zelle|venmo|cash\s*app|paypal\s+transfer|wire\s+(in|out)|book\s+transfer|ach\s+(credit|debit)\s+transfer/i;
const INCOME_RE = /payroll|direct\s+dep|salary|dir\s+dep|paycheck|irs\s+treas|tax\s+ref/i;
const CASH_RE = /\batm\b.*(withdrawal|w\/d)|cash\s+withdrawal/i;
const LEADING_FEE_RE = /^fee\b/i;
const BALANCE_REFUND_RE = /credit\s+balance\s+refund|refund\s+of\s+credit\s+balance/i;
const REWARD_RE =
  /cash\s*back\s+(bonus\s+)?(redemption|reward|credit)|cashback\s+bonus|rewards?\s+(redemption|credit)|points?\s+redemption|statement\s+credit\s+-?\s*(reward|points)/i;

function classify(description, amount, accountType) {
  if (accountType === 'credit') {
    if (amount < 0) {
      if (PAYMENT_RE.test(description)) return 'payment';
      if (REWARD_RE.test(description)) return 'reward';
      return 'refund';
    }
    if (INTEREST_RE.test(description)) return 'interest';
    if (FEE_RE.test(description)) return 'fee';
    // The card sending you back a credit balance raises the balance but is
    // not spending.
    if (BALANCE_REFUND_RE.test(description)) return 'adjustment';
    return 'purchase';
  }
  if (amount > 0) {
    if (FEE_RE.test(description) || LEADING_FEE_RE.test(description)) return 'fee';
    if (CARD_PAYMENT_RE.test(description)) return 'card_payment';
    if (TRANSFER_RE.test(description)) return 'transfer';
    if (CASH_RE.test(description)) return 'cash';
    return 'purchase';
  }
  if (INCOME_RE.test(description)) return 'income';
  if (TRANSFER_RE.test(description)) return 'transfer';
  if (/refund|return|revers/i.test(description)) return 'refund';
  return 'deposit';
}

// Discover prints its own merchant category at the end of each row.
const DISCOVER_CATEGORIES = [
  'Restaurants',
  'Supermarkets',
  'Gasoline',
  'Merchandise',
  'Travel/ Entertainment',
  'Travel/Entertainment',
  'Services',
  'Medical Services',
  'Department Stores',
  'Home Improvement',
  'Education',
  'Government Services',
  'Automotive',
  'Warehouse Clubs',
  'Payments and Credits',
  'Awards and Rebate Credits',
  'Fees',
  'Interest',
  'Other/Miscellaneous',
  'Miscellaneous',
  'Gas Stations',
  'Wholesale Clubs',
  'Grocery Stores',
  'Drug Stores',
  'Utilities',
  'Online Shopping',
];

function stripDiscoverCategory(description) {
  for (const c of DISCOVER_CATEGORIES) {
    const re = new RegExp(`\\s+${c.replace(/[/]/g, '\\/').replace(/\s+/g, '\\s*')}$`, 'i');
    if (re.test(description)) return { description: description.replace(re, ''), bankCategory: c };
  }
  return { description, bankCategory: '' };
}

/**
 * Parse one statement.
 * @param {string[]} lines  text lines from readPdfLines
 * @param {string} fileName
 */
export function parseStatement(lines, fileName = '') {
  const text = lines.join('\n');
  const bank = detectBank(text, fileName);
  const accountType = detectAccountType(text);
  let period = findPeriod(text);
  if (!period) {
    const ref = findReferenceDate(text, fileName);
    if (ref) period = { start: null, end: ref, reference: true };
  }
  const cardName = detectCardName(text);
  const last4 = detectLast4(text);
  const bankName = BANKS[bank]?.name || 'Other bank';
  // "Discover It" already names the bank; don't print "Discover Discover It".
  const showBank = !cardName || !cardName.toLowerCase().startsWith(bankName.toLowerCase());
  const label = [
    showBank && bankName,
    cardName || (accountType === 'debit' ? 'Checking' : 'Card'),
    last4 && `••${last4}`,
  ]
    .filter(Boolean)
    .join(' ');

  // Checking statements list withdrawals as negatives already; we flip to the
  // money-out-positive convention. Card statements print charges positive.
  const flip = accountType === 'debit';

  const transactions = [];
  const seen = new Set();
  let guessedYears = false;
  let section = '';

  lines.forEach((rawLine, idx) => {
    const line = rawLine.replace(/\s+/g, ' ').trim();

    // Daily-balance tables ("Aug 28 2,422.72 Sep 3 2,203.30 …") look like rows.
    if (
      /^(daily\s+)?(ending\s+)?balance\s+summary\b|^daily\s+(ending\s+)?balances?\b/i.test(line)
    ) {
      section = 'balances';
      return;
    }

    // Track section headers: they disambiguate the sign on checking statements
    // that print withdrawals as positive numbers in their own section.
    if (
      /^(deposits\s+and\s+additions|deposits|credits|payments\s+and\s+(other\s+)?credits|other\s+deposits)\b/i.test(
        line
      )
    )
      section = 'in';
    else if (
      /^(atm\s*&\s*debit\s+card\s+withdrawals|electronic\s+withdrawals|other\s+withdrawals|card\s+withdrawals|withdrawals|checks\s+paid|checks|fees|purchases?|new\s+charges)\b/i.test(
        line
      )
    )
      section = 'out';

    const dm = line.match(ROW_DATE_RE);

    // Amex interest/fee rows have no date: "Interest Charge on Purchases $12.34".
    if (!dm) {
      if (bank === 'amex' && /^interest\s+charge\s+on/i.test(line) && period) {
        const amounts = line.match(AMOUNT_RE);
        const value = amounts ? toNumber(amounts[amounts.length - 1]) : 0;
        if (value > 0) {
          transactions.push(
            makeTxn(
              iso(period.end.y, period.end.m, period.end.d),
              line.replace(AMOUNT_RE, '').trim(),
              value,
              'interest',
              label,
              accountType,
              ''
            )
          );
        }
      }
      return;
    }
    if (SKIP_ROW.test(line) || section === 'balances') return;

    const { month, day, year: printedYear } = rowDate(dm);
    const year = printedYear || yearFor(month, period);
    if (!printedYear && !period) guessedYears = true;
    if (!validDate(year, month, day)) return;

    const rest = line.slice(dm[0].length);
    const amounts = rest.match(AMOUNT_RE);
    if (!amounts) return;

    // Card rows have one amount column. Use the PDF's column gaps to take the
    // first cell that is purely an amount, so text printed beside the table
    // (Discover's Cashback Bonus box: "REDEEMED THIS PERIOD -$0.00") can't be
    // mistaken for it. Checking rows end "amount balance": second-to-last.
    let rawAmount;
    let description;
    let columnCategory = '';
    const cells = rawLine
      .trim()
      .split(/\s{3,}/)
      .map(c => c.trim());
    const amountCell = cells.findIndex((c, i) => i > 0 && TRAILING_AMOUNT_RE.test(c));
    if (accountType === 'credit' && amountCell > 0) {
      const m = cells[amountCell].match(TRAILING_AMOUNT_RE);
      rawAmount = m[1];
      const lead = cells[amountCell].slice(0, cells[amountCell].length - m[0].length).trim();
      const first = `${cells[0]} `.replace(ROW_DATE_RE, '').trim();
      const middle = [first, ...cells.slice(1, amountCell), lead].filter(Boolean);
      // Discover: "date | merchant | MERCHANT CATEGORY | amount"
      if (bank === 'discover' && middle.length >= 2) columnCategory = middle.pop();
      description = middle.join(' ');
    } else {
      if (accountType === 'debit' && amounts.length >= 2) rawAmount = amounts[amounts.length - 2];
      else rawAmount = amounts[amounts.length - 1];
      description = rest.slice(0, rest.lastIndexOf(rawAmount)).replace(AMOUNT_RE, ' ');
    }
    const value = toNumber(rawAmount);
    if (!value || Math.abs(value) > 1e7) return;
    description = description.replace(AMOUNT_RE, ' ').replace(/\s+/g, ' ').trim();
    // Some layouts wrap the merchant onto the next line (Amex): borrow it when
    // this row's description is too thin to be useful.
    if (description.length < 3 && lines[idx + 1] && !ROW_DATE_RE.test(lines[idx + 1])) {
      description = lines[idx + 1].replace(AMOUNT_RE, ' ').replace(/\s+/g, ' ').trim();
    }
    if (flip) {
      // Checking statements wrap details onto the next line(s).
      const extra = [];
      for (let k = idx + 1; k < lines.length && extra.length < 2; k += 1) {
        const next = lines[k].replace(/\s+/g, ' ').trim();
        if (
          !next ||
          ROW_DATE_RE.test(next) ||
          NOT_CONTINUATION.test(next) ||
          AMOUNT_RE.test(next)
        ) {
          AMOUNT_RE.lastIndex = 0;
          break;
        }
        extra.push(next);
      }
      const more = extra.join(' ').replace(NOISE_RE, ' ').replace(/\s+/g, ' ').trim();
      description = description.replace(NOISE_RE, ' ').replace(/\s+/g, ' ').trim();
      // U.S. Bank debit-card rows: the merchant is on the next line.
      if (/^debit\s+purchase/i.test(description) && more) {
        description =
          `${more} · ${description.replace(/^debit\s+purchase\s*-?\s*(visa|mastercard)?\s*/i, '')}`.trim();
      } else if (more) {
        description = `${description} ${more}`;
      }
    }
    if (!description) return;

    let bankCategory = columnCategory;
    if (bank === 'discover' && !bankCategory) {
      ({ description, bankCategory } = stripDiscoverCategory(description));
    }

    let amount;
    if (flip) {
      // Printed negative = withdrawal. Printed positive: trust the section.
      if (value < 0) amount = -value;
      else amount = section === 'out' ? value : -value;
    } else {
      amount = value;
    }

    const kind = classify(description, amount, accountType);
    const date = iso(year, month, day);
    const dupKey = `${date}|${description}|${amount}|${idx}`;
    if (seen.has(dupKey)) return;
    seen.add(dupKey);
    transactions.push(makeTxn(date, description, amount, kind, label, accountType, bankCategory));
  });

  const warnings = [];
  if (!transactions.length) {
    warnings.push(
      bank === 'other'
        ? 'No transactions found. Supported: Chase, American Express, Discover and U.S. Bank statements.'
        : `No transactions found in this ${bankName} statement. The layout may have changed — please report it.`
    );
  } else if (!period && guessedYears) {
    warnings.push(
      'No statement period or date found in this file, so the year of each MM/DD date was assumed to be this year.'
    );
  }

  const dates = transactions.map(t => t.date).sort();
  return {
    fileName,
    bank,
    bankName,
    accountType,
    cardName,
    last4,
    label,
    periodStart: period?.start
      ? iso(period.start.y, period.start.m, period.start.d)
      : dates[0] || '',
    periodEnd:
      period?.end && !period.reference
        ? iso(period.end.y, period.end.m, period.end.d)
        : dates[dates.length - 1] || '',
    transactions,
    warnings,
  };
}

function makeTxn(date, description, amount, kind, account, accountType, bankCategory) {
  const { category, source } = categorizeDetailed(description, kind, bankCategory);
  return {
    date,
    description,
    amount: Math.round(amount * 100) / 100,
    kind,
    account,
    accountType,
    merchant: merchantName(description),
    merchantKey: merchantKey(description),
    bankCategory: bankCategory || '',
    category,
    categorySource: source,
  };
}
