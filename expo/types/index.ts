export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  isVerified?: boolean;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface Story {
  id: string;
  user: User;
  imageUrl: string;
  timestamp: number;
  isSeen: boolean;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: number;
  likesCount: number;
}

export interface Tag {
  id: string;
  username: string;
  position?: { x: number; y: number };
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  imageUrl?: string;
}

export interface Post {
  id: string;
  user: User;
  imageUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  comments: Comment[];
  isLiked: boolean;
  isBookmarked: boolean;
  timestamp: number;
  location?: string;
  tags?: Tag[];
}

export interface Reel {
  id: string;
  user: User;
  thumbnailUrl: string;
  videoUrl?: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  musicName?: string;
  tags?: Tag[];
  location?: string;
}

export interface Chat {
  id: string;
  user: User;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
  isOnline: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isRead: boolean;
  type: 'text' | 'image';
  imageUrl?: string;
}
