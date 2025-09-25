import { Request, Response, NextFunction } from "express";
import User from "../auth/userModel";

export const apiAuth = async (req:Request, res:Response, next:NextFunction) => {
  
    const apikey = req.query.apikey;
  
    if(!apikey){
        return res.status(401).json({
            success: false,
            message: 'Unathorised: API key is missing.'
        })
    }

    try {
        const user = await User.findOne({apikey: apikey}).exec();

        if(!user) {
             return res.status(403).json({
            success: false,
            message: 'Forbidden: The API key provided is missing.'
        })
        
} 
        next()
        console.info('API key connected')
   } catch (error) {
        console.error(`Error authenticating API`, error)

         return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        })
    }
}






