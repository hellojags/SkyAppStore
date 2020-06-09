import React from "react";
import {
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  UncontrolledDropdown
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RENDER_CATEGORY_LOGO } from "../sn.constants";
import InfoRoundedIcon from "@material-ui/icons/InfoRounded";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Search from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

function renderPageHeading(category) {
  switch (category) {
    case "all":
      return "All Skynet Apps";
      break;
    case "video":
      return "Videos";
      break;
    case "audio":
      return "Audio";
      break;
    case "app":
      return "Web Apps";
      break;
    case "games":
      return "Games";
      break;
    case "books":
      return "Books";
      break;
    case "blog":
      return "Blogs";
      break;
    default:
      return "All Apps";
  }
}

class SnCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goToApp: false,
      skyappId: "",
      apps: [],
      error: null,
      appsLoaded: false,
      category: null,
      searchKey: "",
      filteredApps: []
    };
    this.openSkyApp = this.openSkyApp.bind(this);
    this.handleSrchSbmt = this.handleSrchSbmt.bind(this);
    this.handleSrchKeyChng = this.handleSrchKeyChng.bind(this);
    this.launchSkyLink = this.launchSkyLink.bind(this);
    this.getFilteredApps = this.getFilteredApps.bind(this);
  }

  launchSkyLink(skyLink) {
    window.open(skyLink, "_blank");
  }

  handleSrchSbmt(evt) {
    evt.preventDefault();
    console.log("search form submitted");
  }

  handleSrchKeyChng(evt) {
    evt.preventDefault();
    this.setState({
      searchKey: evt.target.value
    });
  }

  searchFilter(skyApp, searchKey) {
    if (searchKey && searchKey.trim() !== "") {
      for (const skyAppKey in skyApp) {
        if (
          skyApp[skyAppKey] &&
          skyApp[skyAppKey].toLowerCase().equals(searchKey.toLowerCase())
        ) {
          return skyApp;
        }
      }
    } else {
      return skyApp;
    }
  }

  openSkyApp(skyappId) {
    console.log(skyappId);
    this.setState({
      goToApp: true,
      skyappId
    });
  }

  getAppList() {
    fetch("https://skynethub-api.herokuapp.com/skapps")
      .then(res => res.json())
      .then(res => (res.hasOwnProperty("status") ? res.result : res))
      .then(
        result => {
          this.setState({
            apps: result,
            appsLoaded: true
          });
        },
        error => {
          this.setState({
            error
          });
        }
      );
  }

  componentDidMount() {
    const { category } = this.props.match.params;
    this.setState({ category });
    this.getAppList();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { category } = this.props.match.params;
    if (category !== this.state.category) {
      this.setState({ category });
      this.getAppList();
    }
  }

  getFilteredApps() {
    const category = this.state.category;
    const searchKey = this.state.searchKey;
    const filteredApps = this.state.apps
      .filter(app => {
        if (category && category.trim() != "" && category.trim() != "all") {
          if (app.category && app.category.toLowerCase() == category) {
            return app;
          }
        } else {
          return app;
        }
      })
      .filter(app => {
        if (searchKey && searchKey.trim() !== "") {
          for (const skyAppKey in app) {
            if (
              app[skyAppKey] != null &&
              app[skyAppKey].toLowerCase().indexOf(searchKey.toLowerCase()) > -1
            ) {
              return app;
            }
          }
        } else {
          return app;
        }
      });
    return filteredApps;
  }

  render() {
    const {
      apps,
      error,
      appsLoaded,
      category,
      goToApp,
      skyappId,
      searchKey,
      filteredApps
    } = this.state;
    let cardCount = 0;
    if (goToApp) {
      return <Redirect to={"/skyapps/" + skyappId} />;
    }
    if (appsLoaded) {
      let filteredApps = this.getFilteredApps();
      console.log(filteredApps)
      return (
        <div className="card-parent-conatiner">
          <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <button
              id="sidebarToggleTop"
              className="btn btn-link d-md-none rounded-circle mr-3"
            >
              <i className="fa fa-bars"></i>
            </button>

            <form
              className="d-none d-sm-inline-block form-inline mr-md-5 ml-md-5 my-2 my-md-0 mw-100 navbar-search"
              onSubmit={this.handleSrchSbmt}
            >
              <div className="input-group">
                <Grid
                  container
                  spacing={1}
                  alignItems="flex-end"
                  className="width-100"
                >
                  <Grid item className="search-icon-grid">
                    <Search />
                  </Grid>
                  <Grid item className="width-90">
                    <TextField
                      id="filled-secondary"
                      label="Search Skynet Apps"
                      name="searchKey"
                      variant="filled"
                      className="width-100"
                      onChange={this.handleSrchKeyChng}
                    />
                  </Grid>
                </Grid>
              </div>
            </form>

            <ul className="navbar-nav ml-auto">
              <li className="nav-item dropdown no-arrow d-sm-none">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="searchDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fas fa-search fa-fw"></i>
                </a>

                <div
                  className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                  aria-labelledby="searchDropdown"
                >
                  <form className="form-inline mr-auto w-100 navbar-search">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control bg-light border-0 small"
                        placeholder="Search the SKY..."
                        aria-label="Search"
                        aria-describedby="basic-addon2"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="button">
                          <i className="fas fa-search fa-sm"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </li>
            </ul>
          </nav>
          <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between">
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <div className="d-sm-flex align-items-center justify-content-between">
                    <h3>
                      {renderPageHeading(category)}
                    </h3>
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <div className="d-sm-flex align-items-center justify-content-between float-right">
                    <h4>
                     Total Count : {filteredApps.length}
                    </h4>
                  </div>
                </Grid>
              </Grid>
            </div>

            <div className="card-container row">
              {filteredApps
                .map((app, i) => {
                  cardCount = cardCount + 1;
                  return (
                    <div className="col-md-3 side-padding-0" key={i}>
                      {/* <div className="card card-video"> */}
                      <div
                        className={"card card-" + app.category.toLowerCase()}
                      >
                        <div className="card-count-container">
                          <h4 className="pl-30"> {app.title} </h4>
                          {/* <div className="card-count">
                    {RENDER_CATEGORY_LOGO(app.category)}
                  </div> */}
                        </div>

                        <div className="card-content ">{app.description}</div>

                        <div className="card-footer">
                          {RENDER_CATEGORY_LOGO(app.category)} 
                          <EditOutlinedIcon
                            className="float-right cursor-pointer"
                            onClick={() => this.openSkyApp(app.id)}
                          />
                          {app.skylink && app.skylink.trim() != "" && (
                            <OpenInNewIcon
                              className="float-right cursor-pointer margin-right-20"
                              onClick={() => {
                                this.launchSkyLink(
                                  "https://siasky.net/" + app.skylink
                                );
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      );
    } else {
      return <div className="loader"></div>;
    }
  }
}

export default SnCards;
