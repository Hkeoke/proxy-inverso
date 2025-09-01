# Configuración del Archivo Hosts

## Para Pop!_OS / Linux

### 1. Abrir Terminal
```bash
# Presiona Ctrl + Alt + T
```

### 2. Hacer backup del archivo hosts original
```bash
sudo cp /etc/hosts /etc/hosts.backup
```

### 3. Editar el archivo hosts
```bash
sudo nano /etc/hosts
```

### 4. Agregar las entradas del proxy
Agrega estas líneas al final del archivo:

```
# Steam Proxy Configuration - Netlify - Added 2025-09-01
funny-gecko-341d6e.netlify.app client-update.akamai.steamstatic.com
funny-gecko-341d6e.netlify.app clientconfig.akamai.steamstatic.com
funny-gecko-341d6e.netlify.app steampipe.akamaihd.net
funny-gecko-341d6e.netlify.app steamcdn-a.akamaihd.net
funny-gecko-341d6e.netlify.app steamuserimages-a.akamaihd.net
funny-gecko-341d6e.netlify.app steamcommunity.com
funny-gecko-341d6e.netlify.app store.steampowered.com
funny-gecko-341d6e.netlify.app api.steampowered.com
funny-gecko-341d6e.netlify.app media.steampowered.com
funny-gecko-341d6e.netlify.app cdn.akamai.steamstatic.com
funny-gecko-341d6e.netlify.app shared.akamai.steamstatic.com
funny-gecko-341d6e.netlify.app community.akamai.steamstatic.com
funny-gecko-341d6e.netlify.app store.akamai.steamstatic.com
funny-gecko-341d6e.netlify.app steamworkshop.com
funny-gecko-341d6e.netlify.app steamcommunity-a.akamaihd.net
funny-gecko-341d6e.netlify.app broadcast.steampowered.com
funny-gecko-341d6e.netlify.app video.steampowered.com
funny-gecko-341d6e.netlify.app partner.steampowered.com
funny-gecko-341d6e.netlify.app help.steampowered.com
funny-gecko-341d6e.netlify.app support.steampowered.com
funny-gecko-341d6e.netlify.app checkout.steampowered.com
funny-gecko-341d6e.netlify.app login.steampowered.com
```

### 5. Guardar y limpiar DNS
```bash
# Guardar archivo: Ctrl + X, luego Y, luego Enter
sudo systemctl flush-dns
# O si no funciona:
sudo systemd-resolve --flush-caches
```

### 6. Verificar configuración
```bash
nslookup client-update.akamai.steamstatic.com
```

## Comandos para Steam en Linux

### Lanzamiento estándar (Recomendado)
```bash
steam -tcp -websocket
```

### Opciones alternativas
```bash
# Con debugging adicional
steam -tcp -websocket -console -dev

# Si persisten problemas de certificados
steam -tcp -websocket -insecure

# Forzar protocolo específico
steam -tcp -websocket -no-browser +@NoPromptForPassword 1
```

## Solución de Problemas

### Si Steam no se puede conectar:
1. Verificar proxy: `curl https://funny-gecko-341d6e.netlify.app/api/health`
2. Revisar sintaxis del archivo hosts
3. Reiniciar Steam completamente
4. Probar diferentes parámetros de lanzamiento
5. Verificar firewall

### Para restaurar configuración original:
```bash
sudo cp /etc/hosts.backup /etc/hosts
sudo systemd-resolve --flush-caches
```

### Probar el proxy:
```bash
# Verificar resolución de dominio
nslookup client-update.akamai.steamstatic.com

# Probar respuesta del proxy
curl -I https://funny-gecko-341d6e.netlify.app/api/health
```