import { createClient } from './client'

export type Company = {
  slug: string
  employer_name: string
  employer_state: string
  sector: string
  naics_code: string
  lca_fy2024: number
  lca_fy2025: number
  lca_total_2yr: number
  lca_trend: string
  avg_salary_fy2024: number | null
  avg_salary_fy2025: number | null
  median_salary_fy2025: number | null
  p75_salary_fy2025: number | null
  prevailing_wage_avg: number | null
  top_worksite_state: string
  top3_worksite_states: string
  top3_job_titles: string
  h1b_ratio: number | null
  has_perm: boolean
  perm_total_4yr: number
  perm_certified: number
  perm_avg_wage: number | null
  perm_fy2021: number
  perm_fy2022: number
  perm_fy2023: number
  perm_fy2024: number
  perm_fy2025: number
  perm_total_5yr: number
}

const STATE_MAP: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
  'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
  'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
  'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
  'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
  'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
  'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
  'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
  'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
  'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
  'wisconsin': 'WI', 'wyoming': 'WY', 'district of columbia': 'DC',
  'seattle': 'WA', 'san francisco': 'CA', 'los angeles': 'CA', 'new york city': 'NY',
  'nyc': 'NY', 'sf': 'CA', 'la': 'CA', 'chicago': 'IL', 'boston': 'MA',
  'austin': 'TX', 'dallas': 'TX', 'houston': 'TX', 'denver': 'CO',
  'atlanta': 'GA', 'miami': 'FL', 'phoenix': 'AZ', 'portland': 'OR',
  'san diego': 'CA', 'san jose': 'CA', 'minneapolis': 'MN', 'detroit': 'MI',
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export async function getTopCompanies(limit = 100): Promise<Company[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('company_profiles')
    .select('*')
    .order('lca_total_2yr', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function searchCompanies(query: string, limit = 8) {
  const supabase = createClient()
  const q = query.toLowerCase().trim()
  const stateCode = STATE_MAP[q]

if (stateCode) {
    const { data, error } = await supabase
      .from('company_profiles')
      .select('slug, employer_name, lca_total_2yr, has_perm, employer_state')
      .eq('employer_state', stateCode)
      .order('lca_total_2yr', { ascending: false })
      .limit(limit)
    return (data ?? []) as { slug: string; employer_name: string; lca_total_2yr: number; has_perm: boolean; employer_state: string }[]
  }

  const { data } = await supabase
    .from('company_profiles')
    .select('slug, employer_name, lca_total_2yr, has_perm, employer_state')
    .ilike('employer_name', `%${query}%`)
    .order('lca_total_2yr', { ascending: false })
    .limit(limit)
  return (data ?? []) as { slug: string; employer_name: string; lca_total_2yr: number; has_perm: boolean; employer_state: string }[]
}

export async function getH1BByState() {
  const supabase = createClient()
  const { data } = await supabase
    .from('h1b_by_state')
    .select('*')
    .order('approvals', { ascending: false })
  return data ?? []
}

export async function getH1BByIndustry() {
  const supabase = createClient()
  const { data } = await supabase
    .from('h1b_by_industry')
    .select('*')
    .order('approvals', { ascending: false })
  return data ?? []
}

export async function getSchoolPipeline(university: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('school_pipelines')
    .select('*')
    .ilike('university_std', `%${university}%`)
    .order('perm_count', { ascending: false })
    .limit(20)
  return data ?? []
}

export async function getTopSchools() {
  const supabase = createClient()
  const { data } = await supabase
    .from('school_pipelines')
    .select('university_std, perm_count, avg_annual_wage')
    .order('perm_count', { ascending: false })
    .limit(50)
  return data ?? []
}

export async function getCapExempt(search = '', stateFilter = '', typeFilter = '') {
  const supabase = createClient()
  let query = supabase
    .from('cap_exempt')
    .select('*')
    .order('h1b_total_3yr', { ascending: false })
    .limit(100)

  if (search) query = query.ilike('employer_name', `%${search}%`)
  if (stateFilter) query = query.eq('primary_state', stateFilter)
  if (typeFilter) query = query.eq('institution_type', typeFilter)

  const { data } = await query
  return data ?? []
}

export async function getSectors() {
  const supabase = createClient()
  const { data } = await supabase
    .from('sector_rankings')
    .select('sector, lca_total_2yr, avg_salary_fy2025')
    .order('lca_total_2yr', { ascending: false })

  if (!data) return []

  const sectorMap: Record<string, { total: number; salarySum: number; salaryCount: number }> = {}
  for (const row of data) {
    if (!sectorMap[row.sector]) sectorMap[row.sector] = { total: 0, salarySum: 0, salaryCount: 0 }
    sectorMap[row.sector].total += row.lca_total_2yr
    if (row.avg_salary_fy2025) {
      sectorMap[row.sector].salarySum += row.avg_salary_fy2025
      sectorMap[row.sector].salaryCount++
    }
  }

  return Object.entries(sectorMap)
    .map(([sector, v]) => ({
      sector,
      lca_total: v.total,
      avg_salary: v.salaryCount > 0 ? Math.round(v.salarySum / v.salaryCount) : null,
    }))
    .sort((a, b) => b.lca_total - a.lca_total)
}

export async function getSectorCompanies(sector: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('sector_rankings')
    .select('*')
    .eq('sector', sector)
    .order('lca_total_2yr', { ascending: false })
    .limit(50)
  return data ?? []
}

export async function searchSchools(query: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('school_pipelines')
    .select('university_std, perm_count, avg_annual_wage')
    .ilike('university_std', `%${query}%`)
    .order('perm_count', { ascending: false })
    .limit(20)

  if (!data) return []

  const schoolMap: Record<string, { perm_total: number; wage_sum: number; wage_count: number }> = {}
  for (const row of data) {
    const name = row.university_std
    if (!schoolMap[name]) schoolMap[name] = { perm_total: 0, wage_sum: 0, wage_count: 0 }
    schoolMap[name].perm_total += row.perm_count
    if (row.avg_annual_wage) {
      schoolMap[name].wage_sum += row.avg_annual_wage
      schoolMap[name].wage_count++
    }
  }

  return Object.entries(schoolMap).map(([name, v]) => ({
    university_std: name,
    perm_total: v.perm_total,
    avg_wage: v.wage_count > 0 ? Math.round(v.wage_sum / v.wage_count) : null,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  })).sort((a, b) => b.perm_total - a.perm_total)
}

export async function getSchoolDetail(slug: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('school_details')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}