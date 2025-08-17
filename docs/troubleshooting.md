# Troubleshooting Guide

Common issues and solutions for Octopus AI IDE.

## Installation Issues

### Node Modules Problems

**Issue**: `npm install` fails or modules are corrupted
```bash
# Solution: Clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Python Dependencies

**Issue**: Python-related build errors
```bash
# Solution: Ensure Python 3.8+ is installed
python --version
npm config set python python3
```

### Electron Build Issues

**Issue**: Electron fails to start
```bash
# Solution: Rebuild native modules
npm run rebuild
# or
npx electron-rebuild
```

## AI Model Connection Issues

### API Key Errors

**Issue**: "Invalid API key" errors
- ✅ Verify API key format and validity
- ✅ Check environment variable names
- ✅ Ensure `.env` file is in project root
- ✅ Restart application after changing keys

**Issue**: Rate limiting errors
- ✅ Check your API quota and usage
- ✅ Implement request throttling
- ✅ Switch to different model temporarily

### Network Issues

**Issue**: Connection timeouts
```bash
# Check network connectivity
curl -I https://api.openai.com
curl -I https://api.anthropic.com
```

**Issue**: Proxy/firewall blocking requests
- Configure proxy settings in environment
- Whitelist AI provider domains
- Check corporate firewall settings

### Local Model Issues

**Issue**: Ollama connection fails
```bash
# Check if Ollama is running
curl http://localhost:11434/api/version

# Start Ollama service
ollama serve

# List available models
ollama list
```

## Development Issues

### TypeScript Errors

**Issue**: Type checking failures
```bash
# Restart TypeScript service
# In VS Code: Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# Check configuration
npm run typecheck
```

### Build Performance

**Issue**: Slow build times
- Enable incremental compilation
- Use development build instead of production
- Increase Node.js memory: `--max-old-space-size=8192`

### Hot Reload Not Working

**Issue**: Changes not reflected
- Check if file watcher is running
- Restart development server
- Clear cache and reload

## Runtime Issues

### Memory Issues

**Issue**: High memory usage
- Monitor AI model memory consumption
- Implement request batching
- Clear AI response cache periodically

### Performance Problems

**Issue**: Slow AI responses
- Check network latency to AI providers
- Switch to faster models for simple tasks
- Enable response caching
- Use local models for repetitive tasks

### UI Issues

**Issue**: Interface not responsive
- Check developer console for errors
- Disable browser extensions
- Clear application cache

## Debugging

### Enable Debug Mode

Add to `.env`:
```bash
NODE_ENV=development
LOG_LEVEL=debug
ENABLE_AI_DEBUG=true
DEV_TOOLS=true
```

### Diagnostic Commands

```bash
# Check system info
npm run info

# Test AI connections (when implemented)
npm run test:ai

# Validate configuration
npm run validate:config

# Check build health
npm run health
```

### Log Analysis

Development logs location:
- **Windows**: `%APPDATA%/octopus-ai-ide/logs/`
- **macOS**: `~/Library/Logs/octopus-ai-ide/`
- **Linux**: `~/.config/octopus-ai-ide/logs/`

## Getting Help

### Before Reporting Issues

1. Check this troubleshooting guide
2. Search existing GitHub issues
3. Try with minimal configuration
4. Collect relevant logs and system info

### Reporting Bugs

Include:
- Operating system and version
- Node.js and npm versions
- AI models being used
- Error messages and logs
- Steps to reproduce

### Community Support

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community help
- **Discord**: Real-time community support
- **Stack Overflow**: Tag with `octopus-ai-ide`

### Emergency Recovery

**Issue**: Application completely broken
```bash
# Reset to clean state
rm -rf node_modules package-lock.json
rm .env
npm install
cp .env.example .env
# Reconfigure environment
```

---

*If you encounter issues not covered here, please [report them](https://github.com/yourusername/octopus/issues) to help improve this guide.*
