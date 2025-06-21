# 🍿 PopChoice - AI-Powered Movie Recommender

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Vector_DB-green?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/OpenAI-Embeddings-orange?style=for-the-badge&logo=openai" alt="OpenAI" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1.10-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</div>

## 🎬 About PopChoice

**PopChoice** is an intelligent movie recommendation system that uses **RAG (Retrieval-Augmented Generation)** and **vector embeddings** to suggest personalized movie recommendations. The app analyzes your movie preferences through a beautiful, intuitive interface and leverages AI to find the perfect film for your mood.

### ✨ Key Features

- 🤖 **AI-Powered Recommendations** - Uses OpenAI embeddings and vector similarity search
- 📊 **RAG Architecture** - Retrieval-Augmented Generation for intelligent movie matching
- 🎨 **Beautiful UI/UX** - Mobile-first design with dark gradient theme and popcorn mascot
- ⚡ **Real-time Processing** - Fast vector similarity search using Supabase pgvector
- 🔒 **Type-Safe** - Built with TypeScript and Zod validation
- 🌐 **Edge Ready** - Optimized for Cloudflare Workers deployment

## 🏗️ Architecture

PopChoice implements a sophisticated RAG (Retrieval-Augmented Generation) architecture:

```
User Input → Text Embedding → Vector Search → Movie Recommendations
    ↓              ↓               ↓                ↓
  Questions    OpenAI API     Supabase DB      Filtered Results
```

### Technology Stack

**Frontend:**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives

**Backend & AI:**
- **OpenAI API** - Text embeddings (text-embedding-3-small)
- **Supabase** - PostgreSQL with pgvector extension
- **LangChain** - Text processing and chunking
- **Server Actions** - Type-safe form handling

**Deployment:**
- **Cloudflare Workers** - Edge computing
- **OpenNext** - Next.js adapter for Cloudflare

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- OpenAI API key
- Supabase project with pgvector extension
- (Optional) Cloudflare account for deployment

### 1. Clone & Install

```bash
git clone [<repository-url>](https://github.com/hemants1703/popchoice-ai-vectordb-rag-movie-recommender.git)
cd popchoice-ai-vectordb-rag-movie-recommender
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_SUPABASE_URL=your_supabase_project_url
NEXT_SUPABASE_API_KEY=your_supabase_anon_key
```

### 3. Database Setup

#### Enable pgvector extension in Supabase:

```sql
-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
```

#### Create the movies table:

```sql
-- Create movies table with vector embeddings
CREATE TABLE movies (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- OpenAI text-embedding-3-small dimensions
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vector similarity index for better performance
CREATE INDEX ON movies USING ivfflat (embedding vector_cosine_ops);
```

#### Create the vector similarity function:

```sql
-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION match_movies(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id BIGINT,
  title TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    movies.id,
    movies.title,
    movies.content,
    1 - (movies.embedding <=> query_embedding) AS similarity
  FROM movies
  WHERE 1 - (movies.embedding <=> query_embedding) > match_threshold
  ORDER BY movies.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### 4. Populate Movie Database

Use the provided movie data to populate your database:

```bash
# Use the embed-data API endpoint to process and store movie embeddings
# The movie data is available in src/lib/movies.txt
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see PopChoice in action! 🎉

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat-rag/         # RAG processing endpoint
│   │   └── embed-data/       # Data embedding endpoint
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/ui/           # Reusable UI components
├── features/root/
│   ├── actions.ts           # Server actions for movie recommendations
│   ├── content.ts           # Movie data content
│   ├── definitions.ts       # Zod validation schemas
│   ├── PopChoiceForm.tsx    # Main recommendation form
│   └── textEmbedder.ts      # OpenAI embedding utility
└── lib/
    ├── movies.txt           # Movie database content
    └── utils.ts             # Utility functions
```

## 🎯 How It Works

1. **User Input**: Users answer three personalized questions about their movie preferences
2. **Text Embedding**: Responses are processed and converted to vector embeddings using OpenAI
3. **Vector Search**: Supabase performs cosine similarity search against the movie database
4. **Recommendation**: The most similar movies are returned based on user preferences

### RAG Pipeline

```typescript
// 1. Combine user responses
const context = question1 + "\n" + question2 + "\n" + question3;

// 2. Generate embeddings
const embeddedQuery = await embedText(context);

// 3. Perform vector similarity search
const { data } = await supabase.rpc('match_movies', {
    query_embedding: embeddedQuery,
    match_threshold: 0.7,
    match_count: 5
});

// 4. Return recommendations
return { recommendedMovie: data[0] };
```

## 🚀 Deployment

### Cloudflare Workers (Recommended)

```bash
# Build and deploy to Cloudflare
pnpm deploy

# Or preview locally
pnpm preview
```

### Vercel

```bash
# Deploy to Vercel
vercel --prod
```

### Environment Variables for Production

Ensure all environment variables are configured in your deployment platform:
- `OPENAI_API_KEY`
- `NEXT_SUPABASE_URL`
- `NEXT_SUPABASE_API_KEY`

## 🛠️ Development Scripts

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm deploy       # Deploy to Cloudflare Workers
pnpm preview      # Preview Cloudflare build locally
```

## 🎨 UI/UX Features

- **Responsive Design** - Optimized for mobile and desktop
- **Dark Theme** - Beautiful gradient background with proper contrast
- **Interactive Form** - Real-time validation and error handling
- **Loading States** - Smooth UX with loading indicators
- **Accessibility** - ARIA labels and keyboard navigation support

## 🔧 Customization

### Adding More Movies

1. Update `src/lib/movies.txt` with new movie data
2. Use the `/api/embed-data` endpoint to generate embeddings
3. Movies will be automatically available for recommendations

### Modifying Questions

Update the questions in `src/features/root/PopChoiceForm.tsx`:

```tsx
// Customize the recommendation questions
<h2 className="text-white text-lg font-medium">
    Your custom question here?
</h2>
```

### Styling Changes

The app uses Tailwind CSS. Modify the design in:
- `src/features/root/PopChoiceForm.tsx` - Main form styling
- `src/app/globals.css` - Global styles
- `tailwind.config.js` - Tailwind configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** - For powerful text embeddings
- **Supabase** - For seamless vector database functionality
- **Vercel** - For Next.js and deployment platform
- **Cloudflare** - For edge computing capabilities

---

<div align="center">
  <p>Built with ❤️ using Next.js, OpenAI, and Supabase</p>
  <p>🍿 <strong>PopChoice - Your AI Movie Companion</strong> 🍿</p>
</div>
