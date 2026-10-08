import {BrowserRouter, Routes, Route} from "react-router";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage.tsx";
import NewTaskPage from "./pages/NewTaskPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import {LOGIN_URL, TASK_URL, NEW_TASK_URL} from "./constants/routes.ts";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import './App.css';

const queryClient = new QueryClient()

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={LOGIN_URL} element={<LoginPage/>}/>
                <Route element={<ProtectedRoute/>}>
                    <Route path={TASK_URL}
                           element={
                               <QueryClientProvider client={queryClient}>
                                   <DashboardPage/>
                               </QueryClientProvider>
                           }/>
                    <Route path={NEW_TASK_URL}
                           element={
                               <QueryClientProvider client={queryClient}>
                                   <NewTaskPage/>
                               </QueryClientProvider>
                           }/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;