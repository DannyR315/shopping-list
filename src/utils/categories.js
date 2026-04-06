export const CATEGORIES = {
  meat: { label: 'Meat & Fish', emoji: '🥩', order: 0 },
  veg:  { label: 'Fruit & Veg', emoji: '🥦', order: 1 },
  other:{ label: 'Other',       emoji: '🛒', order: 2 },
};

export const CATEGORY_KEYS = ['meat', 'veg', 'other'];

const MEATS = [
  'chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'venison', 'rabbit',
  'salmon', 'tuna', 'cod', 'haddock', 'prawn', 'shrimp', 'fish', 'bass',
  'trout', 'mackerel', 'sardine', 'anchovy', 'crab', 'lobster', 'scallop',
  'mussel', 'clam', 'oyster', 'mince', 'steak', 'bacon', 'sausage', 'ham',
  'chorizo', 'salami', 'pepperoni', 'lardons', 'pancetta', 'brisket',
  'ribs', 'fillet', 'breast', 'thigh', 'drumstick', 'wing', 'liver', 'kidney',
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
];

export function detectCategory(name) {
  const lower = name.toLowerCase();
  if (MEATS.some(m => lower.includes(m))) return 'meat';
  if (VEGS.some(v => lower.includes(v))) return 'veg';
  return 'other';
}

export function cycleCategory(current) {
  const idx = CATEGORY_KEYS.indexOf(current);
  return CATEGORY_KEYS[(idx + 1) % CATEGORY_KEYS.length];
}
