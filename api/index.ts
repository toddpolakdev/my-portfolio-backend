import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { connectToDatabase } from "../mongo";
import { VercelRequest, VercelResponse } from "@vercel/node";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    const db = await connectToDatabase();
    return { db };
  },
  introspection: true,
});

const startServer = server.start();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await startServer;

  // CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  return server.createHandler({ path: "/api/graphql" })(req, res);
}
