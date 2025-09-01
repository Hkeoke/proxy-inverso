# Steam Reverse Proxy

A production-ready NestJS reverse proxy for Steam services to bypass corporate network restrictions.

## 🚀 Quick Start

### Deploy to Render

1. Fork this repository
2. Connect your GitHub account to Render
3. Create a new Web Service from your forked repository
4. Render will automatically detect the `render.yaml` configuration
5. Your proxy will be deployed with HTTPS automatically

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

## 🔧 Configuration

### Windows Hosts File Setup

1. Open Command Prompt as Administrator
2. Navigate to `C:\Windows\System32\drivers\etc\`
3. Edit the `hosts` file and add these lines (replace `your-proxy-url.onrender.com` with your actual Render URL):

```
# Steam Proxy Configuration
your-proxy-url.onrender.com client-update.akamai.steamstatic.com
your-proxy-url.onrender.com clientconfig.akamai.steamstatic.com
your-proxy-url.onrender.com steampipe.akamaihd.net
your-proxy-url.onrender.com steamcdn-a.akamaihd.net
your-proxy-url.onrender.com steamuserimages-a.akamaihd.net
your-proxy-url.onrender.com steamcommunity.com
your-proxy-url.onrender.com store.steampowered.com
your-proxy-url.onrender.com api.steampowered.com
your-proxy-url.onrender.com media.steampowered.com
your-proxy-url.onrender.com cdn.akamai.steamstatic.com
your-proxy-url.onrender.com shared.akamai.steamstatic.com
your-proxy-url.onrender.com community.akamai.steamstatic.com
your-proxy-url.onrender.com store.akamai.steamstatic.com
```

4. Save the file and flush DNS cache:
```cmd
ipconfig /flushdns
```

### Steam Launch Configuration

Launch Steam with these parameters to ensure proper connectivity:

```cmd
"C:\Program Files (x86)\Steam\Steam.exe" -tcp -websocket -no-browser +@NoPromptForPassword 1
```

### SSL Certificate Trust (if needed)

If you encounter SSL certificate errors:

1. Download the certificate from your proxy URL
2. Install it in Windows Certificate Store (Trusted Root Certification Authorities)
3. Or launch Steam with `-insecure` flag (not recommended for production)

## 📋 Proxied Steam Domains

This proxy handles the following Steam services:

- **Content Delivery**: client-update.akamai.steamstatic.com, steampipe.akamaihd.net
- **Store & Community**: store.steampowered.com, steamcommunity.com
- **API Services**: api.steampowered.com
- **Media & Assets**: All steamstatic.com subdomains
- **Support & Help**: support.steampowered.com, help.steampowered.com

## 🔍 Monitoring

- Health check endpoint: `/health`
- Domain list endpoint: `/health/domains`
- Logs are available in Render dashboard

## ⚠️ Important Notes

- This proxy is for educational and legitimate use only
- Ensure you have proper authorization before bypassing corporate restrictions
- Monitor your usage to avoid exceeding Render's free tier limits
- The proxy automatically handles HTTPS and provides proper SSL certificates

## 🛠️ Troubleshooting

### Steam Won't Connect
1. Verify hosts file entries are correct
2. Check that DNS cache is flushed
3. Ensure proxy is running (check `/health` endpoint)
4. Try restarting Steam completely

### Certificate Errors
1. Verify HTTPS is working on your proxy URL
2. Check browser certificate warnings
3. Consider adding `-insecure` flag temporarily for testing

### Performance Issues
1. Check Render logs for errors
2. Monitor response times at `/health`
3. Consider upgrading Render plan for better performance

## 📞 Support

Check the logs in your Render dashboard for detailed error information and debugging.