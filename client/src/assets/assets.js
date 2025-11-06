export const postsData = [
    {
        _id: '1',
        user_id: 'u1',
        content: 'This is my first post!',
        imageUrl: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg',
        likes: ['u2'],
        likesCount: 1,
        commentsCount: 2,
        creator: 'Alice',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: '2',
        user_id: 'u2',
        content: 'Hello world, this is another post.',
        imageUrl: '',
        likes: [],
        likesCount: 0,
        commentsCount: 0,
        creator: 'Bob',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: '3',
        user_id: 'u3',
        content: 'Check out this cool image!',
        imageUrl: 'https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg',
        likes: ['u1', 'u2'],
        likesCount: 2,
        commentsCount: 1,
        creator: 'Charlie',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
]





export const commentsData = [
    {
        _id: 'c1',
        post_id: '1',
        user_id: 'u2',
        content: 'Nice post!',
        likes: ['u1'],
        likesCount: 1,
        repliesCount: 0,
        creator: 'Bob',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: 'c2',
        post_id: '1',
        user_id: 'u3',
        content: 'Thanks for sharing.',
        likes: [],
        likesCount: 0,
        repliesCount: 0,
        creator: 'Charlie',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: 'c3',
        post_id: '2',
        user_id: 'u1',
        content: 'Interesting!',
        likes: ['u2'],
        likesCount: 1,
        repliesCount: 0,
        creator: 'Alice',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
]

