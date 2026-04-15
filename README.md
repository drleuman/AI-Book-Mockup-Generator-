# AI Book Mockup Generator  
**Render Workstation for Print-Ready Book Visuals**

A high-performance mockup generation tool for creating realistic book visuals from a single cover image.

Built as a **Monolith-style rendering workstation**, the application focuses on:
- precise visual control
- controlled asset generation
- secure file handling
- production-oriented workflows

---

## 🚀 Core Capabilities

- Upload and validate book cover images (JPG, PNG, WEBP)
- Configure physical book attributes:
  - Binding type
  - Cover finish
  - Material texture
  - Spine width
  - Case wrap (hardcover)
  - Background stage color
  - Book format
- Generate:
  - Single mockups
  - Multi-perspective preview sets
- Review outputs in a structured asset gallery
- Download:
  - Individual mockups
  - Batch ZIP exports

---

## 🧠 System Philosophy

This is not a casual AI generator.

The app is designed as a:

> **“Controlled render workstation for print visualization”**

Principles:
- deterministic UI
- technical clarity
- minimal ambiguity
- strict input validation
- bounded resource usage

---

## 🛡️ Security Model

### Status: **Full Gated Architecture (v2.5-BFF)**

The application implements a multi-layer defensive model with a secure backend boundary:

### 🔐 Server-Side Gate (BFF)
- **Provider Secret Isolation**: Gemini API keys are strictly server-side. No provider SDK in the browser.
- **Strict File Validation**:
  - Magic byte (file signature) inspection via `sharp`.
  - Image decode verification.
  - Dimension constraints (200px – 12,000px).
  - File size limits (max 10MB).
  - EXIF/Metadata stripping via server-side re-encoding.
- **Enforced Rate Limiting (IP-Based)**:
  - 8 requests / minute (single generation).
  - 3 batch requests / 5 minutes.
- **Request Schema Enforcement**: Strict server-side validation of all mockup parameters.

### ⚙️ Client-Side Hardening
- UI-level rate limiting (first line of defense).
- Cooldown guard (4 seconds).
- Request deduplication (fingerprinting).
- Max session capacity: 24 generated assets.

### 📦 Output Safety
- Sanitized filenames for all downloads.
- No path injection risk.
- Controlled ZIP generation.
- Safe object URL lifecycle management.

---

## 🏗️ Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind-like utility styling (Monolith design system)

### Backend (BFF)
- Node.js + Express
- Sharp (image processing)
- Multer (secure file handling)
- Helmet (security headers)

### AI / Generation
- Google Gemini API

---

## 📁 Project Structure

```text
/server
  /routes       - API route definitions
  /services     - Provider bridge (Gemini)
  /middleware   - Rate limits & security guards
  /utils        - Sharp-based image validation
  server.ts     - BFF Entry point

/src
  /components   - UI Architecture
  /services     - Frontend proxy service (BFF calls)
  /utils        - Client-side guards
  App.tsx       - Main Workstation Hub

/public         - Static assets (Logo, Favicon)
```

---

## ⚙️ Installation & Development

```bash
git clone https://github.com/drleuman/AI-Book-Mockup-Generator-
cd AI-Book-Mockup-Generator-
npm install
```

### 🔑 Environment Variables
Create a `.env.local` file in the root:
```env
GEMINI_API_KEY=your_api_key_here
PORT=3001
```

### 🚀 Running the Workstation
To run both the **Frontend** (`5174`) and the **BFF** (`8790`) simultaneously:
```bash
npm run dev:full
```

---

## 📊 Constraints & Limits

| Parameter           | Limit              |
| ------------------- | ------------------ |
| File size           | 10 MB              |
| Min resolution      | 200 × 200 px       |
| Max resolution      | 12,000 × 12,000 px |
| Assets per session  | 24                 |
| Previews per batch  | 5                  |
| Single Requests     | 8 / min / IP       |
| Batch Requests      | 3 / 5 min / IP     |
| **Frontend Port**   | **5174**           |
| **BFF Port**        | **8790**           |

---

## 🧱 Design System

The UI follows the **Monolith v2.4** design language:
- Dark-first surfaces
- 0px corner radius (strict)
- Signal-red interaction system
- High-contrast typography
- Void-based separation (no decorative borders)

---

## 🔐 Security Standards

The system is now production-hardened:
- ✅ Browser no longer calls provider directly.
- ✅ Secrets are server-side only.
- ✅ Inputs are validated binarily on the server.
- ✅ Rate limits are enforced at the network boundary.
- ✅ Errors are sanitized to prevent data leakage.

---

## 🧭 Roadmap

- [x] UI Monolith Migration
- [x] Frontend Security Hardening
- [x] Server-Side Security Gate (BFF)
- [ ] Persistent Storage Layer
- [ ] Authentication / User Accounts
- [ ] Job Queue & Async Processing
- [ ] Multi-format export (PDF / print-ready)

---

## 📄 License
MIT

---

## 🧠 Author
**PrintPrice Pro**  
Infrastructure for print intelligence systems  
> PRICE IT. FIX IT. PRINT IT.
