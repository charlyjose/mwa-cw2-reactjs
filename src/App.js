import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
import BoardAdmin from "./components/board-admin.component";
import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";
import AddQuestion from "./components/admin/add-question.component";
import QuestionListUser from "./components/user/question-list-user.component";
import QuestionListAdmin from "./components/admin/question-list-admin.component";
import BarChart from "./components/admin/charts/barchart.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-light bg-light">
          <Link to={"/"} className="navbar-brand">
            e-Survey Shangri-La Survey Tool
          </Link>

          <div className="navbar-nav mr-auto">
            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/add-question"} className="nav-link">
                  Add Questions
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/view-questions"} className="nav-link">
                  View Questions
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/view-question-responses"} className="nav-link">
                  View Question Responses
                </Link>
              </li>
            )}

            {currentUser && !showAdminBoard && !showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/survey"} className="nav-link">
                  Start Survey
                </Link>
              </li>
            )}

          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/home", "/profile"]} component={Profile} />
            <Route exact path={["/", "/login"]} component={Login} />
            <Route exact path="/register" component={Register} />
            <Route path="/admin" component={BoardAdmin} />
            <Route path="/survey" component={QuestionListUser} />
            <Route path="/add-question" component={AddQuestion} />
            <Route path="/view-questions" component={QuestionListAdmin} />
            <Route path="/view-question-responses" component={BarChart} />
          </Switch>
        </div>

        <AuthVerify logOut={this.logOut} />
      </div>
    );
  }
}

export default App;
