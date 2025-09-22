import { FlipBook } from "../models/FlipBook";

export const flipbookResolvers = {
  Query: {
    flipBooks: async () => {
      return await FlipBook.find().sort({ order: 1, createdAt: -1 });
    },
    flipBookBySlug: async (_: any, { slug }: { slug: string }) => {
      return await FlipBook.findOne({ slug });
    },
    myFlipbooks: async (
      _: any,
      __: any,
      context: { userEmail: string | null }
    ) => {
      if (!context.userEmail) {
        throw new Error("Not authenticated");
      }

      return FlipBook.find({ userEmail: context.userEmail });
    },
  },
  Mutation: {
    createFlipBook: async (
      _: any,
      { input }: any,
      context: { userEmail: string | null }
    ) => {
      const maxOrder = await FlipBook.findOne()
        .sort({ order: -1 })
        .select("order");
      const order = (maxOrder?.order || 0) + 1;

      const doc = await FlipBook.create({
        ...input,
        order,
        userEmail: context.userEmail || null,
      });
      return String(doc._id);
    },

    updateFlipBook: async (_: any, { id, input }: any) => {
      const res = await FlipBook.findByIdAndUpdate(id, input, { new: true });
      return !!res;
    },
    reorderFlipBooks: async (_: any, { ids }: { ids: string[] }) => {
      try {
        const updatePromises = ids.map((id, index) =>
          FlipBook.findByIdAndUpdate(id, { order: index })
        );
        await Promise.all(updatePromises);
        return true;
      } catch (error) {
        console.error("Error reordering flipbooks:", error);
        return false;
      }
    },
  },
};
