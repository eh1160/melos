** Prerequisities **

 * Install node 4.2.4 from Node's website

** Get Everything Setup **

 * Update npm to latest with `sudo npm install npm -g`
 * Authenticate with npm so you can fetch private repos: `npm login` (username/password in last pass under npmjs. It will prompt for Email and warn that it IS public... but that only applies if you deploy a new/updated npm repo)
 * If you don't have it, install Gulp globally with `npm install -g gulp-cli`
 * Clone this repo
 * Switch to cloned repo dir
 * Install all required modules with `npm install`
 * Compile all the javascript in the project with `gulp javascript`
 * Compile all the CSS in the project with `gulp css`


** Start Watching Files and Run Local Server **

 * To monitor and recompile files as you modify js/css files with `gulp watch`
 * To start local server, open a second console tab and run `DEBUG=youversion-events:* npm start`
 