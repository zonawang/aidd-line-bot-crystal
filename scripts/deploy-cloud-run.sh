#!/usr/bin/env bash
set -euo pipefail

# Run only after the operator approves billable deployment and public access.
project_id="line-zona"
region="asia-east1"
service="zona-crystal-demo"
runtime_account="zona-crystal-demo@${project_id}.iam.gserviceaccount.com"
demo_origin="${PUBLIC_DEMO_ORIGIN:-https://zona-crystal-demo-3sv3zqjszq-de.a.run.app}"
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
source_dir="$(mktemp -d "${TMPDIR:-/tmp}/zona-crystal-deploy.XXXXXX")"

# Never upload .env, private memories, credentials, framework records or worktrees.
cp "$repo_root/package.json" "$repo_root/package-lock.json" \
  "$repo_root/Dockerfile" "$repo_root/.dockerignore" \
  "$repo_root/.gcloudignore" "$source_dir/"
cp -R "$repo_root/src" "$repo_root/public" "$source_dir/"

gcloud run deploy "$service" \
  --project="$project_id" --region="$region" --platform=managed \
  --source="$source_dir" --service-account="$runtime_account" \
  --allow-unauthenticated --ingress=all \
  --min-instances=0 --max-instances=1 --concurrency=20 \
  --cpu=1 --memory=512Mi --timeout=40 --port=8080 \
  --set-env-vars="APP_MODE=public-demo,BOT_MODE=example,MEMORY_ADAPTER=firestore,GCP_PROJECT=${project_id},FIRESTORE_DATABASE_ID=zona-crystal-demo,FIRESTORE_COLLECTION=zona_crystal_public_demo,HOST=0.0.0.0,PUBLIC_DEMO_ORIGIN=${demo_origin}" \
  --quiet

gcloud run services describe "$service" \
  --project="$project_id" --region="$region" \
  --format='value(status.url)'

# This temporary directory contains public application source only; keep it for diagnostics.
printf 'Deployment source: %s\n' "$source_dir"
