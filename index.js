const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const FileType = require('file-type');

const SCOPES = ['https://www.googleapis.com/auth/drive'];

let options = {
    credentials: './credentials.json',
    token: './token.json'
};

exports.setOptions = opts => {
    options = {
        ...options,
        allowedTypes: opts.allowedTypes,
        driveFolder: opts.driveFolder
    }
}

exports.store = (srcFile, destFile, callback) => {
    fs.readFile(options.credentials, (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        authorize(JSON.parse(content), auth => {
            // console.log("auth", JSON.stringify(auth));
            FileType.fromFile(srcFile).then(fileData => {
                if (options.allowedTypes && options.allowedTypes.split(',').map(o => o.trim()).indexOf(fileData.ext) < 0) {
                    console.log('File type not allowed: ', fileData.ext);
                } else {
                    const drive = google.drive({ version: 'v3', auth });
                    var fileMetadata = {
                        'name': destFile ? destFile.split("/").pop() : srcFile.split("/").pop(),
                        parents: options.driveFolder ? [options.driveFolder] : null
                    };
                    var media = {
                        mimeType: fileData.mime,
                        body: fs.createReadStream(srcFile)
                    };
                    drive.files.create({
                        resource: fileMetadata,
                        media: media,
                        fields: 'id'
                    }, function (err, file) {
                        if (err) {
                            console.error(err);
                        } else {
                            if (callback && typeof callback === 'function') {
                                callback(file);
                            } else {
                                console.log('FileID:', file.data.id);
                            }
                        }
                    });
                }
            });
        });
    });
}

function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    fs.readFile(options.token, (err, token) => {
        if (err) {
            return getAccessToken(oAuth2Client, callback);
        }
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);

            fs.writeFile(options.token, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
            });
            callback(oAuth2Client);
        });
    });
}
