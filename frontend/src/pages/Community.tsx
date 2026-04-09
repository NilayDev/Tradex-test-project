import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageSquare, TrendingUp, ThumbsUp, MessageCircle, Clock, Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const Community = () => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: 1,
      title: 'Best strategies for volatile markets?',
      content: 'Looking for advice on trading during high volatility periods. What indicators do you use?',
      author: 'John Doe',
      authorInitials: 'JD',
      category: 'Strategy',
      replies: 24,
      likes: 45,
      views: 320,
      timeAgo: '2 hours ago',
      isHot: true,
    },
    {
      id: 2,
      title: 'How to manage risk in crypto trading',
      content: 'Share your risk management techniques for cryptocurrency trading.',
      author: 'Jane Smith',
      authorInitials: 'JS',
      category: 'Risk Management',
      replies: 18,
      likes: 32,
      views: 245,
      timeAgo: '5 hours ago',
      isHot: true,
    },
    {
      id: 3,
      title: 'My experience with automated trading',
      content: 'After 6 months of using bots, here are my results and lessons learned.',
      author: 'Mike Johnson',
      authorInitials: 'MJ',
      category: 'Automation',
      replies: 31,
      likes: 67,
      views: 512,
      timeAgo: '1 day ago',
      isHot: false,
    },
    {
      id: 4,
      title: 'Tips for beginners in forex trading',
      content: 'Starting your forex journey? Here are some essential tips to get you started.',
      author: 'Sarah Wilson',
      authorInitials: 'SW',
      category: 'Education',
      replies: 42,
      likes: 89,
      views: 678,
      timeAgo: '2 days ago',
      isHot: false,
    },
    {
      id: 5,
      title: 'Technical analysis vs fundamental analysis',
      content: 'Which approach do you prefer and why? Let\'s discuss the pros and cons.',
      author: 'David Lee',
      authorInitials: 'DL',
      category: 'Analysis',
      replies: 15,
      likes: 28,
      views: 189,
      timeAgo: '3 hours ago',
      isHot: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '', category: 'Strategy' });
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const categories = ['All', 'Strategy', 'Risk Management', 'Automation', 'Education', 'Analysis', 'News'];

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || discussion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateDiscussion = () => {
    if (!newDiscussion.title || !newDiscussion.content) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const discussion: Discussion = {
      id: discussions.length + 1,
      title: newDiscussion.title,
      content: newDiscussion.content,
      author: user?.name || 'Anonymous',
      authorInitials: user?.name?.split(' ').map((n: string) => n[0]).join('') || 'AN',
      category: newDiscussion.category,
      replies: 0,
      likes: 0,
      views: 0,
      timeAgo: 'Just now',
      isHot: false,
    };

    setDiscussions([discussion, ...discussions]);
    setNewDiscussion({ title: '', content: '', category: 'Strategy' });
    setIsDialogOpen(false);
    
    toast({
      title: 'Success!',
      description: 'Your discussion has been created',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">Connect with traders and share insights</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Users className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Discussions</CardTitle>
              <MessageSquare className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{discussions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active conversations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground mt-1">High community activity</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Discussion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Start a New Discussion</DialogTitle>
                <DialogDescription>
                  Share your thoughts, ask questions, or start a conversation with the community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="What's your discussion about?"
                    value={newDiscussion.title}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newDiscussion.category}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts in detail..."
                    value={newDiscussion.content}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                    rows={6}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDiscussion}>
                    Create Discussion
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Discussions List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Discussions</CardTitle>
            <CardDescription>
              {filteredDiscussions.length} {filteredDiscussions.length === 1 ? 'discussion' : 'discussions'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => navigate(`/discussion/${discussion.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{discussion.authorInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                          {discussion.title}
                        </h3>
                        {discussion.isHot && (
                          <Badge variant="destructive" className="text-xs">HOT</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {discussion.content}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{discussion.author}</span>
                        <Badge variant="secondary" className="text-xs">
                          {discussion.category}
                        </Badge>
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
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {discussion.views} views
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredDiscussions.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No discussions found. Be the first to start one!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;
