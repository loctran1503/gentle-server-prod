"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionSource = void 0;
const typeorm_1 = require("typeorm");
exports.connectionSource = new typeorm_1.DataSource({
    migrationsTableName: 'migrations',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Loc123456',
    database: 'test-deploy',
    logging: false,
    synchronize: false,
    name: 'default',
    entities: [
        "src/entity/**/*{.js,.ts}"
    ],
    migrations: [
        "src/migration/**/*{.js,.ts}"
    ],
    subscribers: [
        "src/subscriber/**/*{.js,.ts}"
    ],
});
//# sourceMappingURL=ormconfig.js.map