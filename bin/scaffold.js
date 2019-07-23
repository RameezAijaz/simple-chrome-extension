#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

const packageJson = require('../package.json');

const scripts = `"build": "webpack --mode production",
    "watch": "webpack --watch",
    "test": "echo \\"Error: no test specified\\" && exit 1"`;

const getDeps = deps =>
    Object.entries(deps)
        .map(dep => `${dep[0]}@${dep[1]}`)
        .toString()
        .replace(/,/g, ' ')
        .replace(/^/g, '')
        // exclude the plugin only used in this file, nor relevant to the boilerplate
        .replace(/fs-extra[^\s]+/g, '');

console.log('Initializing project..');

if(!process.argv[2])
{
    console.log('need a name for your chrome extension');
    console.log('pass it like simple-chrome-extension project-name');
    return;

}
exec(
    `mkdir ${process.argv[2]} && cd ${process.argv[2]} && npm init -f`,
    (initErr, initStdout, initStderr) => {
        if (initErr) {
            console.error(`Error while creating new project directory: 
    ${initErr}`);
            return;
        }
        const packageJSON = `${process.argv[2]}/package.json`;
        // replace the default scripts, with the webpack scripts in package.json
        fs.readFile(packageJSON, (err, file) => {
            if (err) throw err;
            const data = file
                .toString()
                .replace('"test": "echo \\"Error: no test specified\\" && exit 1"', scripts);
            fs.writeFile(packageJSON, data, err2 => err2 || true);
        });

        const filesToCopy = ['README.md', 'webpack.config.js', '.babelrc'];

        for (let i = 0; i < filesToCopy.length; i += 1) {
            fs
                .createReadStream(path.join(__dirname, `../${filesToCopy[i]}`))
                .pipe(fs.createWriteStream(`${process.argv[2]}/${filesToCopy[i]}`));
        }
        https.get(
            'https://raw.githubusercontent.com/RameezAijaz/simple-chrome-extension/master/.gitignore',
            (res) => {
                res.setEncoding('utf8');
                let body = '';
                res.on('data', (data) => {
                    body += data;
                });
                res.on('end', () => {
                    fs.writeFile(`${process.argv[2]}/.gitignore`, body, { encoding: 'utf-8' }, (err) => {
                        if (err) throw err;
                    });
                });
            },
        );

        console.log('npm init -- done\n');

        // installing dependencies
        console.log('Installing deps -- it might take a while..');
        const devDeps = getDeps(packageJson.devDependencies);
        const deps = getDeps(packageJson.dependencies);
        exec(
            `cd ${process.argv[2]} && npm i -D ${devDeps} && npm i -S ${deps}`,
            (npmErr, npmStdout, npmStderr) => {
                if (npmErr) {
                    console.error(`Error while installing dependencies: 
      ${npmErr}`);
                    return;
                }
                console.log(npmStdout);
                console.log('Dependencies installed');

                console.log('Copying additional files..');
                // copy additional source files
                fs
                    .copy(path.join(__dirname, '../src'), `${process.argv[2]}/src`)
                    .then(() =>
                        console.log(`All done!\nYour chrome-extension is now started into ${
                            process.argv[2]
                            } folder, refer to the README for the project structure.\nHappy Coding!`))
                    .catch(err => console.error(err));
            },
        );
    },
);
