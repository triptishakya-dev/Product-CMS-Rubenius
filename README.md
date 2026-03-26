# Product-CMS-Rubenius

A modern, high-performance Product Content Management System built with **Next.js**, **Tailwind CSS**, and **Prisma**. This application features a robust admin panel, secure OTP-based authentication, and an intelligent chatbot powered by a vectorless RAG approach.

🌐 **Live URL:** [rubenius-assignment.space](https://www.rubenius-assignment.space/)

---

## 🚀 Features

### 🔐 Secure Authentication
- **Cookie-based flows:** Persistent and secure user sessions.
- **Email OTP Login:** Passwordless authentication for enhanced security and user convenience.

### 🛠️ Professional Admin Panel
- **Product Management:** Full CRUD (Create, Read, Update, Delete) operations.
- **Image Handling:** Seamless integration with **AWS S3** for reliable product image storage and retrieval.
- **Product Metadata:** Manage product names, descriptions, and Unique Selling Points (USPs).

### 🤖 Intelligent Chatbot (PageIndex)
- **Vectorless RAG:** Uses the **PageIndex** approach—a reasoning-based Retrieval-Augmented Generation that retrieves answers from long documents without the overhead of embeddings, chunking, or a vector database.
- **Powered by Gemini:** Leverages Google's Gemini models for high-quality, context-aware responses.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Storage:** [AWS S3](https://aws.amazon.com/s3/)
- **AI/LLM:** [Google Gemini](https://ai.google.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🏗️ Architecture

### Database Models
- **User:** Manages authentication state and OTP codes.
- **Product:** Stores product details, image URLs, and USPs.

### PageIndex RAG
Unlike traditional RAG systems, **PageIndex** avoids the complexity of vector databases. It utilizes the large context window and reasoning capabilities of modern LLMs (Gemini) to process and retrieve information directly from documents, ensuring high accuracy and relevancy without pre-processing hurdles.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- AWS S3 Bucket
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Triptishakya-dev/Product-CMS-Rubenius.git
   cd Product-CMS-Rubenius
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Copy the `.env-example` file to `.env` and add your credentials:
   ```bash
   cp .env-example .env
   ```
   Then fill in the values:
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="..."
   AWS_ACCESS_KEY_ID="..."
   AWS_SECRET_ACCESS_KEY="..."
   AWS_REGION="..."
   AWS_BUCKET="..."
   GEMINI_API_KEY="..."
   ```

4. **Database Migration:**
   ```bash
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📄 License

This project is licensed under the MIT License.
