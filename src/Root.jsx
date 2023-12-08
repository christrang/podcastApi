import {Outlet} from "react-router-dom";
import Menu from "./Menu";

export default function Root() {
  return (
        <div className="container">
          <Menu />
          <Outlet />
        </div>
    )
}
