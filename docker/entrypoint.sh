#!/bin/sh
cd /opt/oxfordia-pod/packages/pod-server
exec node /opt/oxfordia-pod/node_modules/@solid/community-server/bin/server.js "$@"
