import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, ThumbsUp, MessageCircle, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Reply {
  id: number;
  author: string;
  authorInitials: string;
  content: string;
  timeAgo: string;
  likes: number;
}

interface Discussion {
  id: number;
  title: string;
  content: string;
  author: string;
  authorInitials: string;
  category: string;
  replies: number;
  likes: number;
  views: number;
  timeAgo: string;
  isHot: boolean;
}

const DiscussionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [replyContent, setReplyContent] = useState('');
  const [liked, setLiked] = useState(false);

  // Mock discussion data
  const [discussion, setDiscussion] = useState<Discussion>({
    id: parseInt(id || '1'),
    title: 'Best strategies for volatile markets?',
    content: 'Looking for advice on trading during high volatility periods. What indicators do you use? I\'ve been trading for about 6 months now and I find it particularly challenging when the market becomes very volatile. I\'ve tried using RSI and MACD but I\'m not getting consistent results. Would love to hear from experienced traders about their approach to volatile markets and which indicators they find most reliable.',
    author: 'John Doe',
    authorInitials: 'JD',
    category: 'Strategy',
    replies: 24,
    likes: 45,
    views: 320,
    timeAgo: '2 hours ago',
    isHot: true,
  });

  const [replies, setReplies] = useState<Reply[]>([
    {
      id: 1,
      author: 'Sarah Wilson',
      authorInitials: 'SW',
      content: 'Great question! I usually combine Bollinger Bands with ATR (Average True Range) during volatile periods. The ATR helps me adjust my stop losses dynamically based on market volatility.',
      timeAgo: '1 hour ago',
      likes: 12,
    },
    {
      id: 2,
      author: 'Mike Johnson',
      authorInitials: 'MJ',
      content: 'In my experience, volume analysis is crucial during volatile markets. I look for volume spikes combined with price action to confirm trends. Also, I reduce my position sizes by 50% when volatility increases.',
      timeAgo: '45 minutes ago',
      likes: 8,
    },
    {
      id: 3,
      author: 'Emily Chen',
      authorInitials: 'EC',
      content: 'I\'ve found that using multiple timeframe analysis helps a lot. Check the 1H, 4H, and Daily charts together. If they all align, the signal is much stronger even in volatile conditions.',
      timeAgo: '30 minutes ago',
      likes: 15,
    },
    {
      id: 4,
      author: 'David Lee',
      authorInitials: 'DL',
      content: 'Don\'t forget about the VIX! It\'s a great indicator for overall market volatility. When VIX is high, I switch to more conservative strategies and focus on risk management rather than profit maximization.',
      timeAgo: '20 minutes ago',
      likes: 10,
    },
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLike = () => {
    setLiked(!liked);
    setDiscussion({
      ...discussion,
      likes: liked ? discussion.likes - 1 : discussion.likes + 1,
    });
  };

  const handleReply = () => {
    if (!replyContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please write a reply',
        variant: 'destructive',
      });
      return;
    }

    const newReply: Reply = {
      id: replies.length + 1,
      author: user?.name || 'Anonymous',
      authorInitials: user?.name?.split(' ').map((n: string) => n[0]).join('') || 'AN',
      content: replyContent,
      timeAgo: 'Just now',
      likes: 0,
    };

    setReplies([...replies, newReply]);
    setDiscussion({
      ...discussion,
      replies: discussion.replies + 1,
    });
    setReplyContent('');

    toast({
      title: 'Success!',
      description: 'Your reply has been posted',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate('/community')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Community
        </Button>

        {/* Discussion Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="text-lg">{discussion.authorInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{discussion.title}</h1>
                  {discussion.isHot && (
                    <Badge variant="destructive">HOT</Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{discussion.author}</span>
                  <Badge variant="secondary">{discussion.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {discussion.timeAgo}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {discussion.replies} replies
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {discussion.likes} likes
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed mb-4">{discussion.content}</p>
            <div className="flex items-center gap-2">
              <Button
                variant={liked ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={handleLike}
              >
                <ThumbsUp className="w-4 h-4" />
                {liked ? 'Liked' : 'Like'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Replies Section */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-bold">{replies.length} Replies</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {replies.map((reply) => (
                <div key={reply.id} className="flex gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{reply.authorInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-accent rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{reply.author}</span>
                        <span className="text-xs text-muted-foreground">{reply.timeAgo}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{reply.content}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 ml-4">
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                        <ThumbsUp className="w-3 h-3" />
                        {reply.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reply Form */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Add Your Reply</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end">
                <Button onClick={handleReply} className="gap-2">
                  <Send className="w-4 h-4" />
                  Post Reply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiscussionDetail;
