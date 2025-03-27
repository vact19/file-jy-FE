import {Route, Routes} from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home.tsx";
import ErrorPage from "./components/Error.tsx";
import "./index.css";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import ShareFile from "./pages/ShareFile.tsx";

const App = () => {
    return (
        <Layout>
            <Routes>
                <Route path={"/"} element={<Home/>}/>
                <Route path={"/share/:userId"} element={<ShareFile />} />
                <Route path={"/sign-in"} element={<SignIn/>}/>
                <Route path={"/sign-up"} element={<SignUp/>}/>
                <Route path={"*"} element={<ErrorPage/>}/>
            </Routes>
        </Layout>
    )
}

export default App
