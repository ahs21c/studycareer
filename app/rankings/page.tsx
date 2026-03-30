"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase ───────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Types ───────────────────────────────────────────────────────────────────
interface Company {
  employer_name: string;
  employer_state: string;
  sector: string;
  lca_fy2024: number;
  lca_fy2025: number;
  lca_total_2yr: number;
  lca_trend: string;
  avg_salary_fy2025: number;
  p75_salary_fy2025: number;
  top_worksite_state: string;
  top3_worksite_states: string;   // "WA|CA|TX"
  h1b_ratio: number;
  // joined from company_perm_v4
  has_perm?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const SECTOR_LABELS: Record<string, string> = {
  ACCOUNTING: "회계",
  ADMIN_SUPPORT: "행정지원",
  ADVERTISING_PR: "광고·PR",
  AEROSPACE_MFG: "항공우주",
  AGRICULTURE: "농업",
  AI_DIGITAL_PLATFORMS: "AI·디지털",
  ARTS_ENTERTAINMENT: "예술·엔터",
  AUTOMOTIVE_MFG: "자동차",
  BANKING: "은행·금융",
  CHEMICAL_MFG: "화학",
  CLOUD_DATA: "클라우드·데이터",
  COMPUTER_ELECTRONICS_MFG: "전자기기",
  CONSTRUCTION: "건설",
  CONSULTING: "컨설팅",
  DENTISTS: "치과",
  DEPARTMENT_STORES: "백화점·유통",
  DIGITAL_CONTENT: "디지털콘텐츠",
  ECOMMERCE: "이커머스",
  ENERGY_MINING: "에너지·채굴",
  ENGINEERING_SERVICES: "엔지니어링",
  FOOD_BEVERAGE_MFG: "식품·음료",
  FOOTWEAR_APPAREL_MFG: "의류·신발",
  HOLDING_COMPANIES: "지주회사",
  HOSPITALS: "병원",
  HOTELS: "호텔·숙박",
  INDUSTRIAL_MFG: "산업기계",
  INSTRUMENTS_MFG: "계측기기",
  INSURANCE: "보험",
  INTERNET_PLATFORMS: "인터넷플랫폼",
  INVESTMENT_SECURITIES: "투자·증권",
  IT_SERVICES: "IT서비스",
  K12_SCHOOLS: "초중고교",
  LEGAL: "법률",
  MEDIA_ENTERTAINMENT: "미디어·엔터",
  MEDICAL_DEVICES_MFG: "의료기기",
  OTHER: "기타",
  OTHER_EDUCATION: "교육(기타)",
  OTHER_HOSPITALITY: "숙박(기타)",
  OTHER_MFG: "제조(기타)",
  OTHER_PROFESSIONAL: "전문직(기타)",
  OTHER_RETAIL: "소매(기타)",
  OTHER_SERVICES: "서비스(기타)",
  OUTPATIENT_HEALTH: "외래진료",
  PHARMA_MFG: "제약",
  PHYSICIANS: "의사·클리닉",
  PUBLIC_ADMIN: "공공행정",
  REAL_ESTATE: "부동산",
  RESIDENTIAL_CARE: "요양·돌봄",
  RESTAURANTS: "음식점",
  SCIENTIFIC_RD: "연구개발",
  SEMICONDUCTOR_MFG: "반도체",
  SOCIAL_SERVICES: "사회복지",
  SOFTWARE_PRODUCTS: "소프트웨어",
  SPECIALTY_HOSPITALS: "전문병원",
  STAFFING: "인력파견",
  TELECOM: "통신",
  TRANSPORTATION: "운송·물류",
  UNIVERSITIES: "대학·연구기관",
  UTILITIES: "전기·가스",
  WHOLESALE: "도매",
};

const POPULAR_SECTORS = [
  "SOFTWARE_PRODUCTS",
  "IT_SERVICES",
  "INTERNET_PLATFORMS",
  "CONSULTING",
  "BANKING",
  "ACCOUNTING",
  "SEMICONDUCTOR_MFG",
  "ENGINEERING_SERVICES",
  "CLOUD_DATA",
  "PHARMA_MFG",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

const TREND_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  INCREASING: { label: "↑ 증가", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  STABLE:     { label: "→ 유지", color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
  DECREASING: { label: "↓ 감소", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  NEW:        { label: "★ 신규", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  STOPPED:    { label: "■ 중단", color: "#aaa",    bg: "rgba(170,170,170,0.1)" },
};

const PAGE_SIZE = 50;

// ─── Component ────────────────────────────────────────────────────────────────
export default function RankingsPage() {
  const [companies, setCompanies]       = useState<Company[]>([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(false);
  const [page, setPage]                 = useState(0);

  // filters
  const [search, setSearch]             = useState("");
  const [sector, setSector]             = useState("");
  const [stateFilter, setStateFilter]   = useState("");
  const [permOnly, setPermOnly]         = useState(false);
  const [trendFilter, setTrendFilter]   = useState("");

  // ui
  const [activeRow, setActiveRow]       = useState<string | null>(null);
  const [searchInput, setSearchInput]   = useState("");

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(0); }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // reset page on filter change
  useEffect(() => { setPage(0); }, [sector, stateFilter, permOnly, trendFilter]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("company_profiles")
        .select("*", { count: "exact" })
        .order("lca_total_2yr", { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (search)      query = query.ilike("employer_name", `%${search}%`);
      if (sector)      query = query.eq("sector", sector);
      if (trendFilter) query = query.eq("lca_trend", trendFilter);

      if (stateFilter) {
        query = query.or(
          `top3_worksite_states.like.${stateFilter}|%,` +
          `top3_worksite_states.like.%|${stateFilter}|%,` +
          `top3_worksite_states.like.%|${stateFilter},` +
          `top3_worksite_states.eq.${stateFilter}`
        );
      }

      if (permOnly) query = query.eq("has_perm", true);

      const { data, count, error } = await query;
      if (error) throw error;

      setCompanies(data ?? []);
      setTotal(count ?? 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, sector, stateFilter, permOnly, trendFilter, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setSector("");
    setStateFilter("");
    setPermOnly(false);
    setTrendFilter("");
    setPage(0);
  };

  const hasFilter = search || sector || stateFilter || permOnly || trendFilter;
  const activeCompany = companies.find((c) => c.employer_name === activeRow);

  const top3States = (raw: string) =>
    raw ? raw.split("|").filter(Boolean) : [];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#f8f7f4", minHeight: "100vh", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .header-bar { background:#0f1117; padding:0 40px; height:56px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; }
        .logo { color:#fff; font-weight:700; font-size:15px; letter-spacing:-0.3px; }
        .logo span { color:#5b7cfa; }
        .nav-links { display:flex; gap:28px; }
        .nav-links a { color:rgba(255,255,255,0.5); font-size:13.5px; text-decoration:none; cursor:pointer; transition:color 0.2s; }
        .nav-links a:hover, .nav-active { color:#fff !important; }

        .hero { background:#0f1117; padding:48px 40px 0; }
        .hero-eyebrow { display:inline-flex; align-items:center; gap:6px; background:rgba(91,124,250,0.15); border:1px solid rgba(91,124,250,0.3); border-radius:20px; padding:4px 12px; font-size:11.5px; color:#8ba4fc; font-weight:500; letter-spacing:0.4px; text-transform:uppercase; margin-bottom:16px; }
        .hero h1 { font-family:'DM Serif Display',serif; font-size:36px; font-weight:400; color:#fff; line-height:1.15; margin-bottom:10px; letter-spacing:-0.5px; }
        .hero h1 em { color:#5b7cfa; font-style:italic; }
        .hero-sub { color:rgba(255,255,255,0.45); font-size:14px; line-height:1.6; max-width:540px; margin-bottom:28px; }

        .stats-row { display:flex; gap:36px; padding:20px 0; border-top:1px solid rgba(255,255,255,0.07); }
        .stat-num { font-size:22px; font-weight:700; color:#fff; letter-spacing:-0.5px; }
        .stat-label { font-size:11px; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:0.5px; margin-top:2px; }

        .section { padding:24px 40px 0; max-width:1300px; margin:0 auto; }

        .search-row { display:flex; gap:10px; align-items:center; margin-bottom:12px; }
        .search-wrap { flex:1; position:relative; }
        .search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:14px; color:#bbb; pointer-events:none; }
        .search-input { width:100%; height:44px; border:1.5px solid #e2e0db; border-radius:10px; padding:0 14px 0 40px; font-size:14px; font-family:inherit; background:#fff; outline:none; color:#1a1a1a; transition:border-color 0.2s; }
        .search-input:focus { border-color:#5b7cfa; }
        .search-input::placeholder { color:#ccc; }

        .filter-select { height:44px; border:1.5px solid #e2e0db; border-radius:10px; padding:0 32px 0 12px; font-size:13.5px; font-family:inherit; background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5' stroke-linecap='round' fill='none'/%3E%3C/svg%3E") no-repeat right 10px center; appearance:none; outline:none; color:#444; cursor:pointer; transition:border-color 0.2s; min-width:160px; }
        .filter-select:focus { border-color:#5b7cfa; }

        .chip-row { display:flex; gap:8px; align-items:center; flex-wrap:wrap; padding-bottom:16px; }
        .chip { display:inline-flex; align-items:center; gap:5px; padding:5px 12px; border-radius:20px; font-size:12.5px; font-weight:500; border:1.5px solid #e2e0db; background:#fff; cursor:pointer; transition:all 0.15s; color:#555; user-select:none; }
        .chip:hover { border-color:#5b7cfa; color:#5b7cfa; }
        .chip-active { background:#5b7cfa !important; border-color:#5b7cfa !important; color:#fff !important; }

        .meta-row { display:flex; align-items:center; justify-content:space-between; padding:14px 40px 10px; max-width:1300px; margin:0 auto; }
        .meta-count { font-size:13px; color:#777; }
        .meta-count strong { color:#1a1a1a; font-weight:600; }
        .reset-link { color:#5b7cfa; cursor:pointer; font-size:13px; }
        .sort-note { font-size:12px; color:#bbb; }

        .table-wrap { padding:0 40px 80px; max-width:1300px; margin:0 auto; }
        .co-table { width:100%; border-collapse:separate; border-spacing:0; background:#fff; border-radius:14px; border:1.5px solid #e8e6e1; overflow:hidden; }
        .co-table thead tr { background:#f5f4f1; }
        .co-table th { padding:11px 16px; font-size:11px; font-weight:600; color:#999; text-transform:uppercase; letter-spacing:0.5px; text-align:left; border-bottom:1.5px solid #e8e6e1; white-space:nowrap; }
        .co-table td { padding:14px 16px; font-size:13.5px; border-bottom:1px solid #f0ede8; vertical-align:middle; }
        .co-table tbody tr:last-child td { border-bottom:none; }
        .co-table tbody tr { transition:background 0.12s; cursor:pointer; }
        .co-table tbody tr:hover { background:#faf9f7; }
        .co-table tbody tr.row-active { background:#f0f3ff; }

        .co-name { font-weight:600; font-size:13.5px; color:#1a1a1a; }
        .co-sector { font-size:11px; color:#bbb; margin-top:2px; }
        .rank-num { font-size:12px; color:#ccc; font-weight:600; }
        .num { font-variant-numeric:tabular-nums; font-weight:600; }
        .num-sub { font-size:11px; color:#bbb; margin-top:1px; }

        .trend-badge { display:inline-flex; align-items:center; padding:3px 9px; border-radius:20px; font-size:11.5px; font-weight:600; white-space:nowrap; }
        .perm-yes { color:#10b981; font-size:12px; font-weight:500; }
        .perm-no { color:#ddd; font-size:12px; }

        .state-tag { display:inline-flex; align-items:center; justify-content:center; min-width:28px; height:19px; padding:0 4px; background:#f0ede8; border-radius:4px; font-size:10.5px; font-weight:700; color:#666; letter-spacing:0.3px; }
        .state-tag-active { background:#5b7cfa; color:#fff; }

        /* Side panel */
        .panel { position:fixed; right:0; top:56px; bottom:0; width:320px; background:#fff; border-left:1.5px solid #e8e6e1; padding:0; overflow-y:auto; z-index:50; transform:translateX(100%); transition:transform 0.25s cubic-bezier(0.16,1,0.3,1); }
        .panel.open { transform:translateX(0); }
        .panel-inner { padding:28px 24px; }
        .panel-close { position:absolute; top:14px; right:14px; width:28px; height:28px; border-radius:6px; border:1.5px solid #e8e6e1; background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:13px; color:#999; transition:all 0.15s; }
        .panel-close:hover { background:#f5f4f1; color:#333; }
        .panel-name { font-family:'DM Serif Display',serif; font-size:20px; line-height:1.25; color:#1a1a1a; margin-bottom:3px; word-break:break-word; }
        .panel-sub { font-size:12.5px; color:#bbb; margin-bottom:22px; }
        .metric-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:18px; }
        .metric-card { background:#f8f7f4; border-radius:10px; padding:13px; }
        .metric-label { font-size:10.5px; color:#bbb; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px; }
        .metric-val { font-size:19px; font-weight:700; color:#1a1a1a; letter-spacing:-0.5px; }
        .metric-hint { font-size:10.5px; color:#ccc; margin-top:2px; }
        .panel-section { font-size:11px; font-weight:600; color:#bbb; text-transform:uppercase; letter-spacing:0.5px; margin:16px 0 8px; }
        .insight-box { background:rgba(91,124,250,0.06); border:1px solid rgba(91,124,250,0.15); border-radius:10px; padding:13px; font-size:12.5px; color:#3d5acc; line-height:1.65; }
        .panel-btn { display:block; width:100%; padding:11px; background:#0f1117; color:#fff; border:none; border-radius:10px; font-size:13px; font-weight:600; font-family:inherit; cursor:pointer; text-align:center; margin-top:14px; transition:background 0.15s; }
        .panel-btn:hover { background:#1e2030; }

        .empty { padding:60px; text-align:center; color:#bbb; }
        .empty h3 { font-size:15px; margin-bottom:8px; color:#aaa; }

        .pagination { display:flex; align-items:center; gap:8px; padding:20px 0 0; justify-content:center; }
        .page-btn { height:36px; min-width:36px; padding:0 12px; border:1.5px solid #e2e0db; border-radius:8px; background:#fff; font-size:13px; color:#555; cursor:pointer; transition:all 0.15s; font-family:inherit; }
        .page-btn:hover { border-color:#5b7cfa; color:#5b7cfa; }
        .page-btn:disabled { opacity:0.35; cursor:not-allowed; }
        .page-btn.current { background:#5b7cfa; border-color:#5b7cfa; color:#fff; }
        .page-info { font-size:12.5px; color:#aaa; }

        .skeleton { background:linear-gradient(90deg,#f0ede8 25%,#e8e6e1 50%,#f0ede8 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:4px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>

      {/* ── Nav ── */}
      <header className="header-bar">
        <div className="logo">Study<span>Career</span></div>
        <nav className="nav-links">
          <a href="/universities">대학 선택</a>
          <a href="/rankings" className="nav-active">H1B 고용</a>
          <a href="/green-card">영주권 스폰서</a>
          <a href="/cities">도시 가이드</a>
          <a href="/visa">비자 계산기</a>
        </nav>
      </header>

      {/* ── Hero ── */}
      <div className="hero">
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <div className="hero-eyebrow">● FY2024-2025 · DOL 공개 데이터</div>
          <h1>미국 H1B 고용 탐색기<br /><em>94,623개 기업</em> 전수 검색</h1>
          <p className="hero-sub">
            전공·산업·지역으로 H1B 채용 기업을 찾고,<br />
            영주권 스폰서 이력까지 한 화면에 확인하세요.
          </p>
          <div className="stats-row">
            {[
              ["94,623", "H1B 활동 기업"],
              ["1.57M", "LCA 신청 건수 (2년)"],
              ["$147K", "전체 평균 연봉"],
              ["61,670", "영주권 스폰서 기업"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="section" style={{ paddingTop: 28 }}>
        <div className="search-row">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="기업명 검색 — Amazon, Google, Deloitte..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* Industry */}
          <select
            className="filter-select"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            style={{ minWidth: 170 }}
          >
            <option value="">전체 산업</option>
            {Object.entries(SECTOR_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          {/* State — TOP3 기반 필터 */}
          <select
            className="filter-select"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            style={{ minWidth: 110 }}
          >
            <option value="">전체 주</option>
            {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Quick-filter chips */}
        <div className="chip-row">
          <span style={{ fontSize: 12, color: "#aaa", marginRight: 4 }}>빠른 필터:</span>

          <span
            className={`chip ${permOnly ? "chip-active" : ""}`}
            onClick={() => setPermOnly(!permOnly)}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", opacity: 0.7 }} />
            영주권 스폰서만
          </span>

          {(["INCREASING", "NEW"] as const).map((t) => (
            <span
              key={t}
              className={`chip ${trendFilter === t ? "chip-active" : ""}`}
              onClick={() => setTrendFilter(trendFilter === t ? "" : t)}
            >
              {TREND_CONFIG[t].label} 기업
            </span>
          ))}

          {POPULAR_SECTORS.slice(0, 5).map((s) => (
            <span
              key={s}
              className={`chip ${sector === s ? "chip-active" : ""}`}
              onClick={() => setSector(sector === s ? "" : s)}
            >
              {SECTOR_LABELS[s]}
            </span>
          ))}
        </div>
      </div>

      {/* ── Meta ── */}
      <div className="meta-row">
        <p className="meta-count">
          {loading ? "검색 중..." : (
            <><strong>{total.toLocaleString()}</strong>개 기업 {page > 0 && `· ${page + 1}페이지`}</>
          )}
          {hasFilter && (
            <> · <span className="reset-link" onClick={resetFilters}>필터 초기화</span></>
          )}
        </p>
        <span className="sort-note">LCA 건수 기준 정렬</span>
      </div>

      {/* ── Table ── */}
      <div className="table-wrap">
        {loading ? (
          <table className="co-table">
            <thead>
              <tr>
                {["#", "기업명", "LCA 건수", "평균 연봉", "채용 트렌드", "영주권", "주요 근무지"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 12 }).map((_, i) => (
                <tr key={i}>
                  <td><div className="skeleton" style={{ width: 20, height: 14 }} /></td>
                  <td><div className="skeleton" style={{ width: 180, height: 14, marginBottom: 6 }} /><div className="skeleton" style={{ width: 100, height: 11 }} /></td>
                  <td><div className="skeleton" style={{ width: 60, height: 14 }} /></td>
                  <td><div className="skeleton" style={{ width: 60, height: 14 }} /></td>
                  <td><div className="skeleton" style={{ width: 60, height: 22, borderRadius: 20 }} /></td>
                  <td><div className="skeleton" style={{ width: 50, height: 14 }} /></td>
                  <td><div className="skeleton" style={{ width: 80, height: 20 }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : companies.length === 0 ? (
          <div className="empty">
            <h3>검색 결과 없음</h3>
            <p>다른 키워드나 필터를 시도해보세요.</p>
          </div>
        ) : (
          <>
            <table className="co-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>기업명</th>
                  <th>LCA 건수 ↓</th>
                  <th>평균 연봉</th>
                  <th>채용 트렌드</th>
                  <th>영주권 스폰서</th>
                  <th>주요 근무지</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c, i) => {
                  const rank = page * PAGE_SIZE + i + 1;
                  const t = TREND_CONFIG[c.lca_trend] ?? TREND_CONFIG.STABLE;
                  const states = top3States(c.top3_worksite_states);
                  const isActive = activeRow === c.employer_name;

                  return (
                    <tr
                      key={c.employer_name}
                      className={isActive ? "row-active" : ""}
                      onClick={() => setActiveRow(isActive ? null : c.employer_name)}
                    >
                      <td><span className="rank-num">{rank}</span></td>
                      <td>
                        <div className="co-name">{c.employer_name}</div>
                        <div className="co-sector">{SECTOR_LABELS[c.sector] ?? c.sector}</div>
                      </td>
                      <td>
                        <div className="num">{c.lca_total_2yr.toLocaleString()}</div>
                        <div className="num-sub">
                          {c.lca_fy2024.toLocaleString()} → {c.lca_fy2025.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <div className="num">
                          {c.avg_salary_fy2025
                            ? `$${Math.round(c.avg_salary_fy2025 / 1000)}K`
                            : "—"}
                        </div>
                        {c.p75_salary_fy2025 > 0 && (
                          <div className="num-sub">
                            P75 ${Math.round(c.p75_salary_fy2025 / 1000)}K
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="trend-badge" style={{ color: t.color, background: t.bg }}>
                          {t.label}
                        </span>
                      </td>
                      <td>
                        {c.has_perm
                          ? <span className="perm-yes">✓ 있음</span>
                          : <span className="perm-no">— 없음</span>}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {states.map((s, idx) => (
                            <span
                              key={s}
                              className={`state-tag ${stateFilter === s ? "state-tag-active" : ""}`}
                              style={idx === 0 && !stateFilter ? { background: "#e8e6e1", color: "#444" } : {}}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {total > PAGE_SIZE && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  ← 이전
                </button>
                {Array.from({ length: Math.min(5, Math.ceil(total / PAGE_SIZE)) }).map((_, i) => {
                  const p = Math.max(0, page - 2) + i;
                  if (p >= Math.ceil(total / PAGE_SIZE)) return null;
                  return (
                    <button
                      key={p}
                      className={`page-btn ${p === page ? "current" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p + 1}
                    </button>
                  );
                })}
                <button
                  className="page-btn"
                  disabled={page >= Math.ceil(total / PAGE_SIZE) - 1}
                  onClick={() => setPage(page + 1)}
                >
                  다음 →
                </button>
                <span className="page-info">
                  {page + 1} / {Math.ceil(total / PAGE_SIZE)} 페이지 · 총 {total.toLocaleString()}개
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Side Panel ── */}
      {activeCompany && (() => {
        const c = activeCompany;
        const t = TREND_CONFIG[c.lca_trend] ?? TREND_CONFIG.STABLE;
        const states = top3States(c.top3_worksite_states);
        return (
          <div className="panel open">
            <div className="panel-inner">
              <button className="panel-close" onClick={() => setActiveRow(null)}>✕</button>
              <div className="panel-name">{c.employer_name}</div>
              <div className="panel-sub">
                {SECTOR_LABELS[c.sector] ?? c.sector} · {states.join(", ")}
              </div>

              <div className="metric-grid">
                <div className="metric-card">
                  <div className="metric-label">LCA 건수</div>
                  <div className="metric-val">{(c.lca_total_2yr / 1000).toFixed(1)}K</div>
                  <div className="metric-hint">FY2024-2025 합산</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">평균 연봉</div>
                  <div className="metric-val">
                    {c.avg_salary_fy2025 ? `$${Math.round(c.avg_salary_fy2025 / 1000)}K` : "—"}
                  </div>
                  <div className="metric-hint">FY2025 기준</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">채용 트렌드</div>
                  <div className="metric-val" style={{ fontSize: 13, color: t.color, marginTop: 4 }}>{t.label}</div>
                  <div className="metric-hint">전년 대비</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">영주권 스폰서</div>
                  <div className="metric-val" style={{ fontSize: 13, color: c.has_perm ? "#10b981" : "#ccc", marginTop: 4 }}>
                    {c.has_perm ? "이력 있음" : "없음"}
                  </div>
                  <div className="metric-hint">FY2021-2025</div>
                </div>
              </div>

              {c.p75_salary_fy2025 > 0 && (
                <>
                  <div className="panel-section">연봉 분포</div>
                  <div style={{ background: "#f8f7f4", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#666", marginBottom: 8 }}>
                      <span>평균</span>
                      <span style={{ fontWeight: 600 }}>
                        ${Math.round(c.avg_salary_fy2025 / 1000)}K
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#666" }}>
                      <span>상위 25% (P75)</span>
                      <span style={{ fontWeight: 600, color: "#5b7cfa" }}>
                        ${Math.round(c.p75_salary_fy2025 / 1000)}K
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className="panel-section">인사이트</div>
              <div className="insight-box">
                {c.has_perm
                  ? `H1B 채용과 영주권 스폰서 이력을 모두 갖춘 기업입니다. 장기 커리어 경로로 적합합니다.`
                  : `H1B 채용은 활발하지만 영주권 스폰서 이력이 없습니다. 입사 후 이직 계획을 함께 세우는 것을 권장합니다.`}
                {c.lca_trend === "INCREASING" && " 최근 채용이 증가 추세로 지원 타이밍이 좋습니다."}
                {c.lca_trend === "DECREASING" && " 채용이 감소 중이므로 지원 전 최신 채용 공고를 확인하세요."}
              </div>

              <button className="panel-btn">기업 상세 프로필 보기 →</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
