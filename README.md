# TTS Online Assessment Portal

An assessment and proctored examination application built with a **Python Django REST Framework** backend and a modern **React + Tailwind CSS** frontend.

All 40 questions and passages have been extracted and mapped directly from **`TTS Set D.pdf`**.

---

## Architecture & Project Structure

```
Quiz-app/
├── backend/
│   ├── manage.py
│   ├── requirements.txt            # Backend Python dependencies
│   ├── quiz_project/               # Django root project configuration
│   │   ├── settings.py             # DRF, CORS, App settings
│   │   ├── urls.py                 # Root URL configuration
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── quiz/                       # Quiz application
│       ├── admin.py                # Django Admin models registration
│       ├── models.py               # Candidate, Question, Option, Submission models
│       ├── serializers.py          # DRF Serializers for validation & responses
│       ├── views.py                # API endpoints (config, questions, submit)
│       ├── urls.py                 # API routes (/api/config, /api/questions, etc.)
│       ├── questions_data.py       # All 40 verified questions & config from TTS Set D
│       └── management/commands/    # Seed command: populate_questions
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx                 # Page state router & examination controller
│   │   ├── index.css               # Tailwind CSS styles
│   │   ├── components/
│   │   │   ├── CompanyLogo.jsx     # Branded Company Logo
│   │   │   ├── Navbar.jsx          # Top Navigation Bar with Proctor status
│   │   │   ├── WebcamMonitor.jsx   # Live Camera Proctoring component
│   │   │   ├── Timer.jsx           # 40-minute countdown timer with auto-submit
│   │   │   ├── QuestionCard.jsx    # Question, passage, options A/B/C/D selector
│   │   │   ├── QuestionPalette.jsx # 40-question navigation grid
│   │   │   └── ConfirmModal.jsx    # Submission confirmation modal
│   │   ├── pages/
│   │   │   ├── InstructionsPage.jsx    # Page 1: Logo, rules, terms, camera check, OK button
│   │   │   ├── CandidateDetailsPage.jsx# Page 2: Name & Email inputs, validation, Submit button
│   │   │   ├── ExamPage.jsx            # Page 3: 40 questions, live timer, active webcam
│   │   │   └── ResultPage.jsx          # Page 4: Performance score, sectional breakdown, review
│   │   └── services/
│   │       └── api.js              # REST API client
├── venv/                           # Python virtual environment (preconfigured)
├── TTS Set D.pdf                   # Source examination paper
└── run_app.bat                     # Single-click launcher for Windows
```

---

## Application Workflow

### 1. First Page (Instructions & Terms)
- Displays company logo and certified assessment header.
- Presents examination rules and terms:
  - 40 questions total.
  - 40 minutes duration.
  - No negative marking.
  - Laptop camera must remain active and unobstructed.
  - Honor code & fair test policies.
- Live camera preview box to verify webcam hardware readiness.
- "I Agree" checkbox and an **"OK (Proceed)"** button leading to candidate registration.

### 2. Candidate Details Page
- Provides input fields for Candidate Name and Candidate Email Address.
- Client-side and server-side validation.
- **"Submit & Start Exam"** button to initialize the test session.

### 3. Examination Page
- Displays 40 questions across Quantitative Aptitude, Logical Reasoning, and Verbal Ability (including reading comprehension passages).
- 4 options per question (`A`, `B`, `C`, `D`).
- Prominent countdown timer counting down from **40:00**.
- **Active Laptop Camera Feed** displayed in the sidebar throughout the test.
- Interactive **Question Palette (1 to 40)** indicating Answered, Not Answered, and Marked for Review questions.
- **Automatic Submission** when the 40-minute timer runs out.
- Manual **Submit Exam** button with a confirmation summary dialog.

### 4. Result Page
- Detailed score and percentage evaluation.
- Sectional breakdown bar charts.
- Question-by-question review with candidate choices vs correct answers.
- Printable assessment report.

---

## How to Run the Application

### Option A: One-Click Runner (Windows)
Double-click `run_app.bat` in the project root.

### Option B: Manual Terminal Execution

#### 1. Start Django Backend:
```bash
cd backend
..\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```
Backend API will be live at `http://127.0.0.1:8000/api/`.

#### 2. Start React Frontend:
In a separate terminal:
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## Database Integration (Future Ready)
The application includes Django ORM models (`Candidate`, `Question`, `Option`, `ExamSubmission`, `SubmissionAnswer`) with migrations already generated and applied to SQLite. You can seamlessly switch to PostgreSQL or MySQL in `backend/quiz_project/settings.py` without modifying application logic.
