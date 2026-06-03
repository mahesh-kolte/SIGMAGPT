import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import logo from "./assets/blacklogo.png";
function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  useEffect(() => {
    const getAllThreads = async () => {
      try {
        const response = await fetch(
          "https://sigmagpt-vayw.onrender.com/api/thread",
        );
        const res = await response.json();
        const filteredData = res.map((thread) => ({
          threadId: thread.threadId,
          title: thread.title,
        }));
        setAllThreads(filteredData);
      } catch (err) {
        console.log(err);
      }
    };

    getAllThreads();
  }, [currThreadId, setAllThreads]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `https://sigmagpt-vayw.onrender.com/api/thread/${newThreadId}`,
      );
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `https://sigmagpt-vayw.onrender.com/api/thread/${threadId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setAllThreads((prev) =>
          prev.filter((thread) => thread.threadId !== threadId),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img
          src={logo}
          alt="gpt logo"
          className="logo"
        ></img>
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={thread.threadId || idx}
            onClick={() => thread.threadId && changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p> Mahesh Kolte &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;
