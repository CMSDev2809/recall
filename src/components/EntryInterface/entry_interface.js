import React, { Component } from "react";
import { connect } from "react-redux";
import config from "electron-json-config";
import { Prompt, Link } from "react-router-dom";
import * as deepEqual from "deep-equal";
import { TextInput, SelectBox, resetUID } from "../inputs.js";
import { actions } from "./component.js";
import ReactToPrint from "react-to-print";
import "./entry_interface.css";

import fns from "../../fns";

class EntryInterface extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePane: "search",
      activeClient: "",
      editorState: {}
    };
  }

  componentDidMount() {
    if (this.props.location.search.length > 0) {
      this.setEditorState(
        this.props.location.search.split("=")[1],
        this.props.sendCard
      );
    }
  }

  setEditorState(activePane, editorState) {
    this.setState({ activePane, editorState });
  }

  render() {
    const style =
      this.state.activeClient.length > 0 && this.state.activePane === "search"
        ? { opacity: "1.0" }
        : { opacity: "0.35", pointerEvents: "none" };
    return (
      <div>
        <Printer />
        <header class="toolbar toolbar-header">
          <div className="toolbar-actions">
            <div className="btn-group">
              <button
                className="btn btn-default"
                onClick={() => this.setEditorState("editor-new", {})}
              >
                <span className="icon icon-credit-card" />
              </button>
              <button
                className="btn btn-default"
                onClick={() => this.setState({ activePane: "search" })}
              >
                <span className="icon icon-user" />
              </button>
            </div>
          </div>
        </header>
        {this.state.activePane === "editor" ? (
          <CardEditor
            setEditorState={(activePane, editorState) =>
              this.setEditorState(activePane, editorState)}
            editorState={this.state.editorState}
            history={this.props}
          />
        ) : this.state.activePane === "editor-new" ? (
          <CardEditor
            setEditorState={(activePane, editorState) =>
              this.setEditorState(activePane, editorState)}
          />
        ) : (
          <Search
            setEditorState={(activePane, editorState) =>
              this.setEditorState(activePane, editorState)}
          />
        )}
      </div>
    );
  }
}

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: [],
      textInput: ""
    };
  }

  async deleteCard(id) {
    if (window.confirm("Are you sure you wish to delete this item?")) {
      await fns.deleteCard(id);
      this.setState({ hits: [] });
      this.find(this.state.textInput);
    }
  }

  selectCard(card) {
    this.props.setEditorState("editor", card);
  }

  async find(query) {
    let hits = await fns.getCards(query);
    hits = hits.map(element => {
      const card = fns.decryptCard(element);
      return (
        <li className="list-group-item" style={{ position: "relative" }}>
          <div
            className={
              card.processing.length > 0 ? "list_item-void" : "list_item"
            }
            onClick={() =>
              card.processing.length > 0 ? null : this.selectCard(card)}
          >
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
              {card.processing.length > 0 ? (
                <div className={"exclemation"}>
                  <span className="icon icon-key" />
                </div>
              ) : null}
              <div style={{ display: "inline-flex" }}>
                <div style={{ marginLeft: "25px" }}>
                  <strong>
                    {card.lastName}, {card.firstName}
                  </strong>
                  <p>Phone Number: {card.phoneNumber}</p>
                  <p>Address: {card.billingAddress}</p>
                  <p>{card.billingAddress2}</p>
                </div>
              </div>
              {card.processing.length > 0 ? (
                <h5>This card has been flagged for processing.</h5>
              ) : null}
            </div>
          </div>
          {card.processing.length > 0 ? null : (
            <div className={"cancel-button"}>
              <h1
                className={"icon icon-cancel-squared"}
                onClick={() => this.deleteCard(card.id)}
              />
            </div>
          )}
        </li>
      );
    });
    this.setState({ hits });
  }

  clearFields() {
    this.setState({ hits: [], textInput: "" });
  }

  render() {
    return (
      <div style={{ position: "relative" }}>
        <div
          className="box"
          style={{ position: "sticky", top: "0%", zIndex: "9999" }}
        >
          <div className="search_box">
            <header className="toolbar toolbar-header">
              <h1 className="title">Cardholder Search</h1>
            </header>
            <div className="padded">
              <TextInput
                label="Client Name"
                placeholder=""
                value={this.state.textInput}
                onChange={value => {
                  this.setState({ textInput: value });
                }}
              />
              <button
                className="btn btn-large btn-primary"
                onClick={() => this.find(this.state.textInput)}
              >
                Search
              </button>
              <button
                className="btn btn-large btn-default"
                onClick={() => this.clearFields()}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        <div className="box" style={{ marginTop: "15px" }}>
          <header className="toolbar toolbar-header">
            <h1 className="title">Search Results</h1>
          </header>
          <div className="padded">
            <ul className="list-group">{this.state.hits}</ul>
          </div>
        </div>
      </div>
    );
  }
}

class CardEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      firstName: "",
      lastName: "",
      cardNumber: "",
      expDate: "",
      cardHolder: "",
      securityCode: "",
      amount: "",
      billingAddress: "",
      billingAddress2: "",
      city: "",
      state: "",
      zip: "",
      phoneNumber: "",
      purpose: "",
      notes: "",
      processing: ""
    };
  }

  resetState() {
    this.setState({
      id: "",
      firstName: "",
      lastName: "",
      cardNumber: "",
      expDate: "",
      cardHolder: "",
      securityCode: "",
      amount: "",
      billingAddress: "",
      billingAddress2: "",
      city: "",
      state: "",
      zip: "",
      phoneNumber: "",
      purpose: "",
      notes: "",
      processing: ""
    });
  }

  componentDidMount() {
    if (this.props.editorState) {
      this.setState({
        id: this.props.editorState.id,
        firstName: this.props.editorState.firstName,
        lastName: this.props.editorState.lastName,
        cardNumber: this.props.editorState.cardNumber,
        expDate: this.props.editorState.expDate,
        cardHolder: this.props.editorState.cardHolder,
        securityCode: this.props.editorState.securityCode,
        amount: this.props.editorState.amount,
        billingAddress: this.props.editorState.billingAddress,
        billingAddress2: this.props.editorState.billingAddress2,
        city: this.props.editorState.city,
        state: this.props.editorState.state,
        zip: this.props.editorState.zip,
        phoneNumber: this.props.editorState.phoneNumber,
        purpose: this.props.editorState.purpose,
        notes: this.props.editorState.notes,
        processing: this.props.editorState.processing
      });
    } else {
      this.resetState();
    }
  }

  printFn() {
    return <Printer />;
  }

  render() {
    return (
      <div className="entry_interface">
        <div className="content">
          <div className="button_container">
            {this.state.processing.length > 0 ? (
              <Link to="/tasks">
                <button
                  className="button"
                  onClick={() => {
                    fns.updateCard(this.state.id, { processing: "" });
                    this.props.setEditorState("search", {});
                  }}
                >
                  <div className="icon-checkmark">
                    <div className="icon icon-check" />
                  </div>
                  <div>Mark Completed</div>
                </button>
              </Link>
            ) : (
              <button
                className="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "This card will only be accessible by admins until processing has finished. Continue?"
                    )
                  ) {
                    fns.updateCard(this.state.id, {
                      processing: this.props.history.username
                    });
                    this.props.setEditorState("search", {});
                  }
                }}
              >
                <div className="icon">
                  <div className="icon icon-paper-plane" />
                </div>
                <div>Send to Processing</div>
              </button>
            )}
            <button
              className="button"
              onClick={() => {
                if (this.state.id.length > 0) {
                  fns.updateCard(this.state.id, fns.encryptCard(this.state));
                  alert("Card Updated.");
                } else {
                  fns.createCard(fns.encryptCard(this.state));
                  alert("New Card Added");
                  this.props.setEditorState("search", {});
                }
              }}
            >
              <div className="icon">
                <div className="icon icon-credit-card" />
              </div>
              <div>Save / Update</div>
            </button>
            <ReactToPrint
              trigger={() => (
                <button className="button">
                  <div className="icon">
                    <div className="icon icon-print" />
                  </div>
                  <div>Print</div>
                </button>
              )}
              content={() => <h1>Print</h1>}
            />
            <Printer ref={() => <h1>test</h1>} />
            <button className="button" onClick={() => this.resetState()}>
              <div className="icon">
                <div className="icon icon-arrows-ccw" />
              </div>
              <div>Clear Fields</div>
            </button>
          </div>
          <div className="box-wrapper">
            <div className="box">
              <header className="toolbar toolbar-header">
                <h1 className="title">
                  Card Information{" "}
                  {this.state.processing.length > 0
                    ? "(Tasks)"
                    : this.state.id.length > 0 ? "(Edit)" : "(Create)"}
                </h1>
              </header>
              <div className="padded">
                <div className="client_name_row">
                  <div style={{ marginRight: "25px", width: "50%" }}>
                    <TextInput
                      label="Client First Name"
                      placeholder=""
                      value={this.state.firstName}
                      onChange={value => {
                        this.setState({ firstName: value });
                      }}
                    />
                  </div>
                  <div style={{ width: "50%" }}>
                    <TextInput
                      label="Client Last Name"
                      placeholder=""
                      value={this.state.lastName}
                      onChange={value => {
                        this.setState({ lastName: value });
                      }}
                    />
                  </div>
                </div>
                <TextInput
                  label="Card Number"
                  placeholder=""
                  value={this.state.cardNumber}
                  onChange={value => {
                    this.setState({ cardNumber: value });
                  }}
                />
                <TextInput
                  label="Expiration Date"
                  placeholder=""
                  value={this.state.expDate}
                  onChange={value => {
                    this.setState({ expDate: value });
                  }}
                />
                <TextInput
                  label="Cardholder"
                  placeholder=""
                  value={this.state.cardHolder}
                  onChange={value => {
                    this.setState({ cardHolder: value });
                  }}
                />
                <TextInput
                  label="Security Code"
                  placeholder=""
                  value={this.state.securityCode}
                  onChange={value => {
                    this.setState({ securityCode: value });
                  }}
                />
                <TextInput
                  label="Amount"
                  placeholder=""
                  value={this.state.amount}
                  onChange={value => {
                    this.setState({ amount: value });
                  }}
                />
                <TextInput
                  label="Billing Address"
                  placeholder=""
                  value={this.state.billingAddress}
                  onChange={value => {
                    this.setState({ billingAddress: value });
                  }}
                />
                <TextInput
                  placeholder=""
                  value={this.state.billingAddress2}
                  onChange={value => {
                    this.setState({ billingAddress2: value });
                  }}
                />
                <TextInput
                  label="City"
                  placeholder=""
                  value={this.state.city}
                  onChange={value => {
                    this.setState({ city: value });
                  }}
                />
                <TextInput
                  label="State"
                  placeholder=""
                  value={this.state.state}
                  onChange={value => {
                    this.setState({ state: value });
                  }}
                />
                <TextInput
                  label="Zip Code"
                  placeholder=""
                  value={this.state.zip}
                  onChange={value => {
                    this.setState({ zip: value });
                  }}
                />
                <TextInput
                  label="Phone Number"
                  placeholder=""
                  value={this.state.phoneNumber}
                  onChange={value => {
                    this.setState({ phoneNumber: value });
                  }}
                />
                <TextInput
                  label="Purpose"
                  placeholder=""
                  value={this.state.purpose}
                  onChange={value => {
                    this.setState({ purpose: value });
                  }}
                />
                <textarea
                  className="form-control"
                  rows="5"
                  label="Notes (Optional)"
                  placeholder=""
                  value={this.state.notes}
                  onChange={e => {
                    this.setState({ notes: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Printer extends Component {
  render() {
    return <div />;
  }
}

const EntryInterface_mapStateToProps = state => {
  return {
    ...state.EntryInterface,
    sendCard: state.Tasks,
    username: state.Home.username
  };
};

const EntryInterface_mapDispatchToProps = dispatch => {
  return {};
};

EntryInterface = connect(
  EntryInterface_mapStateToProps,
  EntryInterface_mapDispatchToProps
)(EntryInterface);

export default EntryInterface;
