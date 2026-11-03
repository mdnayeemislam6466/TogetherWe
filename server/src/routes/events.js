import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
const router=Router(); const col=()=>getDB().collection('events');
router.get('/',async(req,res,next)=>{try{
 const {q='',category=''}=req.query; const filter={eventDate:{$gte:new Date().toISOString().slice(0,10)}};
 if(category&&category!=='All') filter.category=category;
 if(q) filter.$or=[{title:{$regex:q,$options:'i'}},{location:{$regex:q,$options:'i'}},{description:{$regex:q,$options:'i'}}];
 const events=await col().find(filter).sort({eventDate:1}).limit(100).toArray(); res.json({events:events.map(e=>({...e,_id:e._id.toString()}))});
}catch(e){next(e)}});
router.get('/:id',async(req,res,next)=>{try{if(!ObjectId.isValid(req.params.id))return res.status(400).json({message:'Invalid event id'});const e=await col().findOne({_id:new ObjectId(req.params.id)});if(!e)return res.status(404).json({message:'Event not found'});res.json({event:{...e,_id:e._id.toString()}});}catch(e){next(e)}});
router.post('/',requireAuth,async(req,res,next)=>{try{
 const {title,description,location,eventDate,category,image}=req.body;
 if(!title?.trim()||!description?.trim()||!location?.trim()||!eventDate||!category)return res.status(400).json({message:'Please complete all required fields'});
 if(eventDate<new Date().toISOString().slice(0,10))return res.status(400).json({message:'Event date must be today or later'});
 const event={title:title.trim(),description:description.trim(),location:location.trim(),eventDate,category,image:image||'',creatorEmail:req.user.email,creatorName:req.user.name,createdAt:new Date().toISOString(),participants:[]};
 const result=await col().insertOne(event);res.status(201).json({event:{...event,_id:result.insertedId.toString()}});
}catch(e){next(e)}});
router.patch('/:id',requireAuth,async(req,res,next)=>{try{if(!ObjectId.isValid(req.params.id))return res.status(400).json({message:'Invalid event id'});const id=new ObjectId(req.params.id);const result=await col().findOneAndUpdate({_id:id,creatorEmail:req.user.email},{$set:{title:req.body.title,description:req.body.description,location:req.body.location,eventDate:req.body.eventDate,category:req.body.category,image:req.body.image||''}},{returnDocument:'after'});if(!result)return res.status(404).json({message:'Event not found or you do not own it'});res.json({event:{...result,_id:id.toString()}});}catch(e){next(e)}});
router.delete('/:id',requireAuth,async(req,res,next)=>{try{if(!ObjectId.isValid(req.params.id))return res.status(400).json({message:'Invalid event id'});const id=new ObjectId(req.params.id);const result=await col().deleteOne({_id:id,creatorEmail:req.user.email});if(!result.deletedCount)return res.status(404).json({message:'Event not found or you do not own it'});await getDB().collection('joinedEvents').deleteMany({eventId:id.toString()});res.json({message:'Event deleted'});}catch(e){next(e)}});
export default router;
