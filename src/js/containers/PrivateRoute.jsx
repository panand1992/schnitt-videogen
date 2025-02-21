import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { getIsAuthenticated } from '../selectors/app';

const PrivateRoute = ({ isAuthenticated, children }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return children;
}

const mapStateToProps = createStructuredSelector({
    isAuthenticated: getIsAuthenticated()
});

const mapDispatchToProps = () => ({});

PrivateRoute.propTypes = {
    isAuthenticated: PropTypes.bool,
    children: PropTypes.node
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
