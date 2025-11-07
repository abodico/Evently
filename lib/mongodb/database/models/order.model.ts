import { Schema, model, models, Document } from "mongoose"

export interface IOrder extends Document {
    createdAt: Date
    stripeId: string
    totalAmount: string
    event: {
        _id: string
        title: string
    }
    buyer: {
        _id: string
        firstName: string
        lastName: string
    }
}

export type IOrderItem = {
    _id: string
    totalAmount: string
    createdAt: Date
    eventTitle: string
    eventId: string
    buyer: string
}

const OrderSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    stripeId: {
        type: String,
        required: true,
        unique: true,
    },
    totalAmount: {
        type: String,
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
})

// models.Category: checks if the model already exists (important in Next.js or hot-reloading
// environments — prevents "Cannot overwrite model once compiled" errors).
// If it doesn’t exist, model("Category", CategorySchema) creates a new model using that schema.
const Order = models.Order || model("Order", OrderSchema)

export default Order
