/**
 * Assessment of parsed statement transactions: spending breakdown, per-card
 * comparison, insights & flags, and reward-card recommendations.
 *
 * "Spend" = purchases + fees + interest + cash withdrawals, minus refunds.
 * Payments to cards, transfers and income are tracked but never counted as
 * spend, so uploading a checking statement alongside the card it pays off
 * doesn't double count.
 */

const SPEND_KINDS = new Set(['purchase', 'fee', 'interest', 'cash']);
export const isSpend = t => SPEND_KINDS.has(t.kind);

const round2 = n => Math.round(n * 100) / 100;
const monthOf = date => date.slice(0, 7);

function median(nums) {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

/** Net spend contribution of a transaction (refunds count against spend). */
function spendValue(t) {
  if (isSpend(t)) return t.amount;
  if (t.kind === 'refund') return t.amount; // negative
  return 0;
}

function breakdown(transactions, keyFn) {
  const map = new Map();
  transactions.forEach(t => {
    const v = spendValue(t);
    if (!v) return;
    const k = keyFn(t);
    const row = map.get(k) || { name: k, total: 0, count: 0 };
    row.total += v;
    if (isSpend(t)) row.count += 1;
    map.set(k, row);
  });
  return [...map.values()]
    .map(r => ({ ...r, total: round2(r.total) }))
    .filter(r => r.total > 0.004)
    .sort((a, b) => b.total - a.total);
}

function accountsSummary(transactions, statements) {
  const map = new Map();
  statements.forEach(s => {
    const row = map.get(s.label) || {
      account: s.label,
      bank: s.bankName,
      accountType: s.accountType,
      statements: 0,
      from: s.periodStart,
      to: s.periodEnd,
      spend: 0,
      refunds: 0,
      paymentsIn: 0,
      interest: 0,
      fees: 0,
      income: 0,
      count: 0,
      categories: new Map(),
    };
    row.statements += 1;
    if (s.periodStart && (!row.from || s.periodStart < row.from)) row.from = s.periodStart;
    if (s.periodEnd && (!row.to || s.periodEnd > row.to)) row.to = s.periodEnd;
    map.set(s.label, row);
  });
  transactions.forEach(t => {
    const row = map.get(t.account);
    if (!row) return;
    row.count += 1;
    if (isSpend(t)) {
      row.spend += t.amount;
      row.categories.set(t.category, (row.categories.get(t.category) || 0) + t.amount);
    }
    if (t.kind === 'refund') row.refunds += -t.amount;
    if (t.kind === 'payment') row.paymentsIn += -t.amount;
    if (t.kind === 'interest') row.interest += t.amount;
    if (t.kind === 'fee') row.fees += t.amount;
    if (t.kind === 'income' || t.kind === 'deposit') row.income += -t.amount;
  });
  return [...map.values()]
    .map(r => {
      const top = [...r.categories.entries()].sort((a, b) => b[1] - a[1])[0];
      return {
        account: r.account,
        bank: r.bank,
        accountType: r.accountType,
        statements: r.statements,
        from: r.from,
        to: r.to,
        spend: round2(r.spend - r.refunds),
        refunds: round2(r.refunds),
        paymentsIn: round2(r.paymentsIn),
        interest: round2(r.interest),
        fees: round2(r.fees),
        income: round2(r.income),
        count: r.count,
        topCategory: top ? top[0] : '—',
      };
    })
    .sort((a, b) => b.spend - a.spend);
}

function monthlyTrend(transactions, accounts) {
  const months = new Map();
  transactions.forEach(t => {
    const v = spendValue(t);
    if (!v) return;
    const m = monthOf(t.date);
    const row = months.get(m) || { month: m };
    row[t.account] = round2((row[t.account] || 0) + v);
    months.set(m, row);
  });
  return [...months.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(row => {
      accounts.forEach(a => {
        if (row[a] === undefined) row[a] = 0;
      });
      return row;
    });
}

// ---------------------------------------------------------------- insights

function findDuplicates(transactions) {
  const purchases = transactions.filter(t => t.kind === 'purchase');
  const out = [];
  const used = new Set();
  for (let i = 0; i < purchases.length; i += 1) {
    for (let j = i + 1; j < purchases.length; j += 1) {
      const a = purchases[i];
      const b = purchases[j];
      if (used.has(j)) continue;
      if (
        a.account === b.account &&
        a.merchantKey === b.merchantKey &&
        a.amount === b.amount &&
        Math.abs(daysBetween(a.date, b.date)) <= 1
      ) {
        out.push({ first: a, second: b });
        used.add(j);
      }
    }
  }
  return out;
}

// Everyday spending repeats too, but isn't a subscription.
const NOT_SUBSCRIPTIONS = new Set([
  'Dining',
  'Groceries',
  'Gas',
  'Transportation',
  'Shopping',
  'Cash',
]);

function findRecurring(transactions) {
  const groups = new Map();
  transactions
    .filter(t => t.kind === 'purchase' && !NOT_SUBSCRIPTIONS.has(t.category))
    .forEach(t => {
      const g = groups.get(t.merchantKey) || [];
      g.push(t);
      groups.set(t.merchantKey, g);
    });
  const out = [];
  groups.forEach(list => {
    const months = new Set(list.map(t => monthOf(t.date)));
    if (months.size < 2) return;
    const amounts = list.map(t => t.amount);
    const med = median(amounts);
    // Subscriptions charge (nearly) the same amount each time.
    const steady = amounts.filter(a => Math.abs(a - med) <= Math.max(1, med * 0.1));
    if (steady.length < 2 || steady.length < list.length * 0.6) return;
    const perMonth = steady.length / months.size;
    if (perMonth > 1.5) return; // frequent shopping, not a subscription
    out.push({
      merchant: list[0].merchant,
      category: list[0].category,
      amount: round2(med),
      months: months.size,
      yearly: round2(med * 12),
      account: list[list.length - 1].account,
    });
  });
  return out.sort((a, b) => b.yearly - a.yearly);
}

function findSpikes(transactions) {
  const byCat = new Map();
  transactions
    .filter(t => t.kind === 'purchase')
    .forEach(t => {
      const g = byCat.get(t.category) || [];
      g.push(t.amount);
      byCat.set(t.category, g);
    });
  return transactions
    .filter(t => {
      if (t.kind !== 'purchase') return false;
      const peers = byCat.get(t.category) || [];
      if (peers.length < 4) return t.amount >= 1000;
      return t.amount >= 250 && t.amount >= median(peers) * 4;
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);
}

function buildInsights(transactions, accounts, recurring, duplicates, spikes) {
  const flags = [];
  const interest = accounts.reduce((s, a) => s + a.interest, 0);
  const fees = accounts.reduce((s, a) => s + a.fees, 0);
  if (interest > 0) {
    const worst = accounts
      .filter(a => a.interest > 0)
      .map(a => `${a.account} ($${a.interest.toFixed(2)})`);
    flags.push({
      level: 'danger',
      title: `You paid $${interest.toFixed(2)} in interest`,
      detail: `On ${worst.join(', ')}. Paying the full statement balance each month avoids interest entirely.`,
    });
  }
  if (fees > 0) {
    const feeRows = transactions.filter(t => t.kind === 'fee');
    const foreign = feeRows
      .filter(t => /foreign/i.test(t.description))
      .reduce((s, t) => s + t.amount, 0);
    const late = feeRows.filter(t => /late/i.test(t.description)).reduce((s, t) => s + t.amount, 0);
    const parts = [];
    if (late)
      parts.push(`$${late.toFixed(2)} in late fees — set up autopay for at least the minimum`);
    if (foreign)
      parts.push(
        `$${foreign.toFixed(2)} in foreign transaction fees — use a no-FX-fee card abroad`
      );
    flags.push({
      level: 'warning',
      title: `You paid $${fees.toFixed(2)} in fees`,
      detail: parts.length
        ? `${parts.join('; ')}.`
        : 'Check whether these fees can be waived or avoided.',
    });
  }
  if (duplicates.length) {
    flags.push({
      level: 'warning',
      title: `${duplicates.length} possible duplicate charge${duplicates.length > 1 ? 's' : ''}`,
      detail: duplicates
        .slice(0, 5)
        .map(
          d =>
            `${d.first.merchant} $${d.first.amount.toFixed(2)} on ${d.first.date} and ${d.second.date}`
        )
        .join('; '),
    });
  }
  if (recurring.length) {
    const yearly = recurring.reduce((s, r) => s + r.yearly, 0);
    flags.push({
      level: 'info',
      title: `${recurring.length} recurring charge${recurring.length > 1 ? 's' : ''} ≈ $${yearly.toFixed(0)}/year`,
      detail: `Review subscriptions you no longer use: ${recurring
        .slice(0, 6)
        .map(r => `${r.merchant} ($${r.amount.toFixed(2)})`)
        .join(', ')}.`,
    });
  }
  if (spikes.length) {
    flags.push({
      level: 'info',
      title: `${spikes.length} unusually large purchase${spikes.length > 1 ? 's' : ''}`,
      detail: spikes
        .slice(0, 5)
        .map(t => `${t.merchant} $${t.amount.toFixed(2)} (${t.date})`)
        .join('; '),
    });
  }
  return flags;
}

// --------------------------------------------------------- recommendations

/**
 * Reward cards to compare against. Rates are the issuers' published earn rates
 * as of 2026 (points valued at 1¢); they change — verify before applying.
 * `rates` keys are our categories; `other` is the base rate.
 */
export const CARD_CATALOG = [
  { name: 'Citi Double Cash', issuer: 'Citi', fee: 0, rates: { other: 2 } },
  { name: 'Wells Fargo Active Cash', issuer: 'Wells Fargo', fee: 0, rates: { other: 2 } },
  {
    name: 'Chase Freedom Unlimited',
    issuer: 'Chase',
    fee: 0,
    rates: { Dining: 3, Health: 3, other: 1.5 },
  },
  {
    name: 'Capital One Savor',
    issuer: 'Capital One',
    fee: 0,
    rates: { Dining: 3, Groceries: 3, Entertainment: 3, 'Streaming & Subscriptions': 3, other: 1 },
  },
  {
    name: 'Amex Blue Cash Preferred',
    issuer: 'American Express',
    fee: 95,
    rates: { Groceries: 6, 'Streaming & Subscriptions': 6, Gas: 3, Transportation: 3, other: 1 },
    caps: { Groceries: 6000 },
  },
  {
    name: 'Amex Gold Card',
    issuer: 'American Express',
    fee: 325,
    rates: { Dining: 4, Groceries: 4, Travel: 3, other: 1 },
    caps: { Groceries: 25000 },
  },
  {
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    fee: 95,
    rates: { Dining: 3, 'Streaming & Subscriptions': 3, Travel: 2, other: 1 },
  },
  {
    name: 'Citi Custom Cash',
    issuer: 'Citi',
    fee: 0,
    custom: 'topCategory5', // 5% on the top category up to $500/month, 1% else
    rates: { other: 1 },
  },
];

const NON_REWARD = new Set(['Fees & Interest', 'Cash', 'Housing']);

function annualRewards(card, annualByCat) {
  let total = 0;
  if (card.custom === 'topCategory5') {
    const [topCat, topAmt] = Object.entries(annualByCat).sort((a, b) => b[1] - a[1])[0] || [];
    Object.entries(annualByCat).forEach(([cat, amt]) => {
      if (cat === topCat) {
        const boosted = Math.min(amt, 6000);
        total += boosted * 0.05 + (amt - boosted) * 0.01;
      } else total += amt * 0.01;
    });
    return { gross: total, bestFor: topCat && topAmt ? topCat : '' };
  }
  // "Best for" = the category where this card earns the most over its base rate.
  let bestFor = '';
  let bestBonus = 0;
  Object.entries(annualByCat).forEach(([cat, amt]) => {
    const rate = card.rates[cat] ?? card.rates.other;
    const cap = card.caps?.[cat];
    const boosted = cap ? Math.min(amt, cap) : amt;
    total += (boosted * rate + (amt - boosted) * card.rates.other) / 100;
    const bonus = (boosted * (rate - card.rates.other)) / 100;
    if (bonus > bestBonus) {
      bestBonus = bonus;
      bestFor = cat;
    }
  });
  return { gross: total, bestFor };
}

function recommendCards(transactions) {
  const purchases = transactions.filter(
    t => (t.kind === 'purchase' || t.kind === 'refund') && t.accountType === 'credit'
  );
  const pool = purchases.length ? purchases : transactions.filter(t => t.kind === 'purchase');
  if (!pool.length) return null;
  const dates = pool.map(t => t.date).sort();
  const days = Math.max(28, daysBetween(dates[0], dates[dates.length - 1]) + 1);
  const scale = 365 / days;
  const annualByCat = {};
  pool.forEach(t => {
    if (NON_REWARD.has(t.category)) return;
    annualByCat[t.category] = (annualByCat[t.category] || 0) + t.amount * scale;
  });
  Object.keys(annualByCat).forEach(k => {
    if (annualByCat[k] <= 0) delete annualByCat[k];
  });
  const annualSpend = Object.values(annualByCat).reduce((s, v) => s + v, 0);
  if (annualSpend <= 0) return null;
  const baseline = annualSpend * 0.01;
  const cards = CARD_CATALOG.map(card => {
    const { gross, bestFor } = annualRewards(card, annualByCat);
    return {
      ...card,
      annualRewards: Math.round(gross),
      net: Math.round(gross - card.fee),
      vsBaseline: Math.round(gross - card.fee - baseline),
      bestFor,
    };
  }).sort((a, b) => b.net - a.net);
  return {
    annualSpend: Math.round(annualSpend),
    basedOnDays: days,
    baseline: Math.round(baseline),
    annualByCategory: Object.entries(annualByCat)
      .map(([name, total]) => ({ name, total: Math.round(total) }))
      .sort((a, b) => b.total - a.total),
    cards: cards.slice(0, 4),
  };
}

// ---------------------------------------------------------------- main

/**
 * @param {Array} statements parseStatement results (each with .transactions)
 */
export function analyze(statements) {
  const transactions = statements
    .flatMap(s => s.transactions)
    .sort((a, b) => a.date.localeCompare(b.date));
  const accounts = accountsSummary(transactions, statements);
  const accountNames = accounts.map(a => a.account);
  const spend = transactions.reduce((s, t) => s + spendValue(t), 0);
  const recurring = findRecurring(transactions);
  const duplicates = findDuplicates(transactions);
  const spikes = findSpikes(transactions);
  const dates = transactions.map(t => t.date);
  return {
    totals: {
      spend: round2(spend),
      refunds: round2(
        transactions.filter(t => t.kind === 'refund').reduce((s, t) => s - t.amount, 0)
      ),
      payments: round2(
        transactions.filter(t => t.kind === 'payment').reduce((s, t) => s - t.amount, 0)
      ),
      interestAndFees: round2(
        transactions
          .filter(t => t.kind === 'interest' || t.kind === 'fee')
          .reduce((s, t) => s + t.amount, 0)
      ),
      income: round2(
        transactions
          .filter(t => t.kind === 'income' || t.kind === 'deposit')
          .reduce((s, t) => s - t.amount, 0)
      ),
      count: transactions.length,
      from: dates[0] || '',
      to: dates[dates.length - 1] || '',
    },
    transactions,
    accounts,
    accountNames,
    byCategory: breakdown(transactions, t => t.category),
    byMerchant: breakdown(transactions, t => t.merchant).slice(0, 15),
    monthly: monthlyTrend(transactions, accountNames),
    recurring,
    duplicates,
    spikes,
    insights: buildInsights(transactions, accounts, recurring, duplicates, spikes),
    recommendations: recommendCards(transactions),
  };
}
