const { Role } = require("../utils/enums");
const { z } = require("zod");

const loginUserSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email address." })
        .nonempty({ message: "Email is required." }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." }),
});

const userSchema = z.object({
    username: z.string().trim(),
    email: z
        .string()
        .email({ message: "Invalid email address." })
        .nonempty({ message: "Email is required." }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." }),
    role: z.enum([Role.ADMIN, Role.SUPER_ADMIN])
});

const participantSchema = z.object({
    firstName: z
        .string()
        .nonempty({ message: "First name is required." })
        .max(50, { message: "First name must not exceed 50 characters." }),
    lastName: z
        .string()
        .nonempty({ message: "Last name is required." })
        .max(50, { message: "Last name must not exceed 50 characters." }),
    email: z
        .string()
        .email({ message: "Invalid email address." })
        .nonempty({ message: "Email is required." }),
    phoneNumber: z
        .string()
        .regex(/^\d{2}( \d{2}){4}$/, { message: "Phone number must match the format XX XX XX XX XX." }),
    training: z
        .string()
        .nonempty({ message: "Training is required." }),
    level: z
        .string()
        .nonempty({ message: "Level is required." }),
    birthDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Birth date must be in YYYY-MM-DD format." })
        .refine((date) => {
            const now = new Date();
            const birth = new Date(date);
            return birth < now;
        }, { message: "Birth date cannot be in the future." }),
    role: z
        .string()
        .nonempty({ message: "Role is required." }),
    motivation: z
        .string()
        .max(500, { message: "Motivation must not exceed 500 characters." }),
    status: z.enum(["read", "unread"]).optional(),
});

const statusSchema = z.object({
    status: z.enum(['unread', 'read']),
});



const updateUserSchema = z.object({
    username: z.string().trim(),
    role: z.enum([Role.ADMIN, Role.SUPER_ADMIN])
}).refine(data => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni."
});

const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." }),
    newPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." }),
});

const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body);
        next();
    } catch (error) {
        res.status(400).json({
            error: 'Validation failed',
            details: error.errors
        });
    }
};


module.exports = {
    userSchema,
    loginUserSchema,
    updateUserSchema,
    changePasswordSchema,
    participantSchema,
    statusSchema,
    validate
};
