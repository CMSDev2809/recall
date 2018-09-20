import React, { Component } from "react";
import { actions } from "./component.js";
import { connect } from "react-redux";
import config from "electron-json-config";
import { NavLink } from "react-router-dom";
import fns from "../../fns";

class Menu extends Component {
  state = {
    tasks: "",
    display: <div />
  };

  async tasks() {
    const tasks = await fns.getTasks();
    this.setState({ tasks: tasks.length > 0 ? `(${tasks.length})` : "" });
  }

  async setDisplay() {
    let token = "";
    let access = 5;
    try {
      token = await fns.readToken().catch(res => console.log("dfdfdf"));
      access = await fns.getUserAccess(token);
    } catch (err) {}
    this.setState({
      display: (
        <div>
          {access.username ? (
            <MenuRow path="/" label="Logout" icon="logout" />
          ) : (
            <MenuRow path="/" label="Login" icon="home" />
          )}
          {access.level < 5 ? (
            <MenuRow
              path="/entry_interface"
              label="Card Management"
              icon="icon icon-book"
            />
          ) : null}
          {access.level === 0 ? (
            <MenuRow
              path="/tasks"
              label={`Tasks ${this.state.tasks}`}
              icon="icon icon-clipboard"
            />
          ) : null}
          {access.level === 0 ? (
            <MenuRow path="/admin" label={`Admin`} icon="icon icon-megaphone" />
          ) : null}
          <MenuRow path="/settings" label="Settings" icon="icon icon-cog" />
        </div>
      )
    });
  }

  componentDidMount() {
    this.setDisplay();
  }

  componentWillReceiveProps() {
    this.setDisplay();
  }

  render() {
    return (
      <nav className="nav-group">
        <h5 className="nav-group-title">Navigation</h5>
        {this.state.display}
      </nav>
    );
  }
}

const MenuRow = props => {
  return (
    <NavLink
      to={props.path}
      className="nav-group-item"
      activeClassName="active"
      exact={true}
    >
      <span className={"icon icon-" + props.icon} />
      {props.label}
    </NavLink>
  );
};

const Menu_mapStateToProps = state => {
  return {
    ...state,
    username: state.Home.username
  };
};
const Menu_mapDispatchToProps = dispatch => {
  return {};
};

Menu = connect(Menu_mapStateToProps, Menu_mapDispatchToProps)(Menu);

export default Menu;
