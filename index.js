import { tweetsData as initialTweetsData } from './data.js'
let tweetsData = JSON.parse(localStorage.getItem('tweetsData')) || initialTweetsData
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const currentUser = '@Scrimba'

function saveToLocalStorage(){
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.replyButton)
        handleReplyBtnClick(e.target.dataset.replyButton)
    else if(e.target.dataset.delete){
        handleDeleteTweet(e.target.dataset.delete)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    saveToLocalStorage()
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    saveToLocalStorage()
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    saveToLocalStorage()
    tweetInput.value = ''
    }

}

function handleReplyBtnClick(tweetId){
    const replyInput = document.getElementById(`reply-input-${tweetId}`)
    
    if(replyInput.value){
        const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId)
        
        targetTweetObj.replies.push({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyInput.value
        })
        saveToLocalStorage()
        render()
            
        }
}

function handleDeleteTweet(tweetId){
    
    const tweetToDelete = tweetsData.find(tweet => tweet.uuid === tweetId)
    
    if(tweetToDelete.handle !== currentUser){
        return
    }
    
    tweetsData = tweetsData.filter(function(tweet){
        return tweet.uuid !== tweetId
    })
    
    saveToLocalStorage()
    render()
    
}

function getFeedHtml(){
    
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
        let deleteBtnHtml = ''
        
        if(tweet.handle === currentUser){
            deleteBtnHtml =`
                <span class="tweet-detail">
                </span>
                    <i class="fa-sharp fa-solid fa-trash-can"
                    data-delete="${tweet.uuid}"
                    ></i>
            `
        }        
          
        feedHtml += `
<div class="tweet">
        
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                ${deleteBtnHtml}
            </div>   
                
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
        
    <div class="reply-input-area">
        <textarea
        placeholder="Write a reply..."
        id="reply-input-${tweet.uuid}"
        >
        </textarea>
        
        <button 
        data-reply-button="${tweet.uuid}" 
        class="reply-btn">
        Reply
        </button>
    </div> 
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

        
