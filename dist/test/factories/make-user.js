"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUser = makeUser;
exports.makeAuthenticatedUser = makeAuthenticatedUser;
const faker_1 = require("@faker-js/faker");
const cliente_ts_1 = require("../../database/cliente.ts");
const schema_ts_1 = require("../../database/schema.ts");
const node_crypto_1 = require("node:crypto");
const argon2_1 = require("argon2");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function makeUser(role) {
    const passwordBeforeHash = (0, node_crypto_1.randomUUID)();
    const result = await cliente_ts_1.db.insert(schema_ts_1.users).values({
        id: (0, node_crypto_1.randomUUID)(),
        name: faker_1.faker.person.fullName(),
        email: faker_1.faker.internet.email(),
        password: await (0, argon2_1.hash)(passwordBeforeHash),
        role,
    }).returning();
    return {
        user: result[0],
        passwordBeforeHash,
    };
}
async function makeAuthenticatedUser(role) {
    const { user } = await makeUser(role);
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is required.");
    }
    const token = jsonwebtoken_1.default.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET);
    return { user, token };
}
