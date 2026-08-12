@echo off
echo ========================================================
echo InvoicePro Backend Deployment
echo ========================================================
echo.
echo 1. Adding Supabase URL...
echo https://bfmzpuqanungdkililwi.supabase.co | npx wrangler secret put SUPABASE_URL

echo.
echo 2. Adding Supabase Service Role Key...
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbXpwdXFhbnVuZ2RraWxpbHdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjU0OTcwNywiZXhwIjoyMTAyMTI1NzA3fQ.N7tcjVlV3X6N2JT9wWN6YWNEBiJYP4G0VVUp1uFtjS0 | npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY

echo.
echo 3. Deploying Cloudflare Worker...
npx wrangler deploy

echo.
echo ========================================================
echo If everything worked, copy the Published URL above!
echo ========================================================
pause
