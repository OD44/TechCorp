const Blog = require("../Model/Blog");

const CreatePost = async(req, res)=>{
    const {title, content} = req.body;
    const author = req.user._id

    try {
        const newPost = await Blog.create({title, content, author});
        const savedPost = newPost.save();

        return res.status(201).json({message: "New post created", newPost})
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "server error"})
    }
}

const getPost = async (req, res)=>{
    try {
        const findPost = await Blog.find();
        res.json(findPost)
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Server error"})
    }
}

const singlePost = async(req, res)=>{
    try {
        const postId = req.params.postId

        const post = await Blog.findById(postId)
        if(!post){
            return res.status(404).json({msg: "Post not found"})
        }
            res.json(post)
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Server error"})
    }
}

const updatePost = async (req, res)=>{
    try {
        const {postId} = req.params
        const postUpdate = req.body;
        const updatedPost = await Blog.findByIdAndUpdate(postId, postUpdate,{
            runValidators: true, new: true
        })

        if(!updatedPost){
            return res.json({error: "Post not updated"})
        }
        res.json(updatedPost)
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Server error"})
    }
}


const deletePost = async (req, res)=>{
    const { id } = req.params;
    try {
        const post = await Blog.deleteOne({ _id: id });
        if (post.deletedCount === 1) {
            return res.json({message: "Post Deleted Successfully "})
        } else {
            res.status(404).json({error: "Post not found or already deleted."});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server error."});
    }
}

module.exports = {
    CreatePost,
    getPost,
    singlePost,
    updatePost,
    deletePost
}