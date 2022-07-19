const forgotPasswordTemplate = (data) => {
    return `
        <h1>Hi ${data.name},</h1>
        <p>please click link below to reset your password</p><br />
        <a href="${data.redirectUrl}?token=${data.token}">Reset my password</a>
    `;
};

module.exports = forgotPasswordTemplate;
