const express = require('express');
const router = express.Router();
const userModel = require("../model/user.model");

router.post('/import-project', async (req, res) => {
    const { name, url, userName } = req.body;

    const localPath = `/var/www/${userName}/${name}`;
    const githubRepoUrl = url;

    git.clone(githubRepoUrl, localPath, (err, data) => {
        if (err) {
            console.error('Error cloning repository:', err);
        } else {
            console.log('Repository cloned successfully.');
            // Continue with the build process
            runNpmInstall(localPath);
        }
    });

    function runNpmInstall(localPath) {
        const buildCommand = 'npm install';

        exec(buildCommand, { cwd: localPath }, (error, stdout, stderr) => {
            if (error) {
                console.error('Error running npm install:', error);
            } else {
                if (stdout) {
                    console.log('Build process output:', stdout);
                } else {
                    console.error('Build process error:', stderr);
                }

                // Continue with cleaning up the directory
                runNpmBuild(localPath);
            }
        });
    }

    function runNpmBuild(localPath) {
        const buildCommand = 'npm run build';

        exec(buildCommand, { cwd: localPath }, (error, stdout, stderr) => {
            if (error) {
                console.error('Error running npm run build:', error);
            } else {
                if (stdout) {
                    console.log('Build process output:', stdout);
                } else {
                    console.error('Build process error:', stderr);
                }

                // Continue with cleaning up the directory
                cleanup(localPath);
            }
        });
    }

    async function cleanup(localPath) {
        try {
            const files = await fs.readdir(localPath);
            for (const file of files) {
                if (file !== 'dist') {
                    const filePath = `${localPath}/${file}`;
                    await fs.rm(filePath, { recursive: true });
                    console.log(`Removed: ${file}`);
                }
            }

            // Continue with updating the folder
            updateFolder(localPath);
        } catch (err) {
            console.error('Error cleaning up:', err);
        }
    }

    function updateFolder(localPath) {
        const command_1 = 'cd dist && mv * .. && cd .. && rmdir dist';

        exec(command_1, { cwd: localPath }, (error, stdout, stderr) => {
            if (error) {
                console.error('Error running command:', error);
            } else {
                if (stdout) {
                    console.log('Build process output:', stdout);
                } else {
                    console.error('Build process error:', stderr);
                }
                // Continue with cleaning up the directory
                updateNginxPath(localPath);
            }
            2
        });
    }

    async function updateNginxPath(localPath) {

        const nginxConfig = `
      server {
          listen 80;
          server_name ${name}.devport.online;
  
              root ${localPath};
  
              location / {
                  try_files $uri $uri/ /index.html;
              }
      }
      `;

        fs.appendFile('/etc/nginx/sites-available/13.51.205.148', nginxConfig, (err) => {
            if (err) {
                console.error('Error appending to the file:', err);
            } else {
                console.log('Lines appended to the file successfully.');
            }
        });

        const updateNginxConfigCommand = "sudo nginx -t && sudo systemctl restart nginx";

        exec(updateNginxConfigCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('Error running command:', error);
            } else {
                console.log('Build process output:', stdout);
                console.error('Build process error:', stderr);
            }
        });

        // Update MongoDB Database

        const date = new Date();
        try {
            const user = await userModel.findOneAndUpdate({ username: userName },
                {
                    $push: {
                        "projects_info": [
                            {
                                "projectTitle": name,
                                "domain": `${name}.devport.online`,
                                "createdAt": date
                            }
                        ]
                    }
                });
            return res.json({ message: "User is updated! 🟢", user: user })
        } catch (error) {
            return res
                .status(401)
                .json({ message: "Some error occurred while updating the user! 🔴" });
        }
    }
});

module.exports = router
