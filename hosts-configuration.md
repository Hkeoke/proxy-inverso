# Windows Hosts File Configuration

## Step-by-Step Instructions

### 1. Open Command Prompt as Administrator
- Press `Win + R`
- Type `cmd`
- Press `Ctrl + Shift + Enter` (to run as administrator)

### 2. Navigate to Hosts File Location
```cmd
cd C:\Windows\System32\drivers\etc\
```

### 3. Backup Original Hosts File
```cmd
copy hosts hosts.backup
```

### 4. Edit Hosts File
```cmd
notepad hosts
```

### 5. Add Proxy Entries
Add these lines at the end of the file (replace `YOUR-PROXY-URL.onrender.com` with your actual Render URL):

```
# Steam Proxy Configuration - Added [DATE]
YOUR-PROXY-URL.onrender.com client-update.akamai.steamstatic.com
YOUR-PROXY-URL.onrender.com clientconfig.akamai.steamstatic.com
YOUR-PROXY-URL.onrender.com steampipe.akamaihd.net
YOUR-PROXY-URL.onrender.com steamcdn-a.akamaihd.net
YOUR-PROXY-URL.onrender.com steamuserimages-a.akamaihd.net
YOUR-PROXY-URL.onrender.com steamcommunity.com
YOUR-PROXY-URL.onrender.com store.steampowered.com
YOUR-PROXY-URL.onrender.com api.steampowered.com
YOUR-PROXY-URL.onrender.com media.steampowered.com
YOUR-PROXY-URL.onrender.com cdn.akamai.steamstatic.com
YOUR-PROXY-URL.onrender.com shared.akamai.steamstatic.com
YOUR-PROXY-URL.onrender.com community.akamai.steamstatic.com
YOUR-PROXY-URL.onrender.com store.akamai.steamstatic.com
YOUR-PROXY-URL.onrender.com steamworkshop.com
YOUR-PROXY-URL.onrender.com steamcommunity-a.akamaihd.net
YOUR-PROXY-URL.onrender.com broadcast.steampowered.com
YOUR-PROXY-URL.onrender.com video.steampowered.com
YOUR-PROXY-URL.onrender.com partner.steampowered.com
YOUR-PROXY-URL.onrender.com help.steampowered.com
YOUR-PROXY-URL.onrender.com support.steampowered.com
YOUR-PROXY-URL.onrender.com checkout.steampowered.com
YOUR-PROXY-URL.onrender.com login.steampowered.com
```

### 6. Save and Flush DNS
```cmd
ipconfig /flushdns
ipconfig /release
ipconfig /renew
```

### 7. Verify Configuration
```cmd
nslookup client-update.akamai.steamstatic.com
```

This should return your proxy server's IP address.

## Steam Launch Commands

### Standard Launch (Recommended)
```cmd
"C:\Program Files (x86)\Steam\Steam.exe" -tcp -websocket
```

### Alternative Launch Options
```cmd
# With additional debugging
"C:\Program Files (x86)\Steam\Steam.exe" -tcp -websocket -console -dev

# If certificate issues persist (less secure)
"C:\Program Files (x86)\Steam\Steam.exe" -tcp -websocket -insecure

# Force specific protocol
"C:\Program Files (x86)\Steam\Steam.exe" -tcp -websocket -no-browser +@NoPromptForPassword 1
```

## Troubleshooting

### If Steam Still Can't Connect:
1. Verify proxy is running: Visit `https://YOUR-PROXY-URL.onrender.com/health`
2. Check hosts file syntax (no extra spaces, correct format)
3. Restart Steam completely
4. Try different launch parameters
5. Check Windows Firewall settings

### To Restore Original Configuration:
```cmd
cd C:\Windows\System32\drivers\etc\
copy hosts.backup hosts
ipconfig /flushdns
```

### Testing the Proxy:
```cmd
# Test if domain resolves to proxy
nslookup client-update.akamai.steamstatic.com

# Test proxy response
curl -I https://YOUR-PROXY-URL.onrender.com/health
```