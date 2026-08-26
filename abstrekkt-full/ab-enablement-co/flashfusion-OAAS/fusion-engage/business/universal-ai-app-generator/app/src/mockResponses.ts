/**
 * mockResponses.ts — canned, scripted "agent" responses.
 *
 * ⚠️  These are HARD-CODED demo strings. No model is called and no code is
 * generated or executed. The "Security Score: 98.5%", cost figures, and live
 * URLs below are fictional. This module exists purely to animate the chat UI.
 *
 * IMPORTANT (safety): this demo never executes generated code. If you extend it
 * to call a real generator, treat all generated output as untrusted — never run
 * it automatically.
 */
export interface ScriptedAgentResponse {
  agent: string;
  content: string;
  progress: number;
}

export const scriptedAgentResponses: ScriptedAgentResponse[] = [
  {
    agent: "Master Orchestrator",
    content:
      "Perfect! I'm coordinating with our specialized agents to create your social media platform. Here's our execution plan:\n\n✅ **Code Generation Agent**: Building React Native frontend + Node.js backend\n✅ **Security Guardian**: Implementing OAuth 2.0 + JWT authentication\n✅ **Data Architect**: Designing PostgreSQL schema with Redis caching\n✅ **Quality Engineer**: Setting up Jest + Cypress testing suite\n✅ **Deployment Specialist**: Configuring AWS ECS with auto-scaling\n\nEstimated completion: 4 minutes",
    progress: 15,
  },
  {
    agent: "Code Generation Agent",
    content:
      "🚀 **Frontend Generated**: React Native app with 12 screens including:\n• User authentication & profiles\n• Real-time chat with Socket.io\n• Photo/video sharing with filters\n• Push notifications\n• Dark mode support\n\n🔧 **Backend Created**: Node.js API with:\n• RESTful endpoints + GraphQL\n• Real-time messaging\n• File upload handling\n• Rate limiting & caching\n\n📱 **Mobile Features**: Camera integration, geolocation, offline sync",
    progress: 45,
  },
  {
    agent: "Security Guardian",
    content:
      "🛡️ **Security Implementation Complete** (DEMO values):\n\n✅ Multi-factor authentication (TOTP + SMS)\n✅ Input sanitization & SQL injection protection\n✅ XSS prevention with CSP headers\n✅ API rate limiting (100 req/min per user)\n✅ End-to-end encryption for messages\n✅ GDPR compliance with data deletion\n✅ Vulnerability scanning integrated\n\n**Security Score: 98.5%** (mock figure — not a real assessment)",
    progress: 70,
  },
  {
    agent: "Deployment Specialist",
    content:
      "🚀 **Deployment Pipeline Ready** (DEMO):\n\n✅ **Web**: Deployed to Vercel with CDN\n✅ **Mobile**: Built for iOS/Android app stores\n✅ **Backend**: AWS ECS with auto-scaling\n✅ **Database**: RDS PostgreSQL with read replicas\n✅ **Monitoring**: CloudWatch + Sentry error tracking\n\n🌍 **Global Distribution**: 5 regions, <100ms latency\n💰 **Cost Optimized**: $47/month for 10K users\n\n**Example URLs (not live):**\n• Web: https://your-social-app.example.com\n• API: https://api.your-social-app.example.com\n• Admin: https://admin.your-social-app.example.com",
    progress: 100,
  },
];
