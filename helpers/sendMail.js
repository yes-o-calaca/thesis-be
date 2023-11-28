const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
require("dotenv").config();

const { G_CLIENT_ID, G_CLIENT_SECRET, G_REFRESH_TOKEN, ADMIN_EMAIL } =
  process.env;

const oauth2client = new OAuth2(
  G_CLIENT_ID,
  G_CLIENT_SECRET,
  G_REFRESH_TOKEN,
  OAUTH_PLAYGROUND
);

const sendEmailRegister = (to, password_unhash, name, url) => {
  oauth2client.setCredentials({
    refresh_token: G_REFRESH_TOKEN,
  });
  const accessToken = oauth2client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: ADMIN_EMAIL,
      clientId: G_CLIENT_ID,
      clientSecret: G_CLIENT_SECRET,
      refreshToken: G_REFRESH_TOKEN,
      accessToken,
    },
  });
  const mailOptions = {
    from: "Yes-O-Calaca.org",
    to: to,
    password_unhash: password_unhash,
    url: url,
    subject: "VERIFY ACCOUNT",
    html: `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Template</title>
    <style>
      body {
        width: 100vw;
        background-color: #d1d5db;
        font-family: "Roboto", sans-serif;
        font-size: 11px;
        color: black;
      }
      table.container {
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
        background-color: white;
      }
      table.wrapper {
        width: 100%;
        padding: 0 15px;
      }
      table.card {
        width: 100%;
        padding: 20px;
      }
      span {
        color: #15803d;
      }
      .button-container {
        text-align: center;
      }
      button {
        padding: 1em 2em;
        background-color: #047857;
        border: 0;
        margin-top: 30px;
        cursor: pointer;
      }
      button:hover {
        background-color: #15803d;
      }
      .button-container button a {
        text-decoration: none;
        color: white;
        padding:2px;
      }
      h1,
      h2,
      p {
        margin: 10px 0;
        color: black !important;
      }
      h2,
      p {
        font-weight: normal;
      }
      .heading {
        height: 60px;
        background-color: #15803d;
      }
    </style>
  </head>
  <body>
    <table class="container">
      <tr>
        <td class="heading"></td>
      </tr>
      <tr>
        <td class="wrapper">
          <table class="card">
            <tr>
              <td>
                <h1>Verify your email address</h1>
                <h2>Dear ${name},</h2>
                <h2>
                  To activate and start using your account, you need to confirm
                  your email address.
                </h2>
              </td>
            </tr>
            <tr>
              <td class="button-container">
                <button>
                  <a href="${url}">Activate Account</a>
                </button>
                <p>The link will expire in 1 Day(s)</p>
              </td>
            </tr>
            <tr>
              <td>
                <h2>Your Login Credentials are as follows:</h2>
                <h2>Access Email: ${to}</h2>
                <h2>Password: ${password_unhash}</h2>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `,
  };

  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) return { err };
    return info;
  });
};

const sendEmailReset = (to, url, name) => {
  oauth2client.setCredentials({
    refresh_token: G_REFRESH_TOKEN,
  });
  const accessToken = oauth2client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: ADMIN_EMAIL,
      clientId: G_CLIENT_ID,
      clientSecret: G_CLIENT_SECRET,
      refreshToken: G_REFRESH_TOKEN,
      accessToken,
    },
  });
  const mailOptions = {
    from: "Yes-O-Calaca.org",
    to: to,
    subject: "RESET PASSWORD",
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Template</title>
        <style>
          body {
            width: 100vw;
            background-color: #d1d5db;
            font-family: "Roboto", sans-serif;
            font-size: 11px;
            color: black;
          }
          table.container {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            background-color: white;
          }
          table.wrapper {
            width: 100%;
            padding: 0 15px;
          }
          table.card {
            width: 100%;
            padding: 20px;
          }
          span {
            color: #15803d;
          }
          .button-container {
            text-align: center;
          }
          button {
            padding: 1em 2em;
            background-color: #047857;
            border: 0;
            margin-top: 30px;
            cursor: pointer;
          }
          button:hover {
            background-color: #15803d;
          }
          .button-container button a {
            text-decoration: none;
            color: white;
          }
          h1,
          h2,
          p {
            margin: 10px 0;
            color: black !important;
          }
          h2,
          p {
            font-weight: normal;
          }
          .heading {
            height: 60px;
            background-color: #15803d;
          }
        </style>
      </head>
      <body>
        <table class="container">
          <tr>
            <td class="heading"></td>
          </tr>
          <tr>
            <td class="wrapper">
              <table class="card">
                <tr>
                  <td>
                    <h1>Reset Password</h1>
                    <h2>Dear ${name},</h2>
                    <h2>
                        Please click the below button to reset your password:
                    </h2>
                  </td>
                </tr>
                <tr>
                  <td class="button-container">
                    <button>
                      <a href="${url}">Click Here to reset your password</a>
                    </button>
                    <p>The link will expire in 1 Hour(s)</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
`,
  };

  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) return { err };
    return info;
  });
};

const sendUpdateProjectStatus = (to, url, emailContent) => {
  oauth2client.setCredentials({
    refresh_token: G_REFRESH_TOKEN,
  });
  const accessToken = oauth2client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: ADMIN_EMAIL,
      clientId: G_CLIENT_ID,
      clientSecret: G_CLIENT_SECRET,
      refreshToken: G_REFRESH_TOKEN,
      accessToken,
    },
  });
  const mailOptions = {
    from: "Yes-O-Calaca.org",
    to: to,
    subject: "PROJECT UPDATE",
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Template</title>
        <style>
          body {
            width: 100vw;
            background-color: #d1d5db;
            font-family: "Roboto", sans-serif;
            font-size: 11px;
            color: black;
          }
          table.container {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            background-color: white;
          }
          table.wrapper {
            width: 100%;
            padding: 0 15px;
          }
          table.card {
            width: 100%;
            padding: 20px;
          }
          span {
            color: #15803d;
          }
          .button-container {
            text-align: center;
          }
          button {
            padding: 1em 2em;
            background-color: #047857;
            border: 0;
            margin-top: 30px;
            cursor: pointer;
          }
          button:hover {
            background-color: #15803d;
          }
          .button-container button a {
            text-decoration: none;
            color: white;
          }
          h1,
          h2,
          p {
            margin: 10px 0;
            color: black !important;
          }
          h2,
          p {
            font-weight: normal;
          }
          .heading {
            height: 60px;
            background-color: #15803d;
          }
        </style>
      </head>
      <body>
        <table class="container">
          <tr>
            <td class="heading"></td>
          </tr>
          <tr>
            <td class="wrapper">
              <table class="card">
                <tr>
                
                  </td>
                </tr>
                <tr>
${emailContent}
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
`,
  };

  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) return { err };
    return info;
  });
};

const sendemailApproveDonation = (to, name) => {
  oauth2client.setCredentials({
    refresh_token: G_REFRESH_TOKEN,
  });
  const accessToken = oauth2client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: ADMIN_EMAIL,
      clientId: G_CLIENT_ID,
      clientSecret: G_CLIENT_SECRET,
      refreshToken: G_REFRESH_TOKEN,
      accessToken,
    },
  });
  const mailOptions = {
    from: "Yes-O-Calaca.org",
    to: to,
    subject: "Donation Update",
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Template</title>
        <style>
          body {
            width: 100vw;
            background-color: #d1d5db;
            font-family: "Roboto", sans-serif;
            font-size: 10px;
            color: black;
          }
          table.container {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            background-color: white;
          }
          table.wrapper {
            width: 100%;
            padding: 0 15px;
          }
          table.card {
            width: 100%;
            padding: 20px;
          }
          span {
            color: #15803d;
          }
          .button-container {
            text-align: center;
          }
          button {
            padding: 1em 2em;
            background-color: #047857;
            border: 0;
            margin-top: 30px;
            cursor: pointer;
          }
          button:hover {
            background-color: #15803d;
          }
          .button-container button a {
            text-decoration: none;
            color: white;
          }
          h1,
          h2,
          p {
            margin: 10px 0;
            color: black !important;
          }
          h2,
          p {
            font-weight: normal;
          }
          .heading {
            height: 60px;
            background-color: #15803d;
          }
        </style>
      </head>
      <body>
        <table class="container">
          <tr>
            <td class="heading"></td>
          </tr>
          <tr>
            <td class="wrapper">
              <table class="card">
                <tr>
                  <td>
                    <h1>Thank you</h1>
                    <h2>Dear ${name},</h2>
                    <h2>
                      Your donation is greatly appreciated and will empower the
                      future projects of Yes O Organization
                    </h2>
                  </td>
                </tr>
                <tr></tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>    
`,
  };

  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) return { err };
    return info;
  });
};

const sendNotifRole = (to, name, mes, project_title) => {
  oauth2client.setCredentials({
    refresh_token: G_REFRESH_TOKEN,
  });
  const accessToken = oauth2client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: ADMIN_EMAIL,
      clientId: G_CLIENT_ID,
      clientSecret: G_CLIENT_SECRET,
      refreshToken: G_REFRESH_TOKEN,
      accessToken,
    },
  });
  const mailOptions = {
    from: "Yes-O-Calaca.org",
    to: to,
    subject: "Role Update",
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Template</title>
        <style>
          body {
            width: 100vw;
            background-color: #d1d5db;
            font-family: "Roboto", sans-serif;
            font-size: 10px;
            color: black;
          }
          table.container {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            background-color: white;
          }
          table.wrapper {
            width: 100%;
            padding: 0 15px;
          }
          table.card {
            width: 100%;
            padding: 20px;
          }
          span {
            color: #15803d;
          }
          .button-container {
            text-align: center;
          }
          button {
            padding: 1em 2em;
            background-color: #047857;
            border: 0;
            margin-top: 30px;
            cursor: pointer;
          }
          button:hover {
            background-color: #15803d;
          }
          .button-container button a {
            text-decoration: none;
            color: white;
          }
          h1,
          h2,
          p {
            margin: 10px 0;
            color: black !important;
          }
          h2,
          p {
            font-weight: normal;
          }
          .heading {
            height: 60px;
            background-color: #15803d;
          }
        </style>
      </head>
      <body>
        <table class="container">
          <tr>
            <td class="heading"></td>
          </tr>
          <tr>
            <td class="wrapper">
              <table class="card">
                <tr>
                  <td>
                 
                    <h2>Dear ${name},</h2>
                    <h2>
                    You have been asigned to a role of an ${mes} of an upcoming project entitled ${project_title}. Visit your profile for more details
                    </h2>
                  </td>
                </tr>
                <tr></tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>    
`,
  };

  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) return { err };
    return info;
  });
};

const sendAnnouncement = (
  to,
  name,
  project_name,
  announcement_title,
  announcement_img
) => {
  oauth2client.setCredentials({
    refresh_token: G_REFRESH_TOKEN,
  });
  const accessToken = oauth2client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: ADMIN_EMAIL,
      clientId: G_CLIENT_ID,
      clientSecret: G_CLIENT_SECRET,
      refreshToken: G_REFRESH_TOKEN,
      accessToken,
    },
  });
  const mailOptions = {
    from: "Yes-O-Calaca.org",
    to: to,
    subject: "Announcement",
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <style>
          body {
            width: 100vw;
            background-color: #d1d5db;
            font-family: "Roboto", sans-serif;
            font-size: 10px;
            color: black;
          }
          table.container {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            background-color: white;
          }
          table.wrapper {
            width: 100%;
            padding: 0 15px;
          }
          table.card {
            width: 100%;
            padding: 20px;
          }
          span {
            color: #15803d;
          }
          .button-container {
            text-align: center;
          }
          button {
            padding: 1em 2em;
            background-color: #047857;
            border: 0;
            margin-top: 30px;
            cursor: pointer;
          }
          button:hover {
            background-color: #15803d;
          }
          .button-container button a {
            text-decoration: none;
            color: white;
          }
          h1,
          h2,
          p {
            margin: 10px 0;
            color: black !important;
          }
          h2,
          p {
            font-weight: normal;
          }
          .heading {
            height: 60px;
            background-color: #15803d;
          }
        </style>
      </head>
      <body>
        <table class="container">
          <tr>
            <td class="heading"></td>
          </tr>
          <tr>
            <td class="wrapper">
              <table class="card">
                <tr>
                  <td>
                 
                    <h2>Dear ${name},</h2>
                    <h2>
                  New Announcement for project ${project_name}
                    </h2>
                  <h2>
                 ${announcement_title}
                    </h2>
                    <img src="${announcement_img}"/>
                  </td>
                </tr>
                <tr></tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>    
`,
  };

  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) return { err };
    return info;
  });
};

const sendUpdateProject = (to, name, project_name, project_update) => {
  oauth2client.setCredentials({
    refresh_token: G_REFRESH_TOKEN,
  });
  const accessToken = oauth2client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: ADMIN_EMAIL,
      clientId: G_CLIENT_ID,
      clientSecret: G_CLIENT_SECRET,
      refreshToken: G_REFRESH_TOKEN,
      accessToken,
    },
  });
  const mailOptions = {
    from: "Yes-O-Calaca.org",
    to: to,
    subject: "Update Project Notification",
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <style>
          body {
            width: 100vw;
            background-color: #d1d5db;
            font-family: "Roboto", sans-serif;
            font-size: 10px;
            color: black;
          }
          table.container {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            background-color: white;
          }
          table.wrapper {
            width: 100%;
            padding: 0 15px;
          }
          table.card {
            width: 100%;
            padding: 20px;
          }
          span {
            color: #15803d;
          }
          .button-container {
            text-align: center;
          }
          button {
            padding: 1em 2em;
            background-color: #047857;
            border: 0;
            margin-top: 30px;
            cursor: pointer;
          }
          button:hover {
            background-color: #15803d;
          }
          .button-container button a {
            text-decoration: none;
            color: white;
          }
          h1,
          h2,
          p {
            margin: 10px 0;
            color: black !important;
          }
          h2,
          p {
            font-weight: normal;
          }
          .heading {
            height: 60px;
            background-color: #15803d;
          }
        </style>
      </head>
      <body>
        <table class="container">
          <tr>
            <td class="heading"></td>
          </tr>
          <tr>
            <td class="wrapper">
              <table class="card">
                <tr>
                  <td>
                 
                    <h2>Dear ${name},</h2>
                    <h2>
                This is to announce that the project ${project_name} is updated with the following reason:
                    </h2>
                  <h2>
                 ${project_update}
                    </h2>
                    <h2>For more details about the project changes you can visit the website.</h2>
                   
                  </td>
                </tr>
                <tr></tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>    
`,
  };

  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) return { err };
    return info;
  });
};

module.exports = {
  sendEmailRegister,
  sendEmailReset,
  sendemailApproveDonation,
  sendUpdateProjectStatus,
  sendNotifRole,
  sendAnnouncement,
  sendUpdateProject,
};
