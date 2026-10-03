#!/usr/bin/env bash
set -euo pipefail
REMOTE_URL="${1:-https://github.com/Cloud-byte1/PortfolioChad.git}"
BRANCH="${2:-cursor/chad-carmichael-portfolio-c241}"

if ! git remote get-url github >/dev/null 2>&1; then
  git remote add github "$REMOTE_URL"
else
  git remote set-url github "$REMOTE_URL"
fi

echo "Pushing $BRANCH → github (main + feature branch)..."
git push -u github "$BRANCH:main" --force-with-lease
git push -u github "$BRANCH"
echo "Done. Repo: $REMOTE_URL"
