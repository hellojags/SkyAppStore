import React from "react";
import logo from "./logo.svg";
import skyapplogo from "./logo_small.png";
import "./App.css";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import Grid from "@material-ui/core/Grid";
import MailIcon from "@material-ui/icons/Mail";

import {
  Route,
  Link,
  HashRouter as Router,
  Switch,
  NavLink,
  Redirect
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEnvelope,
  faFan,
  faLaughWink,
  faCloudUploadAlt,
  faStar,
  faVideo,
  faBlog,
  faWifi,
  faHeadphones,
  faEllipsisV
} from "@fortawesome/free-solid-svg-icons";

import SNSearchbarComponent from "./components/sn.searchbar.component";
import SnCards from "./components/sn.cards";
import { RENDER_CATEGORY_LOGO, CATEGORIES } from "./sn.constants";
import SnRegister from "./components/sn.register";
import Drawer from "@material-ui/core/Drawer";
import AddBoxIcon from "@material-ui/icons/AddBox";

library.add(
  faEnvelope,
  faFan,
  faLaughWink,
  faCloudUploadAlt,
  faStar,
  faVideo,
  faBlog,
  faWifi,
  faHeadphones,
  faEllipsisV
);

const drawerWidth = 240;
const useStyles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: ""
    };
    this.handleSrchSbmt = this.handleSrchSbmt.bind(this);
    this.handleSrchKeyChng = this.handleSrchKeyChng.bind(this);
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

  render() {
    const { classes } = this.props;
    const { searchKey } = this.state;

    return (
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar} color="inherit">
            <Toolbar>
              {/* <Typography variant="h6" noWrap> */}
                {/* <NavLink to="/">
                  <img
                    src={skyapplogo}
                    alt="SkynetHub Logo"
                    className="cursor-pointer"
                  ></img>
                </NavLink> */}
                <Grid container spacing={1}>
                <Grid item xs={2}>
                  <NavLink to="/">
                    <img
                      src={skyapplogo}
                      alt="SkynetHub Logo"
                      className="cursor-pointer"
                    ></img>
                  </NavLink>
                </Grid>
                <Grid item xs={8}>
                  <div className="banner-text">
                    SKYNET APPSTORE
                  </div>
                </Grid>
              </Grid>

              {/* </Typography> */}
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <div className={classes.toolbar} />
            <List>
              {["Register"].map((text, index) => (
                <NavLink
                  key={index}
                  activeClassName="active"
                  className="nav-link"
                  to="/register"
                >
                  <ListItem button key={text}>
                    <ListItemIcon>
                      <AddBoxIcon />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                </NavLink>
              ))}
            </List>
            <Divider />
            <List>
              <ListItem button key="Categories" className="cursor-auto vertical-padding-0">
                <ListItemText primary="Categories" />
              </ListItem>
              {CATEGORIES.map((text, index) => (
                <NavLink
                  key={index}
                  activeClassName="active"
                  className="nav-link"
                  to={"/apps/" + text}
                >
                  <ListItem button key={text.toUpperCase()}>
                    <ListItemIcon>{RENDER_CATEGORY_LOGO(text)}</ListItemIcon>
                    <ListItemText primary={text.toUpperCase()} />
                  </ListItem>
                </NavLink>
              ))}
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar}>
              <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                  <Switch>
                    <Route exact path="/">
                      <Redirect to="/apps/all" />
                    </Route>
                    <Route path="/register" component={SnRegister} />
                    <Route path="/apps/:category" component={SnCards} />
                    <Route path="/skyapps/:id" component={SnRegister} />
                    <Route path="/contact" component={SNSearchbarComponent} />
                    <Route component={SNSearchbarComponent} />
                  </Switch>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Router>
    );
  }
}

export default withStyles(useStyles)(App);
