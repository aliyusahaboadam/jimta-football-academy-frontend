import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";


const PrivateRoute = ({ children }) => {

     const token = localStorage.getItem("token"); 
 
    const hasValidToken =  token && token.trim() !== "";


    // const loginState = useSelector((state) => state.login);
    //   const { isAuthenticated } = loginState;



  
    // // const retrieveValue = localStorage.getItem("authenticated"); 
    // // const authenticated = JSON.parse(retrieveValue);
    //  // return authenticated ?  children : <Navigate to={"/school/login"}/>
    //  console.log("Token" + token);
    //  console.log("Has Validity?" + hasValidToken);
    // if (!isAuthenticated) {
    //     return  <Navigate to={"/school/login"} state={{from: location}} replace/>
    // }
    return children;
}
export default PrivateRoute;