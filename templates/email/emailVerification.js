const emailVerificationTemplate = (data) => {
    return `
        <h1>Hi ${data.name}, Welcome to Saturn</h1>
        <p>please click link below to verificate your email address</p>
        <a href="${data.redirectUrl}?token=${data.token}">Verificate my email</a>
    `;
};

module.exports = emailVerificationTemplate;