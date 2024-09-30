
import { z } from "zod";

export const CommentValidationSchema = z.object({
  comment: z.string(),
  post: z.string(),
  user: z.string(),
});
