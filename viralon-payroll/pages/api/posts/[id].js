
// pages/api/posts/[id].js
import dbConnect from "@/utils/dbConnect";
import Post from '../../../models/Post';

export default async function handler(req, res) {
  const { method, query: { id } } = req;

  await dbConnect();

  if (method === 'GET') {
    try {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(400).json({ success: false });
    }
  } else if (method === 'PUT') {
    try {
      const post = await Post.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(400).json({ success: false });
    }
  } else if (method === 'DELETE') {
    try {
      const deletedPost = await Post.deleteOne({ _id: id });
      if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
