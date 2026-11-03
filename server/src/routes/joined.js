import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
const router=Router();
router.get('/',requireAuth,async(req,res,next)=>{try{const joins=await getDB().collection('joinedEvents').find({userEmail:req.user.email}).toArray();const ids=joins.map(j=>new ObjectId(j.eventId)).filter(Boolean);const events=await getDB().collection('events').find({_id:{$in:ids}}).toArray();res.json({events:events.map(e=>({...e,_id:e._id.toString()}))});}catch(e){next(e)}});
router.post('/:id',requireAuth,async(req,res,next)=>{try{if(!ObjectId.isValid(req.params.id))return res.status(400).json({message:'Invalid event id'});const eventId=req.params.id;const event=await getDB().collection('events').findOne({_id:new ObjectId(eventId)});if(!event)return res.status(404).json({message:'Event not found'});if(event.creatorEmail===req.user.email)return res.status(400).json({message:'You cannot join your own event'});await getDB().collection('joinedEvents').updateOne({eventId,userEmail:req.user.email},{$setOnInsert:{eventId,userEmail:req.user.email,joinedAt:new Date().toISOString()}},{upsert:true});res.json({message:'You joined this event'});}catch(e){if(e.code===11000)return res.json({message:'Already joined'});next(e)}});
router.delete('/:id',requireAuth,async(req,res,next)=>{try{await getDB().collection('joinedEvents').deleteOne({eventId:req.params.id,userEmail:req.user.email});res.json({message:'You left this event'});}catch(e){next(e)}});
export default router;
