import MainNavigation from "./MainNav";
import styling from "./Layout.module.css";

function Layout(props) {
  return (
    <div className="App">
      <MainNavigation />
      <main className={styling.main}>{props.children}</main>
    </div>
  );
}

export default Layout;
