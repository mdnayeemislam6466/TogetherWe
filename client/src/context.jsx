import {createContext,useContext,useEffect,useState} from 'react';
const AuthContext=createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('tw_user'))}catch{return null}});const [token,setToken]=useState(()=>localStorage.getItem('tw_token'));
 const login=data=>{setUser(data.user);setToken(data.token);localStorage.setItem('tw_user',JSON.stringify(data.user));localStorage.setItem('tw_token',data.token)};
 const logout=()=>{setUser(null);setToken(null);localStorage.removeItem('tw_user');localStorage.removeItem('tw_token')};
 return <AuthContext.Provider value={{user,token,login,logout}}>{children}</AuthContext.Provider>}
export const useAuth=()=>useContext(AuthContext);
