# sonolus-sus-server
![Node Version](https://img.shields.io/badge/node-v16.4-yellow)
![License](https://img.shields.io/badge/license-MIT-green)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/purplepalette/sonolus-sus-server/Build%20and%20push%20image?label=build)  
sus file to sonolus level convertion server for [sonolus-fastapi](https://github.com/PurplePalette/sonolus-fastapi).  
this server meant micro service to make level data.


## Requirements
* Node 16
* Any S3 storage(Recommends [B2 Cloud Storage](https://www.backblaze.com/b2/cloud-storage.html) with [Cloudflare](https://cloudflare.com/))


## Development setup
```bash
# Install dependencies
git clone https://github.com/PurplePalette/sp-sub-sus
cd sp-sub-sus
npm install
# Create dev server
cp .env.test .env
docker-compose up -d
# Run dev server
(stop sus container)
npm run dev
(or run jest test)
```

## Docs
- [API Spec / Stoplight](https://sonolus-core.stoplight.io/docs/sub-servers/YXBpOjUxODQ0MDcz-sonolus-sus-server)
- [Detailed spec / Whimsical (TODO)](#)
