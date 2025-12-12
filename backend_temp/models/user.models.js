import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,      
      lowercase: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,     
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Others"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // DEFAULT profile pic based on gender
    profilepic: {
      type: String,
      default: function () {
        if (this.gender === "Male") {
          return "https://media.istockphoto.com/id/610003972/vector/vector-businessman-black-silhouette-isolated.jpg?s=612x612&w=0&k=20&c=Iu6j0zFZBkswfq8VLVW8XmTLLxTLM63bfvI6uXdkacM=";
        } else if (this.gender === "Female") {
          return "https://img.freepik.com/premium-vector/default-female-user-profile-icon-vector-illustration_276184-169.jpg";
        } else {
          return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnSSxXHLqu5lsHYkFlZkvXuo2ZamNvdqLiCg&s";
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
