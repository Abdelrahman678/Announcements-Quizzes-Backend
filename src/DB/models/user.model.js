import mongoose from "mongoose";
import { genderEnum } from "../../Constants/constants.js";
import { hashSync } from "bcrypt";

const { Schema } = mongoose;
/* User Schema */
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(genderEnum),
      default: genderEnum.MALE,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

/* pre hook for save to hash user password */
userSchema.pre("save", async function () {
  if (this.isModified("password") && this.password) {
    /* hash password */
    this.password = hashSync(this.password, parseInt(process.env.SALT_ROUNDS));
  }
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
