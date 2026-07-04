import { Favorite } from "../models/Favorite";

type Ctx = { userEmail: string | null };

export const favoritesResolvers = {
  Query: {
    myFavorites: async (_: any, __: any, context: Ctx) => {
      if (!context.userEmail) {
        throw new Error("Not authenticated");
      }

      return Favorite.find({ userEmail: context.userEmail }).sort({
        createdAt: -1,
      });
    },
    isFavorite: async (
      _: any,
      { videoId }: { videoId: string },
      context: Ctx
    ) => {
      if (!context.userEmail) {
        return false;
      }

      const doc = await Favorite.findOne({
        userEmail: context.userEmail,
        videoId,
      });
      return !!doc;
    },
  },
  Mutation: {
    addFavorite: async (
      _: any,
      { videoId, videoUrl }: { videoId: string; videoUrl: string },
      context: Ctx
    ) => {
      if (!context.userEmail) {
        throw new Error("Not authenticated");
      }

      // Upsert keeps re-adding an existing favorite a harmless no-op.
      return Favorite.findOneAndUpdate(
        { userEmail: context.userEmail, videoId },
        { $setOnInsert: { videoUrl } },
        { new: true, upsert: true }
      );
    },
    removeFavorite: async (
      _: any,
      { videoId }: { videoId: string },
      context: Ctx
    ) => {
      if (!context.userEmail) {
        throw new Error("Not authenticated");
      }

      const res = await Favorite.deleteOne({
        userEmail: context.userEmail,
        videoId,
      });
      return res.deletedCount > 0;
    },
  },
};
