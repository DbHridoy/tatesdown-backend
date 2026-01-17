import { Variable } from "./variable.model";

export const getOrCreateVariableConfig = async () => {
    return Variable.findOneAndUpdate(
        { singletonKey: "VARIABLE_CONFIG" },
        { $setOnInsert: { singletonKey: "VARIABLE_CONFIG" } },
        { upsert: true, new: true }
    );
};
