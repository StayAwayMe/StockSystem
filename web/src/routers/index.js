import Home from "../components/home/App.jsx"
import News from "../components/news/App.jsx"
import Login from "../components/login/App.jsx"
import StockTransactionRecord from "../views/stocktransactionrecord/App.jsx"
import NotFound from "../components/notfound/App.jsx"
import Person from "../views/person/index.jsx"
import Dashboard from "../views/dashboard/index.jsx"
export default[
    {
        exact: true,
        path: '/home',
        component: Home,
        childRoutes: []
    },  
    {
        exact: true,
        path: '/dashboard',
        component: Dashboard,
        childRoutes: []
    },  
    {
        exact: true,
        path: '/news',
        component: News,
        childRoutes: []
    },
    {
        exact: true,
        path: '/stockTransactionRecord',
        component: StockTransactionRecord,
        childRoutes: []
    },
    {
        path: '/notfound',
        component: NotFound,
        childRoutes: []
    },
    {
        exact: true,
        path: '/person',
        component: Person,
        childRoutes: []
    },
    {
        exact: true,
        path: '/',
        component:Dashboard,
    }
]