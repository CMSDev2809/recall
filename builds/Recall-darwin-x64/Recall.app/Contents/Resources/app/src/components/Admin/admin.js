import React, { Component } from "react";
import { connect } from "react-redux";
import config from "electron-json-config";
import { Prompt } from "react-router-dom";
import * as deepEqual from "deep-equal";
import { TextInput, SelectBox, resetUID } from "../inputs.js";
import { actions } from "./component.js";
import fns from "../../fns";
import "./admin.css";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className="box" style={{ marginTop: "35px" }}>
        <header className="toolbar toolbar-header">
          <h1 className="title">Admin Functions</h1>
        </header>
        <div className="padded">Hello</div>
      </div>
    );
  }
}

const Admin_mapStateToProps = state => {
  return {
    ...state.Admin
  };
};
const Admin_mapDispatchToProps = dispatch => {
  return {};
};

Admin = connect(Admin_mapStateToProps, Admin_mapDispatchToProps)(Admin);

export default Admin;
