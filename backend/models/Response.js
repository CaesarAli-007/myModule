import mongoose from 'mongoose'

const responseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    domain: { type: String, required: true },
    experience: { type: Number },
    candidateQuestions: { type: String },
    answers: [{ q: String, a: String }]
}, { timestamps: true })

export default mongoose.model('Response', responseSchema)
