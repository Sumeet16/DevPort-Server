const simpleGit = require('simple-git');
const git = simpleGit();
const { exec } = require('child_process');
const fs = require('fs').promises;
const express = require('express');
const cors = require("cors");

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "*"],
  methods: ["GET", "POST"],
  credentials: true
}))

app.use(express.json());

app.post('/import-project', (req, res) => {
  const { name, url, userName } = req.body;

  const localPath = `/var/www/${userName}/${userName}-${name}`;
  const githubRepoUrl = url;

  git.clone(githubRepoUrl, localPath, (err, data) => {
    if (err) {
      console.error('Error cloning repository:', err);
    } else {
      console.log('Repository cloned successfully.');
      res.write("Repository cloned successfully.");
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
          res.write('Build process output:', stdout);
        } else {
          console.error('Build process error:', stderr);
          res.write('Build process error:', stderr);
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
          res.write('Build process output:', stdout);
        } else {
          console.error('Build process error:', stderr);
          res.write('Build process error:', stderr);
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

      res.write("File Cleaned...");

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
          res.write('Build process output:', stdout);
        } else {
          console.error('Build process error:', stderr);
          res.write('Build process error:', stderr);
        }
        // Continue with cleaning up the directory
        updateNginxPath(localPath);
      }
    });
  }

  function updateNginxPath(localPath) {

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
        res.write("Error in Nginx Updating System...");
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

        // Write the code to create an entry in the MongoDB
        
        // Ends here

        res.write("Nginx Updated Successfully...");
      }
    });
  }
});

app.get('/', (req, res) => { res.json({ message: "You've come to the right place... it's a GET request!!" }) });

app.listen(3000);
console.log('App listening on port 3000');




"git clone, npm install, npm run build, cleaning junk files, conf nginx.conf, testing the config file, restarting the nginx server"