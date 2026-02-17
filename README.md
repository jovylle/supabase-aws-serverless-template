# Supabase + AWS Lambda Template

Simple starter template for:
- Supabase Database
- AWS Lambda (Serverless Framework)
- Static HTML frontend

## Setup

### 1. Supabase setup

1. Sign in at https://app.supabase.com, create a new project, and pick a nearby AWS region for lower latency.
2. Once the project is ready, open **SQL Editor** and run the schema below to create the `notes` table:
   ```sql
   create table notes (
     id uuid primary key default gen_random_uuid(),
     title text,
     content text,
     created_at timestamp default now()
   );
   ```
3. Open **Project Settings → API** (upper section of that page lists “Project API” details) and copy the `API URL`.
4. Still under **Project Settings**, switch to the **API Keys** tab, scroll to the “New API keys” section (publishable + secret), and copy the `sb_secret_…` value.
5. Copy `backend/.env.example` to `.env` and plug the values from steps 3–4:
   ```env
   SUPABASE_URL=https://xxxxxx.supabase.co
   SUPABASE_SECRET_KEY=your_sb_secret_key
   ```
   If you also need the frontend to talk directly to Supabase, use the new `sb_publishable_…` key but only after enabling Row Level Security and writing policies for the tables it touches. Otherwise keep Supabase access behind your Lambda and do not expose any secrets in the browser.

### 2. Backend deploy

```sh
cd backend
npm install
npm install -g serverless
cp .env.example .env
# edit .env with SUPABASE_URL and SUPABASE_SECRET_KEY from step 1
serverless deploy
```

Copy the API URL from the deployment output and paste it into `frontend/app.js`.

**AWS credentials**  
Serverless needs AWS credentials before you can deploy. Either run `aws configure` (from the AWS CLI) or tell Serverless about a key pair you created in IAM:

```
serverless config credentials --provider aws --key YOUR_KEY_ID --secret YOUR_SECRET --stage dev --region ap-southeast-1
```

Or export the creds manually in the same session before `serverless deploy`:

```sh
export AWS_ACCESS_KEY_ID=…
export AWS_SECRET_ACCESS_KEY=…
```

If you rotate keys later, re-run `serverless config credentials` with the new values so deployments continue to work.

### 3. Frontend

Edit `frontend/app.js` and set `API_URL` to the value from the backend deploy.

Deploy the frontend to Netlify, GitHub Pages, or S3 whenever you are ready to launch.
