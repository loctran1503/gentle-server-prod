require("dotenv").config();
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import bodyParser  from 'body-parser'
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { dataSource } from "./data-source";
import { resolvers, __prod__ } from "./utils/constants";


const main = async () => {
  //Typeorm connection
  try {
    
   await dataSource.initialize();
  
  } catch (error) {
    console.log(`Typeorm STARTING ERROR:${error}`);
  }
  
  //Express server

  const app = express();
  app.use(
    cors({
      origin: __prod__
        ? "https://gentlevn.com" || "https://www.gentlevn.com"
        : process.env.CORS_ORIGIN_DEV,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(bodyParser.json())
  //Main
  const PORT = process.env.PORT || 4000;

  //Apollo server

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: resolvers,
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({ req, res }) => ({ req, res }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: { origin: true } });
  
 


  app.listen(PORT, () =>
    console.log(
      `Server running on PORT:${PORT},Graphql running at http://localhost:${PORT}${apolloServer.graphqlPath}`
    )
  );
};
main().catch((err) => console.log(`SERVER STARTING ERROR:${err}`));
