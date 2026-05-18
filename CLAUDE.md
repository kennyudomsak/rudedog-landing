# CLAUDE.md — rudedog.co

ไฟล์นี้ Claude Code อ่านอัตโนมัติทุก session ของ repo `kennyudomsak/rudedog-landing`

## อ่านก่อนเริ่มทำงาน

1. `AI_HANDOFF.md` — บันทึกการเปลี่ยนแปลงล่าสุดและสิ่งที่ห้าม revert
2. `docs/google-ai-optimization-guide.md` — แนวทาง Google AI Search optimization ที่จะ adapt มาใช้กับ rudedog.co

## Project Quick Facts

- Repo: `kennyudomsak/rudedog-landing`
- Live site: `https://rudedog.co/`
- Static site (GitHub Pages + Cloudflare Worker สำหรับ Instagram feed)
- Main files:
  - `index.html`
  - `about.html`, `privacy.html`, `terms.html`
  - `assets/css/styles.css`
  - `assets/js/main.js`
- Brand: RUDEDOG (แบรนด์ไทย since 1981) — หมวก / สินค้าแฟชั่น, ขายผ่าน Shopee, TikTok Shop
- ภาษาเนื้อหา: ไทยเป็นหลัก

## Google AI Optimization — สรุปสั้น

รายละเอียดเต็มใน `docs/google-ai-optimization-guide.md`

### ทำ
- เนื้อหา unique, first-hand, มี POV ของแบรนด์
- semantic HTML + heading hierarchy ถูกต้อง
- structured data JSON-LD (`Organization`, `Product`, `WebSite`, `BreadcrumbList`)
- meta tags + OG + Twitter Card ครบทุกหน้า
- image alt + responsive + lazy load
- sitemap.xml / robots.txt อัปเดต
- Search Console verify + monitor

### ไม่ทำ
- ไม่สร้าง `llms.txt` หรือไฟล์พิเศษสำหรับ AI
- ไม่ rewrite content แค่เพื่อ AI
- ไม่ chunk เนื้อหาเป็นชิ้นเล็ก ๆ
- ไม่ทำหลายหน้าเพื่อ manipulate ranking
- ไม่ใส่ structured data ที่ไม่ตรงกับเนื้อหาจริง

## Git Workflow

- Branch ปัจจุบันที่ user กำหนด: `claude/google-ai-optimization-fP9Ju`
- พัฒนาบน branch นี้, commit, push เมื่อผู้ใช้สั่ง
- **ห้าม push** ถ้าผู้ใช้ยังไม่อนุมัติ (pattern จาก `AI_HANDOFF.md`)
- ห้ามสร้าง PR เว้นแต่ผู้ใช้สั่ง

## Style ของ user

- คุยภาษาไทย
- ต้องการให้บอกก่อน push เสมอ
- ตอบสั้น ตรงประเด็น
