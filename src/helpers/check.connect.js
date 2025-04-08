"use strict";
const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;
//count connect
const countConnect = () => {
  const numberOfConnections = mongoose.connections.length;
  console.log(`Number of connections: ${numberOfConnections}`);
};

// check over load
const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCPUs = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // example maximum number of connections based on numver of CPUs
    const maxConnections = numCPUs * 5;
    console.log(`active connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
    if (numConnection > maxConnections) {
      console.log(`Overload: ${numConnection} connections`);
    }
  }, _SECONDS);
};

module.exports = { countConnect, checkOverLoad };
