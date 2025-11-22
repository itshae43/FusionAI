# 🚀 Fusion AI - Intelligent Research & Data Analysis Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![E2B](https://img.shields.io/badge/E2B-Code%20Interpreter-orange?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)

**A powerful AI-powered platform for web research and data analysis with secure code execution**

[Features](#-features) • [Architecture](#-architecture) • [Setup](#-quick-start) • [Usage](#-usage) • [API](#-api-documentation)

</div>

---

## 📋 Overview

Fusion AI is a modern research and data analysis application that combines the power of Large Language Models (LLMs) with secure code execution environments. Built with Next.js and TypeScript, it provides:

- **🔍 AI-Powered Research**: Web search capabilities using Exa API with intelligent summarization
- **📊 Data Analysis**: CSV file analysis with auto-generated Python code execution via E2B sandboxes
- **💾 Dataset Management**: Organize and manage your datasets with folder structures
- **🔒 Secure Execution**: All code runs in isolated E2B sandboxes for maximum security


---

## ✨ Features

### 🧠 Intelligent Chat Interface
- **Research Mode**: Enable web search to get real-time information from the internet
- **Analysis Mode**: Upload CSV files and ask questions about your data
- **Streaming Responses**: Real-time AI responses with markdown formatting
- **Clickable Links**: All URLs in research results are clickable and open in new tabs
- **Visual Hierarchy**: Proper heading styles, lists, code blocks, and blockquotes

### 📈 Data Analysis Engine
- **CSV Processing**: Automatic column detection and schema extraction
- **AI Code Generation**: LLM generates Python code based on your questions
- **Secure Execution**: Code runs in E2B Code Interpreter sandboxes
- **Auto Dependencies**: Automatically installs required Python packages (pandas, tabulate, etc.)
- **Result Visualization**: View analysis output, generated code, and execution logs

### 🗂️ Dataset Management
- **File Upload**: Support for CSV, PDF, and SVG files
- **Folder Organization**: Drag-and-drop chat organization into folders
- **File Metadata**: Track file size, upload date, and folder location
- **Supabase Storage**: Secure cloud storage for all datasets

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16.0.3 + React 19 | App Router, Server Components, Streaming |
| **Styling** | Tailwind CSS v4 | Utility-first styling with custom design system |
| **UI Components** | shadcn/ui + lucide-react | Accessible, customizable components |
| **Language** | TypeScript 5.0 | Type safety across the entire stack |
| **Database** | Supabase (PostgreSQL) | File metadata, user data, chat history |
| **Storage** | Supabase Storage | Binary file storage (CSV, PDF, SVG) |
| **AI Models** | Groq (Llama 3.3 70B) | Code generation and chat responses |
| **Code Execution** | E2B Code Interpreter | Secure Python sandboxes |
| **Web Search** | Exa API | AI-powered web search for research |
| **CSV Parsing** | PapaParse | Client and server-side CSV processing |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Chat Page   │  │ Datasets Page│  │   Sidebar    │          │
│  │  /chat       │  │  /datasets   │  │   Layout     │          │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘          │
└─────────┼──────────────────┼──────────────────────────────────┬─┘
          │                  │                                   │
          │                  │                                   │
┌─────────▼──────────────────▼───────────────────────────────────▼─┐
│                      API Routes (Next.js)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ /api/chat    │  │/api/chat/    │  │ /api/upload  │           │
│  │              │  │  analyze     │  │              │           │
│  │ (Research)   │  │ (Analysis)   │  │ (File Upload)│           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          │                  │                  │
    ┌─────▼─────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │   Groq    │      │    E2B    │     │ Supabase  │
    │    LLM    │      │  Sandbox  │     │  Storage  │
    │  (Llama)  │      │  (Python) │     │ (Files DB)│
    └─────┬─────┘      └─────┬─────┘     └───────────┘
          │                  │
          │                  │
    ┌─────▼─────┐      ┌─────▼─────┐
    │  Exa API  │      │  Python   │
    │ (Research)│      │ Libraries │
    │  Search   │      │pandas,etc │
    └───────────┘      └───────────┘
```

### Key Components

#### 1. **E2B Code Interpreter Integration**
```typescript
// Secure Python execution in isolated sandboxes
import { Sandbox } from '@e2b/code-interpreter';

// Create sandbox → Upload files → Run code → Get results → Cleanup
```

**E2B Features Used:**
- ✅ Secure code execution (no system access)
- ✅ File upload/download capabilities
- ✅ Automatic Python environment setup
- ✅ Real-time stdout/stderr streaming
- ✅ Package installation (pip)

#### 2. **Groq LLM (Llama 3.3 70B)**
```typescript
import Groq from 'groq-sdk';

// Used for:
// - Python code generation
// - Research query analysis
// - Natural language responses
```

#### 3. **Exa API for Research**
```typescript
// AI-powered web search with content extraction
// Returns: title, URL, snippet, published date
```

#### 4. **Supabase Backend**
```sql
-- Files table for metadata
CREATE TABLE files (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  folder_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  size BIGINT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage bucket: "files"
-- RLS policies for secure access
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))
- E2B API key ([e2b.dev](https://e2b.dev))
- Groq API key ([console.groq.com](https://console.groq.com))
- Exa API key ([exa.ai](https://exa.ai))

### 1. Clone the Repository

```bash
git clone https://github.com/itshae43/FusionAI.git
cd fusion-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a New Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned

#### Run the Schema Migration
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql`
3. Paste and execute the SQL

#### Create Storage Bucket
1. Navigate to **Storage** in Supabase dashboard
2. Click **"New Bucket"**
3. Name: `files`
4. Public: `false` (or `true` if you want public access)
5. File size limit: `52428800` (50MB)

#### Create Storage Policy
```sql
CREATE POLICY "Allow file operations" ON storage.objects
  FOR ALL
  USING (bucket_id = 'files')
  WITH CHECK (bucket_id = 'files');
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# E2B Configuration (Code Execution)
E2B_API_KEY=your-e2b-api-key

# Groq Configuration (LLM)
GROQ_API_KEY=your-groq-api-key

# Exa Configuration (Web Search)
EXA_API_KEY=your-exa-api-key
```

#### How to Get API Keys:

**Supabase:**
- Go to **Settings** → **API** in your Supabase dashboard
- Copy `URL`, `anon` key, and `service_role` key

**E2B:**
- Sign up at [e2b.dev](https://e2b.dev)
- Go to **Settings** → **API Keys**
- Create a new API key

**Groq:**
- Sign up at [console.groq.com](https://console.groq.com)
- Navigate to **API Keys**
- Create a new API key

**Exa:**
- Sign up at [exa.ai](https://exa.ai)
- Go to **Dashboard** → **API Keys**
- Create a new API key

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

---

## 💡 Usage

### Research Mode 🔍

1. Navigate to the **Chat** page
2. Click the **Search icon** in the input box to enable research mode
3. Type your question (e.g., "What are the top AI companies in India?")
4. Press **Send** or hit **Enter**
5. The AI will search the web and provide a comprehensive answer with clickable source links

**Example:**
```
User: "What are the latest developments in quantum computing?"

AI: According to recent research:

1. **IBM's 127-Qubit Processor** - [Read more](https://example.com)
   IBM announced their new quantum processor...

2. **Google's Quantum Supremacy Update** - [Read more](https://example.com)
   Google researchers demonstrated...
```

### Analysis Mode 📊

1. Navigate to the **Chat** page
2. Click the **Plus (+) icon** in the input box
3. Select one or more CSV files from the popup
4. Type your question about the data (e.g., "What is the average churn rate?")
5. Press **Send**
6. The AI will:
   - Detect CSV columns automatically
   - Generate Python code to answer your question
   - Execute the code in a secure E2B sandbox
   - Display the results with charts (if applicable)

**Example:**
```
User: "What is the churn rate by region?" [customer_data.csv]

AI: Analyzing data...

Results:
┌──────────┬────────────┐
│ Region   │ Churn Rate │
├──────────┼────────────┤
│ North    │    12.5%   │
│ South    │    8.3%    │
│ East     │    15.2%   │
│ West     │    9.7%    │
└──────────┴────────────┘

[View generated Python code ▼]
```

### Dataset Management 🗂️

1. Navigate to the **Datasets** page
2. Click **Upload File** button
3. Select CSV, PDF, or SVG files
4. Organize files into folders by dragging chats to folder cards
5. View file metadata (size, upload date, type)

---

## 🔧 API Documentation

### POST `/api/chat`
**Research Mode Chat Endpoint**

```typescript
// Request
{
  "messages": [
    { "role": "user", "content": "What is quantum computing?" }
  ],
  "useResearch": true
}

// Response (Streaming)
// Server-Sent Events with text chunks
```

### POST `/api/chat/analyze`
**Data Analysis Endpoint**

```typescript
// Request
{
  "question": "What is the average sales by region?",
  "fileIds": ["uuid-1", "uuid-2"]
}

// Response
{
  "status": "completed",
  "stdout": "Analysis results...",
  "code": "import pandas as pd\n...",
  "files": [
    { "id": "uuid-1", "name": "sales.csv" }
  ]
}
```

### POST `/api/upload`
**File Upload Endpoint**

```typescript
// Request (FormData)
{
  "file": File,
  "folderId": "optional-folder-id"
}

// Response
{
  "message": "File uploaded successfully",
  "file": {
    "id": "uuid",
    "name": "data.csv",
    "path": "files/uuid.csv",
    "size": 1024
  }
}
```

---

## 📂 Project Structure

```
fusion-ai/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes
│   │   │   ├── chat/
│   │   │   │   ├── route.ts      # Research chat endpoint
│   │   │   │   └── analyze/
│   │   │   │       └── route.ts  # Data analysis endpoint
│   │   │   ├── upload/
│   │   │   │   └── route.ts      # File upload endpoint
│   │   │   └── research/
│   │   │       └── route.ts      # Research endpoint
│   │   ├── chat/
│   │   │   └── page.tsx          # Chat interface
│   │   ├── datasets/
│   │   │   └── page.tsx          # Dataset management
│   │   ├── layout.tsx            # Root layout with sidebar
│   │   ├── page.tsx              # Home (redirects to chat)
│   │   └── globals.css           # Global styles
│   │
│   ├── components/               # React Components
│   │   ├── analysis/
│   │   │   ├── AnalysisOutput.tsx # Analysis results display
│   │   │   └── Chart.tsx          # Chart visualization
│   │   ├── chat/
│   │   │   └── ChatInput.tsx      # Chat input with attachments
│   │   ├── datasets/
│   │   │   ├── FileTable.tsx      # File list table
│   │   │   ├── FolderCard.tsx     # Folder cards
│   │   │   └── UploadFileModal.tsx # File upload modal
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        # Collapsible sidebar
│   │   │   ├── SidebarItem.tsx    # Folder tree items
│   │   │   └── NavTabs.tsx        # Navigation tabs
│   │   └── ui/
│   │       └── card.tsx           # shadcn Card component
│   │
│   ├── lib/                      # Utilities & Helpers
│   │   ├── analysis/
│   │   │   └── runner.ts         # Analysis execution logic
│   │   ├── e2b/
│   │   │   ├── Analysis.ts       # E2B sandbox wrapper
│   │   │   ├── research.ts       # Research with Exa API
│   │   │   └── sandbox.ts        # Sandbox utilities
│   │   ├── constants.ts          # App constants
│   │   ├── supabase.ts           # Supabase client
│   │   └── utils.ts              # Utility functions
│   │
│   └── types/                    # TypeScript Types
│       ├── index.ts              # Core types
│       ├── analysis.ts           # Analysis types
│       └── research.ts           # Research types
│
├── public/                       # Static assets
├── supabase-schema.sql           # Database schema
├── components.json               # shadcn/ui config
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js configuration
└── package.json                  # Dependencies
```

---

## 🔐 Security Features

- **E2B Sandboxes**: All code execution happens in isolated containers
- **Supabase RLS**: Row-level security policies protect data
- **Environment Variables**: Sensitive keys never exposed to client
- **Input Validation**: All API inputs are validated and sanitized
- **CORS Protection**: API routes protected from unauthorized origins

---

## 🎨 Design System

### Colors
- **Sidebar Background**: `#F5F5F5`
- **Folder Cards**: `#FDFDFD`
- **Text Primary**: `#000000`
- **Links**: `#2563EB` (Blue 600)
- **Success**: `#10B981` (Green 500)
- **Error**: `#EF4444` (Red 500)

### Typography
- **Headings**: Inter font, bold weights
- **Body**: System font stack
- **Code**: Monospace, dark theme

---

## 🧪 Testing

### Run Analysis Test
```bash
npx tsx test-research.ts
```

### Run Sandbox Test
```bash
npx tsx test-sandbox.ts
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **E2B** for secure code execution sandboxes
- **Groq** for blazing-fast LLM inference
- **Exa** for AI-powered web search
- **Supabase** for backend infrastructure
- **Vercel** for Next.js framework and hosting
- **shadcn/ui** for beautiful UI components

---

## 📧 Contact

**Project Maintainer**: Shailendra  
**Repository**: [github.com/itshae43/FusionAI](https://github.com/itshae43/FusionAI)

For questions or support, please open an issue on GitHub.

---

<div align="center">

**Built with ❤️ using Next.js, E2B, and Supabase**

⭐ Star this repo if you find it helpful!

</div>

