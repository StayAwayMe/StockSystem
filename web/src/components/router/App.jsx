/*
 * @Author: yanyong.yan 
 * @Date: 2021-02-26 14:34:44 
 * @Last Modified by:   yanyong.yan 
 * @Last Modified time: 2021-02-26 14:34:44 
 */

import React, { Component, Fragment } from 'react'
import routers from '../../routers/index';
import { Switch, HashRouter as Router, Route, Redirect } from 'react-router-dom';
import Notfound from '../404/Notfound';

class App extends Component {
    render() {
        const routerList = () => {
            const list = [];
            routers.forEach((item, index) => {
                if (item.redirect) {
                    list.push(<Route key={index} exact path={item.path} render={() =>
                        <Redirect to={item.redirect} />} />
                    );
                } else {
                    list.push(
                        <Route
                            exact={item.exact}
                            key={index}
                            path={item.path}
                            component={item.component}
                        />
                    );
                }
            });
            return list;
        };
        let data = routerList()
        return (
            <Switch>
                {data}
                {/* 匹配不到路由时候走这里 */}
                <Route key="404" component={() => {
                    return <Notfound />
                }}></Route>
            </Switch>
        );
    }
}

export default App