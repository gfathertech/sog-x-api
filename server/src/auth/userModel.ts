import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import {nanoid} from "nanoid";


export interface User extends Document {
  name: string;
  email: string;
  password: string;
  apikey: string;
  role: "user" | "admin";
  status: "free" | "pro";
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<User>({
  name: { 
    type: String, 
    required: [true, "Name is required"],
    minlength: [2, "Name must be at least 2 characters"]
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"]
  },
  password: { 
    type: String, 
    required: [true, "Password is required"], 
    minlength: [6, "Password must be at least 6 characters"],
    // select: false
  },
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user" 
  },
   status: { 
    type: String, 
    enum: ["free", "pro"], 
    default: "free" 
  },
   apikey: { 
    type: String, 
    unique: true,
    required: true,
    default: ()=> ("d-oracle" + nanoid(10))
  }
}, { 
  timestamps: true 
});


// Hash password before saving
userSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(0.5);
    this.password = await bcrypt.hash(this.password, salt);
    console.log(this.password)
    next();
  } catch (error) {
    if (error instanceof Error) {
  return  next(error as Error);
    }
  return next(new Error('Error hashing password'))
  }
});


// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<User>("User", userSchema);

export default User;