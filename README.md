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

- 🤖 **AI-Powered Recommendations** - Uses OpenAI text-embedding-3-small model for semantic understanding
- 📊 **RAG Architecture** - Retrieval-Augmented Generation for intelligent movie matching
- 🎨 **Beautiful UI/UX** - Dark gradient theme with popcorn mascot and responsive design
- ⚡ **Real-time Processing** - Fast vector similarity search using Supabase pgvector
- 🔒 **Type-Safe** - Built with TypeScript and Zod validation
- 🌐 **Edge Ready** - Optimized for Cloudflare Workers deployment
- 📱 **Mobile-First** - Responsive design that works on all devices
- 🍿 **Interactive Experience** - Three personalized questions for better recommendations

## 🏗️ Architecture

PopChoice implements a sophisticated RAG (Retrieval-Augmented Generation) architecture:

```
User Questions → Text Embedding → Vector Search → Movie Recommendations
      ↓               ↓                ↓               ↓
  Form Input     OpenAI API      Supabase RPC    Filtered Results
```

### Technology Stack

**Frontend:**
- **Next.js 15.3.3** - React framework with App Router and Turbopack
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.8.3** - Type-safe development with strict configuration
- **Tailwind CSS 4.1.10** - Utility-first styling with custom design system
- **Radix UI** - Accessible component primitives (Label, Slot)
- **Sonner** - Beautiful toast notifications

**Backend & AI:**
- **OpenAI API 5.5.1** - Text embeddings using text-embedding-3-small model (1536 dimensions)
- **Supabase 2.50.0** - PostgreSQL database with pgvector extension
- **LangChain** - Text processing and recursive character text splitting
- **Next.js Server Actions** - Type-safe form handling and server-side processing
- **Zod 3.25.67** - Runtime type validation and schema parsing

**Deployment & Infrastructure:**
- **Cloudflare Workers** - Edge computing and deployment
- **OpenNext 1.3.1** - Next.js adapter for Cloudflare
- **Wrangler** - Cloudflare development and deployment tool

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- OpenAI API key
- Supabase project with pgvector extension
- (Optional) Cloudflare account for deployment

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/popchoice-ai-vectordb-rag-movie-recommender.git
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
NEXT_SUPABASE_API_KEY=your_supabase_service_role_key
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
CREATE TABLE popchoice_vector_db (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(1536) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for faster similarity search
CREATE INDEX ON popchoice_vector_db USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

#### Create the similarity search function:

```sql
-- Function to find similar movies based on embeddings
CREATE OR REPLACE FUNCTION match_scrimba_challenges(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 3
)
RETURNS TABLE(
  id BIGINT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    popchoice_vector_db.id,
    popchoice_vector_db.content,
    1 - (popchoice_vector_db.embedding <=> query_embedding) AS similarity
  FROM popchoice_vector_db
  WHERE 1 - (popchoice_vector_db.embedding <=> query_embedding) > match_threshold
  ORDER BY popchoice_vector_db.embedding <=> query_embedding
  LIMIT match_count;
$$;
```

### 4. Populate Movie Database

Use the data embedding API endpoint to populate your database with movie content:

```bash
# Start the development server
pnpm dev

# In another terminal, populate the database using the movies.txt file
curl -X POST http://localhost:3000/api/embed-and-insert-data \
  -H "Content-Type: text/plain" \
  -d @src/lib/movies.txt
```

Alternatively, you can copy the content from `src/lib/movies.txt` and send it via any API client like Postman or Insomnia to the `/api/embed-and-insert-data` endpoint.

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
│   │   └── embed-and-insert-data/   # Data embedding and insertion endpoint
│   ├── globals.css                  # Global styles with Tailwind CSS
│   ├── layout.tsx                   # Root layout with metadata
│   └── page.tsx                     # Home page
├── components/ui/                   # Reusable UI components
│   ├── button.tsx                   # Button component variants
│   ├── label.tsx                    # Form label component
│   ├── sonner.tsx                   # Toast notification component
│   └── textarea.tsx                 # Textarea input component
├── features/root/                   # Main application features
│   ├── actions.ts                   # Server actions for movie recommendations
│   ├── content.ts                   # Movie data content (currently empty)
│   ├── definitions.ts               # Zod validation schemas
│   ├── PopChoiceForm.tsx           # Main recommendation form component
│   └── textEmbedder.ts             # OpenAI embedding utility functions
└── lib/
    ├── movies.txt                   # Movie database content for seeding
    └── utils.ts                     # Utility functions (cn helper)
```

## 🎯 How It Works

1. **User Input**: Users answer three personalized questions about their movie preferences:
   - What's your favorite movie and why?
   - Are you in the mood for something new or a classic?
   - Do you want something fun or serious?

2. **Text Embedding**: User responses are combined and processed using OpenAI's text-embedding-3-small model to create a 1536-dimensional vector representation

3. **Vector Search**: Supabase performs cosine similarity search using the `match_scrimba_challenges` RPC function against the movie database

4. **Recommendation**: The most similar movies are returned based on user preferences with similarity scores

### RAG Pipeline

```
📝 User Questions → 🤖 OpenAI Embeddings → 🔍 Vector Search → 🎬 Movie Results
```

## 🎨 UI Components

The application features a beautiful dark gradient design with:
- **Popcorn mascot** (🍿) as the main visual element
- **Responsive form layout** with three question sections
- **Real-time validation** using Zod schemas
- **Toast notifications** for user feedback
- **Loading states** during processing
- **Error handling** with informative messages

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

The app uses Tailwind CSS with a custom design system. Key styling locations:
- `src/features/root/PopChoiceForm.tsx` - Main form styling with blue gradient theme
- `src/app/globals.css` - Global styles and CSS custom properties
- `components.json` - shadcn/ui configuration with "new-york" style

### Database Schema Changes

To modify the database schema:

1. Update the table structure in Supabase
2. Modify the `match_scrimba_challenges` function accordingly
3. Update TypeScript types in `src/features/root/definitions.ts`

## 🔍 Troubleshooting

### Common Issues

1. **Environment Variables**: Ensure all required environment variables are set correctly
2. **Supabase Setup**: Verify pgvector extension is enabled and RPC function is created
3. **OpenAI API**: Check API key validity and rate limits
4. **CORS Issues**: Make sure Supabase RLS policies allow the operations

### Debug Mode

Enable debug logging by adding console.log statements in:
- `src/features/root/textEmbedder.ts` - For embedding issues
- `src/features/root/actions.ts` - For recommendation logic
- `src/app/api/embed-and-insert-data/route.ts` - For data insertion issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use Prettier for code formatting
- Add proper error handling
- Include JSDoc comments for functions
- Test API endpoints thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** - For powerful text embeddings and AI capabilities
- **Supabase** - For seamless vector database functionality with pgvector
- **Next.js Team** - For the amazing React framework and developer experience
- **Cloudflare** - For edge computing and deployment platform
- **shadcn/ui** - For beautiful and accessible UI components

---

<div align="center">
  <p>Built with ❤️ using Next.js 15, OpenAI, and Supabase</p>
  <p>🍿 <strong>PopChoice - Your AI Movie Companion</strong> 🍿</p>
  <p><em>Discover your next favorite movie with AI-powered recommendations</em></p>
</div>
