# RiskTrace — Autonomous Dispute Intelligence & Chargeback Defense

> **Razorpay Buildathon Project**: An AI-powered dispute intelligence and autonomous chargeback investigation platform for modern online merchants.

---

## 🏗️ Architecture & Tech Stack

- **Backend**: Spring Boot 3.2.3 (Java 17+), Spring Data JPA, Hibernate ORM
- **Database**: PostgreSQL 15+ (with automated schema migration & realistic data seeding)
- **AI Engine**: Groq API (`llama-3.1-70b-versatile`) for deep dispute root-cause analysis & win-probability assessment
- **Frontend**: React 18, Vite, Lucide Icons, bespoke cinematic CSS design system
- **Security**: API key validation (`X-API-KEY`), role-based merchant authentication, encrypted audit trail

---

## ⚡ Prerequisites

To run this project locally or inside an evaluation sandbox / AI agent environment, make sure you have:

| Requirement | Minimum Version | Check Command |
| :--- | :--- | :--- |
| **Java JDK** | Java 17 or higher | `java -version` |
| **Node.js & npm** | Node 18+ / npm 9+ | `node -v` && `npm -v` |
| **Docker & Compose** *(Recommended)* | Docker 20+ | `docker compose version` |
| *or* **PostgreSQL** *(Alternative)* | PostgreSQL 14+ | `psql -U postgres` |

---

## 🚀 Quick Start (Zero to Running in 3 Steps)

### Step 1: Start the PostgreSQL Database

Using Docker (fastest, zero manual configuration):
```bash
docker compose up -d
```
*(This starts a dedicated PostgreSQL instance on port `5432` with database `risktrace` pre-configured).*

> **If using an existing local PostgreSQL instead of Docker:**
> Ensure a database named `risktrace` exists on port `5432`. You can set environment variables if your local password differs:
> ```bash
> # Optional custom connection
> export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/risktrace?sslmode=disable
> export SPRING_DATASOURCE_USERNAME=postgres
> export SPRING_DATASOURCE_PASSWORD=your_password
> ```

---

### Step 2: Start the Spring Boot Backend

Open a terminal and navigate to `/backend`:

**On Windows (PowerShell / CMD):**
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

**On Linux / macOS:**
```bash
cd backend
./mvnw spring-boot:run
```

> **Automatic Data Seeder**: On first boot, RiskTrace's `DataSeeder` automatically generates schemas and populates **22 realistic merchant disputes**, complete with transaction histories, 3DS authentication telemetry, tracking IDs, customer risk scores, and audit events.
>
> You will see:
> `Tomcat started on port 8080 (http)`
> `Started RiskTraceApplication in ... seconds`

---

### Step 3: Start the Frontend Application

Open a second terminal and navigate to `/frontend`:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be live at: **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Login & Demo Credentials

1. Open **`http://localhost:5173/login`** in your browser.
2. Click **"Use Instant Demo Access"** to immediately sign into the live Merchant Command Center without typing.
3. *Or sign in manually with:*
   - **Email:** `merchant@razorpay.com`
   - **Password:** `password123`

---

## 🧪 Verifying the Backend (For Judges & AI Agents)

To programmatically verify that the backend is live and actively serving data from PostgreSQL, run:

```bash
# Windows PowerShell:
Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard" -Headers @{"X-API-KEY"="default-dev-key"}

# Linux / macOS / cURL:
curl -H "X-API-KEY: default-dev-key" http://localhost:8080/api/dashboard
```

**Expected JSON Response (HTTP 200 OK):**
```json
{
  "totalDisputes": 22,
  "totalDisputedAmount": 222283.99,
  "recentDisputes": [ ... ]
}
```

---

## 📁 Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Aggregated merchant dispute metrics, money at risk, and recent cases |
| `GET` | `/api/disputes` | Paginated, filterable dispute registry (`?status=...&priorityLevel=...`) |
| `GET` | `/api/disputes/{id}` | Full dispute dossier with transaction, payment, and customer telemetry |
| `GET` | `/api/disputes/{id}/investigate` | Auto-correlated evidence timeline & heuristic risk breakdown |
| `POST` | `/api/disputes/{id}/ai-investigate` | Triggers LLM-driven root cause analysis & win probability score |
| `POST` | `/api/disputes/{id}/decision` | Submits merchant decision (`CONTEST_DISPUTE` / `ACCEPT_DISPUTE`) |
| `POST` | `/api/disputes/intake` | Ingests new chargeback telemetry and triggers risk scoring |
| `GET` | `/api/patterns` | Velocity clustering & fraud pattern detection |

---

## ⚙️ Environment Variables Reference (Optional)

The backend comes with full working defaults, but you can override any setting via environment variables:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8080` | Spring Boot HTTP port |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/risktrace?sslmode=disable` | PostgreSQL JDBC connection URL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | `MyNewSecurePass123!` | Database password |
| `GROQ_API_KEY` | *(included fallback key)* | Groq API Key for Llama 3.1 inference |
| `API_KEY` | `default-dev-key` | Backend API auth key (`X-API-KEY`) |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Allowed CORS origins for frontend |

---

## 🎯 Verification Matrix

- [x] Spring Boot 3.2 API compiles and runs with Java 17 / 21
- [x] Automatic PostgreSQL schema creation via Hibernate (`ddl-auto=update`)
- [x] Database seeder cleanly initializes 22 realistic dispute records
- [x] React frontend builds cleanly for production (`npm run build`)
- [x] Docker Compose provided for 1-click database orchestration
