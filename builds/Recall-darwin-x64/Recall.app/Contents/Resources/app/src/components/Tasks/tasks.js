import React, { Component } from "react";
import { connect } from "react-redux";
import config from "electron-json-config";
import { Prompt } from "react-router-dom";
import * as deepEqual from "deep-equal";
import { TextInput, SelectBox, resetUID } from "../inputs.js";
import { actions } from "./component.js";
import fns from "../../fns";
import "./tasks.css";

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: [],
      textInput: ""
    };
  }

  componentDidMount() {
    setTimeout(() => this.find(), 100);
  }

  async find() {
    let hits = await fns.getTasks();
    hits = hits.map(element => {
      const card = fns.decryptCard(element);
      return (
        <li
          className="list-group-item"
          onClick={() => {
            this.props.sendCard(card);
            this.props.history.push("/entry_interface?activepane=editor");
          }}
        >
          <div className="list_item">
            <span className="icon icon-user pull-left" />
            <div className="media-body">
              <div style={{ float: "right" }}>
                <h2>
                  {card.cardNumber[card.cardNumber.length - 1]}
                  {card.cardNumber[card.cardNumber.length - 2]}
                  {card.cardNumber[card.cardNumber.length - 3]}
                  {card.cardNumber[card.cardNumber.length - 4]}
                </h2>
                <p style={{ float: "right" }}>{card.securityCode}</p>
              </div>
              <div className={"hourglass"}>
                <span className="icon icon-hourglass" />
              </div>
              <div style={{ marginLeft: "25px" }}>
                <strong>
                  {card.lastName}, {card.firstName}
                </strong>
                <p>Phone Number: {card.phoneNumber}</p>
                <p>Address: {card.billingAddress}</p>
                <p>{card.billingAddress2}</p>
              </div>
              <h5>
                A request has been made to charge this card for{" "}
                {`${card.amount}.`}
              </h5>
              <h5 style={{ fontStyle: "italic" }}>{card.processing}</h5>
            </div>
          </div>
        </li>
      );
    });
    this.setState({ hits });
  }

  render() {
    return (
      <div className="box" style={{ marginTop: "35px" }}>
        <header className="toolbar toolbar-header">
          <h1 className="title">Tasks</h1>
        </header>
        <div className="padded">
          <ul className="list-group">{this.state.hits}</ul>
        </div>
      </div>
    );
  }
}

const Tasks_mapStateToProps = state => {
  return {
    ...state.Tasks
  };
};
const Tasks_mapDispatchToProps = dispatch => {
  return {
    sendCard: card => {
      dispatch(actions.sendCard(card));
    }
  };
};

Tasks = connect(Tasks_mapStateToProps, Tasks_mapDispatchToProps)(Tasks);

export default Tasks;
