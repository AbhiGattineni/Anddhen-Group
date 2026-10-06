/**
 * Merchant clean-up and spending categories for statement transactions.
 * Keyword rules, checked in order; the first match wins.
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
  'Refunds',
  'Other',
];

const RULES = [
  [
    'Streaming & Subscriptions',
    /netflix|spotify|hulu|disney\s*\+|disneyplus|hbo|max\.com|youtube\s*(premium|tv)|apple\.com\/bill|itunes|google\s*\*?(storage|one|play)|amazon\s+prime|prime\s+video|audible|paramount|peacock|siriusxm|patreon|chatgpt|openai|adobe|microsoft\s*\*?(365|office)|dropbox|icloud|nytimes|wsj|substack/i,
  ],
  [
    'Groceries',
    /whole\s*foods|trader\s*joe|safeway|kroger|costco|sam'?s\s*club|aldi|publix|wegmans|heb\b|h-e-b|albertsons|sprouts|food\s*lion|giant\s+(eagle|food)|stop\s*&\s*shop|harris\s*teeter|meijer|winco|qfc|fred\s*meyer|ralphs|vons|market\s*basket|patel\s*brothers|instacart|grocery|supermarket|99\s*ranch|h\s*mart|walmart\s+(grocery|supercenter)/i,
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
    /rent\b|apartment|property\s+mgmt|property\s+management|mortgage|hoa\b|homeowners\s+assoc|realty|zillow\s+rent|avail\b|bilt/i,
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

/** Category for a transaction. `bankCategory` is the bank's own label if it prints one. */
export function categorize(description, kind, bankCategory = '') {
  if (kind === 'interest' || kind === 'fee') return 'Fees & Interest';
  if (kind === 'payment' || kind === 'card_payment') return 'Card Payments';
  if (kind === 'transfer') return 'Transfers';
  if (kind === 'income' || kind === 'deposit') return 'Income';
  if (kind === 'cash') return 'Cash';
  for (const [category, re] of RULES) {
    if (re.test(description)) return category;
  }
  const mapped = DISCOVER_MAP[(bankCategory || '').toLowerCase()];
  if (mapped) return mapped;
  if (kind === 'refund') return 'Refunds';
  return 'Other';
}

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
