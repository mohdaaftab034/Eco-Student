import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { userDataContext } from '../Context/UserContext'

const Feed = () => {

    const [feeds, setFeeds] = useState([])
    const [loading, setLoading] = useState(true)
    const { token, user, axios } = useContext(userDataContext);

    const fetchFeeds = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get('/api/post/feed', {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })

            if (data.success) {
                setFeeds(data.posts)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchFeeds()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center flex flex-col gap-5 items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mb-4 mx-auto"></div>
                    <p className="text-lg text-gray-600">Loading your profile...</p>
                </div>
            </div>
        )
    }



    return (
        <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
            {/* stories and post list */}
            <div>
                <Storiesbar />
                <div className='p-4 space-y-6'>
                    {feeds.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Feed