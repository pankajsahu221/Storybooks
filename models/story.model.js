import mongoose from "mongoose";

const Schema = mongoose.Schema;

const StorySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    status: { type: String, default: "public", enum: ["public", "private"] },
    user: { type: Schema.Types.ObjectId, ref: "user" }
  },
  { timestamps: true }
);

const Story = mongoose.model("story", StorySchema);

export default Story;
