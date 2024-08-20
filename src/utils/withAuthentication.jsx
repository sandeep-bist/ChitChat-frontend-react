import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const withAuthentication = (WrappedComponent) => {
    return function AuthComponent(props) {
            const [isAuthenticated, setAuth] = useState(true);

        useEffect(() => {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            if (token) {
                // console.log("Token exists:");
                setAuth(true);
            } else {
                console.log("Token not found");
                setAuth(false);
            }
        }, []);

 
        if (isAuthenticated) {
            // console.log("Authenticated");
            return <WrappedComponent {...props} />;
        } else {
            console.log("Unauthenticated");
            return <Navigate to="/login" />;
        }
    };
};

export default withAuthentication;

// import { useState, useEffect } from 'react';
// import { Navigate } from 'react-router-dom';

// const withAuthentication = (WrappedComponent) => {
//     return function AuthComponent(props) {
//         const [isToken, setTokenFound] = useState(false);

//         useEffect(() => {
//             const token = document.cookie.split('; ').find(row => row.startsWith('token='));
//             if (token) {
//                 console.log("Token exists:", token);
//                 setTokenFound(true);
//             } else {
//                 console.log("Token not found");
//                 setTokenFound(false);
//             }


//             console.log(isToken,"isToken------")
//         }, []);

//         if (isToken) {
//             console.log("Authenticated");
//             return <WrappedComponent {...props} />;
//         } else {
//             console.log("Unauthenticated");
//             return <Navigate to="/login" />;
//         }
//     };
// };

// export default withAuthentication;

// import { useEffect, useState } from "react"
// import { Navigate } from "react-router-dom"

// const withAuthentication=(wrappedComponent)=>{
//     return function AuthComponent(props){
//         const [is_Authenticated,setAuth]=useState(false)
        
//         useEffect((props)=>{
//                 const token = document.cookie.split('; ').find(row => row.startsWith('token='))
//                 if(token){
//                     console.log("toke if exists",token);
//                     setAuth(true)
//                 }
//                 else{
//                     console.log("token not found");
//                     setAuth(false)
//                 }
//         },[])

        
//         if (is_Authenticated){
//             console.log("here----------authenticaiton ");
//             return <wrappedComponent {...props}/>
//         }
//         else{
//             console.log("unauthenticated");
//             return <Navigate to="/login" />
//         }
//     }
// }

// export default withAuthentication