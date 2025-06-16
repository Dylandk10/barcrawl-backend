import { z } from 'zod';

// the schema and type for the searchText
export const searchTextSchema = z.object({
    searchText: z.string().min(1).max(30)
});
export type SearchText = z.infer<typeof searchTextSchema>;



