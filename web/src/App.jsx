import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import routers from "./routers/index.js";
import MainContent from "./components/main-content/App.jsx";
import Login from "./components/login/App.jsx";
import { Switch, BrowserRouter as Router } from "react-router-dom";
import qs from "qs";
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
    };
  }
  componentDidMount(){
	  const {cookie} = document
	  if(cookie){
		  this.setState({active:true})
	  }

  }
  render() {
    const { active } = this.state;
    return (
      <>
        {active ? (
          <Router>
		  <MainContent />
		</Router>          
        ) : (
		  <Router>
		  <Login
			getData={(mess) => {
			  const id = qs.parse(mess).id;
			  if (id) {
				this.setState({ active: true });
			  }
			}}
		  ></Login>
		</Router>
        )}
      </>
    );
  }
}
