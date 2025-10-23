# Quick Setup Instructions

## You Need to Create the Database Table Manually

Due to network limitations (IPv6 vs IPv4), I can't create the table programmatically. But it's very easy to do manually!

### Steps:

1. **Open Supabase SQL Editor:**
   - Go to: https://app.supabase.com/project/wnclwwvnyxmtkcukjrlc/sql/new
   - Or: Dashboard → SQL Editor → New query

2. **Copy the SQL:**
   - Open the file `supabase-setup.sql` in this project
   - Copy ALL the contents (Ctrl+A, Ctrl+C)

3. **Paste and Run:**
   - Paste into the Supabase SQL editor
   - Click "Run" button (or Ctrl+Enter)
   - You should see success messages

4. **Verify:**
   - Go to Table Editor (left sidebar)
   - You should see `adapter_state` table

### That's it! Once done, come back and let me know.

I'll then:
- ✅ Update your .env with the service_role key
- ✅ Start your adapter server
- ✅ Test it with a YouTube video
- ✅ Verify data is saving to Supabase

---

**Your Supabase Credentials Summary:**
- URL: `https://wnclwwvnyxmtkcukjrlc.supabase.co`
- Anon Key (public): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduY2x3d3ZueXhtdGtjdWtqcmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNTQyNTEsImV4cCI6MjA3NjgzMDI1MX0.GChDM-cJGwWwXrWOiP2wVpnw-iOBXeOO94iznCovSjE`
- Service Role Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduY2x3d3ZueXhtdGtjdWtqcmxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI1NDI1MSwiZXhwIjoyMDc2ODMwMjUxfQ.KLbUGzoFKB7y4wFyywPP_gkulNOulC0bF4WDY-54Ac0`
