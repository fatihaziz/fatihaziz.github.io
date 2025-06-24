# GitHub Pages Deployment

## Deployment Process

### Build and Deploy Commands
1. **Build for GitHub Pages**: `pnpm build-github` - Build optimized for GitHub Pages deployment
2. **Deploy**: `pnpm gh-publish` - Build and deploy to GitHub Pages with custom domain
3. **CNAME Configuration**: CNAME file in `/docs/` directory configures custom domain
4. **Live Site**: Site deploys to `fatihaziz.com`

### Deployment Workflow
```bash
# 1. Build optimized version for GitHub Pages
pnpm build-github

# 2. Deploy to GitHub Pages with custom domain
pnpm gh-publish
```

## Technical Configuration

### Build Configuration
- **Build Output**: Goes to `.output/public/`
- **Custom Domain**: Configured via CNAME: `fatihaziz.com`
- **GitHub Pages Preset**: Used for proper static asset handling
- **Dotfiles Deployment**: Includes dotfiles via `--dotfiles` flag

### Static Site Generation
- Configured for GitHub Pages deployment
- SSG with `ssr: false` setting
- Optimized for static hosting environment
- All assets properly resolved for GitHub Pages structure

## Domain Configuration

### Custom Domain Setup
- Domain: `fatihaziz.com`
- CNAME file location: `/docs/CNAME`
- DNS configuration points to GitHub Pages
- HTTPS automatically handled by GitHub Pages

## Deployment Best Practices

1. **Always test locally first**:
   ```bash
   pnpm build-github
   pnpm preview
   ```

2. **Verify build output** before deploying
3. **Check custom domain** configuration remains intact
4. **Monitor deployment status** on GitHub Pages settings
5. **Test live site** after deployment

## Troubleshooting

### Common Issues
- **Asset paths**: Ensure all assets use proper relative paths
- **Custom domain**: Verify CNAME file is not overwritten
- **Build failures**: Check for TypeScript errors or missing dependencies
- **Static generation**: Ensure all dynamic content is properly handled for SSG

### Verification Steps
1. Check GitHub Pages settings in repository
2. Verify custom domain configuration
3. Test site functionality on live domain
4. Validate SSL certificate is active