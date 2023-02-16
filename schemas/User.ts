import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  email: string;
  password: string;
}
const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    // unique: [true, "Account already exists"],
    // validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your email"],
    minLength: [6, "Your password must be at least 6 characters long"],
    select: false, //dont send back password after request
  },
});

// Encryption
UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch {}
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
