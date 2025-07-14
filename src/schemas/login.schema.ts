import { z } from "zod"

export const userSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
})

export type UserSchema = z.infer<typeof userSchema>
