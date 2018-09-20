import React, { Component } from "react";
import { connect } from "react-redux";
import config from "electron-json-config";
import { Prompt } from "react-router-dom";
import * as deepEqual from "deep-equal";
import { TextInput, SelectBox, resetUID } from "../inputs.js";
import { actions } from "./component.js";
import fns from "../../fns";
import "./settings.css";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className="box" style={{ marginTop: "35px" }}>
        <header className="toolbar toolbar-header">
          <h1 className="title">Settings</h1>
        </header>
        <div className="padded">Hello</div>
      </div>
    );
  }
}

const Settings_mapStateToProps = state => {
  return {
    ...state.Settings
  };
};
const Settings_mapDispatchToProps = dispatch => {
  return {};
};

Settings = connect(Settings_mapStateToProps, Settings_mapDispatchToProps)(
  Settings
);

export default Settings;
