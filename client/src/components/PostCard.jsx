import { BadgeCheck, Heart, HeartIcon, LucideSendHorizonal, MessageCircle, SendHorizonal, Share2 } from 'lucide-react'
import React, { useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const PostCard = ({ post }) => {

    const [likes, setLikes] = useState(post.likes_count)
    const currentUser = useSelector((state) => state.user.value)
    const postWithHashTag = post.content.replace(/(#\w+)/g, '<span class="text-indigo-600">$1</span>')
    const { getToken } = useAuth()
    const [showComment, setShowComment] = useState(false)
    const [commentContent, setCommentContent] = useState("")
    const [comments, setComments] = useState([])

    const handleLike = async () => {
        try {
            const { data } = await api.post(`/api/post/like`, { postId: post._id },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            )
            if (data.success) {
                toast.success(data.message)
                setLikes(prev => {
                    if (prev.includes(currentUser._id)) {
                        return prev.filter(id => id !== currentUser._id)
                    } else {
                        return [...prev, currentUser._id]
                    }
                })
            } else {
                toast(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleComment = async () => {

        try {
            setLoading(true)
            // Send comment to backend
            await api.post(`/api/post/comment`, {
                content: comments,
                userId: user._id // replace with logged-in user ID
            });

            // Clear input (official comment will arrive via SSE)
            setComments("");
        } catch (err) {
            console.error("❌ Failed to post comment:", err);
            toast("Could not post comment. Try again.");
        } finally {
            setLoading(false);
        }
    };
    const navigate = useNavigate();

    return (
        <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
            {/* User Info */}
            <div onClick={() => navigate('/profile/' + post.user._id)} className='inline-flex items-center gap-3 cursor-pointer'>
                <img src={post.user.profile_picture} className='w-10 h-10 rounded-full shadow' alt="" />
                <div>
                    <div className='flex items-center space-x-1'>
                        <span>{post.user.full_name}</span>
                        <BadgeCheck className='w-4 h-4 text-blue-500' />
                    </div>
                    <div className='text-gray-500 text-sm'>@{post.user.username} . {moment(post.createdAt).fromNow()}</div>
                </div>
            </div>
            {/* content */}
            {post.content && <div className='text-gray-800 text-sm whitespace-pre-line' dangerouslySetInnerHTML={{ __html: postWithHashTag }} />}
            {/* images */}
            <div className='grid grid-cols-2 gap-2'>
                {post.image_urls.map((img, index) => (
                    <img src={img} key={index} className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`} alt="" />
                ))}
            </div>

            {/* Actions */}
            <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
                <div className='flex items-center gap-1'>
                    <Heart className={`w-4 h-4 cursor-pointer ${likes.includes(currentUser._id) && 'text-red-500'}`} onClick={handleLike} />
                    <span>{likes.length}</span>
                </div>
                <div onClick={() => setShowComment(prev => !prev)} className='flex cursor-pointer items-center gap-1'>
                    <MessageCircle className='w-4 h-4' />
                    <span>{12}</span>
                </div>
                <div className='flex items-center gap-1'>
                    <Share2 className='w-4 h-4' />
                    <span>{7}</span>
                </div>
            </div>
            {showComment && <div>
                <form className="w-full flex justify-between items-center border-b-2 border-b-gray-300 p-[10px] 
                     " >
                    <input type="text" placeholder={"leave a comment"} className='outline-none  border-none' value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
                    <button onClick={handleComment} className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full'>
                        <SendHorizonal size={18} />
                    </button>
                </form>

                <div className='flex flex-col gap-[10px]'>
                    {comments.map((com) => (
                        <div key={com._id} className='flex flex-col gap-[10px] border-b-2 p-[20px] border-b-gray-300' >
                            <div className="w-full flex justify-start items-center gap-[10px]">
                                <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center  cursor-pointer' >
                                    <img src={com.user.profile_picture || ""} alt="" className='h-full' />
                                </div>

                                <div className='text-[16px] font-semibold'>{`${com.user.full_name}`}</div>


                            </div>
                            <div className='pl-[50px]'>{com.content}</div>
                        </div>
                    ))}
                </div>
            </div>}
        </div>
    )
}

export default PostCard