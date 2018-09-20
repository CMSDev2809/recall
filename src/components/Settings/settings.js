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
    this.state = {
      directoryPath: "",
      port: ""
    };
  }

  async getSettings() {
    const settings = await fns.readFromSave();
    this.setState({
      directoryPath: settings.db,
      port: settings.port
    });
  }

  submit() {
    if (window.confirm("Save new settings?")) {
      fns.writeToSave({
        db: this.state.directoryPath,
        port: this.state.port
      });
    }
  }

  cancel() {
    this.getSettings();
  }

  componentDidMount() {
    this.getSettings();
  }

  render() {
    return (
      <div>
        <div className="box" style={{ marginTop: "35px" }}>
          <header className="toolbar toolbar-header">
            <h1 className="title">Settings</h1>
          </header>
          <div className="padded">
            <label>Database Directory</label>
            <div>
              <div className="db">
                <div style={{ marginRight: "12.5px", width: "75%" }}>
                  <input
                    label="Database Directory"
                    type="text"
                    className="form-control"
                    placeholder=""
                    value={this.state.directoryPath}
                    onChange={e =>
                      this.setState({ directoryPath: e.target.value })}
                  />
                </div>
                :
                <div style={{ marginLeft: "12.5px", width: "25%" }}>
                  <input
                    label="Database Directory"
                    type="text"
                    className="form-control"
                    placeholder=""
                    value={this.state.port}
                    onChange={e => this.setState({ port: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="buttons">
          <button
            style={{ marginRight: "5px" }}
            className="btn btn-large btn-primary"
            onClick={() => this.submit()}
          >
            Submit
          </button>
          <button
            className="btn btn-large btn-negative"
            onClick={() => this.cancel()}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

const Settings_mapStateToProps = state => {};
const Settings_mapDispatchToProps = dispatch => {};

Settings = connect(Settings_mapStateToProps, Settings_mapDispatchToProps)(
  Settings
);

export default Settings;
