### The Perfume Dictionary — Revised PRD Version 3.0

New feature: Perfume Alternatives & Dupes Finder

The Perfume Dictionary will now have another major feature: users can search for any perfume and discover similar fragrances, affordable dupes, luxury alternatives, and perfumes with comparable scent profiles.

This should be a core feature, not an afterthought. It connects naturally to the AI Perfume Mixer, price comparison engine, community reviews and public API.

For example, a visitor searching for Parfums de Marly Delina Exclusif should be able to see its fragrance profile, potential alternatives, price comparisons, community-reported similarities, and which alternatives best match their budget.

### 1\. How the Dupes Finder should work

![Parfums de Marly DELINA EXCLUSIF - Gharyal | Official Retailer

        – Gharyal by Collectibles](https://images.openai.com/static-rsc-4/e9VnlZe2hMM97ONsnwAYFb9UurPiRpBwHl23tgtD7jEiA3Sl0b_NdHHqndvqxXYTpHIJVLehiWBs5-cu4bqS7HJOZDRGkgnU2o2rpesM4Sak1C-b8SKICgbc2ynyWPlwzfx7W9Y5lzUett-A5W_1xnjWGa_V_PXczR8aU-u8ip0TI5abhAKQLO5NiJQY4YDE?purpose=fullsize)

Step 1 — Select the original perfume

Search by brand, perfume name, concentration or fragrance family.

Example: Delina Exclusif.

![Original vs Dupe Fragrances: Comparing Iconic Scents and Their Affordable Alternatives](https://images.openai.com/static-rsc-4/1lpBF9hKgfs_702I5sWRvqn9gP47gHTir1U5Rq3AboYShKX3M0m02osA3xzV0WgjOgMOL9Wx8oOOJMx57YV44h4iPhyyZNVEuht6oQQUNLIobM-uMjjL8RXYItJ1bro-z5_-1ktxpXfdvaP7HI6ERmxvSdOlcNXCeeHhlJKUk7nJlJsgzET4UFMOIKxUqxZf?purpose=fullsize)

Step 2 — Discover alternatives

The system retrieves known community-reported dupes and calculates scent-profile similarity against other fragrances in the catalogue.

![お問い合わせ多数😆大人気ブランド香水もアウトレット価格にて販売中✋✨｜パフューマジック｜ショップトピックス｜グランベリーパーク](https://images.openai.com/static-rsc-4/X_5NcLvtPISF7x2BXizJXHw447gtE-KdtuSQ3JQaEm5kktsOCIyq8pxMo7d78iwIR9cJmVG94j_UacSUz-ZWRa2pqCpaFof4TZfJR0jU7-q0cBsZxDrdunhUi-ONWpM_mKBF-Sa0qmTiZmlvT-pfkdcyCojLIxoIq4ujX5_qeGGNkFVzxn0-zlCct-WbmVzY?purpose=fullsize)

Step 3 — Compare and choose

Users compare scent notes, longevity, sillage, price, bottle size, availability and verified retailer offers.

### Types of alternatives

| Category               | Meaning                                                                       |
| ---------------------- | ----------------------------------------------------------------------------- |
| Close dupe             | Strong scent resemblance supported by community or editorial evidence         |
| Affordable alternative | Similar fragrance character at a lower verified price                         |
| Luxury alternative     | Similar profile from another premium fragrance house                          |
| Same scent family      | Shares key accords but may smell noticeably different                         |
| Inspired-by fragrance  | Explicitly marketed as inspired by another scent, where supported by evidence |
| Layering alternative   | Two perfumes that may produce a related scent impression when layered         |

The platform must distinguish verified similarity evidence, community opinion, and algorithmic predictions. Sharing rose, oud and vanilla notes does not automatically mean two perfumes smell identical.

### Part 1 — Complete revised Product Requirements Document

# THE PERFUME DICTIONARY
## Product Requirements Document — Version 3.0

**Product:** Global Fragrance Discovery, AI Recommendation, Dupes, Price Intelligence and Developer API Platform
**Status:** Development-ready specification, subject to data-source validation
**Primary platform:** Responsive website
**Secondary platform:** Public REST API
**Future platform:** Native mobile application
**Development approach:** Phased implementation using Claude Code

---

## 1. Executive Summary

The Perfume Dictionary is a global fragrance discovery and intelligence platform designed to help users discover, understand, compare and purchase perfumes.

The platform combines:

1. A comprehensive fragrance encyclopaedia.
2. An AI Perfume Mixer for creating virtual scent profiles.
3. An AI-powered perfume alternatives and dupes finder.
4. Perfume layering recommendations.
5. Global retailer price comparison.
6. Historical prices, promotions and price-drop alerts.
7. New fragrance release tracking.
8. Community ratings, reviews and performance voting.
9. Instagram creator content and editorial articles.
10. A public fragrance API for developers and businesses.
11. Automated data pipelines and administrative tools.

The product shall operate from a central PostgreSQL catalogue with a FastAPI backend. The website and external developer services will consume shared, versioned API functionality.

### Product Vision

**Every scent has a story. Discover yours.**

### Product Positioning

Discover fragrances, find similar scents, compare real prices and make informed buying decisions.

### Core Value Proposition

A user should be able to search for a perfume, understand its fragrance profile, discover affordable dupes or luxury alternatives, compare retailer prices, review community opinions, and decide what to purchase—all within one platform.

---

## 2. Business Objectives

- Build a trusted global fragrance catalogue.
- Become a destination for perfume alternatives and dupes.
- Help consumers identify fragrances matching their preferences and budgets.
- Provide transparent, up-to-date retailer price information.
- Encourage repeat visits through price alerts, new releases and community activity.
- Generate revenue through affiliate partnerships, advertising, sponsorships and API subscriptions.
- Develop a licensable fragrance intelligence platform.

### Key Performance Indicators

- Verified perfume catalogue size and completeness.
- Search-to-profile engagement.
- Dupe Finder usage and recommendation relevance.
- AI Mixer completion rate.
- Community similarity votes and reviews.
- Retailer offer coverage and freshness.
- Price-alert engagement.
- Affiliate conversion.
- API usage and developer retention.
- Data pipeline reliability.

---

## 3. Target Audiences

### Fragrance Consumers
People researching fragrances, looking for alternatives, comparing prices, exploring scent families or deciding what to buy.

### Fragrance Collectors
Users who track owned perfumes, wishlists, longevity, sillage and performance.

### Budget-Conscious Shoppers
Consumers seeking fragrances similar to premium perfumes at more affordable prices.

### Content Creators
Perfume reviewers sharing permitted Instagram content, editorial reviews and recommendations.

### Developers and Businesses
Third-party applications, AI agents, fragrance retailers and commercial partners requiring structured fragrance data.

### Administrators
Editors, moderators, data quality analysts and platform operators.

---

## 4. Functional Requirements

### FR-01 — Perfume Encyclopaedia

**Priority: P0**

Users shall be able to search and browse fragrances by:

- Name and brand.
- Fragrance family and accords.
- Top, heart and base notes.
- Perfumer.
- Release year.
- Concentration and bottle size.
- Community rating.
- Availability and price where supported.

Each perfume profile shall include available verified metadata, approved imagery, source information, community reviews, similar perfumes, dupe recommendations and retailer offers.

The catalogue must distinguish the fragrance identity from its individual commercial variants.

### FR-02 — Perfume Alternatives & Dupes Finder

**Priority: P1 — Core Differentiator**

Users shall be able to search for a perfume and discover a ranked list of potential alternatives.

#### Required capabilities

1. Search for an original fragrance.
2. Retrieve curated and community-reported dupes.
3. Generate algorithmic similarity candidates.
4. Display affordable, premium and same-family alternatives.
5. Compare fragrance notes and accords.
6. Compare longevity, sillage and projection where reliable community data exists.
7. Compare exact bottle variants and prices.
8. Filter by budget, country, availability, brand and concentration.
9. Display similarity evidence and confidence.
10. Allow users to vote on whether two fragrances smell similar.
11. Allow users to submit potential dupes for moderation.
12. Link directly to alternative perfume profiles and retailer offers.

#### Similarity classifications

- Community-supported close dupe.
- Affordable alternative.
- Premium alternative.
- Similar scent family.
- Brand-described inspired-by fragrance.
- Algorithmically suggested alternative.

These classifications are not mutually exclusive.

#### Evidence levels

**Editorially assessed:** Reviewed using documented comparison criteria.

**Community-supported:** Supported by sufficient independent user similarity assessments.

**Algorithmic suggestion:** Identified through note, accord and style features, without confirmed sensory similarity.

**Unverified submission:** Awaiting moderation or sufficient evidence.

The system shall never label a perfume a verified dupe solely because it shares notes with another perfume.

#### Required comparison fields

- Original perfume.
- Alternative perfume.
- Relationship category.
- Shared and distinguishing notes.
- Accord similarity.
- Community similarity rating and sample size.
- Reported performance differences.
- Algorithmic similarity score and model version.
- Evidence level and source.
- Best available verified retailer offer.
- Price per 100ml.
- Last verification timestamp.

#### User journey

Search Original → View Alternatives → Filter by Budget → Compare Two Perfumes → Read Similarity Evidence → Compare Prices → Visit Retailer or Set Alert.

### FR-03 — AI Perfume Mixer

**Priority: P1**

Users shall be able to create a virtual scent using selected notes and relative weights.

Example:

- Rose: 40%.
- Oud: 30%.
- Vanilla: 20%.
- Musk: 10%.
- Style: Luxurious and romantic.

The system shall normalise preferences, construct a fragrance feature vector, search catalogue candidates and return explainable recommendations.

Initial ranking formula:

**60% note similarity + 25% accord similarity + 15% style compatibility.**

The weights shall be configurable and evaluated against human relevance assessments.

LLM-generated explanations must use retrieved catalogue records and clearly identify uncertainty.

Virtual note weights are preferences, not manufacturing formulas.

### FR-04 — Perfume Layering Assistant

**Priority: P2**

Users shall be able to select two existing perfumes and receive a hypothetical layering analysis.

The system shall compare notes and accords, explain possible complementary or contrasting characteristics, and suggest additional combinations.

Results shall not be represented as scientifically verified physical blends.

### FR-05 — Global Price Comparison

**Priority: P1**

Users shall be able to compare retailer offers for an exact perfume variant.

Features include:

- Bottle size and concentration matching.
- Retailer and country selection.
- Currency and price display.
- Delivery-inclusive totals where available.
- Price per 100ml.
- Stock and promotion status.
- Historical price charts.
- Affiliate retailer links.
- Source freshness and verification timestamps.

Cross-currency estimates must display conversion assumptions and must not be presented as guaranteed checkout totals.

### FR-06 — Price-Drop Alerts and Promotions

**Priority: P1**

Users shall be able to follow fragrances or specific variants, configure target prices and receive opted-in notifications.

The system shall detect meaningful price reductions, prevent duplicate alerts and remove expired promotions.

### FR-07 — New Release Intelligence

**Priority: P1**

The system shall monitor permitted brand announcements and authorised product feeds to identify newly launched and upcoming fragrances.

Uncertain release information shall be reviewed before publication.

### FR-08 — Community Reviews and Similarity Voting

**Priority: P1**

Authenticated users shall be able to:

- Rate perfumes.
- Vote on longevity, sillage and projection.
- Write and edit reviews.
- Maintain wishlists and collections.
- Suggest dupes.
- Rate similarity between two fragrances.
- Report inaccurate or abusive content.

Each user shall have one active similarity vote per unordered perfume pair, with editing and withdrawal supported.

Similarity voting shall be separate from perfume quality ratings.

### FR-09 — Editorial and Creator Content

**Priority: P2**

The platform shall support perfume reviews, buying guides, alternatives articles, fragrance explainers and authorised Instagram creator embeds.

Sponsored content and affiliate relationships must be disclosed.

### FR-10 — Public Developer API

**Priority: P1 for foundation; P2 for commercial access**

The platform shall expose a documented versioned REST API for:

- Perfume catalogue.
- Brands and notes.
- Search.
- AI Mixer recommendations.
- Alternatives and dupes.
- Perfume comparison.
- Retailer offers.
- Price history.
- Promotions and new releases.
- Permitted community aggregates.

Developer features shall include API keys, quotas, usage metering, versioning, documentation, webhooks and licensing controls.

### FR-11 — Administration and Moderation

**Priority: P1**

Administrators shall manage:

- Perfume catalogue records.
- Variant matching.
- Dupe suggestions and evidence.
- Community similarity disputes.
- New-release candidates.
- Retailer data sources.
- Price anomalies.
- User reviews.
- Editorial content.
- API clients and operational metrics.

All significant changes must be auditable.

### FR-12 — Monetisation

**Priority: P2**

Revenue sources:

- Affiliate retailer commissions.
- Display advertising.
- Clearly labelled sponsorships.
- Commercial API subscriptions.
- Licensed enterprise data access.
- Optional premium consumer subscriptions in later releases.

Paid placement must not alter organic similarity scores or falsely imply a fragrance is a close dupe.

---

## 5. Dupes Finder Recommendation Engine

### Candidate Sources

The engine shall combine:

1. Editorially curated alternatives.
2. Moderated community suggestions.
3. Community similarity votes.
4. Algorithmic fragrance-profile matching.
5. Permitted manufacturer descriptions.

### Proposed Initial Algorithm

For algorithmic candidate discovery:

- 40% note similarity.
- 25% accord similarity.
- 15% scent-family and style compatibility.
- 20% community similarity evidence, where sufficiently available.

When community evidence is missing, the model shall use a separately calibrated metadata-only scoring configuration rather than treating missing votes as negative evidence.

Price is a filtering and ranking preference, not evidence of scent similarity.

### Ranking Output

Every result shall include:

- Candidate perfume ID.
- Similarity score.
- Score version.
- Evidence classification.
- Matched and differing attributes.
- Community vote count.
- Confidence or data-completeness indicator.
- Price information where verified.

The platform must distinguish algorithmic resemblance from verified sensory similarity.

### Recommendation Evaluation

Evaluate ranking quality through:

- Human pairwise fragrance judgments.
- Precision at top 5.
- User-reported relevance.
- Agreement between editorial and community assessments.
- False-positive review.
- Performance across designer, niche and affordable brands.

---

## 6. User Experience and Main Pages

### Public Pages

- `/`
- `/perfumes`
- `/perfumes/[slug]`
- `/brands`
- `/notes`
- `/search`
- `/ai-perfume-mixer`
- `/perfume-dupes`
- `/perfumes/[slug]/alternatives`
- `/compare`
- `/deals`
- `/new-releases`
- `/reviews`
- `/magazine`
- `/creators`

### Account Pages

- `/account`
- `/account/wishlist`
- `/account/collections`
- `/account/price-alerts`
- `/account/saved-blends`

### Developer Pages

- `/developers`
- `/developers/docs`
- `/developers/keys`
- `/developers/usage`

### Admin Pages

- `/admin/catalogue`
- `/admin/dupe-submissions`
- `/admin/reviews`
- `/admin/retailers`
- `/admin/ingestion`
- `/admin/editorial`

### Dupes Finder Interface

The original fragrance shall appear at the top, followed by alternative cards showing perfume imagery, category, evidence level, matched notes, community similarity information, verified price and comparison actions.

Filters shall support budget, country, brand, scent family and relationship type.

Mobile layouts shall provide accessible stacked cards and a responsive filter interface.

---

## 7. Technical Architecture

### Frontend
Next.js, TypeScript, Tailwind CSS and shadcn/ui.

### Backend
Python FastAPI, Pydantic, SQLAlchemy and Alembic.

### Database
PostgreSQL with Supabase Auth.

### Recommendation Engines
Python deterministic ranking, with optional LLM-generated explanations.

### Data Ingestion
Python, Prefect and authorised source connectors.

### Background Processing
Redis-backed workers.

### Editorial CMS
Sanity.

### Testing
Pytest, frontend component tests and Playwright.

### Infrastructure
Docker Compose, GitHub Actions, managed hosting, logging, monitoring and backups.

### Architecture Principle

A single authoritative fragrance catalogue shall serve the website, AI Mixer, Dupes Finder, price comparison and public API.

---

## 8. Database Requirements

### Catalogue
`brands`, `perfumes`, `perfume_variants`, `notes`, `note_aliases`, `perfume_notes`, `perfumers`, `fragrance_families`.

### Dupes and Alternatives
`perfume_relationships`, `dupe_submissions`, `similarity_votes`, `similarity_evidence`, `similarity_scores`, `similarity_model_versions`.

### AI Mixer
`scent_styles`, `perfume_feature_vectors`, `mixer_blends`, `mixer_blend_notes`, `mixer_recommendations`, `mixer_feedback`.

### Pricing
`retailers`, `retailer_products`, `retailer_offers`, `price_observations`, `promotions`, `price_alerts`.

### Community
`profiles`, `ratings`, `dimension_votes`, `reviews`, `collections`, `review_reports`.

### Data Operations
`data_sources`, `ingestion_runs`, `raw_source_records`, `product_releases`, `change_events`, `data_quality_issues`.

### API Platform
`api_clients`, `api_keys`, `api_usage`, `webhook_subscriptions`, `webhook_deliveries`.

### Administration
`moderation_actions`, `audit_logs`.

#### Relationship Integrity

Store perfume-to-perfume similarity relationships as canonical unordered pairs to prevent duplicates.

Store directional relationships, such as "inspired by", separately when direction matters.

All user submissions and editorial decisions shall retain provenance and moderation history.

---

## 9. API Requirements

**Base URL:** `https://api.theperfumedictionary.com/v1`

### Catalogue
- GET `/perfumes`
- GET `/perfumes/{id}`
- GET `/brands`
- GET `/notes`
- GET `/search`

### Alternatives and Dupes
- GET `/perfumes/{id}/alternatives`
- GET `/perfumes/{id}/dupes`
- GET `/alternatives/search`
- GET `/alternatives/compare`
- POST `/alternatives/suggestions`
- POST `/alternatives/similarity-votes`

### AI Mixer
- GET `/mixer/notes`
- GET `/mixer/styles`
- POST `/mixer/analyse`
- POST `/mixer/recommend`
- POST `/mixer/blends`

### Pricing
- GET `/perfumes/{id}/offers`
- GET `/perfumes/{id}/price-history`
- GET `/deals`
- GET `/deals/price-drops`
- GET `/releases/latest`

### Developer Services
- POST `/developer/keys`
- GET `/developer/usage`
- POST `/webhooks/subscriptions`

Write operations shall enforce authentication, authorisation, abuse prevention and appropriate rate limits.

---

## 10. Non-Functional Requirements

### Security
Authentication, authorisation, rate limiting, API key protection, secure secrets and audit logs.

### Privacy
UK GDPR and applicable international privacy requirements, user consent, data minimisation and notification controls.

### Accessibility
WCAG 2.2 AA target, keyboard support and responsive layouts.

### Performance
Indexed search, paginated APIs, caching, background jobs and optimised media.

### Reliability
Automated tests, monitoring, backup and recovery procedures.

### Data Quality
Verified source provenance, exact variant matching, freshness timestamps and moderation.

### AI Governance
No invented perfume records, unsupported dupe claims, fabricated prices or ungrounded product descriptions.

### Commercial Integrity
Sponsored placements shall be disclosed and separated from organic rankings.

---

## 11. Release Scope

### MVP
- Searchable catalogue.
- Responsive website.
- FastAPI foundation.
- Basic community ratings.
- AI Perfume Mixer.
- Dupes Finder with curated and algorithmic alternatives.
- Basic verified retailer comparison.
- Essential admin tools.

### Beta
- Community dupe voting.
- Price history and alerts.
- Automated retailer ingestion.
- New releases.
- Editorial CMS.
- Public API beta.

### Commercial Release
- Broader retailer coverage.
- Developer subscriptions.
- Webhooks.
- Affiliate and advertising integrations.
- Operational analytics.

### Future Releases
- Perfume layering assistant.
- Personalised recommendations.
- Multilingual support.
- Mobile app.
- Enterprise fragrance intelligence.

---

## 12. Acceptance Criteria

The MVP is acceptable when:

1. Users can search for and open a perfume.
2. Users can request a list of alternatives and dupes.
3. Recommendations clearly identify their evidence level.
4. Similarity results come from real catalogue records.
5. Users can compare the original perfume with an alternative.
6. The AI Mixer accepts weighted notes and produces explainable matches.
7. Users can compare verified retailer offers for exact variants.
8. Community ratings and authentication work.
9. Admins can review and correct catalogue information.
10. The website works on mobile and desktop.
11. API contracts and database migrations are documented.
12. Critical automated tests pass.
13. Data provenance and licensing controls are implemented.

---

## 13. Major Risks

**False dupe claims:** Similar notes do not prove equivalent smell. Use evidence categories and human validation.

**Data licensing:** Catalogue information, imagery, reviews and retailer feeds may have restrictions. Obtain appropriate permissions.

**Price inaccuracies:** Retailer offers may change. Display freshness and avoid unsupported checkout totals.

**Community manipulation:** Similarity voting may be gamed. Use moderation, abuse detection and audit trails.

**AI hallucination:** Ground recommendations and explanations in catalogue records.

**Scope expansion:** Release in phases and avoid blocking the MVP on every advanced feature.

---

## 14. Definition of Done

Every feature requires working implementation, relevant tests, database migrations where needed, documented API contracts, security checks, responsive UI verification and updated project documentation.

**End of PRD Version 3.0.**

### Part 2 — Revised Claude Code Development Phases

I recommend making the Dupes Finder Phase 4, immediately after the AI Perfume Mixer. Both features can reuse the same note dictionary, fragrance vectors and similarity infrastructure.

0

Project architecture and setup

Repository, Claude instructions, PRD and system design

1

Database and FastAPI

Core catalogue, brands, notes and variants

2

Website and UI

Responsive homepage, search and perfume profiles

3

AI Perfume Mixer

Virtual scent creation and recommendations

4

Alternatives & Dupes Finder

Similarity ranking, evidence, comparisons and dupe search

5

User accounts and community

Reviews, similarity voting and wishlists

6

Price comparison

Retailer offers, variants and price history

7

Automated data intelligence

New releases, promotions, price alerts and scheduled ingestion

8

Admin, CMS and creators

Moderation, catalogue management and editorial publishing

9

Public API and developer portal

API keys, quotas, documentation and webhooks

10

SEO, security and launch

Deployment, monitoring and monetisation

11

Advanced AI and layering

Personalisation, layering and recommendation evaluation

### Part 3 — Claude Code Master Instructions

Use this prompt first, before beginning the development phases.

# Claude Code Master Instructions — The Perfume Dictionary

Act as a principal software architect, senior Python engineer, senior Next.js engineer, data engineer and machine learning engineer.

Build The Perfume Dictionary according to PRD Version 3.0.

The platform must include:
- Global fragrance catalogue.
- AI Perfume Mixer.
- Perfume Alternatives & Dupes Finder.
- Community similarity voting.
- Perfume comparison.
- Retailer price comparison.
- Price history and alerts.
- New-release and promotion ingestion.
- User reviews and collections.
- Editorial CMS and creator content.
- Public developer API.
- Administration and monetisation.

## Technology

Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui.

Backend: Python, FastAPI, Pydantic, SQLAlchemy and Alembic.

Database: PostgreSQL.

Authentication: Supabase Auth.

Data pipelines: Python and Prefect.

Background processing: Redis-backed workers.

CMS: Sanity.

Testing: Pytest and Playwright.

Infrastructure: Docker Compose and GitHub Actions.

## Engineering Requirements

1. Use one authoritative catalogue.
2. Keep business logic in reusable backend services.
3. Implement features in the specified order.
4. Use database migrations for schema changes.
5. Write tests for critical functionality.
6. Validate all external inputs.
7. Enforce authentication and authorisation.
8. Document all API contracts.
9. Do not invent live perfume records or retailer prices.
10. Do not scrape unauthorised third-party sources.
11. Distinguish verified dupes, community opinions and algorithmic alternatives.
12. Keep commercial sponsorship separate from organic ranking.
13. Do not present AI scent predictions as chemical simulations.
14. Preserve data provenance and verification timestamps.
15. Never commit credentials or secrets.
16. Do not run destructive migrations without approval.
17. Do not deploy to production without approval.

## Workflow

Before each phase:
- Inspect the repository.
- Read CLAUDE.md and relevant documentation.
- Explain the implementation plan.
- Identify integration risks.

During each phase:
- Make small, reviewable changes.
- Write migrations and tests.
- Run relevant tests.
- Document the work.

After each phase:
- Report completed features.
- Report test results.
- List unresolved issues.
- Update docs/progress.md.
- Stop and wait for approval.

Begin with Phase 0 only.

### Part 4 — Claude Code Prompts for Each Phase

### Phase 0 — Architecture and setup

Implement Phase 0: Architecture and Project Setup.

Read The Perfume Dictionary PRD Version 3.0.

Create the monorepo structure for Next.js, FastAPI, data ingestion, pricing, recommendations and notifications.

Create:
- CLAUDE.md
- README.md
- docs/prd/PRD-v3.md
- docs/architecture/system-design.md
- docs/architecture/database-design.md
- docs/architecture/api-design.md
- docs/implementation-roadmap.md
- docs/progress.md
- .env.example
- .gitignore
- Docker Compose development configuration

Define how the AI Perfume Mixer and Dupes Finder share fragrance feature vectors without duplicating business logic.

Design a canonical perfume identity model and a separate commercial variant model.

Include security, licensing, monitoring, testing and deployment plans.

Do not implement the full application yet.

Present the architecture for approval and stop.

### Phase 1 — Database and FastAPI

Implement Phase 1: Core Catalogue Database and FastAPI.

Create a Python FastAPI application with PostgreSQL, SQLAlchemy 2, Pydantic and Alembic.

Implement:
- Brands.
- Perfumes.
- Perfume variants.
- Fragrance notes.
- Note aliases.
- Fragrance families.
- Perfumers.
- Perfume-note relationships.
- Data source provenance.

Create versioned catalogue endpoints, search, filters, sorting and pagination.

Add health checks, environment configuration, Docker Compose and synthetic development data.

Create database constraints and indexes.

Write Pytest unit and integration tests.

Document the API and migrations.

Run the tests, report results and stop before Phase 2.

### Phase 2 — Website and UI

Implement Phase 2: Responsive Website.

Use Next.js, TypeScript, Tailwind CSS and shadcn/ui.

Use the approved visual design:
- Ivory #FAF7F2
- Champagne #D9C4A5
- Rose #B57E86
- Espresso #302521
- Gold #A47B42

Build:
- Homepage.
- Fragrance search.
- Perfume catalogue.
- Perfume detail pages.
- Brand directory.
- Notes dictionary.
- Fragrance family pages.
- Navigation links for AI Mixer, Dupes Finder and Price Comparison.
- Reusable perfume cards.
- Mobile navigation.
- Loading, error and empty states.

Consume the existing FastAPI catalogue endpoints.

Add SEO metadata, responsive design and accessibility.

Run component and Playwright tests.

Stop before Phase 3.

### Phase 3 — AI Perfume Mixer

Implement Phase 3: AI Perfume Mixer.

Build a virtual fragrance creation and recommendation feature.

Example:
Rose 40%, Oud 30%, Vanilla 20%, Musk 10%.
Style: Luxurious and romantic.

Implement:
- Searchable note selector.
- Relative note weights.
- Weight normalisation.
- Scent personality selection.
- Perfume feature vectors.
- Weighted cosine note similarity.
- Accord similarity.
- Style compatibility.
- Ranked catalogue recommendations.
- Matched and missing note explanations.
- Data confidence indicators.
- Saved blend support.
- Optional grounded LLM explanations.

Initial scoring:
60% note similarity.
25% accord similarity.
15% style compatibility.

Create FastAPI mixer endpoints and a Next.js `/ai-perfume-mixer` page.

Use only actual catalogue records for recommendations.

Write algorithm, validation, API and UI tests.

Document the ranking methodology and limitations.

Stop before Phase 4.

### Phase 4 — Perfume Alternatives & Dupes Finder

New core phase

Act as a senior machine learning engineer, fragrance data architect and full-stack developer.

Implement Phase 4: Perfume Alternatives & Dupes Finder.

## Objective

Allow users to search for any perfume and discover ranked alternatives, affordable dupes, luxury alternatives and fragrances with similar scent profiles.

## Database

Create migrations for:
- perfume_relationships
- dupe_submissions
- similarity_votes
- similarity_evidence
- similarity_scores
- similarity_model_versions

Reuse existing perfumes, notes, accords, feature vectors and user models.

Represent unordered similarity pairs canonically and directional inspired-by relationships separately.

## Recommendation Engine

Implement a candidate retrieval and ranking service combining:
1. Editorially curated alternatives.
2. Moderated community suggestions.
3. Community similarity votes.
4. Algorithmic note and accord similarity.
5. Scent-family and style compatibility.

Initial scoring proposal:
- 40% note similarity.
- 25% accord similarity.
- 15% family/style compatibility.
- 20% community similarity evidence when sufficient.

Use a separately calibrated metadata-only score when community evidence is unavailable.

Do not use price as evidence of scent similarity.

Store model versions and source evidence.

Do not classify a perfume as a verified dupe based solely on note overlap.

## Frontend

Create:
- /perfume-dupes
- /perfumes/[slug]/alternatives
- /compare

Build:
- Original perfume search.
- Alternative recommendation cards.
- Affordable and luxury filters.
- Budget slider.
- Country and availability filters.
- Matched and different notes.
- Community similarity display.
- Evidence-level labels.
- Side-by-side perfume comparison.
- Links to retailer offers.
- User dupe submission interface.

## FastAPI

Implement:
GET /api/v1/perfumes/{id}/alternatives
GET /api/v1/perfumes/{id}/dupes
GET /api/v1/alternatives/search
GET /api/v1/alternatives/compare
POST /api/v1/alternatives/suggestions
POST /api/v1/alternatives/similarity-votes

Protect write endpoints with authentication and authorisation.

## Testing

Test:
- Pair uniqueness.
- Ranking consistency.
- Missing community data.
- Similarity evidence classification.
- Duplicate submissions.
- Budget filters.
- Unauthorised voting.
- Self-pair rejection.
- Moderation states.
- API pagination.
- Responsive comparison pages.

Create documentation:
docs/dupes/architecture.md
docs/dupes/algorithm.md
docs/dupes/api.md
docs/dupes/testing.md

Implement in small steps, run tests and report results.

Stop before Phase 5.

### Phase 5 — User accounts and community

Implement Phase 5: User Authentication and Fragrance Community.

Use Supabase Auth with secure FastAPI JWT validation.

Build:
- Registration and login.
- User profiles.
- Overall perfume ratings.
- Longevity, sillage and projection voting.
- Written reviews.
- Wishlists and collections.
- Saved AI Mixer blends.
- Dupe suggestions.
- Perfume-pair similarity voting.
- Review reporting and moderation.

Enforce one active vote per user per perfume and rating dimension.

Enforce one active similarity vote per user per canonical perfume pair.

Allow users to edit or withdraw their votes.

Protect user data and prevent unauthorised modifications.

Write authentication, authorisation, voting and moderation tests.

Stop before Phase 6.

### Phase 6 — Global price comparison

Implement Phase 6: Global Perfume Price Comparison.

Create retailer, retailer-product, offer, price-observation, promotion and alert database models.

Implement exact variant matching using fragrance identity, concentration, size and available product identifiers.

Build:
- Retailer comparison tables.
- Country and currency filters.
- Price per 100ml.
- Shipping-inclusive totals where known.
- Historical price charts.
- Promotion details.
- Affiliate links.
- Price freshness indicators.
- Comparison links from the Dupes Finder.

Create API endpoints for offers, price history, deals and price drops.

Use synthetic development feeds until authorised real sources are available.

Do not invent live offers or scrape prohibited sources.

Write variant-matching, pricing, currency, promotion and API tests.

Stop before Phase 7.

### Phase 7 — Automated data intelligence

Implement Phase 7: Automated Fragrance Data Intelligence.

Use Python, Prefect, PostgreSQL and background workers.

Build:
- Authorised source connector interface.
- Source permission registry.
- Scheduled new-release ingestion.
- Retailer price updates.
- Promotion ingestion.
- Raw record storage.
- Validation and normalisation.
- Variant matching.
- Duplicate detection.
- Manual review queues.
- Price history updates.
- Price-drop detection.
- Promotion expiry.
- Email price alerts.
- Retry and failure handling.
- Pipeline health monitoring.

Use synthetic fixtures to demonstrate the full workflow before connecting live sources.

Ensure ingestion is idempotent.

Test repeated runs, changed prices, duplicate events, expired promotions and failed source retrieval.

Stop before Phase 8.

### Phase 8 — Admin dashboard, CMS and creators

Implement Phase 8: Administration, CMS and Creator Integration.

Create a secure admin dashboard with role-based access.

Build:
- Catalogue management.
- Perfume record merging.
- Dupe suggestion moderation.
- Similarity evidence management.
- Review moderation.
- Retailer source management.
- Price anomaly review.
- New-release approval.
- Ingestion monitoring.
- Audit logs.
- Sanity editorial CMS.
- Article publishing.
- Creator profiles.
- Authorised Instagram embeds.
- Sponsorship disclosures.

Add an admin interface to approve, reject or reclassify suggested perfume alternatives.

Keep editorial content separate from canonical catalogue data.

Test all permissions and workflows.

Stop before Phase 9.

### Phase 9 — Public developer API

Implement Phase 9: Public Developer API.

Extend the existing FastAPI application into a secure, versioned developer platform.

Expose authorised read-only services for:
- Perfume catalogue.
- Brands and notes.
- Search.
- AI Mixer recommendations.
- Perfume alternatives and dupes.
- Perfume comparison.
- Community similarity aggregates.
- Retailer offers.
- Price history.
- Promotions.
- New releases.

Implement:
- Developer registration.
- API key generation and hashing.
- Key rotation and revocation.
- Rate limiting.
- Usage metering.
- Pagination.
- OpenAPI documentation.
- Python and TypeScript examples.
- Webhook subscriptions.
- Signed webhook events.
- Delivery retries.
- Data licensing restrictions.
- Developer dashboard.

Create developer documentation and contract tests.

Do not enable paid billing without approval.

Stop before Phase 10.

### Phase 10 — Production launch

Implement Phase 10: Production Readiness.

Perform:
- Technical SEO audit.
- Sitemap generation.
- Canonical URL validation.
- Structured data validation.
- Accessibility testing.
- Security audit.
- API authentication and rate-limit testing.
- Database backup and restore testing.
- CI/CD configuration.
- Staging deployment.
- Performance testing.
- Error monitoring.
- Privacy and consent implementation.
- Affiliate disclosure integration.
- Advertising readiness.
- Production deployment planning.

Deploy Next.js, FastAPI, PostgreSQL and background workers to approved infrastructure.

Do not deploy or modify production resources without explicit approval.

Produce a PASS/FAIL launch report and list outstanding blockers.

Stop before Phase 11.

### Phase 11 — Advanced AI, layering and personalisation

Implement Phase 11: Advanced Fragrance Intelligence.

Build:
- Two-perfume layering assistant.
- Hypothetical combined scent analysis.
- Personalised recommendations.
- Recommendation feedback learning.
- Embedding-based fragrance retrieval.
- Hybrid ranking experiments.
- Community and editorial similarity evaluation.
- Improved dupe confidence scoring.
- Human relevance testing.
- Recommendation monitoring.
- LLM cost optimisation.
- AI-agent-friendly API integration.

Compare advanced models against the deterministic baseline before changing production recommendations.

Do not claim physical chemical equivalence or verified scent similarity without appropriate evidence.

Document model limitations and evaluation results.

Stop after completing the phase and reporting tests.

### Part 5 — How the features work together

Search a perfume or create an AI blend

Dupes Finder

Find alternatives

AI Mixer

Match scent preferences

Compare notes, similarity evidence and reviews

Compare verified retailer prices

Buy from retailer or set a price alert

### Recommended next implementation step

Start Claude Code with the revised PRD Version 3.0 and Phase 0 master instructions. The most important architectural change is creating a shared fragrance similarity service that supports both the AI Perfume Mixer and Dupes Finder, while maintaining separate scoring rules and evidence classifications.

That will prevent duplicate recommendation logic and make the public API easier to maintain as the platform grows.
