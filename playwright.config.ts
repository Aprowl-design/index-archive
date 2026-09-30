import {defineConfig} from '@playwright/test';
import {existsSync} from 'node:fs';
const edge='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
export default defineConfig({testDir:'./tests/browser',fullyParallel:false,workers:1,timeout:60000,reporter:[['list'],['json',{outputFile:'qa/browser-results.json'}]],use:{baseURL:'http://127.0.0.1:5174',viewport:{width:1440,height:1000},reducedMotion:'reduce',launchOptions:{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH||(existsSync(edge)?edge:undefined)},trace:'retain-on-failure'},webServer:{command:'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5174 --strictPort',url:'http://127.0.0.1:5174',reuseExistingServer:true}});
