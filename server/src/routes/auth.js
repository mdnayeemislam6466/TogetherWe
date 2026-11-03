import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
const router=Router();
const publicUser=u=>({name:u.name,email:u.email,photoURL:u.photoURL||''});
router.post('/register',async(req,res,next)=>{try{
 const {name,email,password,photoURL=''}=req.body;
 if(!name?.trim()||!email?.trim()||!password) return res.status(400).json({message:'Name, email and password are required'});
 if(password.length<6) return res.status(400).json({message:'Password must be at least 6 characters'});
 const users=getDB().collection('users'); const normalized=email.trim().toLowerCase();
 if(await users.findOne({email:normalized})) return res.status(409).json({message:'An account with this email already exists'});
 const user={name:name.trim(),email:normalized,passwordHash:await bcrypt.hash(password,12),photoURL};
 await users.insertOne(user); const token=jwt.sign({email:user.email,name:user.name},process.env.JWT_SECRET,{expiresIn:'7d'});
 res.status(201).json({token,user:publicUser(user)});
}catch(e){next(e)}});
router.post('/login',async(req,res,next)=>{try{
 const email=req.body.email?.trim().toLowerCase(); const user=await getDB().collection('users').findOne({email});
 if(!user||!await bcrypt.compare(req.body.password||'',user.passwordHash)) return res.status(401).json({message:'Incorrect email or password'});
 const token=jwt.sign({email:user.email,name:user.name},process.env.JWT_SECRET,{expiresIn:'7d'});
 res.json({token,user:publicUser(user)});
}catch(e){next(e)}});
router.get('/me',requireAuth,async(req,res,next)=>{try{const u=await getDB().collection('users').findOne({email:req.user.email}); if(!u)return res.status(404).json({message:'User not found'}); res.json({user:publicUser(u)});}catch(e){next(e)}});
export default router;
