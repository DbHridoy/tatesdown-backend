import { model, Schema, Types } from "mongoose";

const AdminSchema=new Schema({
    userId:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    }
})


const Admin=model("Admin",AdminSchema)


export default Admin
