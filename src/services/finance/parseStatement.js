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
import { categorize, merchantKey, merchantName } from './categorize';

const BANKS = {
  chase: { name: 'Chase', test: /\bchase\b|jpmorgan/i },
  amex: { name: 'American Express', test: /american\s+express|\bamex\b/i },
  discover: { name: 'Discover', test: /\bdiscover\b/i },
};

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

function detectBank(text, fileName) {
  const head = text.slice(0, 4000);
  for (const [id, bank] of Object.entries(BANKS)) {
    if (bank.test.test(head)) return id;
  }
  for (const [id, bank] of Object.entries(BANKS)) {
    if (bank.test.test(text) || bank.test.test(fileName || '')) return id;
  }
  return 'other';
}

function detectAccountType(text) {
  const debit =
    /(checking|savings)\s+(account|summary)|total\s+checking|beginning\s+balance|deposits\s+and\s+additions|atm\s*&\s*debit\s+card\s+withdrawals/i;
  const credit =
    /minimum\s+payment\s+due|credit\s+(limit|access\s+line)|new\s+balance|payment\s+due\s+date|purchase\s+interest|cash\s+advance/i;
  if (credit.test(text)) return 'credit';
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
  const m =
    head.match(/account\s+(?:number|ending)(?:\s+in)?\s*:?\s*([\dx*•\s-]{4,25})/i) ||
    head.match(/((?:x{4}|\*{4})[\s-]*(?:x{4}|\*{4})[\s-]*(?:x{4}|\*{4})[\s-]*\d{4})/i) ||
    head.match(/account\s+ending\s+in\s+(\d{4,6})/i);
  if (!m) return '';
  const digits = m[1].replace(/\D/g, '');
  return digits.length >= 4 ? digits.slice(-4) : '';
}

// A money amount: 1,234.56  -1,234.56  $1,234.56  -$1,234.56  ($12.00)  12.00 CR
const AMOUNT_RE = /(\(?-?\s?\$?\s?-?\d{1,3}(?:,\d{3})*\.\d{2}\)?(?:\s?CR\b)?)/gi;

function toNumber(raw) {
  const neg = /^\(|-|CR$/i.test(raw.trim());
  const n = parseFloat(raw.replace(/[^\d.]/g, ''));
  return neg ? -n : n;
}

/** Leading date on a row: "08/15", "08/15/25", "08/15/2025", optional trailing "*". */
const ROW_DATE_RE = /^\s*(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\*?\s+/;

function yearFor(month, period) {
  if (!period) return new Date().getFullYear();
  const { end } = period;
  // A statement covers ~1 month: a month later than the closing month belongs
  // to the previous year (December rows on a January statement).
  return month > end.m + 1 ? end.y - 1 : end.y;
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

function classify(description, amount, accountType) {
  if (accountType === 'credit') {
    if (amount < 0) return PAYMENT_RE.test(description) ? 'payment' : 'refund';
    if (INTEREST_RE.test(description)) return 'interest';
    if (FEE_RE.test(description)) return 'fee';
    return 'purchase';
  }
  if (amount > 0) {
    if (FEE_RE.test(description)) return 'fee';
    if (CARD_PAYMENT_RE.test(description)) return 'card_payment';
    if (TRANSFER_RE.test(description)) return 'transfer';
    if (CASH_RE.test(description)) return 'cash';
    return 'purchase';
  }
  if (INCOME_RE.test(description)) return 'income';
  if (TRANSFER_RE.test(description)) return 'transfer';
  if (/refund|return|reversal/i.test(description)) return 'refund';
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
  const period = findPeriod(text);
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
  let section = '';

  lines.forEach((rawLine, idx) => {
    const line = rawLine.replace(/\s+/g, ' ').trim();

    // Track section headers: they disambiguate the sign on checking statements
    // that print withdrawals as positive numbers in their own section.
    if (
      /^(deposits\s+and\s+additions|deposits|credits|payments\s+and\s+(other\s+)?credits)\b/i.test(
        line
      )
    )
      section = 'in';
    else if (
      /^(atm\s*&\s*debit\s+card\s+withdrawals|electronic\s+withdrawals|other\s+withdrawals|withdrawals|checks\s+paid|fees|purchases?|new\s+charges)\b/i.test(
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
    if (SKIP_ROW.test(line)) return;

    const month = +dm[1];
    const day = +dm[2];
    const year = dm[3] ? fullYear(+dm[3]) : yearFor(month, period);
    if (!validDate(year, month, day)) return;

    const rest = line.slice(dm[0].length);
    const amounts = rest.match(AMOUNT_RE);
    if (!amounts) return;

    // Checking rows end "amount balance": take the second-to-last figure.
    // Card rows end with just the amount.
    let rawAmount;
    if (accountType === 'debit' && amounts.length >= 2) rawAmount = amounts[amounts.length - 2];
    else rawAmount = amounts[amounts.length - 1];
    const value = toNumber(rawAmount);
    if (!value || Math.abs(value) > 1e7) return;

    let description = rest.slice(0, rest.lastIndexOf(rawAmount)).replace(AMOUNT_RE, ' ');
    description = description.replace(/\s+/g, ' ').trim();
    // Some layouts wrap the merchant onto the next line (Amex): borrow it when
    // this row's description is too thin to be useful.
    if (description.length < 3 && lines[idx + 1] && !ROW_DATE_RE.test(lines[idx + 1])) {
      description = lines[idx + 1].replace(AMOUNT_RE, ' ').replace(/\s+/g, ' ').trim();
    }
    if (!description) return;

    let bankCategory = '';
    if (bank === 'discover') ({ description, bankCategory } = stripDiscoverCategory(description));

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
        ? 'No transactions found. Is this a Chase, American Express or Discover statement?'
        : `No transactions found in this ${bankName} statement. The layout may have changed — please report it.`
    );
  } else if (!period) {
    warnings.push('Could not find the statement period; years were guessed for MM/DD dates.');
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
    periodEnd: period?.end
      ? iso(period.end.y, period.end.m, period.end.d)
      : dates[dates.length - 1] || '',
    transactions,
    warnings,
  };
}

function makeTxn(date, description, amount, kind, account, accountType, bankCategory) {
  return {
    date,
    description,
    amount: Math.round(amount * 100) / 100,
    kind,
    account,
    accountType,
    merchant: merchantName(description),
    merchantKey: merchantKey(description),
    category: categorize(description, kind, bankCategory),
  };
}
