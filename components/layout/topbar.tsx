export default function Topbar() {
  return (
    <nav className="blur" id="navbar">
      <div className="logo desktop opac" id="logo-style">
        <div className="logo-top menu list">
          <a href="index.html">
            <span className="anarchychats titleName">
              AnarchyChats
            </span>
            <span className="com titleName">
              .com
            </span>
          </a>
        </div>
        <div className="logo-below">
          <span className="subtext subTitleName">
            By Lorenzino, mr.iogames, and more
          </span>
        </div>
      </div>
      <div className="logo-image" id="logo-image">
        <img src="images/ARCH.webp" className="logotkr" />
      </div>
    </nav>
  );
}