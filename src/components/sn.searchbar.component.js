import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SNSearchbarComponent extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            searchText: ''
        };
    }

    render() {
        return (
            <div>Navbar 
                <FontAwesomeIcon icon="fan" />
            </div>
        );
    }
}

export default SNSearchbarComponent;