# Deployment Checklist

## Pre-Deployment (60+ Checks)

### Environment Variables
- [ ] All production env vars configured
- [ ] No secrets in code/commits
- [ ] .env.local in .gitignore

### Performance
- [ ] Lighthouse Performance â‰¥90
- [ ] LCP <2.5s
- [ ] CLS <0.1
- [ ] Bundle size <200KB

### Security
- [ ] CSP Level 3 active
- [ ] HSTS enabled
- [ ] Rate limiting configured
- [ ] Input validation on all forms

### Accessibility
- [ ] WCAG 2.2 AA compliant
- [ ] Keyboard navigation tested
- [ ] Screen reader tested
- [ ] Color contrast â‰¥4.5:1

### SEO
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Meta tags on all pages
- [ ] JSON-LD structured data

### Testing
- [ ] Unit tests pass (80%+ coverage)
- [ ] E2E tests pass
- [ ] Cross-browser tested
- [ ] Mobile tested

## Deployment Steps

### Vercel
1. Connect GitHub repository
2. Configure environment variables
3. Set build command: `npm run build`
4. Deploy to production

### Docker
1. Build: `docker build -t app .`
2. Run: `docker run -p 3000:3000 app`
3. Deploy to container registry

## Post-Deployment

- [ ] Verify DNS/SSL
- [ ] Test all critical paths
- [ ] Monitor error rates
- [ ] Check analytics tracking

---

**Next:** Monitor performance for 24-48 hours
