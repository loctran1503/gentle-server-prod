"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_express_1 = require("apollo-server-express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const data_source_1 = require("./data-source");
const constants_1 = require("./utils/constants");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield data_source_1.dataSource.initialize();
    }
    catch (error) {
        console.log(`Typeorm STARTING ERROR:${error}`);
    }
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: constants_1.__prod__
            ? "https://gentlevn.com"
            : process.env.CORS_ORIGIN_DEV,
        credentials: true,
    }));
    app.use((0, cookie_parser_1.default)());
    app.use(body_parser_1.default.json());
    const PORT = process.env.PORT || 4000;
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: constants_1.resolvers,
            validate: false,
        }),
        plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()],
        context: ({ req, res }) => ({ req, res }),
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: { origin: true } });
    app.listen(PORT, () => console.log(`Server running on PORT:${PORT},Graphql running at http://localhost:${PORT}${apolloServer.graphqlPath}`));
});
main().catch((err) => console.log(`SERVER STARTING ERROR:${err}`));
//# sourceMappingURL=index.js.map