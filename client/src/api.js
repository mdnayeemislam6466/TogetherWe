const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
export async function request(path,{method='GET',body,token}={}){
 const res=await fetch(`${API}${path}`,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});
 const data=await res.json().catch(()=>({message:'Unexpected server response'}));if(!res.ok)throw new Error(data.message||'Request failed');return data;
}
