import { Response ,Request} from "express"
import * as UserServices from "../services/user.services"


export const createUser = async (req:Request , res:Response) => {
    try {
        const user = await UserServices.createUser(req.body);
        res.status(201).json({
            message : "User created Successfully" , 
            user : user 
        })
    } catch (error) {
        res.status(500).json({ message: `Error creating user: ${error}` });
    }
}