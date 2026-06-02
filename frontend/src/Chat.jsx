 import "./Chat.css";
import { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);

    const [latestReply, setLatestReply] = useState(null);
    const bottomRef = useRef(null);

    // Auto Scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [prevChats, latestReply]);

    // Reset on New Chat
    useEffect(() => {
        // Defer resetting latestReply to avoid synchronous setState during render/effect
        const t = setTimeout(() => setLatestReply(null), 0);
        return () => clearTimeout(t);
    }, [newChat]);

    // Typing Effect
    useEffect(() => {
        if (!reply || !prevChats?.length) return;

        const content = reply.split(" ");

        let idx = 0;

        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));

            idx++;

            if (idx >= content.length) {
                clearInterval(interval);
            }
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply]);

    const chats = prevChats || [];
    const hasChats = chats.length > 0;

    return (
        <>
            {newChat && <h1>Start a New Chat!</h1>}

            <div className="chats">

                {chats.slice(0, -1).map((chat, idx) => (
                    <div
                        key={idx}
                        className={
                            chat.role === "user"
                                ? "userDiv"
                                : "gptDiv"
                        }
                    >
                        {chat.role === "user" ? (
                            <p className="userMessage">
                                {chat.content}
                            </p>
                        ) : (
                            <ReactMarkdown
                                rehypePlugins={[rehypeHighlight]}
                            >
                                {chat.content || ""}
                            </ReactMarkdown>
                        )}
                    </div>
                ))}

                {hasChats && (
                    latestReply === null ? (
                        <div className="gptDiv">
                            <ReactMarkdown
                                rehypePlugins={[rehypeHighlight]}
                            >
                                {chats[chats.length - 1]?.content || ""}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <div className="gptDiv">
                            <ReactMarkdown
                                rehypePlugins={[rehypeHighlight]}
                            >
                                {latestReply}
                            </ReactMarkdown>
                        </div>
                    )
                )}

                {/* Auto Scroll Target */}
                <div ref={bottomRef}></div>

            </div>
        </>
    );
}

export default Chat;