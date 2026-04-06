# Disciplina+ Coach

App comercial de disciplina com gamificacao, agente coach diario, rotina anti-vicio e planos (gratis, basico, pro e hardcore).

## Deploy publico gratis e seguro (HTTPS)

Este repositorio agora inclui deploy automatico do frontend no **GitHub Pages** usando Actions:

- Workflow: `.github/workflows/deploy-frontend-pages.yml`
- Build: `frontend` (React/CRACO)
- Publicacao: branch `gh-pages`

### Como publicar

1. No GitHub do repositorio, abra:
   - `Settings` -> `Pages`
2. Em **Build and deployment**, selecione:
   - **Source**: `GitHub Actions`
3. Garanta que a branch com este workflow esteja no remoto.
4. Apos o workflow rodar com sucesso, o link publico ficara:
   - `https://SEU-USUARIO.github.io/SEU-REPO/`

No repo atual, o padrao fica semelhante a:
- `https://goaoo.github.io/art-ia/`

## Instalar no celular (grátis)

O frontend foi configurado como PWA:

- `frontend/public/manifest.json`
- `frontend/public/sw.js`
- registro do service worker em `frontend/src/index.js`

Com o app publicado em HTTPS, usuarios podem:

- Android (Chrome): menu -> **Adicionar a tela inicial**
- iPhone (Safari): compartilhar -> **Adicionar a Tela de Inicio**

## Desenvolvimento local

```bash
cd frontend
yarn install
yarn start
```

Build de producao:

```bash
cd frontend
yarn build
```
