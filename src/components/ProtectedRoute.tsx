import {Navigate, Outlet} from "react-router";
import {LOGIN_URL} from "../constants/routes.ts";
import {USER_KEY} from "../constants/localStorageKeys.ts";

export default function ProtectedRoute() {
    const isAuth: boolean = localStorage.getItem(USER_KEY) !== null
    if (!isAuth) {
        return <Navigate to={LOGIN_URL} replace/>;
    }
    return <Outlet/>
}