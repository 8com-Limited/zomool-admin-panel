import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from "components/shared-components/Loading";
const LazyAddDriver = lazy(() => import('./transportation/add-driver'));


const Pages = ({ match }) => {
  console.log(match.url, "kkkk")

  return (

    <Suspense Suspense fallback={< Loading cover="content" />}>
      <Switch>
        <Redirect exact from={`${match.url}`} to={`${match.url}/profile`} />
        <Route
          path={`${match.url}/profile`}
          component={lazy(() => import(`./profile`))}
        />
        <Route
          path={`${match.url}/invoice`}
          component={lazy(() => import(`./invoice`))}
        />
        <Route
          path={`${match.url}/pricing`}
          component={lazy(() => import(`./pricing`))}
        />
        <Route
          path={`${match.url}/faq`}
          component={lazy(() => import(`./faq`))}
        />
        <Route
          path={`${match.url}/setting`}
          component={lazy(() => import(`./setting`))}
        />
        <Route
          path={`${match.url}/user-list`}
          component={lazy(() => import(`./user-list`))}
        />
        <Route
          path={`${match.url}/service-list`}
          component={lazy(() => import(`./service-list`))}
        />
        <Route
          path={`${match.url}/hospitals`}
          component={lazy(() => import(`./hospitals`))}
        />
        <Route
          path={`${match.url}/pharmacies`}
          component={lazy(() => import(`./pharmacies`))}
        />
        <Route
          path={`${match.url}/feed`}
          component={lazy(() => import(`./feed`))}
        />
        <Route
          path={`${match.url}/accessories`}
          component={lazy(() => import(`./accessories`))}
        />
        <Route
          path={`${match.url}/vehicle`}
          component={lazy(() => import(`./transportation/vehicle`))}
        />
        <Route
          path={`${match.url}/driver`}
          component={lazy(() => import(`./transportation/driver`))}
        />
        <Route
          path={`${match.url}/add-driver`}
          component={LazyAddDriver}
        />
        <Route
          path={`${match.url}/request-service-list`}
          component={lazy(() => import(`./request-service-list`))}
        />
      </Switch>
    </Suspense>
  );

}

export default Pages;
