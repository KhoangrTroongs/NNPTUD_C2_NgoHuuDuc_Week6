let userModel = require('../schemas/users')
let bcrypt = require('bcrypt')

module.exports = {
    CreateAnUser: async function (username, password, email, role,
        avatarUrl, fullName, status, loginCount
    ) {
        let newUser = new userModel({
            username: username,
            password: password,
            email: email,
            role: role,
            avatarUrl: avatarUrl,
            fullName: fullName,
            status: status,
            loginCount: loginCount
        })
        await newUser.save();
        return newUser;
    },
    QueryByUserNameAndPassword: async function (username, password) {
        let getUser = await userModel.findOne({ username: username });
        if (!getUser) {
            return false;
        }
        // Verify password
        const isMatch = bcrypt.compareSync(password, getUser.password);
        if (isMatch) return getUser;
        return false;
    },
    FindUserById: async function (id) {
        return await userModel.findOne({
            _id: id,
            isDeleted: false
        }).populate('role')
    },
    ChangePassword: async function (userId, oldPassword, newPassword) {
        const user = await userModel.findById(userId);
        if (!user) return { success: false, message: "Người dùng không tồn tại" };

        const isMatch = bcrypt.compareSync(oldPassword, user.password);
        if (!isMatch) return { success: false, message: "Mật khẩu cũ không chính xác" };

        user.password = newPassword; // Pre-save hook will hash it
        await user.save();
        return { success: true, message: "Đổi mật khẩu thành công" };
    }
}