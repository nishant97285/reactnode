import bcrypt from "bcryptjs";
const hash = await bcrypt.hash("112233", 12);
console.log(hash);