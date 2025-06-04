.
├── .env.example                    # ตัวอย่างไฟล์ Environment Variables
├── .eslintignore
├── .eslintrc.js                    # ESLint Configuration
├── .gitignore
├── .prettierignore
├── .prettierrc.js                  # Prettier Configuration
├── docker-compose.yml              # (Optional) สำหรับ Docker
├── Dockerfile                      # (Optional) สำหรับ Docker
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
│
├── src/
│   ├── main.ts                     # ไฟล์เริ่มต้นสำหรับ bootstrap แอปพลิเคชัน
│   ├── app.module.ts               # โมดูลหลักของแอปพลิเคชัน
│   │
│   ├── core/                       # Boilerplate's Core: กลไกพื้นฐาน, ไม่ควรเปลี่ยนบ่อยเมื่อเริ่มโปรเจกต์ใหม่
│   │   ├── config/                 #   - กลไกการจัดการ Configuration
│   │   │   ├── config.module.ts    #     - CoreConfigModule (setup @nestjs/config, load .env, load project configs from src/config/)
│   │   │   ├── config.service.ts   #     - CoreConfigService (wrapper service สำหรับเข้าถึง config)
│   │   │   ├── validation.ts       #     - (Joi) Schema สำหรับ validate ENV vars พื้นฐานที่ Boilerplate คาดหวัง
│   │   │   └── utils/
│   │   │       └── validate-config.util.ts # - Utility function กลางสำหรับ validate project-specific typed configs
│   │   │
│   │   ├── database/               #   - กลไกการเชื่อมต่อฐานข้อมูลของ NestJS
│   │   │   └── database.module.ts  #     - CoreDatabaseModule (e.g., TypeOrmModule.forRootAsync() โดยใช้ DataSource จาก src/database/data-source.ts)
│   │   │
│   │   ├── logger/                 # ระบบ Logging ส่วนกลาง
│   │   │   ├── logger.module.ts    #   - โมดูลสำหรับให้บริการ LoggerService
│   │   │   ├── logger.service.ts   #   - เซอร์วิสสำหรับการ Log (อาจจะ wrap Winston หรือ NestJS Logger)
│   │   │   ├── logger.interface.ts #   - (Optional) Interface สำหรับ Logger (ถ้ามีการ implement เอง)
│   │   │   └── index.ts            #   - (Optional) Export ทุกอย่างจาก logger/
│   │   │
│   │   ├── caching/                # (ตัวอย่าง) กลไก Caching
│   │   │   ├── caching.module.ts   #   - โมดูลสำหรับตั้งค่าและให้บริการ Caching
│   │   │   ├── caching.service.ts  #   - เซอร์วิสสำหรับจัดการ Cache
│   │   │   └── index.ts            #   - (Optional) Export ทุกอย่างจาก caching/
│   │   │
│   │   ├── mailing/                # (ตัวอย่าง) กลไกการส่ง Email
│   │   │   ├── mailing.module.ts   #   - โมดูลสำหรับตั้งค่าและให้บริการ Mailing
│   │   │   ├── mailing.service.ts  #   - เซอร์วิสสำหรับส่งอีเมล
│   │   │   ├── templates/          #   - (Optional) โฟลเดอร์สำหรับเก็บ Email Templates
│   │   │       └── welcome.hbs     #     (ตัวอย่าง template)
│   │   │   └── index.ts            #   - (Optional) Export ทุกอย่างจาก mailing/
│   │   │
│   │   └── index.ts                #   - (Optional) ไฟล์หลักสำหรับ re-export โมดูลทั้งหมดจาก core/ เพื่อให้ AppModule สามารถ import โมดูลจาก core/ ได้ง่ายขึ้น เช่น import { ConfigModule, DatabaseModule, LoggerModule } from '#core'; (จะต้องตั้งค่า path alias '#' ใน tsconfig.json ด้วย)
│   │
│   ├── database/                   # Project-Specific DB: Schema, Migrations, Seeds & ORM Config โดยตรง
│   │   ├── data-source.ts          #   - ไฟล์ Config หลักสำหรับ ORM CLI (e.g., TypeORM DataSource)
│   │   │                           #     (จะ config path ไปยัง entities ใน feature modules และ migrations ที่นี่)
│   │   ├── migrations/             #   - โฟลเดอร์สำหรับ Database Migrations (ไฟล์ .ts)
│   │   │   └── .gitkeep            #     (Boilerplate อาจจะว่าง หรือมีตัวอย่าง migration แรก)
│   │   └── seeds/                  #   - โฟลเดอร์สำหรับ Database Seeds (ไฟล์ .ts หรือตาม library ที่ใช้)
│   │       └── .gitkeep            #     (ถ้าใช้ SeedModule อาจจะเก็บแค่ raw data หรือไม่ใช้เลย)
│   │                               #   *Entities: โดยทั่วไปจะอยู่ในแต่ละ Feature Module (e.g., src/modules/users/entities/user.entity.ts)
│   │                               #    และ data-source.ts จะถูกตั้งค่าให้ค้นหา entities จาก path เหล่านั้น (e.g., 'src/modules/**/*.entity.ts')
│   │
│   ├── config/                     # Project-Specific Typed Configurations: โครงสร้าง Config ที่ซับซ้อนของโปรเจกต์นี้
│   │   ├── app.config.ts           #   - (ตัวอย่าง) ใช้ registerAs และ validateAndTransformConfig จาก core
│   │   ├── jwt.config.ts           #   - (ตัวอย่าง)
│   │   ├── database.config.ts      #   - (ตัวอย่าง) Typed config สำหรับ database connection details (ถ้าจำเป็น)
│   │   ├── swagger.config.ts       #   - API documentation config
│   │   └── index.ts                #   - Export array ของ configuration factories ทั้งหมดเพื่อให้ CoreConfigModule โหลด
│   │
│   ├── constants/                  # Project-Specific Global Constants: ค่าคงที่ที่ใช้หลายส่วนใน "โปรเจกต์นี้"
│   │   ├── index.ts
│   │   └── error-codes.constants.ts #  - (ตัวอย่าง)
│   │
│   ├── shared/                     # Boilerplate's Shared Components: Utilities, DTOs พื้นฐาน ที่ใช้ซ้ำได้ทั่วไปใน Boilerplate
│   │   ├── constants/              #   - ค่าคงที่ที่เป็นสากลมากๆ ของ Boilerplate (ควรมีน้อย)
│   │   ├── decorators/             #   - Custom decorators ทั่วไป
│   │   ├── dto/                    #   - Base DTOs (e.g., PaginationDto, SuccessResponseDto)
│   │   ├── exceptions/             #   - Base custom exceptions
│   │   ├── filters/                #   - Global Exception Filters (e.g., GlobalExceptionsFilter)
│   │   ├── guards/                 #   - Global Guards หรือ Guards ที่ใช้ได้ทั่วไปมากๆ (ถ้ามี)
│   │   ├── helpers/                #   - (หรือ utils/) Utility functions ทั่วไป
│   │   ├── interfaces/             #   - TypeScript interfaces ที่ใช้ได้ทั่วไป
│   │   ├── interceptors/           #   - Global Interceptors (e.g., TransformResponseInterceptor)
│   │   ├── pipes/                  #   - Global Pipes (e.g., setup for ValidationPipe)
│   │   └── providers/              #   - Shared utility services (ถ้ามี)
│   │
│   └── modules/                    # (หรือ features/) Feature Modules: ส่วน Business Logic หลักของแอปพลิเคชัน
│       ├── auth/                   #   - (ตัวอย่าง) โมดูลการยืนยันตัวตนและสิทธิ์
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── strategies/         #     - Passport strategies
│       │   ├── guards/             #     - Feature-specific guards
│       │   ├── decorators/         #     - Auth-specific decorators
│       │   ├── dto/
│       │   ├── constants/          #     - Auth-specific constants
│       │   └── entities/           #     - (Optional, e.g., RefreshTokenEntity, ถ้า UserEntity อยู่อีก Module)
│       │
│       ├── users/                  #   - (ตัวอย่าง) โมดูลจัดการผู้ใช้งาน
│       │   ├── users.module.ts
│       │   ├── users.controller.ts
│       │   ├── users.service.ts
│       │   ├── dto/
│       │   ├── entities/           #     - User.entity.ts
│       │   ├── repositories/       #     - (Optional) User.repository.ts
│       │   └── constants/
│       │
│       ├── health/                 #   - (Recommended) โมดูลสำหรับ Health Check
│       │   ├── health.module.ts
│       │   └── health.controller.ts
│       │
│       ├── seed/                   #   - (Optional) โมดูลสำหรับจัดการ Database Seeding ที่ซับซ้อนด้วย NestJS Services
│       │   ├── seed.module.ts      #     (เป็นทางเลือก/ส่วนเสริมของ src/database/seeds/)
│       │   ├── seed.service.ts
│       │   └── seeders/            #     - (Optional) โฟลเดอร์เก็บ seeder logic ย่อยๆ
│       │
│       └── [other-feature-module]/ #   - โครงสร้างสำหรับ Feature Module อื่นๆ
│           ├── [feature].module.ts
│           ├── [feature].controller.ts
│           ├── [feature].service.ts
│           ├── dto/
│           ├── entities/
│           ├── constants/
│           └── ...
│
└── test/                           # ไฟล์สำหรับ Unit Tests และ E2E Tests
    ├── jest-e2e.json
    ├── jest.config.js              # (หรือ vitest.config.ts ถ้าใช้ Vitest)
    ├── unit/                       # (Optional) โฟลเดอร์สำหรับ Unit Tests แยกตามโครงสร้าง src
    └── e2e/                        # (Optional) โฟลเดอร์สำหรับ E2E Tests
        └── app.e2e-spec.ts