export const CATEGORIES = {
  meat:          { label: 'Meat',            emoji: '🥩', order: 0 },
  seafood:       { label: 'Seafood',         emoji: '🐟', order: 1 },
  veg:           { label: 'Fruit & Veg',     emoji: '🥦', order: 2 },
  dairy:         { label: 'Dairy',           emoji: '🧀', order: 3 },
  bakery:        { label: 'Bakery',          emoji: '🍞', order: 4 },
  frozen:        { label: 'Frozen Foods',    emoji: '🧊', order: 5 },
  beverages:     { label: 'Beverages',       emoji: '🥤', order: 6 },
  canned:        { label: 'Canned Goods',    emoji: '🥫', order: 7 },
  herbs_spices:  { label: 'Herbs & Spices',  emoji: '🌿', order: 8 },
  snacks:        { label: 'Snacks',          emoji: '🍫', order: 9 },
  cleaning:      { label: 'Cleaning',        emoji: '🧹', order: 10 },
  personal_care: { label: 'Personal Care',   emoji: '🧴', order: 11 },
  pet_supplies:  { label: 'Pet Supplies',    emoji: '🐾', order: 12 },
  other:         { label: 'Other',           emoji: '🛒', order: 13 },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES);

// Detection lists — checked in priority order to resolve conflicts
const PET_SUPPLIES = [
  'dog food', 'cat food', 'pet food', 'fish food', 'bird food', 'rabbit food',
  'hamster food', 'guinea pig', 'cat litter', 'dog treat', 'cat treat',
  'kibble', 'pedigree', 'whiskas', 'felix', 'bird seed', 'pet shampoo',
  'flea treatment', 'worming tablet', 'purina', 'royal canin', 'iams',
  'science diet', 'dog lead', 'cat toy', 'dog toy',
];

const CLEANING = [
  'washing up liquid', 'washing powder', 'washing tablet', 'washing capsule',
  'laundry detergent', 'laundry liquid', 'laundry powder', 'fabric softener',
  'bleach', 'dishwasher tablet', 'dishwasher pod', 'dishwasher salt',
  'dish soap', 'dish liquid', 'washing up',
  'kitchen roll', 'toilet paper', 'toilet roll',
  'bin bag', 'bin liner', 'cleaning spray', 'disinfectant', 'antibacterial',
  'floor cleaner', 'bathroom cleaner', 'toilet cleaner', 'oven cleaner',
  'glass cleaner', 'shoe polish', 'furniture polish', 'floor polish',
  'duster', 'rubber glove', 'sponge cloth', 'scrubbing brush',
];

const PERSONAL_CARE = [
  'shampoo', 'conditioner', 'shower gel', 'body wash', 'soap bar', 'hand soap',
  'soap', 'toothpaste', 'toothbrush', 'electric toothbrush', 'deodorant',
  'antiperspirant', 'moisturiser', 'moisturizer', 'sunscreen', 'sunblock',
  'spf cream', 'razor', 'shaving foam', 'shaving gel', 'tampon', 'sanitary',
  'cotton wool', 'cotton bud', 'dental floss', 'mouthwash', 'face wash',
  'hand cream', 'nail polish', 'hair dye', 'lipstick', 'mascara', 'foundation',
  'perfume', 'cologne', 'aftershave', 'bubble bath', 'bath bomb', 'face mask',
  'eye cream', 'toner', 'serum', 'body lotion', 'baby wipe', 'nappy',
];

const FROZEN = [
  'frozen', 'ice cream', 'gelato', 'sorbet', 'ice lolly', 'popsicle',
  'ice pop', 'fish finger', 'fish stick',
];

const CANNED = [
  'tinned', 'canned', 'tin of', 'baked beans', 'chopped tomatoes', 'passata',
  'coconut milk', 'tomato paste', 'tomato puree', 'tomato purée',
  'soup',
];

const HERBS_SPICES = [
  // Stocks & gravies
  'stock cube', 'stock pot', 'stockpot', 'beef stock', 'chicken stock',
  'vegetable stock', 'fish stock', 'gravy granule', 'gravy powder',
  'gravy mix', 'bouillon',
  // Spice mixes, sachets & seasonings
  'spice', 'seasoning', 'marinade', 'garam masala', 'curry powder',
  'curry paste', 'five spice', 'mixed spice', 'allspice', 'ras el hanout',
  'za\'atar', 'jerk seasoning', 'cajun', 'old bay', 'smoked paprika',
  // Individual spices
  'cumin', 'turmeric', 'paprika', 'cinnamon', 'cardamom', 'cloves', 'nutmeg',
  'cayenne', 'chilli powder', 'chilli flakes', 'chilli flake',
  'black pepper', 'white pepper', 'ground pepper', 'peppercorn',
  'vanilla', 'saffron', 'star anise', 'fennel seed', 'coriander seed',
  'mustard seed', 'celery seed', 'fenugreek',
  // Dried herbs
  'dried basil', 'dried coriander', 'dried parsley', 'dried mint',
  'dried rosemary', 'dried thyme', 'dried sage', 'dried oregano',
  'mixed herbs', 'herbes de provence', 'bay leaf', 'bay leaves', 'oregano',
  // Salt & condiment bases
  'sea salt', 'rock salt', 'himalayan salt', 'table salt',
  'white wine vinegar', 'red wine vinegar', 'balsamic vinegar', 'apple cider vinegar',
];

const BEVERAGES = [
  'water', 'juice', 'coffee', 'tea', 'beer', 'wine', 'cider', 'lager',
  'ale', 'stout', 'porter', 'vodka', 'gin', 'rum', 'whiskey', 'whisky',
  'tequila', 'prosecco', 'champagne', 'lemonade', 'squash',
  'smoothie', 'kombucha', 'sparkling water', 'energy drink', 'hot chocolate',
  'cordial', 'coconut water', 'sports drink', 'protein shake', 'oat milk',
  'almond milk', 'soy milk', 'rice milk',
  // Brand names
  'pepsi', 'coca-cola', 'coca cola', 'fanta', 'sprite', 'dr pepper',
  '7up', 'lucozade', 'ribena', 'irn bru', 'red bull', 'monster energy',
  'innocent', 'volvic', 'evian', 'highland spring',
];

const VEGS = [
  'carrot', 'broccoli', 'onion', 'potato', 'tomato', 'pepper', 'spinach',
  'mushroom', 'garlic', 'leek', 'courgette', 'zucchini', 'cucumber', 'lettuce',
  'celery', 'cabbage', 'cauliflower', 'asparagus', 'aubergine', 'eggplant',
  'beetroot', 'parsnip', 'turnip', 'swede', 'pea', 'bean', 'lentil', 'chickpea',
  'corn', 'sweetcorn', 'kale', 'chard', 'rocket', 'radish', 'shallot', 'fennel',
  'artichoke', 'pumpkin', 'squash', 'apple', 'banana', 'orange', 'lemon', 'lime',
  'strawberry', 'raspberry', 'blueberry', 'grape', 'mango', 'avocado', 'pear',
  'peach', 'plum', 'cherry', 'melon', 'pineapple', 'grapefruit', 'kiwi',
  'spring onion', 'sweet potato', 'butternut', 'pak choi', 'tenderstem',
  'salad', 'basil', 'coriander', 'parsley', 'mint', 'rosemary', 'thyme',
  'chilli', 'ginger root', 'fresh ginger',
];

const SEAFOODS = [
  'salmon', 'tuna', 'cod', 'haddock', 'prawn', 'shrimp', 'fish', 'bass',
  'trout', 'mackerel', 'sardine', 'anchovy', 'crab', 'lobster', 'scallop',
  'mussel', 'clam', 'oyster', 'squid', 'octopus', 'herring', 'plaice',
  'halibut', 'monkfish', 'tilapia', 'seabass', 'swordfish', 'caviar',
  'langoustine', 'crayfish', 'smoked salmon', 'fishcake',
];

const MEATS = [
  'chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'venison', 'rabbit',
  'mince', 'steak', 'bacon', 'sausage', 'ham', 'chorizo', 'salami',
  'pepperoni', 'lardons', 'pancetta', 'brisket', 'ribs', 'breast', 'thigh',
  'drumstick', 'wing', 'liver', 'kidney', 'veal', 'mutton', 'goat',
  'hot dog', 'frankfurter', 'pastrami', 'prosciutto', 'meatball', 'burger',
  'meat',
];

const DAIRY = [
  'milk', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt', 'egg',
  'cheddar', 'mozzarella', 'parmesan', 'brie', 'camembert', 'gouda',
  'ricotta', 'halloumi', 'feta', 'crème fraîche', 'creme fraiche',
  'sour cream', 'double cream', 'single cream', 'clotted cream',
  'custard', 'fromage frais', 'kefir', 'ghee', 'quark',
];

const BAKERY = [
  'bread', 'roll', 'baguette', 'croissant', 'muffin', 'bagel', 'wrap',
  'tortilla', 'pitta', 'pita', 'naan', 'sourdough', 'loaf', 'bun', 'pastry',
  'cake', 'scone', 'crumpet', 'waffle', 'brioche', 'focaccia', 'ciabatta',
  'breadstick', 'flatbread', 'chapatti', 'chapati', 'pizza', 'doughnut',
  'donut', 'tart', 'danish',
];

const SNACKS = [
  'crisp', 'chips', 'chocolate', 'biscuit', 'cookie', 'popcorn',
  'cracker', 'cereal bar', 'granola bar', 'sweets', 'gummy', 'haribo',
  'pretzel', 'rice cake', 'tortilla chip', 'corn chip', 'trail mix',
  'raisin', 'nut', 'peanut', 'cashew', 'almond', 'walnut', 'pistachio',
  'pecan', 'hazelnut', 'macadamia', 'dried fruit',
];

// Priority order: non-food specifics first, then food categories
export function detectCategory(name) {
  const lower = name.toLowerCase();
  if (PET_SUPPLIES.some(w => lower.includes(w)))    return 'pet_supplies';
  if (CLEANING.some(w => lower.includes(w)))         return 'cleaning';
  if (PERSONAL_CARE.some(w => lower.includes(w)))   return 'personal_care';
  if (FROZEN.some(w => lower.includes(w)))           return 'frozen';
  if (CANNED.some(w => lower.includes(w)))           return 'canned';
  if (HERBS_SPICES.some(w => lower.includes(w)))    return 'herbs_spices';
  if (BEVERAGES.some(w => lower.includes(w)))        return 'beverages';
  if (VEGS.some(w => lower.includes(w)))             return 'veg';
  if (SEAFOODS.some(w => lower.includes(w)))         return 'seafood';
  if (MEATS.some(w => lower.includes(w)))            return 'meat';
  if (DAIRY.some(w => lower.includes(w)))            return 'dairy';
  if (BAKERY.some(w => lower.includes(w)))           return 'bakery';
  if (SNACKS.some(w => lower.includes(w)))           return 'snacks';
  return 'other';
}

export function cycleCategory(current) {
  const idx = CATEGORY_KEYS.indexOf(current);
  return CATEGORY_KEYS[(idx + 1) % CATEGORY_KEYS.length];
}
