export type City = {
  slug: string
  name: string
  state: string
  state_tax: number
  cost_index: number
  rent_1br: number
  walk_score: number
  transit_score: number
  korean_pop: number
  h_mart: boolean
  grade: string
  tagline: string
  top_sectors: string[]
  top_employers: string[]
  avg_salary: number
  real_income_100k: number
  real_income_150k: number
  real_income_200k: number
  annual_savings_150k: number
}

export const CITIES: City[] = [
  {
    slug: 'seattle', name: 'Seattle', state: 'WA', state_tax: 0, cost_index: 180,
    rent_1br: 1891, walk_score: 74, transit_score: 60, korean_pop: 50000, h_mart: true,
    grade: 'A', tagline: 'No state tax + Big Tech = Maximum savings',
    top_sectors: ['IT', 'Cloud', 'E-Commerce'],
    top_employers: ['Amazon', 'Microsoft', 'Expedia'],
    avg_salary: 143833, real_income_100k: 76000, real_income_150k: 114000, real_income_200k: 152000, annual_savings_150k: 68500,
  },
  {
    slug: 'austin', name: 'Austin', state: 'TX', state_tax: 0, cost_index: 93,
    rent_1br: 1500, walk_score: 40, transit_score: 33, korean_pop: 15000, h_mart: true,
    grade: 'A-', tagline: 'No state tax + Tech boom + Low cost',
    top_sectors: ['IT', 'Semiconductor', 'EV'],
    top_employers: ['Tesla', 'Oracle', 'Samsung Austin'],
    avg_salary: 137000, real_income_100k: 76000, real_income_150k: 114000, real_income_200k: 152000, annual_savings_150k: 67000,
  },
  {
    slug: 'sf-bay-area', name: 'SF / Bay Area', state: 'CA', state_tax: 9.3, cost_index: 200,
    rent_1br: 3100, walk_score: 89, transit_score: 80, korean_pop: 70000, h_mart: true,
    grade: 'A-', tagline: 'Highest salaries, highest costs',
    top_sectors: ['Big Tech', 'AI', 'Startup'],
    top_employers: ['Google', 'Apple', 'Meta'],
    avg_salary: 170000, real_income_100k: 59000, real_income_150k: 88000, real_income_200k: 118000, annual_savings_150k: 45000,
  },
  {
    slug: 'nyc', name: 'New York City', state: 'NY', state_tax: 10.9, cost_index: 190,
    rent_1br: 3500, walk_score: 88, transit_score: 84, korean_pop: 100000, h_mart: true,
    grade: 'B+', tagline: 'Finance & consulting hub, brutal costs',
    top_sectors: ['Finance', 'Consulting', 'Media'],
    top_employers: ['JPMorgan', 'Goldman Sachs', 'Citi'],
    avg_salary: 147000, real_income_100k: 55000, real_income_150k: 82000, real_income_200k: 110000, annual_savings_150k: 35000,
  },
  {
    slug: 'boston', name: 'Boston', state: 'MA', state_tax: 5.0, cost_index: 152,
    rent_1br: 2500, walk_score: 83, transit_score: 72, korean_pop: 20000, h_mart: true,
    grade: 'A-', tagline: 'Biotech capital + Top universities',
    top_sectors: ['Biotech', 'Consulting', 'Finance'],
    top_employers: ['Biogen', 'Moderna', 'Fidelity'],
    avg_salary: 120000, real_income_100k: 66000, real_income_150k: 99000, real_income_200k: 132000, annual_savings_150k: 42000,
  },
  {
    slug: 'dc', name: 'Washington DC', state: 'DC', state_tax: 8.95, cost_index: 140,
    rent_1br: 2200, walk_score: 77, transit_score: 71, korean_pop: 100000, h_mart: true,
    grade: 'B+', tagline: 'Gov IT + Korean community hub (Annandale)',
    top_sectors: ['Gov IT', 'Consulting', 'Cloud'],
    top_employers: ['AWS', 'Booz Allen', 'Leidos'],
    avg_salary: 118000, real_income_100k: 62000, real_income_150k: 93000, real_income_200k: 124000, annual_savings_150k: 48000,
  },
  {
    slug: 'dallas', name: 'Dallas', state: 'TX', state_tax: 0, cost_index: 95,
    rent_1br: 1400, walk_score: 46, transit_score: 37, korean_pop: 40000, h_mart: true,
    grade: 'B+', tagline: 'No state tax + Fortune 500 HQs',
    top_sectors: ['Finance', 'Telecom', 'Healthcare'],
    top_employers: ['AT&T', 'American Airlines', 'ExxonMobil'],
    avg_salary: 115000, real_income_100k: 76000, real_income_150k: 114000, real_income_200k: 152000, annual_savings_150k: 52000,
  },
  {
    slug: 'chicago', name: 'Chicago', state: 'IL', state_tax: 4.95, cost_index: 107,
    rent_1br: 1700, walk_score: 77, transit_score: 65, korean_pop: 40000, h_mart: true,
    grade: 'B+', tagline: 'Consulting & finance with 4 seasons',
    top_sectors: ['Consulting', 'Finance', 'Manufacturing'],
    top_employers: ['Deloitte', 'Accenture', 'United Airlines'],
    avg_salary: 118000, real_income_100k: 68000, real_income_150k: 102000, real_income_200k: 136000, annual_savings_150k: 45000,
  },
  {
    slug: 'houston', name: 'Houston', state: 'TX', state_tax: 0, cost_index: 87,
    rent_1br: 1200, walk_score: 47, transit_score: 36, korean_pop: 30000, h_mart: true,
    grade: 'B', tagline: 'No tax + Cheapest big city + Energy hub',
    top_sectors: ['Energy', 'Healthcare', 'Engineering'],
    top_employers: ['ExxonMobil', 'Shell', 'MD Anderson'],
    avg_salary: 105000, real_income_100k: 76000, real_income_150k: 114000, real_income_200k: 152000, annual_savings_150k: 58000,
  },
  {
    slug: 'la', name: 'Los Angeles', state: 'CA', state_tax: 9.3, cost_index: 170,
    rent_1br: 2300, walk_score: 67, transit_score: 53, korean_pop: 110000, h_mart: true,
    grade: 'B+', tagline: 'Largest Korean community in the US',
    top_sectors: ['Entertainment', 'Gaming', 'Tech'],
    top_employers: ['Riot Games', 'Blizzard', 'Disney'],
    avg_salary: 120000, real_income_100k: 59000, real_income_150k: 88000, real_income_200k: 118000, annual_savings_150k: 38000,
  },
  {
    slug: 'atlanta', name: 'Atlanta', state: 'GA', state_tax: 5.49, cost_index: 102,
    rent_1br: 1600, walk_score: 48, transit_score: 37, korean_pop: 50000, h_mart: true,
    grade: 'B+', tagline: 'Fortune 500 HQs + Growing Korean community',
    top_sectors: ['Finance', 'Logistics', 'IT'],
    top_employers: ['NCR', 'Delta', 'Home Depot'],
    avg_salary: 106000, real_income_100k: 67000, real_income_150k: 100000, real_income_200k: 134000, annual_savings_150k: 42000,
  },
  {
    slug: 'raleigh-durham', name: 'Raleigh-Durham', state: 'NC', state_tax: 4.5, cost_index: 95,
    rent_1br: 1350, walk_score: 35, transit_score: 25, korean_pop: 10000, h_mart: false,
    grade: 'B+', tagline: 'Research Triangle + Epic Games + Low cost',
    top_sectors: ['IT', 'Biotech', 'Gaming'],
    top_employers: ['Epic Games', 'Cisco', 'IBM'],
    avg_salary: 105000, real_income_100k: 70000, real_income_150k: 105000, real_income_200k: 140000, annual_savings_150k: 50000,
  },
  {
    slug: 'phoenix', name: 'Phoenix', state: 'AZ', state_tax: 2.5, cost_index: 93,
    rent_1br: 1300, walk_score: 40, transit_score: 30, korean_pop: 8000, h_mart: false,
    grade: 'B-', tagline: 'Semiconductor boom + Low taxes + Sun',
    top_sectors: ['Semiconductor', 'Finance', 'Healthcare'],
    top_employers: ['Intel', 'TSMC', 'Banner Health'],
    avg_salary: 98000, real_income_100k: 73000, real_income_150k: 109000, real_income_200k: 146000, annual_savings_150k: 48000,
  },
  {
    slug: 'charlotte', name: 'Charlotte', state: 'NC', state_tax: 4.5, cost_index: 95,
    rent_1br: 1400, walk_score: 25, transit_score: 20, korean_pop: 8000, h_mart: false,
    grade: 'B', tagline: 'BofA HQ + Finance hub + Affordable',
    top_sectors: ['Finance', 'Banking', 'Healthcare'],
    top_employers: ['Bank of America', 'Wells Fargo', 'Truist'],
    avg_salary: 98000, real_income_100k: 70000, real_income_150k: 105000, real_income_200k: 140000, annual_savings_150k: 48000,
  },
  {
    slug: 'detroit', name: 'Detroit', state: 'MI', state_tax: 4.25, cost_index: 86,
    rent_1br: 1100, walk_score: 55, transit_score: 42, korean_pop: 12000, h_mart: false,
    grade: 'B', tagline: 'Auto/EV hub + Lowest cost big city',
    top_sectors: ['Automotive', 'EV', 'Manufacturing'],
    top_employers: ['Ford', 'GM', 'Stellantis'],
    avg_salary: 95000, real_income_100k: 71000, real_income_150k: 107000, real_income_200k: 142000, annual_savings_150k: 50000,
  },
  {
    slug: 'minneapolis', name: 'Minneapolis', state: 'MN', state_tax: 9.85, cost_index: 98,
    rent_1br: 1300, walk_score: 69, transit_score: 55, korean_pop: 8000, h_mart: false,
    grade: 'B', tagline: 'Medical devices + Fortune 500 + Cold winters',
    top_sectors: ['Medical Devices', 'Retail', 'Finance'],
    top_employers: ['Medtronic', 'UnitedHealth', 'Target'],
    avg_salary: 100000, real_income_100k: 61000, real_income_150k: 91000, real_income_200k: 121000, annual_savings_150k: 38000,
  },
  {
    slug: 'denver', name: 'Denver', state: 'CO', state_tax: 4.4, cost_index: 120,
    rent_1br: 1700, walk_score: 61, transit_score: 46, korean_pop: 8000, h_mart: false,
    grade: 'B', tagline: 'Outdoor lifestyle + Growing tech scene',
    top_sectors: ['IT', 'Aerospace', 'Energy'],
    top_employers: ['Lockheed Martin', 'Arrow Electronics', 'DaVita'],
    avg_salary: 100000, real_income_100k: 66000, real_income_150k: 99000, real_income_200k: 132000, annual_savings_150k: 42000,
  },
  {
    slug: 'miami', name: 'Miami', state: 'FL', state_tax: 0, cost_index: 130,
    rent_1br: 2100, walk_score: 57, transit_score: 47, korean_pop: 5000, h_mart: false,
    grade: 'B', tagline: 'No state tax + Finance + Latin hub',
    top_sectors: ['Finance', 'Accounting', 'Real Estate'],
    top_employers: ['Carnival', 'World Fuel Services', 'Lennar'],
    avg_salary: 95000, real_income_100k: 76000, real_income_150k: 114000, real_income_200k: 152000, annual_savings_150k: 44000,
  },
  {
    slug: 'portland', name: 'Portland', state: 'OR', state_tax: 9.9, cost_index: 120,
    rent_1br: 1500, walk_score: 65, transit_score: 51, korean_pop: 8000, h_mart: false,
    grade: 'B-', tagline: 'Nike HQ + Intel + High state tax',
    top_sectors: ['Semiconductor', 'Retail', 'Manufacturing'],
    top_employers: ['Intel', 'Nike', 'Daimler Trucks'],
    avg_salary: 98000, real_income_100k: 61000, real_income_150k: 91000, real_income_200k: 121000, annual_savings_150k: 36000,
  },
]

export type CityRanking = {
  slug: string
  name: string
  state: string
  grade: string
  rank: number
  scores: {
    employment: number      // 취업 기회 (5점 만점)
    real_income: number     // 실질 구매력 (5점)
    green_card: number      // 영주권 스폰서 (5점)
    safety: number          // 치안 (5점)
    school: number          // 학군 (5점)
    transit: number         // 대중교통 (5점)
    korean: number          // 한인 커뮤니티 (5점)
    weather: number         // 날씨 (5점)
  }
  best_for: string
  tagline: string
}

export const CITY_RANKINGS: CityRanking[] = [
  { slug: 'seattle',       name: 'Seattle',         state: 'WA', grade: 'A',  rank: 1,  scores: { employment: 5, real_income: 4, green_card: 5, safety: 3, school: 5, transit: 4, korean: 4, weather: 3 }, best_for: 'IT / Cloud', tagline: 'No state tax + Big Tech = Max savings' },
  { slug: 'austin',        name: 'Austin',          state: 'TX', grade: 'A-', rank: 2,  scores: { employment: 4, real_income: 5, green_card: 3, safety: 4, school: 4, transit: 2, korean: 3, weather: 3 }, best_for: 'IT / Semiconductor / EV', tagline: 'No tax + Tech boom + Low cost' },
  { slug: 'sf-bay-area',   name: 'SF / Bay Area',   state: 'CA', grade: 'A-', rank: 3,  scores: { employment: 5, real_income: 2, green_card: 5, safety: 3, school: 4, transit: 5, korean: 4, weather: 4 }, best_for: 'Big Tech / AI / Startup', tagline: 'Highest salaries, highest costs' },
  { slug: 'boston',        name: 'Boston',          state: 'MA', grade: 'A-', rank: 4,  scores: { employment: 4, real_income: 3, green_card: 4, safety: 4, school: 5, transit: 4, korean: 3, weather: 2 }, best_for: 'Biotech / Consulting', tagline: 'Biotech capital + Top universities' },
  { slug: 'dc',            name: 'Washington DC',   state: 'DC', grade: 'B+', rank: 5,  scores: { employment: 4, real_income: 3, green_card: 3, safety: 3, school: 4, transit: 4, korean: 5, weather: 3 }, best_for: 'Gov IT / Consulting', tagline: 'Gov IT hub + Largest Korean community (Annandale)' },
  { slug: 'dallas',        name: 'Dallas',          state: 'TX', grade: 'B+', rank: 6,  scores: { employment: 3, real_income: 5, green_card: 3, safety: 3, school: 4, transit: 2, korean: 4, weather: 3 }, best_for: 'Finance / Telecom', tagline: 'No tax + Fortune 500 HQs' },
  { slug: 'raleigh-durham',name: 'Raleigh-Durham',  state: 'NC', grade: 'B+', rank: 7,  scores: { employment: 3, real_income: 4, green_card: 3, safety: 4, school: 4, transit: 2, korean: 3, weather: 4 }, best_for: 'IT Research / Gaming', tagline: 'Research Triangle + Epic Games + Low cost' },
  { slug: 'chicago',       name: 'Chicago',         state: 'IL', grade: 'B+', rank: 8,  scores: { employment: 4, real_income: 3, green_card: 3, safety: 3, school: 3, transit: 4, korean: 4, weather: 2 }, best_for: 'Consulting / Finance', tagline: 'Consulting & finance hub' },
  { slug: 'nyc',           name: 'New York City',   state: 'NY', grade: 'B+', rank: 9,  scores: { employment: 5, real_income: 1, green_card: 4, safety: 3, school: 3, transit: 5, korean: 5, weather: 2 }, best_for: 'Finance / IB / Consulting', tagline: 'Best jobs, worst purchasing power' },
  { slug: 'la',            name: 'Los Angeles',     state: 'CA', grade: 'B+', rank: 10, scores: { employment: 4, real_income: 2, green_card: 3, safety: 3, school: 3, transit: 2, korean: 5, weather: 5 }, best_for: 'Entertainment / Gaming', tagline: 'Largest Korean community in the US' },
  { slug: 'atlanta',       name: 'Atlanta',         state: 'GA', grade: 'B+', rank: 11, scores: { employment: 3, real_income: 4, green_card: 3, safety: 3, school: 3, transit: 2, korean: 4, weather: 4 }, best_for: 'Fortune 500 HQs', tagline: 'Growing Korean community + Fortune 500' },
  { slug: 'houston',       name: 'Houston',         state: 'TX', grade: 'B',  rank: 12, scores: { employment: 3, real_income: 5, green_card: 3, safety: 2, school: 3, transit: 2, korean: 3, weather: 2 }, best_for: 'Energy / Healthcare', tagline: 'No tax + Cheapest big city' },
  { slug: 'phoenix',       name: 'Phoenix',         state: 'AZ', grade: 'B-', rank: 13, scores: { employment: 3, real_income: 4, green_card: 2, safety: 3, school: 3, transit: 1, korean: 2, weather: 3 }, best_for: 'Semiconductor / Finance', tagline: 'Semiconductor boom + Low taxes + Sun' },
  { slug: 'charlotte',     name: 'Charlotte',       state: 'NC', grade: 'B',  rank: 14, scores: { employment: 3, real_income: 4, green_card: 2, safety: 3, school: 4, transit: 1, korean: 2, weather: 4 }, best_for: 'Finance / Banking', tagline: 'BofA HQ + Finance hub + Affordable' },
  { slug: 'detroit',       name: 'Detroit',         state: 'MI', grade: 'B',  rank: 15, scores: { employment: 3, real_income: 4, green_card: 2, safety: 2, school: 3, transit: 2, korean: 3, weather: 2 }, best_for: 'Automotive / EV', tagline: 'Auto/EV hub + Lowest cost big city' },
  { slug: 'minneapolis',   name: 'Minneapolis',     state: 'MN', grade: 'B',  rank: 16, scores: { employment: 3, real_income: 3, green_card: 3, safety: 3, school: 3, transit: 3, korean: 2, weather: 1 }, best_for: 'Medical Devices / Retail', tagline: 'Medical devices hub + Very cold winters' },
  { slug: 'denver',        name: 'Denver',          state: 'CO', grade: 'B',  rank: 17, scores: { employment: 2, real_income: 3, green_card: 2, safety: 3, school: 4, transit: 2, korean: 2, weather: 4 }, best_for: 'Outdoor + Tech', tagline: 'Outdoor lifestyle + Growing tech scene' },
  { slug: 'miami',         name: 'Miami',           state: 'FL', grade: 'B',  rank: 18, scores: { employment: 3, real_income: 4, green_card: 2, safety: 2, school: 3, transit: 2, korean: 1, weather: 5 }, best_for: 'Finance / Accounting', tagline: 'No tax + Finance + Latin hub' },
  { slug: 'portland',      name: 'Portland',        state: 'OR', grade: 'B-', rank: 19, scores: { employment: 2, real_income: 3, green_card: 2, safety: 3, school: 4, transit: 3, korean: 2, weather: 3 }, best_for: 'Nike / Intel', tagline: 'Nike HQ + Intel + High state tax' },
]