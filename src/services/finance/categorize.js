/**
 * Merchant clean-up and spending categories for statement transactions.
 *
 * There is deliberately no "Other" bucket. A purchase is categorised by, in
 * order: a known-merchant rule, the bank's own category (Discover prints one),
 * a guess from words in the description ("ENTERTAINMEN" -> Entertainment),
 * and finally the merchant's own name. The user can change any of these; the
 * change applies to every transaction from that merchant (see analyze.js).
 */

export const CATEGORIES = [
  'Dining',
  'Groceries',
  'Gas',
  'Travel',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Streaming & Subscriptions',
  'Utilities & Bills',
  'Health',
  'Insurance',
  'Housing',
  'Education',
  'Personal Care',
  'Gifts & Donations',
  'Fees & Interest',
  'Cash',
  'Transfers',
  'Card Payments',
  'Income',
  'Rewards',
];

/** Categories a user can assign to a purchase or refund. */
export const SPENDING_CATEGORIES = CATEGORIES.slice(0, CATEGORIES.indexOf('Fees & Interest'));

const RULES = [
  [
    'Streaming & Subscriptions',
    /netflix|spotify|hulu|disney\s*\+|disneyplus|hbo|max\.com|youtube\s*(premium|tv)|apple\.com\/bill|itunes|google\s*\*?(storage|one|play)|amazon\s+prime|prime\s+video|audible|paramount|peacock|siriusxm|patreon|chatgpt|openai|adobe|microsoft\s*\*?(365|office)|dropbox|icloud|nytimes|wsj|substack/i,
  ],
  [
    'Groceries',
    /total\s+wine|bevmo|liquor|wine\s*&\s*spirits|whole\s*foods|trader\s*joe|safeway|kroger|costco|sam'?s\s*club|aldi|publix|wegmans|heb\b|h-e-b|albertsons|sprouts|food\s*lion|giant\s+(eagle|food)|stop\s*&\s*shop|harris\s*teeter|meijer|winco|qfc|fred\s*meyer|ralphs|vons|market\s*basket|patel\s*brothers|instacart|grocery|supermarket|99\s*ranch|h\s*mart|walmart\s+(grocery|supercenter)/i,
  ],
  [
    'Gas',
    /shell\b|chevron|exxon|mobil\b|\bbp\b|arco|texaco|valero|sunoco|citgo|marathon\s+petro|speedway|wawa|sheetz|circle\s*k|quiktrip|\bqt\b|76\s|phillips\s*66|costco\s+gas|gas\s+station|fuel|racetrac|kwik\s*trip|pilot\s+travel|love'?s\s+travel/i,
  ],
  [
    'Dining',
    /restaurant|cafe|coffee|starbucks|dunkin|mcdonald|burger|wendy|taco\s*bell|chipotle|subway|pizza|domino|papa\s*john|kfc|popeyes|chick-?fil|panera|panda\s*express|five\s*guys|shake\s*shack|in-n-out|sweetgreen|cava|wingstop|olive\s*garden|applebee|ihop|denny|cheesecake|grill|kitchen|bistro|sushi|ramen|thai|pho|bbq|bakery|bar\s*&|tavern|pub\b|brewing|doordash|uber\s*\*?\s*eats|grubhub|postmates|seamless|tst\*|toast|caviar|dine|eatery|diner|deli\b|bagel|donut|juice|boba|tea\s+house/i,
  ],
  [
    'Travel',
    /airline|airlines|delta\s+air|united\s+air|american\s+air|southwest|jetblue|alaska\s+air|spirit\s+air|frontier|lufthansa|british\s+airways|emirates|qatar|air\s+india|air\s+canada|expedia|booking\.com|hotels\.com|priceline|kayak|airbnb|vrbo|marriott|hilton|hyatt|ihg|holiday\s+inn|sheraton|westin|hotel|motel|resort|inn\b|hertz|avis|enterprise\s+rent|budget\s+rent|national\s+car|sixt|turo|amtrak|cruise|tsa\s+pre|global\s+entry|travel/i,
  ],
  [
    'Transportation',
    /uber(?!\s*\*?\s*eats)|lyft|taxi|cab\b|metro|transit|mta\b|bart\b|clipper|orca|ventra|parking|parkmobile|spothero|toll|e-?zpass|fastrak|sunpass|car\s+wash|jiffy\s+lube|auto\s+(parts|zone|repair)|autozone|o'?reilly|napa\s+auto|pep\s+boys|firestone|discount\s+tire|dmv|tesla\s+supercharger|chargepoint|evgo|electrify/i,
  ],
  [
    'Utilities & Bills',
    /comcast|xfinity|verizon|at&t|\batt\b|t-mobile|tmobile|sprint|spectrum|cox\s+comm|optimum|frontier\s+comm|centurylink|google\s+fi|mint\s+mobile|visible|electric|energy|power\b|pg&e|edison|duke\s+energy|con\s+ed|water|sewer|utility|utilities|waste\s+management|republic\s+services|gas\s+co|puget\s+sound/i,
  ],
  [
    'Insurance',
    /insurance|geico|state\s*farm|progressive|allstate|liberty\s+mutual|farmers\s+ins|nationwide|usaa|lemonade|metlife|aflac/i,
  ],
  [
    'Housing',
    /newrez|shellpoint|mr\.?\s*cooper|rocket\s+mortgage|pennymac|loancare|freedom\s+mortgage|home\s+mtg|rent\b|apartment|property\s+mgmt|property\s+management|mortgage|hoa\b|homeowners\s+assoc|realty|zillow\s+rent|avail\b|bilt/i,
  ],
  [
    'Health',
    /pharmacy|cvs|walgreens|rite\s+aid|duane\s+reade|doctor|dental|dentist|medical|clinic|hospital|health|optometr|vision|labcorp|quest\s+diag|kaiser|urgent\s+care|therapy|physio|gym|fitness|planet\s+fitness|la\s+fitness|24\s+hour\s+fitness|equinox|orangetheory|peloton|ymca/i,
  ],
  [
    'Personal Care',
    /salon|barber|spa\b|nails|massage|ulta|sephora|great\s+clips|supercuts|cosmetic/i,
  ],
  [
    'Education',
    /tuition|university|college|school|udemy|coursera|edx|chegg|pearson|bookstore|leetcode|skillshare|masterclass|duolingo/i,
  ],
  [
    'Entertainment',
    /movie|cinema|amc\s|regal|fandango|theater|theatre|concert|ticketmaster|stubhub|seatgeek|eventbrite|live\s+nation|steam\s*games|steampowered|playstation|xbox|nintendo|epic\s+games|bowling|golf|museum|zoo|park\s+tickets|disneyland|six\s+flags/i,
  ],
  [
    'Gifts & Donations',
    /donation|charity|foundation|gofundme|red\s+cross|unicef|church|temple|mosque|gift\s+card/i,
  ],
  [
    'Shopping',
    /amazon|amzn|walmart|target|best\s*buy|ebay|etsy|apple\s+store|apple\.com(?!\/bill)|home\s*depot|lowe'?s|ikea|wayfair|macy|nordstrom|kohl|tj\s*maxx|marshalls|ross\s+stores|old\s+navy|gap\b|h&m|zara|uniqlo|nike|adidas|costco\.com|dollar\s+tree|dollar\s+general|five\s+below|bed\s+bath|michaels|hobby\s+lobby|staples|office\s+depot|petco|petsmart|chewy|shein|temu|aliexpress|shopify|paypal\s*\*|sq\s*\*|square/i,
  ],
];

const DISCOVER_MAP = {
  restaurants: 'Dining',
  supermarkets: 'Groceries',
  gasoline: 'Gas',
  'travel/ entertainment': 'Travel',
  'travel/entertainment': 'Travel',
  'medical services': 'Health',
  'department stores': 'Shopping',
  merchandise: 'Shopping',
  'home improvement': 'Shopping',
  'warehouse clubs': 'Groceries',
  education: 'Education',
  automotive: 'Transportation',
  'government services': 'Utilities & Bills',
};

// Word fragments that point to a category when no known merchant matched.
// Looser than RULES, so only consulted after them.
const GUESSES = [
  [
    'Entertainment',
    /entertain|amuse|arcade|cinema|theat|music|concert|game|gaming|sport|stadium|arena|ticket|karaoke|escape\s*room|bowl|billiard|comedy|festival|attraction/i,
  ],
  [
    'Dining',
    /restau|grill|cafe|caf\u00e9|coffee|espresso|kitchen|\beat|food\s*(truck|hall|court)|pizz|taco|taqueria|burger|bbq|barbecue|sushi|noodle|curry|biryani|bakery|bake\s*shop|\bbar\b|pub\b|brew|cantina|dine|diner|bistro|tea\b|creamery|ice\s*cream|dessert|wings|chicken|steak|seafood|buffet/i,
  ],
  [
    'Groceries',
    /market|grocer|\bfoods?\b|produce|farm|butcher|halal|indian\s+store|asian\s+store|bazaar/i,
  ],
  [
    'Health',
    /pharm|medic|clinic|dental|dentist|ortho|health|\bcare\b|hospital|\blab\b|vision|optic|wellness|fitness|\bgym\b|yoga|pilates|physical\s+therapy|chiro|\bmd\b|\bdds\b/i,
  ],
  ['Personal Care', /salon|beauty|\bspa\b|barber|nail|cosmet|lash|brow|wax/i],
  [
    'Transportation',
    /\bauto\b|motor|tire|garage|parking|transit|\bcar\b|repair|\btow|smog|lube|bike|scooter|\bev\b/i,
  ],
  [
    'Travel',
    /hotel|\binn\b|lodge|suites|travel|tours?\b|\bair\b|flight|airport|resort|hostel|vacation/i,
  ],
  [
    'Utilities & Bills',
    /utilit|electric|\bwater\b|telecom|wireless|internet|broadband|cable|\bphone\b|mobile\s+bill|\bbill\s*pay/i,
  ],
  ['Insurance', /insur|assurance|\bpolicy\b/i],
  [
    'Education',
    /school|academy|college|universit|learning|tutor|course|training|institute|\bbooks?\b/i,
  ],
  [
    'Housing',
    /\brent\b|property|apartment|apts?\b|realty|mortgage|\bhoa\b|homeowners|lease|storage\s+unit|self\s+storage/i,
  ],
  ['Gifts & Donations', /donat|charit|church|temple|mosque|gurdwara|foundation|fundrais|\bgift/i],
  [
    'Streaming & Subscriptions',
    /subscription|membership|monthly\s+plan|premium|\bpro\s+plan|\.tv\b|stream/i,
  ],
  [
    'Shopping',
    /store|shop|outlet|retail|boutique|depot|supply|supplies|goods|apparel|clothing|fashion|shoes|electronics|furniture|hardware|\bmall\b|emporium|\.com\b|online/i,
  ],
];

const SPENDING_KINDS = new Set(['purchase', 'refund']);

/**
 * Category for a transaction, with where it came from:
 *   'kind'     fees, transfers, income… (fixed by what the row is)
 *   'rule'     a known merchant
 *   'bank'     the bank's own category label (Discover)
 *   'guess'    inferred from words in the description — worth a look
 *   'merchant' nothing to go on: the merchant's own name — worth a look
 */
export function categorizeDetailed(description, kind, bankCategory = '') {
  if (kind === 'interest' || kind === 'fee') return { category: 'Fees & Interest', source: 'kind' };
  if (kind === 'payment' || kind === 'card_payment')
    return { category: 'Card Payments', source: 'kind' };
  if (kind === 'transfer') return { category: 'Transfers', source: 'kind' };
  if (kind === 'income' || kind === 'deposit') return { category: 'Income', source: 'kind' };
  if (kind === 'cash') return { category: 'Cash', source: 'kind' };
  if (kind === 'reward') return { category: 'Rewards', source: 'kind' };
  // A refunded / reversed fee nets against fees, not against a merchant.
  if (kind === 'refund' && /\bfee\b|interest/i.test(description)) {
    return { category: 'Fees & Interest', source: 'kind' };
  }
  for (const [category, re] of RULES) {
    if (re.test(description)) return { category, source: 'rule' };
  }
  const mapped = DISCOVER_MAP[(bankCategory || '').toLowerCase()];
  if (mapped) return { category: mapped, source: 'bank' };
  const name = merchantName(description);
  for (const [category, re] of GUESSES) {
    if (re.test(description) || re.test(name)) return { category, source: 'guess' };
  }
  return { category: name || 'Unnamed merchant', source: 'merchant' };
}

/** Category name only (see categorizeDetailed). */
export function categorize(description, kind, bankCategory = '') {
  return categorizeDetailed(description, kind, bankCategory).category;
}

/** Whether the user may re-categorise this kind of transaction. */
export const isRecategorizable = (kind, description = '') =>
  SPENDING_KINDS.has(kind) && !(kind === 'refund' && /\bfee\b|interest/i.test(description));

const BRANDS = [
  [/\batm\b|cash\s+withdrawal/i, 'ATM withdrawal'],
  [/amzn|amazon/i, 'Amazon'],
  [/uber\s*\*?\s*eats/i, 'Uber Eats'],
  [/\buber\b/i, 'Uber'],
  [/lyft/i, 'Lyft'],
  [/doordash/i, 'DoorDash'],
  [/starbucks/i, 'Starbucks'],
  [/walmart|wal-mart/i, 'Walmart'],
  [/target/i, 'Target'],
  [/costco/i, 'Costco'],
  [/whole\s*foods/i, 'Whole Foods'],
  [/trader\s*joe/i, "Trader Joe's"],
  [/netflix/i, 'Netflix'],
  [/spotify/i, 'Spotify'],
  [/apple\.com\/bill|itunes/i, 'Apple (subscriptions)'],
  [/google/i, 'Google'],
  [/paypal/i, 'PayPal'],
];

/** Display name: brand if recognised, otherwise the description minus store numbers and locations. */
export function merchantName(description) {
  for (const [re, name] of BRANDS) if (re.test(description)) return name;
  let s = description
    .split(' · ')[0]
    // Bank-transfer wording: keep who it went to / came from.
    .replace(/^electronic\s+(withdrawal|deposit|payment)\s+(to|from)\s+/i, '')
    .replace(/^zelle\s+(instant\s+)?(pmt|payment)\s+(to|from)\s+/i, m =>
      /from/i.test(m) ? 'Zelle from ' : 'Zelle to '
    )
    // Checking-account wrappers: "Card Purchase 01/07 <merchant> … Card 1234"
    .replace(
      /^(recurring\s+)?card\s+purchase(\s+with\s+pin)?(\s+return)?\s+(\d{1,2}\/\d{1,2}\s+)?/i,
      ''
    )
    .replace(
      /^(pos\s+(purchase|debit)|debit\s+card\s+purchase|purchase\s+authorized\s+on\s+\d{1,2}\/\d{1,2})\s+/i,
      ''
    )
    .replace(/\s+card\s+\d{4}$/i, '')
    .replace(/^(sq|tst|sp|py|paypal|pp|in|dd|cke|fsp|sqc)\s*\*\s*/i, '')
    .replace(/#\s*\d+/g, ' ')
    .replace(/\b[\w-]*\d{3,}[\w-]*\b/g, ' ')
    .replace(/\b(www\.)?[\w-]+\.(com|net|org)\b.*$/i, m => m.split(/\s/)[0])
    .replace(/\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?\s+[A-Z]{2}$/, '')
    .replace(/\s+[A-Z]{2,}\s+[A-Z]{2}$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  s = s.split(' ').slice(0, 4).join(' ');
  if (!s) s = description.slice(0, 30);
  return s
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/'S\b/g, "'s");
}

/** Stable key for grouping the same merchant across rows. */
export function merchantKey(description) {
  return merchantName(description)
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}
