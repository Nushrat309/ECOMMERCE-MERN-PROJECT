import React from 'react';
import {Helmet} from 'react-helmet';

const pageTitle = (props) => {
    return(
        <Helmet>
          <title>{props.title}</title>
        </Helmet>
    );
};

export default pageTitle;