import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import {modelAPI} from "../api/apiURLs";
import axios from "../api/axiosInstance";

class CategoryBase extends React.Component{
    state = {
      items: []
    };

    componentDidMount(){
        const url = modelAPI(this.props.apiName);
        // fetch data in this function
        axios.get(url).then((response) => (this.setState({ items: response.data.data })));
    }

    componentWillReceiveProps(nextProps){
        if(this.props.location.pathname !== nextProps.location.pathname){
            const url = modelAPI(nextProps.apiName);
            axios.get(url).then((response) => (this.setState({ items: response.data.data })));
        }
    }

    render() {
        return (
            <div className={"subcategory-div"}>
                <h1>Welcome to our {this.props.sectionName} section</h1>
                <h4>Shop from the huge selection of products offered by the stores below.</h4>
                <ListGroup className={"subcategory-ul"}>
                    {this.state.items.map((item) => (
                        <ListGroupItem key={item.id} className={"subcategory-li"}>
                            <Link to={this.props.location.pathname + "/" + item.id}>{item.name}</Link>
                        </ListGroupItem>
                    ))
                    }
                </ListGroup>
            </div>
        )
    }
}

export default CategoryBase;
