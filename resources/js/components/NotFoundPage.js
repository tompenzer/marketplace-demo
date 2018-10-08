import React from 'react';
import { NOT_FOUND_IMAGE } from "../api/strings";

const NotFoundPage = () => (
    <div className="loading-div">
        <img src={NOT_FOUND_IMAGE} className="loading-circular-progress" />
    </div>
);

export default NotFoundPage;
