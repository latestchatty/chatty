import React from 'react'
import AuthContext from './AuthContext'

const withAuth = Child => props =>
    <AuthContext.Consumer>
        {authProps => <Child {...props} {...authProps}/>}
    </AuthContext.Consumer>

export default withAuth
