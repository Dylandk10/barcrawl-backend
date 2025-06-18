import { z } from 'zod';

// the schema and type for the searchText
export const searchTextSchema = z.object({
    searchText: z.string().min(1).max(30)
});
export type SearchText = z.infer<typeof searchTextSchema>;



//sign up validation is the same as login just emaill and password
export const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password is too long' }),
});
export type signup = z.infer<typeof signupSchema>;



//searching for nearby places must have the following lat and long
export const searchForNearByPlacesSchema = z.object({
  lat: z.string(),
  long: z.string()
});

export type getPlacesNearMe = z.infer<typeof searchForNearByPlacesSchema>;
