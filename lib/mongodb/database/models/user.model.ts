import { model, models, Schema } from "mongoose"

const userSchema = new Schema({
    clerkId: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
})

const User = models.User || model("User", userSchema)

export default User
