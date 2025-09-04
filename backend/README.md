bun-backend/
├── src/
│   ├── routes/
│   │   ├── index.route.ts          # Root/general routes
│   │   ├── url.route.ts            # URL shortener routes
│   │   └── qr.route.ts             # QR code routes
│
│   ├── controllers/
│   │   ├── url.controller.ts       # URL shortener controllers
│   │   └── qr.controller.ts        # QR code controllers
│
│   ├── services/
│   │   ├── url.service.ts          # URL shortener business logic
│   │   └── qr.service.ts           # QR code business logic
│
│   ├── utils/
│   │   ├── shortener.ts            # URL shortener helpers (id gen, validation)
│   │   └── qr.ts                   # QR code helpers (generation, formatting)
│
│   ├── middlewares/
│   │   ├── error.middleware.ts
│   │   └── logger.middleware.ts
│
│   ├── config/
│   │   └── firebase.ts             # Config for Firebase or other DB
│
│   ├── types/
│   │   └── index.d.ts
│
│   ├── core/
│   │   ├── server.ts
│   │   ├── router.ts
│   │   └── env.ts
│
│   └── index.ts
│
├── .env
├── bunfig.toml
├── tsconfig.json
└── README.md
