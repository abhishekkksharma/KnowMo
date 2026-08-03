# KnowMo

KnowMo is a community-driven academic resource platform for university students. It helps students discover department-wise subjects, open subject pages, browse shared study materials, and take practice tests generated from stored question banks and Gemini-powered MCQ generation flows.

The project is split into:

- a `Next.js` frontend in the repo root
- an `Express + MongoDB` backend inside `server/`

## What The Project Does

KnowMo is designed to make study content easier to find and share.

Core user-facing features:

- browse all departments
- open a department to view its subjects
- open a subject to access notes, PYQs, assignments, labs, and other files
- filter subject resources by type and search keyword
- take practice tests for a subject using saved MCQs
- request a missing department or subject
- send messages through the contact form
- explore recent updates and featured content

Core backend/admin-facing capabilities:

- create departments
- create subjects under departments
- add resources to subjects
- store and retrieve contact submissions
- store and review department/subject requests
- generate and store MCQs for subjects

## Product Workflow

The main workflow in KnowMo is:

1. A student lands on the home page and navigates to `Departments`.
2. The app fetches department data from the backend.
3. The student opens a department page to view all subjects for that branch and year.
4. The app fetches subjects using the department code.
5. The student opens a subject page to view all uploaded resources.
6. The subject page groups learning materials by resource type such as notes, PYQs, assignments, labs, and others.
7. The student can open the practice test page for that subject.
8. The backend returns saved MCQs, or can generate MCQs through the Gemini workflow for supported flows.
9. If a department or subject is missing, the student can submit a request form.

## Project Structure

```text
KnowMo/
|-- src/app/                 # Next.js app router pages
|-- components/              # Reusable frontend UI and feature components
|-- assets/                  # Static images and visual assets
|-- lib/                     # Shared frontend helpers
|-- public/                  # Public static files
|-- server/
|   |-- src/
|   |   |-- controllers/     # Route handlers and business logic
|   |   |-- models/          # Mongoose models
|   |   |-- routes/          # Express route definitions
|   |   |-- services/        # Gemini and MCQ generation services
|   |   |-- config/          # Backend config helpers
|   |   |-- app.ts           # Express app setup
|   |   |-- server.ts        # Backend entry point
|   |-- uploads/             # Temporary uploaded files for image-based generation
|-- package.json             # Frontend scripts and dependencies
|-- README.md
```

## Tech Stack

Frontend:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide React

Backend:

- Express 5
- MongoDB with Mongoose
- TypeScript
- Multer
- JWT
- Google Gemini via `@google/genai`

## Main Routes And Pages

Frontend pages:

- `/` - home page
- `/about` - project story and contact form
- `/departments` - all departments
- `/departments/[department]` - subjects for one department
- `/subject?subjectCode=...` - subject resource page
- `/subject/test/[subjectCode]` - practice test page
- `/explore` - updates and discovery page

Backend API routes:

- `GET /api/department` - list departments
- `POST /api/department` - create a department
- `GET /api/subject/:departmentCode` - list subjects for a department
- `POST /api/subject` - create a subject
- `GET /api/resource/:subjectCode` - get subject details and resources
- `POST /api/resource` - add a resource
- `GET /api/resource/mcqs/:subjectCode` - get saved MCQs
- `POST /api/resource/mcqs` - add MCQs to a subject
- `POST /api/resource/test/mcqs/:subjectCode` - generate MCQs with prompt or image input
- `GET /api/search?q=...` - search departments and subjects
- `GET /api/updates/latest` - latest updates
- `POST /api/contact` - submit contact form
- `GET /api/contact` - list contact messages
- `POST /api/requests/department` - request a new department
- `POST /api/requests/subject` - request a new subject
- `GET /api/requests` - list submitted requests
- `POST /api/user/signup` - create user account

## Environment Variables

### Frontend `.env`

The frontend uses:

```env
NEXT_PUBLIC_CLIENT_BASE_URL=http://localhost:5000
```

This value is used by the Next.js app when it fetches backend data.

### Backend `server/.env`

The backend expects these values:

```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Notes:

- `PORT` should usually be `5000` so it matches the frontend base URL.
- `CLIENT_URL` is used by the backend CORS config.
- `GEMINI_API_KEY` is required for Gemini-based MCQ generation.

## How To Run The Project

### 1. Install frontend dependencies

From the repo root:

```bash
npm install
```

### 2. Install backend dependencies

From the backend folder:

```bash
cd server
npm install
```

### 3. Configure environment files

Create or update:

- `.env` in the repo root
- `.env` inside `server/`

Recommended local setup:

- frontend on `http://localhost:3000`
- backend on `http://localhost:5000`

### 4. Start the backend

From `server/`:

```bash
npm run dev
```

Or from the repo root:

```bash
npm run server
```

### 5. Start the frontend

From the repo root:

```bash
npm run dev
```

### 6. Open the app

Visit:

```text
http://localhost:3000
```

## Build And Production Commands

Frontend:

```bash
npm run build
npm run start
npm run lint
```

Backend:

```bash
cd server
npm run build
npm run start
```

## Recommended Local Development Workflow

Use two terminals:

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
npm run dev
```

This gives you:

- backend API on `http://localhost:5000`
- frontend app on `http://localhost:3000`

## How Data Flows Through The App

Department flow:

- frontend calls `GET /api/department`
- backend returns department records from MongoDB

Subject flow:

- frontend calls `GET /api/subject/:departmentCode`
- backend returns subjects linked to that department

Resource flow:

- frontend calls `GET /api/resource/:subjectCode`
- backend returns subject details, department info, and all linked resources

Request flow:

- frontend submits a department or subject request
- backend validates and stores the request in MongoDB

Contact flow:

- frontend submits the contact form
- backend stores the message in MongoDB

Test flow:

- frontend opens `/subject/test/[subjectCode]`
- backend returns saved MCQs for that subject
- Gemini-backed services can generate new MCQs for supported endpoints

## Important Development Notes

- The frontend and backend are separate apps and must both be running for full functionality.
- The frontend expects the backend URL from `NEXT_PUBLIC_CLIENT_BASE_URL`.
- The backend default code falls back to port `3000`, but this project should use `5000` locally to avoid conflicting with Next.js.
- Image uploads for test generation are stored temporarily in `server/uploads/`.
- MongoDB must be available before most pages can load real data.

## Suggested Improvements

The project already has a solid structure for a student resource platform. Some useful next steps would be:

- add a root script that starts frontend and backend together with `concurrently`
- add seed scripts for departments, subjects, and demo resources
- add API documentation or Swagger
- add tests for controllers and key UI flows
- add role-based admin flows for managing resources and requests
- add deployment instructions for frontend and backend environments

## Summary

KnowMo is a full-stack student knowledge-sharing platform focused on discoverability, collaboration, and exam preparation. The frontend delivers the browsing and learning experience, while the backend manages academic entities, resources, student requests, contact messages, and MCQ generation workflows.
