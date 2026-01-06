import { buildDynamicSearch } from "../../utils/dynamic-search-utils";
import Counter from "./counter.model";
import { Notification } from "./notification.model";
import { Variable } from "./variable.model";

export class CommonRepository {
  generateSequentialId = async (prefix: string, counterName: string) => {
    const counter = await Counter.findOneAndUpdate(
      { name: counterName },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    return `${prefix}${counter.seq}`;
  };

  upsertVariable = async (variables: any) => {
    console.log(variables);
    return Variable.findOneAndUpdate(
      { singletonKey: "VARIABLE_CONFIG" },
      variables,
      {
        upsert: true, // create if missing
        new: true, // return updated doc
      }
    );
  };

  getVariable = async () => {
    return Variable.findOne();
  };

  getNotification=async(query:{})=>{
    const {filter,search,options}=buildDynamicSearch(Notification,query);
    const notifications=await Notification.find({...filter,...search},null,options)
    return notifications
  }
}
