const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  name: { type: String, required: true },
  teacher: { type: String, required: true },
  // Arrayofstring?
  boardsCompletedByDate: { type: Array, required: true }
});

mongoose.model("students", StudentSchema);
