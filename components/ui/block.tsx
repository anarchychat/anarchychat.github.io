export default function Block({
  block
}: {
  block: boolean
}) {
  return (
    <div id="block-page" 
      className={`block-page blur ${block ? "active" : ""}`} 
      tabIndex={block ? 0 : -1}
      inert={!block}
    >
      <div className="innerBlockPage">
        <div className="sidebars blocksidebar">
          <div className="item">
            <input type="color" 
              id="usernameColorPicker" 
              className="mobileblock colorPickerClass"
            />
          </div>
          
          <div className="item">        
            <div className="mobileblock blockedUsersListClass all">
              Blocked Users:
            </div>
          </div>
  
          <div className="item">
            <input type="text" 
              placeholder="Block user" 
              className="mobileblock blockInputClass" 
            />
          </div>

          <div className="item">
            <input type="text" 
              placeholder="Unblock user" 
              className="mobileblock unblockInputClass" 
            />
          </div>

          <div className="item">
            <button className="mobileblock unblockAllButtonClass">
              Unblock All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}