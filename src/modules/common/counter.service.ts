import Counter from "./counter.model";

export async function generateSequentialId(
  prefix: string,
  counterName: string
) {
  const counter = await Counter.findOneAndUpdate(
    { name: counterName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `${prefix}${counter.seq}`;
}
