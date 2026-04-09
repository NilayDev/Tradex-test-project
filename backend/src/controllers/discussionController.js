const { z } = require('zod');
const { supabase } = require('../config/supabase');

const createDiscussionSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(10),
  category: z.string(),
});

const createReplySchema = z.object({
  content: z.string().min(1),
});

const getAllDiscussions = async (req, res) => {
  try {
    const { data: discussions, error } = await supabase
      .from('discussions')
      .select(`
        *,
        user:users(name, email),
        replies:discussion_replies(count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ discussions });
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({ error: 'Failed to get discussions' });
  }
};

const getDiscussionById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: discussion, error } = await supabase
      .from('discussions')
      .select(`
        *,
        user:users(name, email),
        replies:discussion_replies(
          *,
          user:users(name, email)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Increment views
    await supabase
      .from('discussions')
      .update({ views: (discussion.views || 0) + 1 })
      .eq('id', id);

    res.json({ discussion });
  } catch (error) {
    console.error('Get discussion error:', error);
    res.status(500).json({ error: 'Failed to get discussion' });
  }
};

const createDiscussion = async (req, res) => {
  try {
    const { title, content, category } = createDiscussionSchema.parse(req.body);

    const { data: discussion, error } = await supabase
      .from('discussions')
      .insert([{
        title,
        content,
        category,
        user_id: req.userId,
        likes: 0,
        views: 0,
      }])
      .select(`
        *,
        user:users(name, email)
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Discussion created successfully',
      discussion,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create discussion error:', error);
    res.status(500).json({ error: 'Failed to create discussion' });
  }
};

const createReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = createReplySchema.parse(req.body);

    const { data: reply, error } = await supabase
      .from('discussion_replies')
      .insert([{
        discussion_id: id,
        user_id: req.userId,
        content,
        likes: 0,
      }])
      .select(`
        *,
        user:users(name, email)
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Reply created successfully',
      reply,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create reply error:', error);
    res.status(500).json({ error: 'Failed to create reply' });
  }
};

const likeDiscussion = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('discussion_likes')
      .select('id')
      .eq('discussion_id', id)
      .eq('user_id', req.userId)
      .single();

    if (existingLike) {
      // Unlike
      await supabase
        .from('discussion_likes')
        .delete()
        .eq('discussion_id', id)
        .eq('user_id', req.userId);

      // Decrement likes count
      const { data: discussion } = await supabase
        .from('discussions')
        .select('likes')
        .eq('id', id)
        .single();

      await supabase
        .from('discussions')
        .update({ likes: Math.max(0, (discussion?.likes || 0) - 1) })
        .eq('id', id);

      return res.json({ message: 'Discussion unliked', liked: false });
    } else {
      // Like
      await supabase
        .from('discussion_likes')
        .insert([{ discussion_id: id, user_id: req.userId }]);

      // Increment likes count
      const { data: discussion } = await supabase
        .from('discussions')
        .select('likes')
        .eq('id', id)
        .single();

      await supabase
        .from('discussions')
        .update({ likes: (discussion?.likes || 0) + 1 })
        .eq('id', id);

      return res.json({ message: 'Discussion liked', liked: true });
    }
  } catch (error) {
    console.error('Like discussion error:', error);
    res.status(500).json({ error: 'Failed to like discussion' });
  }
};

module.exports = {
  getAllDiscussions,
  getDiscussionById,
  createDiscussion,
  createReply,
  likeDiscussion
};
