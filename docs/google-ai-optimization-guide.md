# Google AI Optimization Guide — Notes for rudedog.co

แหล่งอ้างอิง: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

สรุปไว้เพื่อใช้เป็นแนวทางปรับ `rudedog.co` ให้ติดผลลัพธ์ใน AI Overviews / AI Mode / Generative AI features ของ Google Search

---

## หลักการสำคัญ (Core Principle)

- Generative AI ของ Google ใช้ระบบ ranking และ quality เดียวกับ Search ปกติ + RAG (Retrieval-Augmented Generation)
- **SEO ที่ทำอยู่ยังใช้ได้** ไม่ต้องสร้างระบบใหม่เฉพาะ AI
- คอนเทนต์ต้อง crawlable และ indexable ถึงจะถูกหยิบไปใช้ใน AI response

---

## Content Strategy

### สร้างเนื้อหาที่ไม่ใช่ commodity
- เนื้อหาต้อง **unique, compelling, useful** — มีมุมมองเฉพาะที่ของแบรนด์เอง
- หลีกเลี่ยงการรวมข้อมูลทั่วไปจากที่อื่นมาซ้ำ — เน้น first-hand review, expert insight, brand voice ของจริง
- "Helpful, reliable, people-first" — เน้น user value ไม่ใช่ keyword stuffing
- ห้ามทำหลายหน้าเพื่อ manipulate ranking (scaled content abuse)

### Format
- ผสมรูปคุณภาพสูง + วิดีโอ ไปกับข้อความ
- จัด paragraph / section / heading ให้ชัด
- ถ้าใช้ AI ช่วยเขียน ต้องไม่ละเมิด Search Essentials + spam policy

---

## Technical Requirements

### Indexing & Crawlability
- หน้าทุกหน้าต้องถูก index และ "eligible to be shown with a snippet"
- เนื้อหาต้อง crawlable ผ่าน Googlebot (public, ไม่ติด auth)
- ไซต์ใหญ่/อัปเดตบ่อย ต้อง optimize crawl budget

### Technical Structure
- ใช้ **semantic HTML** ที่ทำได้ (header / nav / main / section / article / footer / figure)
- ถ้ามี JavaScript framework ต้องทำ JS SEO ให้ผ่าน (SSR/pre-render ถ้าจำเป็น)
- Page experience ดีทุก device, latency ต่ำ
- ลด duplicate content
- Verify site ใน Search Console

---

## Structured Data & Commerce

- **Structured data ไม่ใช่ requirement** สำหรับ AI search โดยตรง
- แต่ "ใช้ต่อไปตาม SEO ปกติ" เพราะช่วยทั้ง Search ปกติ + product/brand visibility
- E-commerce: ใช้ Google Merchant Center feeds + Google Business Profile ช่วยให้ AI หยิบข้อมูลสินค้า/ร้านไปแสดง
- พิจารณา Business Agent สำหรับ conversational interaction บน Google Search

---

## What NOT to Do (Myths Google เคลียร์)

- **ไม่ต้อง** สร้าง `llms.txt` หรือ markup พิเศษสำหรับ AI
- **ไม่ต้อง** "chunk" เนื้อหาเป็นชิ้นเล็ก ๆ — ระบบเข้าใจหลาย topic ใน 1 หน้า
- **ไม่ต้อง** rewrite content เฉพาะให้ AI อ่าน — ระบบเข้าใจ synonyms / meaning อยู่แล้ว
- **ไม่ต้อง** วิ่งหาคนพูดถึงแบรนด์แบบไม่ออร์แกนิก (inauthentic mentions)
- **ไม่ต้อง** หมกมุ่นกับ structured data จนเกินไป

---

## Emerging Opportunities

- **Agent-friendly website**: เตรียม DOM ให้ browser agent อ่านง่าย (accessibility tree, semantic structure, ARIA ที่ถูกต้อง)
- ติดตามมาตรฐานใหม่ เช่น Universal Commerce Protocol (UCP)

---

## Monitoring

- Google Search Console: ตรวจ index status + technical issues
- ติดตามผ่าน Google Search Central blog / LinkedIn / X / YouTube / podcast
- Help forum ของ Google สำหรับ troubleshoot

---

## Adapt to rudedog.co — Action Items (Draft)

แนวทางที่จะปรับใช้กับเว็บ rudedog.co (ยังไม่ทำ — รอผู้ใช้สั่งเริ่มงาน)

### Quick wins (ทำได้ทันทีบน static site)
1. **Semantic HTML audit** บน `index.html`, `about.html`, `privacy.html`, `terms.html`
   - ใช้ `<main>`, `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>` ให้ครบ
   - heading hierarchy ถูกต้อง (1 × `<h1>` ต่อหน้า, ไล่ลง `<h2>`, `<h3>`)
2. **Meta + Open Graph + Twitter Card** ครบทุกหน้า
3. **Structured data (JSON-LD)** ตามที่ Google ยังแนะนำให้ใส่:
   - `Organization` — brand RUDEDOG, logo, sameAs (IG, Facebook, TikTok, Shopee)
   - `WebSite` + `SearchAction`
   - `Product` สำหรับสินค้าเด่น (ALPHA CAP ฯลฯ) พร้อมราคา / availability / link Shopee
   - `BreadcrumbList` หน้าใน
   - `FAQPage` ถ้ามี Q&A
4. **Image SEO**: `alt` ครบ, ใช้ filename สื่อความ, `loading="lazy"` (มีแล้ว), `width`/`height` ป้องกัน CLS
5. **`sitemap.xml` + `robots.txt`** ทันสมัย — ตรวจให้ครอบคลุมทุกหน้า public

### Content strategy
1. เพิ่ม brand storytelling ที่เป็น **first-hand**: เรื่องราว RUDEDOG since 1981, มุมมองช่างทำหมวก, การออกแบบ
2. หน้า product/collection มี **unique POV** ไม่ใช่แค่ลิสต์สินค้า
3. ถ้าจะเพิ่ม blog/บทความ ให้เน้น expert voice ของแบรนด์ (สไตล์, การดูแลหมวก, look book)

### Technical
1. Page speed: ตรวจ Lighthouse / PageSpeed Insights, optimize รูป (มี shimmer placeholder แล้ว, ดูเรื่อง responsive image / `srcset` ต่อ)
2. Mobile experience: รอบที่แล้ว AI_HANDOFF บันทึกว่าทำไปแล้ว ตรวจรอบใหม่หลังเพิ่ม content
3. Search Console: verify domain + monitor coverage

### E-commerce visibility
1. Google Merchant Center feed สำหรับสินค้า RUDEDOG (link ไป Shopee/TikTok Shop)
2. Google Business Profile (ถ้ามีหน้าร้าน/showroom)

### สิ่งที่ "ไม่ต้องทำ"
- ไม่ต้องสร้าง `llms.txt`
- ไม่ต้อง rewrite copy ใหม่ทั้งเว็บเพื่อ AI โดยเฉพาะ
- ไม่ต้องเพิ่ม structured data แบบ overkill ถ้าไม่สอดคล้องกับเนื้อหาจริง
