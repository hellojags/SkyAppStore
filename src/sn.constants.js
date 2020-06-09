import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import AppsIcon from '@material-ui/icons/Apps';
import CasinoOutlinedIcon from '@material-ui/icons/CasinoOutlined';
import SportsEsportsOutlinedIcon from '@material-ui/icons/SportsEsportsOutlined';
import MenuBookTwoToneIcon from '@material-ui/icons/MenuBookTwoTone';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import LanguageOutlinedIcon from '@material-ui/icons/LanguageOutlined';

export const CATEGORIES = ['all','video', 'audio', 'blog', 'games', 'books', 'pictures', 'skynetportal', 'other'];

export const RENDER_CATEGORY_LOGO = (category)=>{
    if (category==='all'){
      return <AllInclusiveIcon />
    }
    if(category==='video'){
      return <FontAwesomeIcon icon="video"></FontAwesomeIcon>
    } else if(category==='audio'){
      return <FontAwesomeIcon icon="headphones"></FontAwesomeIcon>
    } else if(category==='blog'){
      return <FontAwesomeIcon icon="blog"></FontAwesomeIcon>
    } else if(category.toLowerCase()==='games'){
      return <SportsEsportsOutlinedIcon />
    } else if (category.toLowerCase()==='other'){
      return <CasinoOutlinedIcon />
    } else if(category.toLowerCase()==='books'){
      return <MenuBookTwoToneIcon />
    } else if(category.toLowerCase()==='pictures'){
      return <CameraAltOutlinedIcon />
    } else if(category.toLowerCase()==='skynetportal'){
      return <LanguageOutlinedIcon />
    }
  }

export const WEBSERVICE_SUCCESS='success';
export const WEBSERVICE_FAILURE='failure';