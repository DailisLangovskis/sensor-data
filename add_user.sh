#!/bin/bash

curl -d '{"name": "asd", "lastname": "ads", "email": "ad@va.lv(opens in new tab)", "username": "123", "password": "123123"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/registerUser

