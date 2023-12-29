import ChatHeader from '../Components/ChatHeader'
import MatchesDisplay from '../Components/MatchesDisplay'
import ChatsDisplay from '../Components/ChatsDisplay'

const ChatContainer = () => {
    return(
        <div className="chat-container">
            <ChatHeader/>

            <div>
                <button className="option">Matches</button>
                <button className="option">Chats</button>
            </div>

            <MatchesDisplay/>

            <ChatsDisplay/>

        </div>
    )
}

export default ChatContainer