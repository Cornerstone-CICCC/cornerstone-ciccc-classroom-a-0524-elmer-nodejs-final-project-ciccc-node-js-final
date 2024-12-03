import { Request, Response } from "express";
import Poll from "../models/Poll.models";
import { pluralize } from "mongoose";



export const createPoll = async (req: Request, res: Response)=>{
  try{
    const {question, options} = req.body
    const poll = new Poll ({
      question, options
    })
  await poll.save()
  res.status(200).json({message:"created"})
}catch(err){
  res.status(400).json({messgae: ""})
}}

export const getPolls = async (req: Request, res: Response)=>{
  try{
    const polls = await Poll.find()
    res.json(polls)
  }catch(err){
    res.status(400).json({message: ""})
  }
}

export const pollDetail = async (req: Request, res: Response)=>{
  try{
    const {id} = req.params
    const page = await Poll.findById(id)
    res.json(page)
  }catch{
    res.status(404).json({message: "not found"})
  }

}

export const votePoll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { index } = req.body; 

    const poll = await Poll.findById(id);

    if(poll){ poll.options[index].votes++;
    await poll.save();
    res.status(200).json(poll);
  }

  res.status(404).json({message: "not found"})

  } catch (error) {
    console.error("Vote poll error:", error);
    res.status(500).json({ 
      message: "Server error during voting", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};


