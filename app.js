const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./db/connect");
const Blog = require("./models/Blog");

const app = express(); //callling express

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "BlogApp API " });
});
// get all blogs
app.get("/api/v1/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// create new blog
app.post("/api/v1/blogs", async (req, res) => {
  try {
    // creating a blog
    const { title, content, author, tags } = req.body;
    const newBlog = new Blog({
      title: title,
      content: content,
      author: author || "Anonymous",
      tags: tags || [],
    });
    // saving the blog in database

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// get a single blog
app.get("/api/v1/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "blog not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// DELETE THE BLOG
app.delete("/api/v1/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ message: "blog not found" });
    }
    res.json({ message: "deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const PORT = process.env.PORT;

const start = async function () {
  try {
    await connectDB();
    console.log("connected to DATABSE");
    app.listen(PORT, () => {
      console.log(`server is listening on PORT ${PORT} `);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
