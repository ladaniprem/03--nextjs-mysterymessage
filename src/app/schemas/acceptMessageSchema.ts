import { z } from 'zod';

export const acceptMessageSchema = z.object({ // to check it further if anykind of error occurs 
  acceptMessage: z.boolean(),
});