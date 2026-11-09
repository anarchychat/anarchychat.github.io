import { useState } from "react"
import { SetStateAction, Dispatch } from "react";
import { setCookie } from "../logic/cookie";

export default function Block({
  block, 
  blur, 
  blockData,
  color,
  setCookieValue,
}: {
  block: boolean,
  blur: boolean,
  blockData: string[],
  color: string,
  setCookieValue: (name: string, value: string) => void,
}) {
  const [blockInput, setBlockInput] = useState("")
  const [unblockInput, setUnblockInput] = useState("")
  function blockUser(input: string, 
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    if (blockData.includes(input)) {
      return
    }
    setCookieValue("block", input)
  }
  function unblockUser(input: string, 
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    setCookieValue("unblock", input)
  }
  function unblockAll() {
    setCookieValue("unblock-all", "")
  }

  function ifNeedComma(username: string, index: number) {
    if (index === 0) return " " + username
    return ", " + username
  }

  return (
    <div id="block-page" 
      className={`block-page ${blur ? "blur" : ""} ${block ? "active" : ""}`} 
      tabIndex={block ? 0 : -1}
      inert={!block}
    >
      <div className="innerBlockPage">
        <div className="sidebars blocksidebar">
          <div className="item">
            <input type="color" 
              id="usernameColorPicker" 
              className="mobileblock colorPickerClass"
              value={color}
              onChange={(e) => setCookie("color", e.target.value)}
            />
          </div>
          
          <div className="item">        
            <div className="mobileblock blockedUsersListClass all">
              Blocked Users:
              {blockData.map((username, i) => {
                return(
                  ifNeedComma(username, i)
                )
              })}
            </div>
          </div>
  
          <div className="item">
            <form
              onSubmit={(e) => blockUser(blockInput, e)}
            >
              <input type="text" 
                placeholder="Block user" 
                className="mobileblock blockInputClass" 
                onChange={(e) => setBlockInput(e.target.value)}
              />
            </form>
          </div>

          <div className="item">
            <form
              onSubmit={(e) => unblockUser(unblockInput, e)}
            >
              <input type="text" 
                placeholder="Unblock user" 
                className="mobileblock unblockInputClass" 
                onChange={(e) => setUnblockInput(e.target.value)}
              />
            </form>
          </div>

          <div className="item">
            <button 
              className="mobileblock unblockAllButtonClass"
              onClick={() => unblockAll()}
            >
              Unblock All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}