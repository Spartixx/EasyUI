#!/bin/sh
{
  echo "window.__env__ = {"
  env | grep "^VITE_" | while IFS='=' read -r key value; do
    echo "  \"$key\": \"$value\","
  done
  echo "};"
} > /usr/share/nginx/html/env.js
exec nginx -g 'daemon off;'
