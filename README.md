# jpchat - AI Portfolio Assistant

A modern, responsive AI chatbot built with Next.js, Vercel AI SDK, and OpenAI GPT-4o-mini. Features a sleek dark theme with green accents, perfect for portfolio websites to engage visitors with intelligent conversations.

## Features

- 🤖 **AI-Powered Conversations**: Uses OpenAI GPT-4o-mini for intelligent responses
- 💬 **Real-time Streaming**: Messages stream in real-time for smooth chat experience  
- 🌙 **Dark Theme**: Beautiful dark mode with green primary accents
- 📱 **Responsive Design**: Card-based layout that works on all devices
- 🎨 **Modern UI**: Minimal design with smooth transitions and animations
- ⚡ **Edge Runtime**: Optimized for Vercel deployment
- 🔄 **Auto-scroll**: Automatically scrolls to latest messages

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI SDK**: Vercel AI SDK with OpenAI integration
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel (Edge Runtime)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Local Development

1. **Clone and install dependencies**:
   \`\`\`bash
   git clone <your-repo-url>
   cd portfolio-chatbot
   npm install
   \`\`\`

2. **Set up environment variables**:
   Create a \`.env.local\` file in the root directory:
   \`\`\`env
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

3. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

The chatbot will be available at \`/chat\` and the root path redirects there automatically.

## Deployment to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. Push your code to a GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project" and import your GitHub repository
4. Add your environment variable:
   - Key: \`OPENAI_API_KEY\`
   - Value: Your OpenAI API key
5. Click "Deploy"

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**:
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. **Deploy**:
   \`\`\`bash
   vercel
   \`\`\`

3. **Add environment variable**:
   \`\`\`bash
   vercel env add OPENAI_API_KEY
   \`\`\`

4. **Redeploy**:
   \`\`\`bash
   vercel --prod
   \`\`\`

## Configuration

### AI Model Settings

The chatbot is configured in \`app/api/chat/route.ts\`:

- **Model**: \`gpt-4o-mini\` (cost-effective and fast)
- **Max Tokens**: 600 (controls response length)
- **Temperature**: 0.7 (balances creativity and consistency)

### Customization

**App Branding**: The app is branded as "jpchat" with a dark theme and green primary color (HSL: 142 76% 36%). Modify the system prompt in `app/api/chat/route.ts` to customize the AI's personality.

**Styling**: Update Tailwind classes in \`app/chat/page.tsx\` to match your brand colors and design.

**Features**: Add more functionality like:
- Message persistence
- User authentication
- Custom tools and functions
- File uploads

## Project Structure

\`\`\`
portfolio-chatbot/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # AI chat API endpoint
│   ├── chat/
│   │   └── page.tsx              # Main chat interface
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (redirects to /chat)
├── .env.local                    # Environment variables
├── package.json                  # Dependencies and scripts
├── tailwind.config.ts            # Tailwind configuration
└── README.md                     # This file
\`\`\`

## API Usage and Costs

This chatbot uses OpenAI's GPT-4o-mini model, which is cost-effective:
- Input: ~$0.15 per 1M tokens
- Output: ~$0.60 per 1M tokens

With the 600 max tokens limit, each conversation turn costs approximately $0.0004-$0.0006.

## Troubleshooting

### Common Issues

1. **"API key not found" error**:
   - Ensure \`.env.local\` exists with \`OPENAI_API_KEY\`
   - Restart the development server after adding environment variables

2. **Messages not streaming**:
   - Check browser console for errors
   - Verify API key is valid and has credits

3. **Deployment issues**:
   - Ensure environment variables are set in Vercel dashboard
   - Check function logs in Vercel dashboard for errors

### Getting Help

- [Vercel AI SDK Documentation](https://sdk.vercel.ai)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT License - feel free to use this project for your portfolio!
