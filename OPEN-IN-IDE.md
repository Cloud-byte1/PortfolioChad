# Open this portfolio in Cursor IDE (no GitHub push needed)

You do **not** need to push to GitHub to edit this project locally.

## 1. Download the zip

From the agent run / artifacts, download:

- `PortfolioChad-ide.zip`

(Also in Project Context: `portfolio/PortfolioChad-ide.zip`)

## 2. Unzip into a folder

Example:

```bash
mkdir -p ~/PortfolioChad
unzip PortfolioChad-ide.zip -d ~/PortfolioChad
```

## 3. Open in Cursor

1. Cursor → **File → Open Folder…**
2. Choose `~/PortfolioChad` (or wherever you unzipped)
3. In the terminal:

```bash
npm install
npm run dev
```

Open http://127.0.0.1:4317

## Optional later: push to GitHub

When you’re ready and signed into GitHub on your machine:

```bash
cd ~/PortfolioChad
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/Cloud-byte1/PortfolioChad.git
git push -u origin main
```

(If GitHub already has a README commit, you may need `git pull origin main --allow-unrelated-histories` first, or force-push if you intend to replace it.)
