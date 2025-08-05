import { Db } from "mongodb";

export const resolvers = {
  Query: {
    sections: async (_: any, args: { ids?: string[] }, { db }: { db: Db }) => {
      const query = args.ids?.length ? { id: { $in: args.ids } } : {};

      return db.collection("section").find(query).toArray();
    },

    section: async (_: any, args: { id: string }, { db }: { db: Db }) => {
      return db.collection("section").findOne({ id: args.id });
    },
  },
};
