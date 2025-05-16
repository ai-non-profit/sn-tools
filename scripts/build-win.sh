#!/bin/bash

yarn package
yarn make -- --platform win32
zip -r sn-tools.zip out/sn-tools-win32-x64