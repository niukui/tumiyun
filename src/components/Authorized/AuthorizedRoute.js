import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Authorized from './Authorized';
import { getAuthority } from '../../utils/authority';

class AuthorizedRoute extends React.Component {
  render() {
    const { component: Component, render, redirectPath, ...rest } = this.props;
    const authority = getAuthority();
    return (
      <Authorized
        authority={authority && authority.userId}
        noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: redirectPath }} />} />}
      >
        <Route {...rest} render={props => (Component ? <Component {...props} /> : render(props))} />
      </Authorized>
    );
  }
}

export default AuthorizedRoute;
