# Installation & Setup Guide

**Quick installation and setup for Octopus AI IDE - the world's most advanced AI development ecosystem.**

## 🚀 **Quick Installation**

### **System Requirements**
- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 18.04+)
- **RAM**: 16GB recommended for optimal AI performance
- **Storage**: 5GB for installation + additional for local AI models
- **Internet**: Required for cloud AI models and marketplace access
- **GPU**: Optional (NVIDIA RTX series recommended for local models)

### **Download & Install**

#### **Official Installer** (Recommended)
```bash
# Download from official website
https://octopusai.dev/download

# Windows
octopus-ai-ide-setup.exe

# macOS
open octopus-ai-ide.dmg

# Linux (Ubuntu/Debian)
sudo dpkg -i octopus-ai-ide.deb
```

#### **Package Managers**
```bash
# Windows (Chocolatey)
choco install octopus-ai-ide

# macOS (Homebrew)
brew install --cask octopus-ai-ide

# Linux (Snap)
sudo snap install octopus-ai-ide

# Linux (Flatpak)
flatpak install octopus-ai-ide
```

## ⚙️ **Initial Configuration**

### **1. First Launch Setup**
```bash
# Launch Octopus AI IDE
# The AI Setup Wizard will guide you through:

1. Choose AI models (cloud or local)
2. Configure API keys for cloud models
3. Set team preferences (if applicable)
4. Access AI Model Marketplace
5. Complete initial project setup
```

### **2. AI Model Configuration**
```json
{
  "quickSetup": {
    "beginner": {
      "primary": "gpt-4-turbo",
      "fallback": "claude-3-opus"
    },
    "team": {
      "shared": ["gpt-4-turbo", "claude-3-opus"],
      "collaboration": "enabled",
      "marketplace": ["python-expert", "react-wizard"]
    },
    "enterprise": {
      "sso": "configure-later",
      "compliance": "standard",
      "privateHosting": false
    }
  }
}
```

### **3. Environment Variables** (Optional)
```bash
# For advanced configuration
export OCTOPUS_AI_API_KEY="your-api-key"
export OCTOPUS_AI_MODEL_PREFERENCE="gpt-4-turbo"
export OCTOPUS_AI_MARKETPLACE_ACCESS="enabled"
export OCTOPUS_AI_TEAM_MODE="collaborative"
```

## 🏢 **Enterprise Setup**

### **Private Hosting** (M3.3 - Available Soon)
```bash
# Enterprise deployment options:

# Docker Deployment
docker run -d --name octopus-ai-ide \
  -p 8080:8080 \
  -v /data:/app/data \
  octopus/ai-ide:enterprise

# Kubernetes Deployment
kubectl apply -f k8s/octopus-ai-ide-enterprise.yaml

# Terraform Infrastructure
terraform apply -var-file="enterprise.tfvars"
```

### **SSO Configuration** (M3.3 - Available Soon)
```json
{
  "sso": {
    "provider": "azure-ad",
    "clientId": "your-client-id",
    "tenantId": "your-tenant-id",
    "redirectUri": "https://your-octopus.company.com/auth/callback"
  }
}
```

## 🔧 **Troubleshooting**

### **Common Installation Issues**

#### **1. Installation Fails**
```bash
# Windows: Run as Administrator
# macOS: Check Gatekeeper settings
# Linux: Verify dependencies
sudo apt update && sudo apt install -f
```

#### **2. AI Models Not Loading**
```bash
# Check internet connection
# Verify API keys in Settings → AI Models
# Try fallback to local models
```

#### **3. Performance Issues**
```bash
# Increase RAM allocation
# Enable GPU acceleration (if available)
# Check background processes
```

### **Getting Help**
- **Community**: [Discord Support](https://discord.gg/octopus-ai)
- **Documentation**: [Complete Guides](../README.md)
- **Enterprise**: help@octopusai.dev

## 🎯 **Next Steps**

After installation, continue with:
1. **[Getting Started Guide](../user-guide/getting-started.md)** - Your first AI project
2. **[AI Models Setup](../ai-models/README.md)** - Configure AI ecosystem
3. **[Team Configuration](../configuration/)** - Set up collaboration

---

**Installation complete! Ready to revolutionize your development workflow.** 🚀
