export default function Bg({
  bg
}: {
  bg: boolean
}) {

  function changeBg(bg: string) {

  }

  return (
    <div id="background-page" 
      className={`background-page blur ${bg ? "active" : ""}`} 
      tabIndex={bg ? 0 : -1}
      inert={!bg}
    >
      <div className="sidebars">
        <div className="header">
          Anarchy Chat
        </div>
        <div className="backgroundstyles">
          <li>
            <button 
              className="b1 b" 
              id="hoverButton"
              onClick={() => changeBg(
                "https://cdn.pixabay.com/video/2024/05/29/214405_large.mp4"
              )}
            >
              Background 1
            </button>
          </li>
          <li>
            <button 
              className="b2 b" 
              id="hoverButton"
              onClick={() => changeBg(
                "https://cdn.pixabay.com/video/2024/06/08/215762_large.mp4"
              )}
            >
              Background 2
            </button>
          </li>
          <li>
            <button 
              className="b3 b" 
              id="hoverButton"
              onClick={() => changeBg(
                "https://cdn.pixabay.com/video/2024/03/01/202587-918431513_large.mp4"
              )}
            >
              Background 3
            </button>
          </li>
          <li>
            <button 
              className="b4 b" 
              id="hoverButton"
              onClick={() => changeBg(
                "https://cdn.pixabay.com/video/2021/04/15/71122-537102350_large.mp4"
              )}
            >
              Background 4
            </button>
          </li>
          <li>
            <button 
              className="b5 b" 
              id="hoverButton"
              onClick={() => changeBg(
                "https://cdn.pixabay.com/video/2021/10/10/91562-629172467_large.mp4"
              )}
            >
              Background 5
            </button>
          </li>
          <li>
            <button 
              className="b6 b" 
              id="hoverButton"
              onClick={() => changeBg(
                "https://cdn.pixabay.com/video/2019/10/09/27669-365224683_large.mp4"
              )}
            >
              Background 6
            </button>
          </li>
          <li>
            <button 
              className="rem b" 
              id="hoverButton"
              onClick={() => changeBg("")}
            >
              No Background
            </button>
          </li>
          <li>
            <div className="cust">
              <input
                id="url-background"
                className="ib" 
                placeholder="Background URL" 
                onChange={(event) => changeBg(event.target.value)}
              />
            </div>
          </li>
        </div>
      </div>
    </div>
  );
}