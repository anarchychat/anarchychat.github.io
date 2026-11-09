import { SetStateAction, Dispatch, useState } from "react";

export default function Bg({
  bg, blur, 
  b1, b2, b3, b4, b5, b6, 
  setCookieValue
}: {
  bg: boolean,
  blur: boolean,
  b1: boolean, b2: boolean,
  b3: boolean, b4: boolean,
  b5: boolean, b6: boolean,
  setCookieValue: (name: string, value: string | boolean) => void,
}) {
  return (
    <div id="background-page" 
      className={`background-page ${blur ? "blur" : ""} ${bg ? "active" : ""}`} 
      tabIndex={bg ? 0 : -1}
      inert={!bg}
    >
      <div className="sidebars">
        <div className="backgroundstyles">
          <li className="header-bg">
            Anarchy Chat
          </li>
          <li>
            <div
              className="bg-div" 
            >
              Background 1
              <label className="switch">
                <input 
                  type="checkbox"
                  checked={b1}
                  onChange={() => setCookieValue("b1", 
                    "https://cdn.pixabay.com/video/2024/05/29/214405_large.mp4"
                  )}
                />
                <span className="toggle-slider round"></span>
              </label>
            </div>
          </li>
          <li>
            <div
              className="bg-div" 
            >
              Background 2
              <label className="switch">
                <input 
                  type="checkbox"
                  checked={b2}
                  onChange={() => setCookieValue("b2",
                    "https://cdn.pixabay.com/video/2024/06/08/215762_large.mp4"
                  )}
                />
                <span className="toggle-slider round"></span>
              </label>
            </div>
          </li>
          <li>
            <div
              className="bg-div" 
            >
              Background 3
              <label className="switch">
                <input 
                  type="checkbox"
                  checked={b3}
                  onChange={() => setCookieValue("b3",
                    "https://cdn.pixabay.com/video/2024/03/01/202587-918431513_large.mp4"
                  )}
                />
                <span className="toggle-slider round"></span>
              </label>
            </div>
          </li>
          <li>
            <div
              className="bg-div" 
            >
              Background 4
              <label className="switch">
                <input 
                  type="checkbox"
                  checked={b4}
                  onChange={() => setCookieValue("b4",
                    "https://cdn.pixabay.com/video/2021/04/15/71122-537102350_large.mp4"
                  )}
                />
                <span className="toggle-slider round"></span>
              </label>
            </div>
          </li>
          <li>
            <div
              className="bg-div" 
            >
              Background 5
              <label className="switch">
                <input 
                  type="checkbox"
                  checked={b5}
                  onChange={() => setCookieValue("b5",
                    "https://cdn.pixabay.com/video/2021/10/10/91562-629172467_large.mp4"
                  )}
                />
                <span className="toggle-slider round"></span>
              </label>
            </div>
          </li>
          <li>
            <div
              className="bg-div" 
            >
              Background 6
              <label className="switch">
                <input 
                  type="checkbox"
                  checked={b6}
                  onChange={() => setCookieValue("b6",
                    "https://cdn.pixabay.com/video/2019/10/09/27669-365224683_large.mp4"
                  )}
                />
                <span className="toggle-slider round"></span>
              </label>
            </div>
          </li>
          <li>
            <div className="cust">
              <input
                id="url-background"
                className="ib" 
                placeholder="Background URL"
                onChange={(event) => setCookieValue("cust", 
                  event.target.value
                )}
              />
            </div>
          </li>
          <li>
            <div className="blur-mode">
              Blur Mode
              <label className="switch">
                <input 
                  type="checkbox"
                  checked={blur}
                  onChange={() => setCookieValue("blur", !blur)}
                />
                <span className="toggle-slider round"></span>
              </label>
            </div>
          </li>
        </div>
      </div>
    </div>
  );
}