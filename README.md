# Upload files to Google Drive

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
    driveFolder: 'DRIVE_FOLDER_ID'  // Take the ID from the URL when inside the folder in Google Drive
});

/**
 * Finally send a file to the cloud:
 * @param String - Local path to file
 * @parma String - Rename file (Optional)
 * @param Function - Callback on success (Optional)
 */
driveUpload.store('local/path/to/file.ext', 'rename.ext', file => {
    console.log('FileID: ', file.data.id);
});
```