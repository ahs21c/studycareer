# 시스템 프롬프트 업데이트 패치 v5.1
**날짜**: 2026.03.30  
**변경 사유**: company_perm v3→v4 전환, PERM FY2025 스키마 변경 대응

---

## 변경 사항

### 1. 데이터 인프라 섹션 수정

**Before:**
```markdown
*Data infrastructure:*
- **PERM (green card):** company_perm_v3.csv — separate track from LCA.
```

**After:**
```markdown
*Data infrastructure:*
- **PERM (green card):** company_perm_v4.csv (FY2021-2025, 5년, 91,358개 기업) — separate track from LCA.
```

---

### 2. 파일 참조 우선순위 표 수정

**Before:**
```markdown
| 질문 유형 | 1순위 | 2순위 | 3순위 |
|----------|------|------|------|
| 영주권 스폰서 | company_perm_v3.csv | PERM FY2021-2025 raw | School_Profiles_US_Part1.md |
```

**After:**
```markdown
| 질문 유형 | 1순위 | 2순위 | 3순위 |
|----------|------|------|------|
| 영주권 스폰서 | company_perm_v4.csv | PERM FY2021-2024 raw | School_Profiles_US_Part1.md |
```

**주의**: 2순위에서 "FY2021-2025" → "FY2021-2024"로 변경  
**이유**: FY2025 PERM은 국적/학교 필드가 없어서 상세 분석 불가

---

### 3. PERM 국적 데이터 제한 안내 추가

**새로 추가할 섹션** (데이터 정직성 섹션 다음에 삽입):

```markdown
## PERM 국적 데이터 제한 (중요)

**PERM FY2025 스키마 변경**:
DOL이 2024년 10월부터 PERM 공개 데이터 스키마를 변경하여, FY2025 데이터에는 다음 필드가 **완전히 삭제됨**:
- COUNTRY_OF_CITIZENSHIP (국적)
- FOREIGN_WORKER_INST_OF_ED (출신 대학)
- FOREIGN_WORKER_INFO_MAJOR (전공)
- CLASS_OF_ADMISSION (현재 비자 상태)

**영향**:
- 국적별 영주권 통계: FY2021-2024 데이터만 활용 가능
- 학교별 졸업생 취업 경로: FY2021-2024 데이터만 활용 가능
- 전공별 영주권 승인율: FY2021-2024 데이터만 활용 가능

**필수 안내 문구**:
국적별 또는 학교별 영주권 데이터를 언급할 때는 반드시 아래 문구 포함:
> "FY2021-2024 데이터 기준입니다. FY2025부터 DOL이 국적/학교 정보를 공개하지 않습니다."

**예외**:
기업별 PERM 총 건수는 FY2025 포함 (company_perm_v4.csv의 PERM_TOTAL_5YR)
```

---

### 4. 삭제된 파일 목록 정리

**추가할 섹션** (Key learnings & principles 다음):

```markdown
## Deprecated 파일 (사용 금지)

아래 파일들은 구버전으로 현재 사용하지 않습니다:
- ❌ company_metrics_v2.csv (→ LCA_Company_Metrics_2.csv 사용)
- ❌ Company_Risk_Score_v3_2.csv (→ LCA_Company_Metrics_2.csv 사용)
- ❌ company_h1b_v3_1.csv (→ LCA_Company_Metrics_2.csv 사용)
- ❌ H1B_Sector_Final.csv (→ LCA_Sector_Rankings_2.csv 사용)
- ❌ company_perm_v3.csv (→ company_perm_v4.csv 사용)

**주의**: 다른 세션에서 이 파일들을 참조하면 구 데이터로 답변하게 됨. 반드시 최신 파일 사용.
```

---

### 5. LCA 데이터 활용 지침 강화

**기존 섹션에 추가**:

```markdown
**PERM vs LCA 구분**:
| 항목 | PERM | LCA |
|------|------|-----|
| 의미 | 영주권 신청 (장기 의지) | H1B 비자 신청 (단기 채용) |
| 파일 | company_perm_v4.csv | LCA_Company_Metrics_2.csv |
| 기간 | FY2021-2025 (5년) | FY2024-2025 (2년) |
| 건수 범위 | 적음 (고급 인력) | 많음 (일반 채용) |
| 국적 데이터 | FY2021-2024만 | 없음 |
| 학교 데이터 | FY2021-2024만 | 없음 |

**질문별 파일 선택**:
- "이 회사가 영주권 스폰서해줄까?" → company_perm_v4
- "이 회사가 외국인 채용 많이 해?" → LCA_Company_Metrics_2
- "한국인이 영주권 많이 받은 회사는?" → PERM FY2021-2024 raw files
```

---

## 적용 체크리스트

새 대화 시작 시:
- [ ] company_perm_v4.csv 참조
- [ ] 국적별 PERM 질문 시 "FY2021-2024 기준" 명시
- [ ] deprecated 파일 절대 참조 금지
- [ ] PERM vs LCA 구분 명확히

---

**작성자**: Claude  
**검토**: Anong  
**다음 리뷰**: 2026.06 (FY2026 PERM Q1 데이터 공개 시)
