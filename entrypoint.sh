#!/bin/bash

npm install
cd client
npm install
npm run build
cd ..
npm run start