const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ProfileSchema = new Schema({ bio: String, website: String });
const UserSchema = new Schema({ 
    name: String, 
    // 1:1 -> Referencia a un solo objeto
    profile: { type: Schema.Types.ObjectId, ref: 'Profile' } 
});

const Profile = mongoose.models.Profile || model('Profile', ProfileSchema);
const User = mongoose.models.User || model('User', UserSchema);

async function runOneToOne() {
    console.log('\n--- Ejecutando Relación 1:1 (Usuario -> Perfil) ---');

    const profile = await Profile.create({ bio: "Fullstack Dev", website: "myweb.com" });
    await User.create({ name: "Carlos", profile: profile._id });

    const user = await User.findOne({ name: "Carlos" }).populate('profile');
    console.log(`Usuario: ${user.name}, Bio: ${user.profile.bio}`);
}

module.exports = runOneToOne;