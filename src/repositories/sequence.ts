import { mongoose } from "../db";

const { Schema, model } = mongoose;

interface CounterDoc {
	_id: string; // collection name
	seq: number;
}

const CounterSchema = new Schema<CounterDoc>({
	_id: { type: String, required: true },
	seq: { type: Number, required: true, default: 0 },
});

const Counter = model<CounterDoc>("Counter", CounterSchema);

export async function getNextSequence(name: string): Promise<number> {
	const res = await Counter.findByIdAndUpdate(
		name,
		{ $inc: { seq: 1 } },
		{ new: true, upsert: true, setDefaultsOnInsert: true }
	).lean();
	return res!.seq;
}

