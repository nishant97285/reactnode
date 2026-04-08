export const validateRegister = (req, res, next) => {
  const { username, email, password, referral_code } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!username || username.trim().length < 2)
    return res.status(400).json({ message: "Username name atleast 2 characters." });

  if (!email || !emailRegex.test(email))
    return res.status(400).json({ message: "Pls enter Valid email address..." });

  if (!password || password.length < 6)
    return res.status(400).json({ message: "Password minimum 6 characters..." });

  if (!referral_code || referral_code.trim() === "")
  return res.status(400).json({ message: "Referral code required ." });

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email aur password required hain." });
  next();
};