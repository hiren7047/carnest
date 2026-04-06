# Carnest — VPS deployment (carnest.in)

આ ડોક્યુમેન્ટ **Ubuntu Server 22.04 LTS** (અથવા 24.04) માટે છે. તમારા VPS ની **public IP** પર ડોમેન નો **A record** સેટ થયેલો હોવો જોઈએ.

**આર્કિટેક્ચર:** બ્રાઉઝર → `https://carnest.in` → **Nginx** (static React build + reverse proxy) → **Node.js** (`localhost:4000`) + **MySQL** (`localhost:3306`).

---

## 0) તમારી તરફથી પહેલાં (DNS)

1. તમારા ડોમેન રજિસ્ટ્રાર પર જાઓ.
2. **A record:** `carnest.in` → તમારી VPS ની **IPv4** address.
3. (જરૂર હોય તો) **A record:** `www.carnest.in` → સમાન IP (અથવા `www` માટે CNAME → `carnest.in`).

DNS propagate થવામાં કેટલાક મિનિટથી કલાક લાગી શકે છે. આગળ વધતા પહેલાં `ping carnest.in` થી IP સાચી દેખાય તે ચેક કરો.

---

## 1) VPS પર SSH થી લોગિન

તમારા PC થી (Windows PowerShell અથવા Git Bash):

```bash
ssh root@YOUR_VPS_IP
```

જો non-root user હોય:

```bash
ssh youruser@YOUR_VPS_IP
```

---

## 2) સિસ્ટમ અપડેટ

```bash
sudo apt update
```

```bash
sudo apt upgrade -y
```

---

## 3) ફાયરવોલ (UFW) — ફક્ત SSH, HTTP, HTTPS

```bash
sudo apt install -y ufw
```

```bash
sudo ufw allow OpenSSH
```

```bash
sudo ufw allow 80/tcp
```

```bash
sudo ufw allow 443/tcp
```

```bash
sudo ufw enable
```

(પ્રોમ્પ્ટ આવે તો `y` દબાવો.)

```bash
sudo ufw status
```

---

## 4) MySQL ઇન્સ્ટોલ અને ડેટાબેઝ

```bash
sudo apt install -y mysql-server
```

```bash
sudo systemctl enable mysql
```

```bash
sudo systemctl start mysql
```

MySQL માં root થી લોગિન (Ubuntu પર ઘણીવાર auth socket):

```bash
sudo mysql
```

MySQL prompt અંદર નીચેના જેવું ચલાવો (**પાસવર્ડ બદલો**):

```sql
CREATE DATABASE IF NOT EXISTS carnest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'carnest'@'localhost' IDENTIFIED BY 'Heric@1211';
GRANT ALL PRIVILEGES ON carnest.* TO 'carnest'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 5) Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

```bash
sudo apt install -y nodejs
```

ચેક:

```bash
node -v
```

```bash
npm -v
```

---

## 6) PM2 (process manager)

```bash
sudo npm install -g pm2
```

---

## 7) પ્રોજેક્ટ સર્વર પર મૂકવું

**વિકલ્પ A — Git (જો repo GitHub/GitLab પર હોય):**

```bash
sudo mkdir -p /var/www
```

```bash
sudo chown -R $USER:$USER /var/www
```

```bash
cd /var/www
```

```bash
git clone YOUR_REPO_URL carnest
```

```bash
cd carnest
```

**વિકલ્પ B — તમારા PC થી `scp` (zip/folder અપલોડ):**

Windows PowerShell થી (ઉદાહરણ — પાથ બદલો):

```powershell
scp -r f:\carnest youruser@YOUR_VPS_IP:/var/www/carnest
```

પછી VPS પર:

```bash
cd /var/www/carnest
```

---

## 8) Backend — `.env` (production)

```bash
cd /var/www/carnest/server
```

```bash
cp .env.example .env
```

```bash
nano .env
```

નીચે મુજબ સેટ કરો (મૂલ્યો તમારા મુજબ):

- `NODE_ENV=production`
- `PORT=4000`
- `DB_HOST=127.0.0.1`
- `DB_PORT=3306`
- `DB_NAME=carnest`
- `DB_USER=carnest`
- `DB_PASSWORD=` (જે MySQL માં આપ્યું)
- `DB_TIMEZONE=+05:30`
- `JWT_SECRET=` — લાંબો રેન્ડમ સ્ટ્રિંગ (ઉદા. `openssl rand -hex 32` થી)
- `JWT_EXPIRES_IN=7d`
- `CLIENT_URL=https://carnest.in`
- `UPLOAD_DIR=uploads`
- `PUBLIC_BASE_URL=https://carnest.in`

સેવ કરીને બહાર નીકળો (nano: `Ctrl+O`, Enter, `Ctrl+X`).

JWT_SECRET જનરેટ કરવા:

```bash
openssl rand -hex 32
```

---

## 9) Backend — build અને PM2

**મહત્વપૂર્ણ:** `npm run build` માટે **TypeScript** જોઈએ — તે `devDependencies` માં છે. જો તમે `npm ci --omit=dev` અથવા `npm install --production` ચલાવ્યું હોય તો `tsc` નહીં મળે અને **`dist/` બનશે જ નહીં.** પહેલાં સામાન્ય `npm ci` (અથવા `npm install`) ચલાવો, પછી બિલ્ડ.

```bash
cd /var/www/carnest/server
```

```bash
npm ci
```

જો પહેલેથી production-only install કર્યું હોય:

```bash
npm install --include=dev
```

```bash
npm run build
```

ચેક કરો કે `dist/index.js` બન્યું:

```bash
ls -la dist/
```

જો `npm run build` એરર આપે, એ લાઇનો ફિક્સ કર્યા વગર PM2 ચાલશે નહીં. **`pm2 start src/index.ts` ન ચલાવો** — PM2 `.ts` માટે Bun શોધે છે અને એ ફેલ થાય છે. હંમેશા પહેલાં `tsc`, પછી `dist/index.js`.

PM2 થી ચાલુ કરો:

```bash
pm2 start dist/index.js --name carnest-api
```

બૂટ પર ઓટો-સ્ટાર્ટ:

```bash
pm2 save
```

```bash
sudo pm2 startup systemd
```

(જે કમાન્ડ PM2 પ્રિન્ટ કરે તે ચલાવો — એક વાર.)

ચેક:

```bash
pm2 status
```

```bash
curl -s http://127.0.0.1:4000/api/health
```

`{"ok":true,"database":"connected"}` જેવું JSON આવવું જોઈએ.

---

## 10) Admin user (જરૂર હોય તો)

```bash
cd /var/www/carnest/server
```

```bash
npm run create-admin
```

પ્રોમ્પ્ટ પ્રમાણે ઇમેલ/પાસવર્ડ આપો.

---

## 11) Frontend — production env અને build

આ એપ માટે **સમાન ડોમેન** પર API મૂકવા `VITE_API_URL` ખાલી રાખવું શ્રેષ્ઠ છે (બ્રાઉઝર same-origin થી `/api` કોલ કરશે, Nginx proxy કરશે).

```bash
cd /var/www/carnest/client
```

```bash
cp .env.example .env.production
```

```bash
nano .env.production
```

ખાતરી કરો:

- `VITE_API_URL=` (ખાલી, અથવા લાઇન કોમેન્ટ/ડિલીટ)
- `VITE_WHATSAPP_NUMBER`, `VITE_PUBLIC_PHONE_DISPLAY`, `VITE_PUBLIC_PHONE_TEL` તમારા નંબર મુજબ

```bash
npm ci
```

```bash
npm run build
```

`dist/` ફોલ્ડર બનશે.

---

## 12) Nginx — static site + `/api` અને `/uploads` proxy

```bash
sudo apt install -y nginx
```

સાઇટ કોન્ફિગ:

```bash
sudo nano /etc/nginx/sites-available/carnest.in
```

નીચેનું પેસ્ટ કરો (`server_name` જરૂર હોય તો `www.carnest.in` ઉમેરો):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name carnest.in www.carnest.in;

    root /var/www/carnest/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 25M;
}
```

સેવ કરો.

સાઇટ સક્રિય કરો:

```bash
sudo ln -sf /etc/nginx/sites-available/carnest.in /etc/nginx/sites-enabled/carnest.in
```

ડિફોલ્ટ સાઇટ હોય તો બંધ કરો (ટકરાવ ટાળવા):

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

ટેસ્ટ:

```bash
sudo nginx -t
```

```bash
sudo systemctl reload nginx
```

---

## 13) SSL — Let's Encrypt (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
```

જો `www.carnest.in` માટે DNS સેટ નથી, તો ફક્ત:

```bash
sudo certbot --nginx -d carnest.in
```

જો `www` માટે પણ A/CNAME record છે:

```bash
sudo certbot --nginx -d carnest.in -d www.carnest.in
```

ઇમેઇલ અને ટર્મ્સ માટે પ્રોમ્પ્ટ ફોલો કરો. પછી બ્રાઉઝરમાં ખોલો:

`https://carnest.in`

---

## 14) ડિપ્લોય પછી અપડેટ કેવી રીતે કરવું

કોડ પુલ/કૉપિ કર્યા પછી:

**Backend:**

```bash
cd /var/www/carnest/server
```

```bash
npm ci
```

```bash
npm run build
```

```bash
pm2 restart carnest-api
```

**Frontend:**

```bash
cd /var/www/carnest/client
```

```bash
npm ci
```

```bash
npm run build
```

```bash
sudo systemctl reload nginx
```

---

## 15) ટ્રબલશૂટિંગ (ટૂંકું)

| સમસ્યા | શું ચેક કરવું |
|--------|----------------|
| 502 / API નથી ચાલતું | `pm2 status`, `pm2 logs carnest-api`, `curl http://127.0.0.1:4000/api/health` |
| DB error | `.env` માં `DB_*`, MySQL `systemctl status mysql` |
| CORS | `CLIENT_URL` ચોક્કસ `https://carnest.in` (અથવા તમે જે URL ખોલો છો) |
| ફાઇલ અપલોડ | `client_max_body_size`, `UPLOAD_DIR` permissions, `PUBLIC_BASE_URL` HTTPS |
| ફક્ત blank page | `dist` પાથ સાચો, `try_files` SPA માટે |

---

## 16) Cloudinary (વૈકલ્પિક)

જો તમે `.env` માં `CLOUDINARY_*` સેટ કરો તો અપલોડ ક્લાઉડ પર જશે. નહીંતર ડિસ્ક પર `uploads/` — ત્યારે બેકઅપ અને ડિસ્ક સ્પેસ ધ્યાનમાં રાખો.

---

આ સ્ટેપ્સ પૂરા કર્યા પછી **carnest.in** પર frontend અને **સમાન ડોમેન** પર `/api` દ્વારા backend ચાલવું જોઈએ. કોઈ સ્ટેપ પર એરર આવે તો તે સ્ટેપ નો સંપૂર્ણ મેસેજ સાચવીને ચેક કરી શકાય છે.
