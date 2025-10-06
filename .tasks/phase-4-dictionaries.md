# Phase 4: Dictionary & Wordlist Migration

**Duration**: 2-3 weeks
**Status**: Not Started
**Dependencies**: Phase 1 (Foundation), Phase 3 (Backend)

---

## Overview

Migrate all wordlists and dictionaries from JavaScript files to Supabase PostgreSQL with optimized querying. This phase transforms the legacy dictionary processor and establishes a scalable system for word validation and translations.

---

## Goals

- [ ] All wordlists migrated to Supabase
- [ ] Dictionary data normalized and indexed
- [ ] Fast word validation (<10ms lookup time)
- [ ] Dictionary management tools created
- [ ] Performance benchmarks established

---

## Tasks

### 1. Wordlist Data Analysis (Week 1)

**Source**: `www/js/wordlist/*.js`, root wordlist files (`de_wordlist.js`, etc.)

#### 1.1 Inventory Existing Wordlists
- [ ] **1.1.1** Catalog all wordlist files
  ```
  www/js/wordlist/
  ├── en_wordlist.js      (~178,000 words)
  ├── fr_wordlist.js      (~?? words)
  ├── es_wordlist.js
  ├── tl_wordlist.js      (Filipino)
  ├── de_wordlist.js      (German - in development)
  ├── it_wordlist.js      (Italian - in development)
  └── pt_wordlist.js      (Portuguese - in development)

  Root directory:
  ├── de_wordlist.js
  ├── de_cachelist.js
  └── ... (other language files)
  ```

- [ ] **1.1.2** Analyze wordlist formats
  - Identify data structure (array, object, etc.)
  - Check for metadata (frequency, category, etc.)
  - Determine file sizes and word counts
  - Note any special characters or encoding issues

- [ ] **1.1.3** Analyze cache lists
  - Understand cachelist vs wordlist difference
  - Determine if cache structure needed in new system
  - Evaluate caching strategy

#### 1.2 Dictionary Data Analysis
**Source**: `www/js/dic/*.js`, `www/js/dic/full_*`

- [ ] **1.2.1** Catalog dictionary files
  ```
  www/js/dic/
  ├── en_fr.js            (English → French)
  ├── fr_en.js            (French → English)
  ├── en_es.js            (English → Spanish)
  ├── es_en.js
  ├── en_tl.js            (English → Filipino)
  ├── tl_en.js
  └── full_*/             (Full dictionaries)
  ```

- [ ] **1.2.2** Analyze dictionary structure
  - Word → translations mapping
  - Additional metadata (part of speech, definitions, examples)
  - Bidirectional relationships
  - Synonyms and related words

- [ ] **1.2.3** Identify data quality issues
  - Duplicate entries
  - Inconsistent formatting
  - Missing translations
  - Encoding problems

### 2. Database Schema Design (Week 1)

#### 2.1 Wordlist Tables
- [ ] **2.1.1** Design `wordlists` table structure
  ```sql
  CREATE TABLE wordlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    language VARCHAR(5) NOT NULL,
    words TEXT[] NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Alternative: one row per word (normalized)
  CREATE TABLE words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    language VARCHAR(5) NOT NULL,
    word VARCHAR(255) NOT NULL,
    frequency INTEGER,
    category VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  CREATE UNIQUE INDEX idx_words_unique ON words (language, word);
  CREATE INDEX idx_words_language ON words (language);
  CREATE INDEX idx_words_word_trgm ON words USING GIN (word gin_trgm_ops);
  ```

- [ ] **2.1.2** Decide on table structure
  - **Option A**: Array-based (one row per language, words as TEXT[])
    - Pros: Simpler queries, smaller table
    - Cons: Limited per-word metadata
  - **Option B**: Normalized (one row per word)
    - Pros: Better for metadata, easier updates
    - Cons: Larger table, more complex queries

- [ ] **2.1.3** Create indexes for fast lookup
  - GIN index for array containment (`@>` operator)
  - Or B-tree index for word lookup (normalized)
  - Trigram index for fuzzy search (optional)

#### 2.2 Dictionary Tables
- [ ] **2.2.1** Design `dictionaries` table
  ```sql
  CREATE TABLE dictionaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_lang VARCHAR(5) NOT NULL,
    to_lang VARCHAR(5) NOT NULL,
    word VARCHAR(255) NOT NULL,
    translations JSONB NOT NULL,
    definitions TEXT[],
    part_of_speech VARCHAR(50),
    examples JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  CREATE INDEX idx_dict_lookup ON dictionaries (from_lang, to_lang, word);
  CREATE INDEX idx_dict_word ON dictionaries (word);
  ```

- [ ] **2.2.2** Design translations structure
  ```jsonb
  // translations field example:
  {
    "primary": ["translation1", "translation2"],
    "synonyms": ["synonym1"],
    "variants": ["variant1"]
  }
  ```

- [ ] **2.2.3** Add full-text search
  ```sql
  -- Add tsvector column for full-text search
  ALTER TABLE dictionaries
    ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
      to_tsvector('english', word || ' ' || COALESCE(array_to_string(definitions, ' '), ''))
    ) STORED;

  CREATE INDEX idx_dict_search ON dictionaries USING GIN (search_vector);
  ```

### 3. Migration Scripts (Week 1-2)

#### 3.1 Wordlist Parser
- [ ] **3.1.1** Create Node.js parser script
  ```typescript
  // scripts/migrate-wordlists.ts
  import * as fs from 'fs';
  import { createClient } from '@supabase/supabase-js';

  interface WordlistFile {
    language: string;
    words: string[];
  }

  async function parseWordlistFile(filePath: string): Promise<WordlistFile> {
    // Read JS file
    // Extract word array
    // Clean and normalize words
    // Return structured data
  }
  ```

- [ ] **3.1.2** Implement parsing logic
  - Read JavaScript files (handle different formats)
  - Extract word arrays from various structures
  - Normalize words (lowercase, trim, etc.)
  - Handle special characters and encodings
  - Remove duplicates

- [ ] **3.1.3** Batch insert to Supabase
  ```typescript
  async function insertWordlist(wordlist: WordlistFile) {
    const supabase = createClient(url, key);

    // Option A: Insert as array
    await supabase.from('wordlists').insert({
      language: wordlist.language,
      words: wordlist.words
    });

    // Option B: Insert individually (normalized)
    const wordsData = wordlist.words.map(word => ({
      language: wordlist.language,
      word: word
    }));

    // Batch insert (1000 at a time)
    for (let i = 0; i < wordsData.length; i += 1000) {
      const batch = wordsData.slice(i, i + 1000);
      await supabase.from('words').insert(batch);
    }
  }
  ```

#### 3.2 Dictionary Parser
**Source**: `dictool/` Java processor

- [ ] **3.2.1** Analyze Java dictionary processor
  - Read `dictool/DictProcessor.java`
  - Understand processing logic
  - Identify input/output formats
  - Document transformation rules

- [ ] **3.2.2** Rewrite processor in TypeScript
  ```typescript
  // scripts/migrate-dictionaries.ts
  import * as xml2js from 'xml2js';

  interface DictionaryEntry {
    word: string;
    fromLang: string;
    toLang: string;
    translations: string[];
    definitions: string[];
    partOfSpeech?: string;
  }

  async function parseDictionaryFile(filePath: string): Promise<DictionaryEntry[]> {
    // Parse XML or JSON dictionary file
    // Extract entries
    // Normalize structure
    // Return array of entries
  }
  ```

- [ ] **3.2.3** Handle different source formats
  - XML dictionaries (if used)
  - JSON dictionaries
  - JavaScript object files
  - TEI XML format (if applicable)

- [ ] **3.2.4** Batch insert dictionaries
  ```typescript
  async function insertDictionaries(entries: DictionaryEntry[]) {
    const supabase = createClient(url, key);

    const dictionaryData = entries.map(entry => ({
      from_lang: entry.fromLang,
      to_lang: entry.toLang,
      word: entry.word,
      translations: { primary: entry.translations },
      definitions: entry.definitions,
      part_of_speech: entry.partOfSpeech
    }));

    // Batch insert
    for (let i = 0; i < dictionaryData.length; i += 1000) {
      const batch = dictionaryData.slice(i, i + 1000);
      await supabase.from('dictionaries').insert(batch);
    }
  }
  ```

#### 3.3 Migration Execution
- [ ] **3.3.1** Create migration CLI
  ```bash
  # scripts/migrate.ts
  npm run migrate:wordlists -- --language en
  npm run migrate:dictionaries -- --from en --to fr
  npm run migrate:all
  ```

- [ ] **3.3.2** Add progress tracking
  - Log migration progress
  - Handle errors gracefully
  - Resume on failure
  - Validate data after migration

- [ ] **3.3.3** Verify data integrity
  ```typescript
  async function verifyWordlist(language: string) {
    // Check word count matches source
    // Validate sample words
    // Test query performance
  }
  ```

### 4. Query Optimization (Week 2)

#### 4.1 Word Validation Queries
- [ ] **4.1.1** Optimize single word lookup
  ```sql
  -- Array-based (if using TEXT[])
  SELECT EXISTS (
    SELECT 1 FROM wordlists
    WHERE language = $1 AND $2 = ANY(words)
  );

  -- Normalized (if one row per word)
  SELECT EXISTS (
    SELECT 1 FROM words
    WHERE language = $1 AND word = $2
  );
  ```

- [ ] **4.1.2** Batch word validation
  ```sql
  -- Check multiple words at once
  SELECT word, EXISTS (
    SELECT 1 FROM words w2
    WHERE w2.language = $1 AND w2.word = words_to_check.word
  ) as valid
  FROM unnest($2::text[]) AS words_to_check(word);
  ```

- [ ] **4.1.3** Add query hints and analyze
  ```sql
  EXPLAIN ANALYZE
  SELECT * FROM words
  WHERE language = 'en' AND word = 'example';

  -- Check if index is used
  -- Optimize if needed
  ```

#### 4.2 Dictionary Queries
- [ ] **4.2.1** Translation lookup
  ```sql
  SELECT translations, definitions
  FROM dictionaries
  WHERE from_lang = $1 AND to_lang = $2 AND word = $3;
  ```

- [ ] **4.2.2** Fuzzy search (optional)
  ```sql
  -- Using trigram similarity
  SELECT word, similarity(word, $1) as sim
  FROM words
  WHERE language = $2 AND word % $1
  ORDER BY sim DESC
  LIMIT 10;
  ```

- [ ] **4.2.3** Full-text search
  ```sql
  SELECT word, definitions
  FROM dictionaries
  WHERE search_vector @@ to_tsquery('english', $1)
  ORDER BY ts_rank(search_vector, to_tsquery('english', $1)) DESC;
  ```

### 5. Caching Layer (Week 2)

#### 5.1 In-Memory Cache
- [ ] **5.1.1** Implement wordlist cache in NestJS
  ```typescript
  @Injectable()
  export class WordlistCache {
    private cache: Map<string, Set<string>> = new Map();

    async loadWordlist(language: string): Promise<void> {
      const { data } = await this.supabase
        .from('words')
        .select('word')
        .eq('language', language);

      this.cache.set(language, new Set(data.map(r => r.word)));
    }

    validate(word: string, language: string): boolean {
      return this.cache.get(language)?.has(word.toLowerCase()) ?? false;
    }
  }
  ```

- [ ] **5.1.2** Preload common languages on startup
  ```typescript
  async onModuleInit() {
    await this.loadWordlist('en');
    await this.loadWordlist('fr');
    // ...
  }
  ```

- [ ] **5.1.3** Implement cache refresh strategy
  - Periodic refresh (every hour)
  - Manual refresh endpoint
  - Incremental updates (only new words)

#### 5.2 Redis Cache (Optional)
- [ ] **5.2.1** Set up Redis
  ```typescript
  import { CacheModule } from '@nestjs/cache-manager';
  import * as redisStore from 'cache-manager-redis-store';

  CacheModule.register({
    store: redisStore,
    host: 'localhost',
    port: 6379,
  });
  ```

- [ ] **5.2.2** Cache wordlist queries
  ```typescript
  @Cacheable({ key: (lang, word) => `word:${lang}:${word}`, ttl: 3600 })
  async validateWord(language: string, word: string): Promise<boolean> {
    // Query database
  }
  ```

- [ ] **5.2.3** Cache dictionary lookups
  ```typescript
  @Cacheable({ key: (from, to, word) => `dict:${from}:${to}:${word}`, ttl: 7200 })
  async translate(from: string, to: string, word: string): Promise<Translation[]> {
    // Query database
  }
  ```

### 6. Dictionary Management Tools (Week 3)

#### 6.1 Admin API
- [ ] **6.1.1** Create admin endpoints
  ```typescript
  // POST /admin/wordlists/:language/words
  async addWord(language: string, word: string)

  // DELETE /admin/wordlists/:language/words/:word
  async removeWord(language: string, word: string)

  // POST /admin/dictionaries
  async addDictionaryEntry(entry: DictionaryEntry)

  // PUT /admin/dictionaries/:id
  async updateDictionaryEntry(id: string, entry: Partial<DictionaryEntry>)
  ```

- [ ] **6.1.2** Bulk operations
  ```typescript
  // POST /admin/wordlists/:language/words/bulk
  async addWordsBulk(language: string, words: string[])

  // POST /admin/wordlists/:language/import
  async importWordlist(language: string, file: Express.Multer.File)
  ```

#### 6.2 Admin UI (Optional)
- [ ] **6.2.1** Create simple admin dashboard (Svelte)
  - View wordlist stats
  - Add/remove words
  - Search dictionary
  - Import/export tools

- [ ] **6.2.2** Word search and filtering
  - Search words by prefix
  - Filter by language
  - View word frequency/usage

- [ ] **6.2.3** Dictionary editor
  - Add new translations
  - Edit definitions
  - Manage synonyms

### 7. Performance Testing (Week 3)

#### 7.1 Benchmarking
- [ ] **7.1.1** Create performance tests
  ```typescript
  describe('Word Validation Performance', () => {
    it('should validate 1000 words in < 100ms', async () => {
      const start = Date.now();
      const words = generateRandomWords(1000);
      await Promise.all(words.map(w => wordlistService.validate(w, 'en')));
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
  ```

- [ ] **7.1.2** Test different scenarios
  - Single word validation
  - Batch validation (10, 100, 1000 words)
  - Dictionary lookup
  - Fuzzy search performance

- [ ] **7.1.3** Compare with legacy system
  - Benchmark old JavaScript wordlist lookup
  - Benchmark new Supabase queries
  - Document performance improvements

#### 7.2 Load Testing
- [ ] **7.2.1** Simulate concurrent requests
  ```bash
  # Using artillery or k6
  artillery run load-test.yml
  ```

- [ ] **7.2.2** Test cache effectiveness
  - Cache hit rate
  - Response time with/without cache
  - Memory usage

- [ ] **7.2.3** Database query analysis
  ```sql
  -- Enable query logging
  ALTER DATABASE marbble SET log_statement = 'all';

  -- Analyze slow queries
  SELECT * FROM pg_stat_statements
  ORDER BY mean_exec_time DESC
  LIMIT 10;
  ```

#### 7.3 Optimization
- [ ] **7.3.1** Identify bottlenecks
  - Slow queries
  - Missing indexes
  - Cache misses

- [ ] **7.3.2** Apply optimizations
  - Add indexes
  - Adjust cache TTL
  - Use prepared statements
  - Connection pooling

### 8. Data Validation & Quality (Week 3)

#### 8.1 Validation Scripts
- [ ] **8.1.1** Create validation script
  ```typescript
  async function validateWordlistIntegrity() {
    // Check for duplicate words
    // Verify word counts match source
    // Test sample words
    // Check encoding issues
  }
  ```

- [ ] **8.1.2** Dictionary consistency checks
  - Bidirectional translation consistency
  - Missing translations
  - Orphaned entries

- [ ] **8.1.3** Data quality reports
  - Generate reports on data issues
  - Statistics (word counts, coverage, etc.)
  - Suggest improvements

#### 8.2 Rollback Plan
- [ ] **8.2.1** Create database backup
  ```bash
  # Backup before migration
  pg_dump -h supabase-host -U postgres marbble > backup.sql
  ```

- [ ] **8.2.2** Rollback script
  ```typescript
  async function rollbackMigration() {
    // Truncate new tables
    // Restore from backup
    // Verify old system still works
  }
  ```

---

## Migration Mapping

| Legacy Source | New Destination |
|---------------|-----------------|
| `www/js/wordlist/en_wordlist.js` | `wordlists` or `words` table (language='en') |
| `www/js/wordlist/fr_wordlist.js` | `wordlists` or `words` table (language='fr') |
| `www/js/dic/en_fr.js` | `dictionaries` table (from_lang='en', to_lang='fr') |
| `dictool/` (Java processor) | `scripts/migrate-dictionaries.ts` (TypeScript) |
| In-memory wordlist arrays | Supabase + in-memory cache |

---

## Deliverables

### Data Migration
- [ ] All wordlists migrated to Supabase (7+ languages)
- [ ] All dictionaries migrated with translations
- [ ] Data validation reports (100% success rate)
- [ ] Migration scripts (reusable and documented)

### Performance
- [ ] Word validation < 10ms (p95)
- [ ] Dictionary lookup < 50ms (p95)
- [ ] Cache hit rate > 80%
- [ ] Performance benchmark report

### Tools
- [ ] Migration CLI scripts
- [ ] Admin API for wordlist/dictionary management
- [ ] Data validation and quality scripts
- [ ] (Optional) Admin UI dashboard

### Documentation
- [ ] Database schema documentation
- [ ] Migration guide (how to run scripts)
- [ ] Performance benchmarks and optimizations
- [ ] API documentation for dictionary endpoints

---

## Acceptance Criteria

- [ ] All legacy wordlists successfully migrated
- [ ] All dictionaries successfully migrated
- [ ] Word validation returns same results as legacy system
- [ ] Performance meets or exceeds legacy system
- [ ] Zero data loss during migration
- [ ] Database indexes properly configured
- [ ] Cache layer operational and effective
- [ ] Admin tools functional
- [ ] Data quality validation passes
- [ ] Rollback plan tested and documented

---

## Resources

### PostgreSQL & Supabase
- [Supabase Database](https://supabase.com/docs/guides/database)
- [PostgreSQL GIN Indexes](https://www.postgresql.org/docs/current/gin-intro.html)
- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [PostgreSQL Performance](https://www.postgresql.org/docs/current/performance-tips.html)

### Data Migration
- [Node.js File System](https://nodejs.org/api/fs.html)
- [XML Parsing (xml2js)](https://github.com/Leonidas-from-XIV/node-xml2js)
- [Batch Inserts Best Practices](https://supabase.com/docs/guides/database/insert-data)

### Caching
- [NestJS Caching](https://docs.nestjs.com/techniques/caching)
- [Redis Documentation](https://redis.io/documentation)

---

## Notes

- **Data Size**: With ~178K English words, consider partitioning or sharding if other languages are similar size
- **Encoding**: Ensure UTF-8 encoding throughout the migration
- **Backwards Compatibility**: Keep old wordlist files until migration is fully validated
- **Incremental Migration**: Can migrate one language at a time, test, then proceed
- **Custom Words**: Consider allowing users to submit new words (with moderation)

---

## Next Phase

Once Phase 4 is complete, proceed to [Phase 5: Multiplayer & Realtime](phase-5-multiplayer.md).
