import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";
import {
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Button
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import DoneIcon from "@material-ui/icons/Done";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { Redirect } from "react-router-dom";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import DeleteIcon from "@material-ui/icons/Delete";
import { WEBSERVICE_SUCCESS, CATEGORIES } from "../sn.constants";
import { WEBSERVICE_FAILURE } from "../sn.constants";

const useStyles = theme => ({
  formControl: {
    margin: theme.spacing(1)
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const emptySkyApp = {
  title: "",
  description: "",
  skylink: "",
  filename: "",
  fileformat: "",
  type: "",
  category: "",
  git_url: "",
  searchable: false,
  auth_code: "",
  id: ""
};

const getPageHeader = (isRegister, isEdit) => {
  if (isRegister) {
    return <h1 className="h3 mb-0 text-gray-800">Register Skapp</h1>;
  } else if (isEdit) {
    return <h1 className="h3 mb-0 text-gray-800">Edit Skapp</h1>;
  } else return <h1 className="h3 mb-0 text-gray-800">View Skapp</h1>;
};

let appId = "";

class SnRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      openSecretIdDlg: false,
      redirectToAllApps: false,
      edit: false,
      isRegister: false,
      openEnableEditDlg: false,
      skyAppSecret: "",
      openEdtFailDlg: false,
      skyapp: JSON.parse(JSON.stringify(emptySkyApp)),
      errorObj: this.createEmptyErrObj()
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSecretIdDlgClose = this.handleSecretIdDlgClose.bind(this);
    this.handleDoneBtn = this.handleDoneBtn.bind(this);
    this.handleEditBtn = this.handleEditBtn.bind(this);
    this.handleSkyAppSecretChange = this.handleSkyAppSecretChange.bind(this);
    this.handleEnableEditDlgOkBtn = this.handleEnableEditDlgOkBtn.bind(this);
    this.handleEnableEditDlgClose = this.handleEnableEditDlgClose.bind(this);
    this.handleEdtFailDlgClose = this.handleEdtFailDlgClose.bind(this);
  }

  createEmptyErrObj(){
    const errObj = {};
    for(const key in emptySkyApp){
      if (emptySkyApp.hasOwnProperty(key)){
        errObj[key]= false;
      }
    }
    return errObj;
  }

  handleEdtFailDlgClose() {
    this.setState({ openEdtFailDlg: false });
  }

  handleEnableEditDlgClose() {
    this.setState({ openEnableEditDlg: false });
  }

  handleEnableEditDlgOkBtn(evt) {
    if (this.state.skyAppSecret && this.state.skyAppSecret.trim() !== "") {
      this.setState({
        openEnableEditDlg: false,
        showLoader: true
      });
      const validateSecretUrl =
        "http://www.mocky.io/v2/5e5f23ae3100004b00afd966"; //TODO
      fetch(validateSecretUrl, {
        method: "POST",
        body: JSON.stringify({
          skyAppSecret: this.state.skyAppSecret,
          skyAppId: this.state.skyapp.id
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(response => {
          this.setState({
            showLoader: false
          });
          response = true; //TODO
          if (response) {
            this.setState({ edit: true });
          }
          console.log("this.setState ", this.state.skyapp);
        });
    }
  }

  handleSkyAppSecretChange(evt) {
    this.setState({ skyAppSecret: evt.target.value });
  }

  handleEditBtn() {
    this.setState({
      openEnableEditDlg: true
    });
  }

  handleDoneBtn() {
    this.setState({
      redirectToAllApps: true
    });
  }

  componentDidMount() {
    const path = this.props.match.path;
    if (path === "/register") {
      this.setState({
        isRegister: true,
        skyapp: JSON.parse(JSON.stringify(emptySkyApp))
      });
      console.log("this.setState ", this.state.skyapp);
    } else {
      const { id } = this.props.match.params;
      appId = id;
      console.log("Component mounted : ", id, path, this.props.match);
      this.setState({
        isRegister: false
      });
      console.log("this.setState ", this.state.skyapp);
      this.getSkyAppDetails(id);
    }
  }

  getSkyAppDetails(skyAppId) {
    this.setState({
      showLoader: true
    });
    console.log("this.setState ", this.state.skyapp);
    fetch("https://skynethub-api.herokuapp.com/skapps/" + skyAppId)
      .then(res => res.json())
      .then(res=> res.hasOwnProperty('status') ? res.result : res)
      .then(res => {
        console.log("obtsined skyap", res);
        this.setState({
          showLoader: false,
          skyapp: {
            title: res.title,
            description: res.description,
            skylink: res.skylink,
            filename: res.filename,
            fileformat: res.fileformat,
            type: res.type,
            category: res.category ? res.category.toLowerCase() : "",
            git_url: res.git_url,
            searchable: res.searchable == "true",
            id: res.id,
            skyAppSecret: res.skyAppSecret
          }
        });
        console.log("this.setState ", this.state.skyapp);
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const path = this.props.match.path;
    if (path === "/register") {
      if (!this.state.isRegister) {
        this.setState({
          isRegister: true,
          skyapp: JSON.parse(JSON.stringify(emptySkyApp))
        });
        console.log("this.setState ", this.state.skyapp);
      }
      return;
    }
    const { id } = this.props.match.params;
    appId = id;
    console.log("Component updated : ", id, this.props);
    console.log("previous state: ", prevState);
    if (this.state.isRegister) {
      this.setState({
        isRegister: false
      });
      console.log("this.setState ", this.state.skyapp);
    }
  }

  handleSecretIdDlgClose() {
    this.setState({
      openSecretIdDlg: false,
      redirectToAllApps: true
    });
    console.log("this.setState ", this.state.skyapp);
  }

  handleSubmit(evt, param) {
    evt.preventDefault();
    let isError = false;
    for(const key in this.state.skyapp){
      if (this.state.skyapp.hasOwnProperty(key)){
        isError = isError | this.validateField(key)
      }
    }
    if (isError){
      return;
    }
    let url = "https://skynethub-api.herokuapp.com/skapps/";
    let apiMethod = "POST";
    console.log(param);
    if (!this.state.isRegister) {
      url += appId;
      if (param == "delete") {
        url += "/"+this.state.skyapp.auth_code;
        //console.log("url---->>>",url)
        apiMethod = "DELETE";
      } else {
        apiMethod = "PUT";
      }
    }
    this.setState({ showLoader: true });
    console.log("this.setState ", this.state.skyapp, this.state.isRegister);
    fetch(url, {
      method: apiMethod,
      body: JSON.stringify(this.state.skyapp),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        //console.log("-------------"+res.status);
        //console.log("-------------"+apiMethod);
        if(apiMethod == "DELETE" && res.status == 204)
        {
          return {
            status : WEBSERVICE_SUCCESS
          }
        }
        else if (res.status!=200 && res.status!=201)
        {
          return {
            status : WEBSERVICE_FAILURE
          }
        }
        return res.json();
      })
      .catch(err => {
        this.setState({ showLoader: false });
        console.log("this.setState ", this.state.skyapp);
      })
      .then(response => {
        console.log(response);
        const status = response.status;
        if (status.toLowerCase()==WEBSERVICE_SUCCESS){
          if (this.state.isRegister) {
            this.setState({ skyapp: response.result });
          }
          this.setState({
            showLoader: false,
            openSecretIdDlg: true
          });
          console.log("this.setState ", this.state.skyapp);
        } else {
          this.setState({
            openEdtFailDlg: true,
            showLoader: false
          })
        }
      });
  }

  validateField(fieldName){
    const { errorObj } = this.state;
    const fieldVal = this.state.skyapp[fieldName];
    let isError = false;
    switch(fieldName){
      case "title": 
      case "description":
      case "category":
      case "skylink":
        errorObj[fieldName] = (fieldVal==null || fieldVal.trim()=="");
        isError= errorObj[fieldName];
        this.setState({errorObj});
        break;
      default:
    }
    return isError;
  }

  handleChange(evt) {
    console.log(evt.target.type);
    const eleType = evt.target.type;
    const { skyapp } = this.state;
    const fieldName = evt.target.name;
    if (eleType === "checkbox") {
      skyapp[fieldName] = evt.target.checked;
    } else {
      skyapp[fieldName] = evt.target.value;
    }
    this.setState({ skyapp });
    this.validateField(fieldName);
  }

  render() {
    const { classes } = this.props;
    const {
      showLoader,
      skyapp,
      openSecretIdDlg,
      redirectToAllApps,
      isRegister,
      edit,
      openEnableEditDlg,
      openEdtFailDlg,
      errorObj
    } = this.state;

    if (redirectToAllApps) {
      return <Redirect to="/apps/all" />;
    }

    if (!showLoader) {
      return (
        <div className="container-fluid register-container">
          <ValidatorForm
            ref="form"
            onSubmit={this.handleSubmit}
            onError={errors => console.log(errors)}
          >
          
            <Grid container spacing={1}>
            <Grid item xs={3}>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
            {getPageHeader(isRegister, edit)}
          </div>
              </Grid>
              <Grid item xs={7} className="button-grid">
                {!isRegister && (
                  <Button
                    variant="contained"
                    className="btn-20px"
                    type="button"
                    onClick={evt => this.handleSubmit(evt, "delete")}
                    id="btnDelete"
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                )}
                {(isRegister || edit || true) && (
                  <Button
                    variant="contained"
                    color="primary"
                    className="btn-20px"
                    type="submit"
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </Button>
                )}
                {!isRegister && !edit && false && (
                  <Button
                    variant="contained"
                    color="primary"
                    className="btn-20px"
                    onClick={this.handleEditBtn}
                    type="button"
                    startIcon={<CheckCircleRoundedIcon />}
                  >
                    Edit
                  </Button>
                )}
                {!isRegister && (
                  <Button
                    variant="contained"
                    color="primary"
                    className="btn-20px"
                    onClick={this.handleDoneBtn}
                    type="button"
                    startIcon={<CheckCircleRoundedIcon />}
                  >
                    Done
                  </Button>
                )}
              </Grid>
              <Grid item xs={10}>
                <TextField
                  id="title"
                  name="title"
                  label="Skynet App Name*"
                  fullWidth
                  error={errorObj.title}
                  value={skyapp.title}
                  autoComplete="off"
                  onChange={this.handleChange}
                  helperText={errorObj.title ? 'Skynet App Name is a mandatory field.' : 'Max 20 characters. This is a mandatory field.'}
                  onInput={e => {
                    e.target.value = e.target.value.slice(0, 20);
                  }}
                />
              </Grid>
              <Grid item xs={10}>
                <TextField
                  id="description"
                  name="description"
                  label="Skynet App Description*"
                  error={errorObj.description}
                  fullWidth
                  value={skyapp.description}
                  autoComplete="off"
                  helperText={errorObj.description ? 'Skynet App Description is a mandatory field.' : 'Max 200 charecters'}
                  onInput={e => {
                    e.target.value = e.target.value.slice(0, 200);
                  }}
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item xs={10}>
                <TextField
                  id="skylink"
                  name="skylink"
                  label="Skynet App - Skylink URL*"
                  error={errorObj.skylink}
                  fullWidth
                  value={skyapp.skylink}
                  autoComplete="off"
                  helperText={errorObj.skylink ? 'Skylink URL is a mandatory field.' : 'Example: https://siasky.net/EADCbQJDO8cFkf-fawBrKI56uOdrdIVwMQIpgsIiLSdE5A'}
                  onInput={e => {
                    e.target.value = e.target.value.slice(0, 200);
                  }}
                  onChange={this.handleChange}
                />
              </Grid>
              {/*
              <Grid item xs={10}>
                <TextField
                  id="portal"
                  name="portal"
                  label="WebApp URL"
                  fullWidth
                  value={skyapp.skylink}
                  autoComplete="off"
                  helperText={errorObj.description ? '' : 'Example: https://skynethub.io/{skylink}, https://mywebsite.com.  This is a mandatory field.'}
                  onInput={e => {
                    e.target.value = e.target.value.slice(0, 46);
                  }}
                  onChange={this.handleChange}
                />
              </Grid>
               <Grid item xs={6}>
                <TextField
                  id="filename"
                  name="filename"
                  label="File Name"
                  fullWidth
                  value={skyapp.filename}
                  autoComplete="off"
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="fileformat"
                  name="fileformat"
                  label="File Format"
                  fullWidth
                  value={skyapp.fileformat}
                  autoComplete="off"
                  onChange={this.handleChange}
                />
              </Grid> 
              <Grid item xs={6} className="select-grid">
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    fullWidth
                    value={skyapp.type}
                    name="type"
                    onChange={this.handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="d">Directory</MenuItem>
                    <MenuItem value="f">File</MenuItem>
                  </Select>
                </FormControl>
              </Grid>*/}
              <Grid item xs={5} className="select-grid">
                <FormControl className={classes.formControl}
                  error={errorObj.category}
                  >
                  <InputLabel id="demo-simple-select-label">
                    Category*
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="category"
                    fullWidth
                    value={skyapp.category}
                    name="category"
                    onChange={this.handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {CATEGORIES.filter(category => category!='all' ? category: '')
                    .map((txt, index) => (
                      <MenuItem key={index} value={txt}>{txt.toUpperCase()}</MenuItem>
                    ))}
                  </Select>
                  
                    <FormHelperText>Please select a category. This is a mandatory field.</FormHelperText>
                  
                </FormControl>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  id="git_url"
                  name="git_url"
                  label="Github/GitLab URL"
                  fullWidth
                  value={skyapp.git_url}
                  autoComplete="off"
                  onChange={this.handleChange}
                />
              </Grid>
              {/* <Grid item xs={5} className="paddingt-40">
                <FormControlLabel
                  control={
                    <Checkbox
                      color="secondary"
                      name="searchable"
                      checked={skyapp.searchable}
                      onChange={this.handleChange}
                    />
                  }
                  label="Searchable"
                />
              </Grid> */}
              {!isRegister && (
                <Grid item xs={10} className="button-grid">
                  <TextField
                    id="auth_code"
                    name="auth_code"
                    error
                    label="Enter Secret Key To Edit/Delete Sky App"
                    fullWidth
                    autoComplete="off"
                    onChange={this.handleChange}
                  />
                </Grid>
              )}
            </Grid>
          </ValidatorForm>

          <Dialog
            open={openSecretIdDlg}
            onClose={this.handleSecretIdDlgClose}
            TransitionComponent={Transition}
            keepMounted
            maxWidth="lg"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {isRegister && "Your App Secret ID"}
              {!isRegister && "Change SkyApp"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {isRegister &&
                  "Your App secret ID is '" +
                    skyapp.auth_code +
                    "'. Please save this ID at a secure place. You will need this ID to be able to make any updates to your SkyApp. You will now be redirected to All Apps page."}
                {!isRegister && "Changes to SkyApp is successfull!"}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleSecretIdDlgClose}
                autoFocus
                variant="contained"
                color="primary"
                className="btn-20px"
                startIcon={<DoneIcon />}
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openEdtFailDlg}
            onClose={this.handleEdtFailDlgClose}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Failure!"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                No changes were made to the SkyApp as the Secret provided by you
                is incorrect. Please retry with correct Sky App Secret to
                edit/delete.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleEdtFailDlgClose}
                autoFocus
                variant="contained"
                color="primary"
                className="btn-20px"
                startIcon={<DoneIcon />}
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openEnableEditDlg}
            onClose={this.handleEnableEditDlgClose}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Please enter SkyApp Secret ID"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Please enter your SkyApp Secret ID to be able to make changes to
                the SkyApp
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="SkyApp Secret"
                type="text"
                onChange={this.handleSkyAppSecretChange}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleEnableEditDlgOkBtn}
                autoFocus
                variant="contained"
                color="primary"
                className="btn-20px"
                startIcon={<DoneIcon />}
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    } else {
      return <div className="loader"></div>;
    }
  }
}

export default withStyles(useStyles)(SnRegister);
