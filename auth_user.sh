#!/bin/bash

 curl -X POST -d '{"username":"asd", "password": "123123"}' -H "Content-Type: application/json" http://localhost:3000/api/auth