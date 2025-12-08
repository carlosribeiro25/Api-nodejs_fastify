"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCourse = makeCourse;
const faker_1 = require("@faker-js/faker");
const cliente_ts_1 = require("../../database/cliente.ts");
const schema_ts_1 = require("../../database/schema.ts");
const node_crypto_1 = require("node:crypto");
async function makeCourse() {
    const result = await cliente_ts_1.db.insert(schema_ts_1.courses).values({
        id: (0, node_crypto_1.randomUUID)(),
        title: faker_1.faker.lorem.words(4),
        description: faker_1.faker.lorem.words(4),
    }).returning();
    return result[0];
}
