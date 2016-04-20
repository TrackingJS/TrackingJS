import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },

  password: String
});


userSchema.pre('save', function (next) {
  const user = this;
  console.log(this);

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, (err2, hash) => {
      if (err2) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (canditatePassword, callback) {
  bcrypt.compare(canditatePassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};
export default mongoose.model('user', userSchema);
