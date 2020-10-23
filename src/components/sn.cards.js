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
    case "utilities":
      return "Utilities";
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
    case "pictures":
      return "Pictures";
      break;  
    case "skynetportal":
      return "Skynet Portal";
      break; 
    case "other":
      return "Other Apps"
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
    this.trimDescription = this.trimDescription.bind(this);
  }

  trimDescription(strValue, maxLength){
    if (strValue && strValue.length>maxLength){
      return strValue.slice(0,maxLength-3) + '...';
    } else {
      return strValue;
    }
  }

  launchSkyLink(skyLink) {
    let link = "";
    if (skyLink.indexOf("http://")=== 0 || skyLink.indexOf("https://")=== 0){
      link = skyLink;
    } else if (skyLink.indexOf("sia://") === 0){
      link = skyLink.replace("sia://", "https://skynethub.io/")
    } else if (skyLink.lenghth === 46){
      link = "https://skynethub.io/"+skyLink;
    }
    if (link!== "") {
      window.open(link, "_blank")
    } 
  }

  handleSrchSbmt(evt) {
    evt.preventDefault();
    //console.log("search form submitted");
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
    fetch("https://skynethub-api.herokuapp.com/skapps?limit=500")
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
          <nav className="navbar navbar-expand navbar-light bg-white topbar mb-1 static-top shadow">

            <form
              className="d-sm-inline-block form-inline mr-md-5 ml-md-5 my-2 my-md-0 mw-100 navbar-search"
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
                      className="width-100"
                      onChange={this.handleSrchKeyChng}
                    />
                  </Grid>
                </Grid>
              </div>
            </form>
          </nav>
          <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between">
              <Grid container spacing={1}>
                <Grid item xs={6} sm={8}>
                  <div className="d-sm-flex align-items-center justify-content-between">
                    <h5>
                      {renderPageHeading(category)}
                    </h5>
                  </div>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <div className="d-sm-flex align-items-center justify-content-between float-right">
                    <h6>
                     Total Count : {filteredApps.length}
                    </h6>
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
                          <h5 className="pl-10"> {app.title} </h5>
                          {/* <div className="card-count">
                    {RENDER_CATEGORY_LOGO(app.category)}
                  </div> */}
                        </div>

                        <div className="card-content ">
                          {this.trimDescription(app.description, 200)}
                        </div>

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
                                this.launchSkyLink(app.skylink);
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
