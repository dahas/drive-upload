# Upload files to Google Drive

Supports Google Drive Api v3

### Enable Google Drive Api

- Follow [this link](https://developers.google.com/drive/api/v3/quickstart/nodejs) and accomplish Step 1 of the quickstart guide. 
- Press button "Enable the Drive Api".
- In the dialogue window enter any name for your project.
- Click "Next", leave the dropdown at "Desktop App" and press "Create".
- Download the client configuration file, save it in the root folder of your project and close the dialogue window.
- Before you can accomplish the next and final step, check out the "Usage" section below and prepare a file for your first upload attempt.
- When ready upload your first file and keep an eye on the console. Follow the instructions and enter the provided string in the console prompt so that the token gets created.

When everything has gone right, you have now a "token.json" file in your root folder. Keep it there together with "credentials.json".

### INSTALLATION

```
$ npm i drive-upload
```

### Usage

```
const driveUpload = require('drive-upload');

/**
 * Optional settings:
 * @param Object
 */
driveUpload.setOptions({
    allowedTypes: 'png,pdf,mp3,jpg',  // Comma-separated string with allowed types.
    driveFolder: 'DRIVE_FOLDER_ID',  // Take the ID from the URL when inside the folder in Google Drive
    permissions: {}  // See section below
});

/**
 * Finally send a file to the cloud:
 * @param String - Local path to file
 * @parma String - Rename file (Optional)
 * @param Function - Callback on success (Optional)
 */
driveUpload.store('local/path/to/file.ext', 'rename.ext', file => {
    console.log('Link: ', file.webLink);  // The webLink string can be inserted into the "src" property of an "img" tag.
});
```

### Permissions

You can determine how a uploaded file can be accessed from the public. But you have to follow the rules as defined in the [Google Drive Api docs](https://developers.google.com/drive/api/v2/reference/permissions/insert#request-body).

```
permissions: {
    'value': value, // The kind of value property depends on the role!
    'type': type,
    'role': role 
};
```
By default anyone can read the file:
```
permissions: {
    'type': 'anyone',
    'role': 'reader' 
};
```