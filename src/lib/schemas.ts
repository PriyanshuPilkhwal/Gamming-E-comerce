import { z } from 'zod'

// Schema for checkout form validation
export const checkoutSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  cardNumber: z.string()
    .regex(/^\d{16}$/, { message: "Card number must be 16 digits." })
    .transform((val) => val.replace(/\s/g, '')), // Clean spaces
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, { message: "Must be in MM/YY format." }),
  cvc: z.string().regex(/^\d{3}$/, { message: "CVC must be 3 digits." }),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>