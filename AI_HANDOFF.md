# RUDEDOG Landing AI Handoff

อ่านไฟล์นี้ก่อนเริ่มแก้เว็บ `rudedog.co` เพื่อไม่ให้ AI หลายตัวแก้งานซ้ำหรือย้อนงานกันเอง

## Project

- Repo: `kennyudomsak/rudedog-landing`
- Live site: `https://rudedog.co/`
- Main files:
  - `index.html`
  - `assets/css/styles.css`
  - `assets/js/main.js`

## 2026-05-17 Layout Cleanup

ผู้ใช้ให้สำรวจและแก้เฉพาะความถูกต้องของเว็บไซต์ ตัวอักษร การจัดเรียง และ responsive layout โดยยังไม่โฟกัสคุณภาพเนื้อหา

### Audit Findings

- Desktop/tablet โดยรวมผ่าน ไม่มี horizontal page overflow จริง
- Mobile ไม่มี horizontal scroll จริง แต่ header แน่นและมี safety margin น้อย
- Mobile product cards สูงเกินไป เพราะ breakpoint `max-width: 560px` เปลี่ยน `.product-media` จาก 2 คอลัมน์เป็น 1 คอลัมน์ ทำให้รูปสินค้า 2 ภาพซ้อนแนวตั้ง
- Full-page screenshot มีหลายพื้นที่เป็นภาพ blank ระหว่าง lazy loading แม้ asset ไม่เสีย
- `.hero-title` บน mobile ใช้ `flex-wrap: nowrap` ซึ่งเสี่ยงล้นถ้ามีการเปลี่ยนข้อความภายหลัง

### Changes Made

- Updated `assets/css/styles.css`
- Mobile header:
  - จัด header กลับมา `align-items: center`
  - ลด padding/gap
  - ย่อ visible text ของ `.shop-link` บน mobile เป็น `Shopee` ผ่าน CSS pseudo-element เพื่อกันแถว header แน่นเกิน
- Mobile hero:
  - เปลี่ยน `.hero-title` ให้ `flex-wrap: wrap`
  - เพิ่ม `min-width: 0` และ `overflow-wrap: anywhere`
- Mobile product/dealer cards:
  - เปลี่ยน `.product-media` และ `.dealer-media` บน `max-width: 560px` กลับมาเป็น 2 คอลัมน์แบบ responsive
  - ลด padding รูป packshot บน mobile
  - ลด padding/card text เล็กน้อย
  - ทำให้ปุ่มใน product card กว้างเต็ม card เพื่อกดง่าย
- Lazy image polish:
  - เพิ่ม shimmer placeholder background ให้ `img[loading="lazy"]`
  - เพิ่ม placeholder background ให้ media containers ก่อนภาพโหลด

### Do Not Revert Without Rechecking

- อย่าเปลี่ยน `.product-media` / `.dealer-media` ใน mobile กลับเป็น `grid-template-columns: 1fr` เพราะจะทำให้ card สูงเกินและหน้า mobile ยาวมากอีกครั้ง
- อย่าใส่ `nowrap` กลับให้ `.hero-title` ใน mobile เว้นแต่มีการทดสอบที่ 360px/390px แล้วว่าไม่ล้น
- ถ้าจะปรับ performance รูปภาพต่อ ให้เช็คด้วย browser screenshot ทั้ง desktop/tablet/mobile หลังแก้

## Suggested Verification

- Run local static server from repo root
- Check:
  - `390x844`
  - `360x740`
  - `768x1000`
  - `1440x1000`
- Confirm:
  - `document.documentElement.scrollWidth === window.innerWidth`
  - mobile product cards no longer stack both images vertically
  - header buttons do not collide
  - image placeholders look intentional while lazy images load
