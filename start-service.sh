!/usr/bin/env bash
$evn=$1
$type=$2

if [$evn == "api" || $evn == "all"]
then
        echo "STOP WORKER API"
        forever stop api
        echo "RUN WORKER API"
        NODE_ENV=$type npm run start-forever
else if [$evn == "import" || $evn == "all"]
then
        echo "STOP WORKER IMPORT"
        forever stop api
        echo "RUN WORKER API"
        NODE_ENV=$type npm run start-import
else if [$evn == "price" || $evn == "all"]
        echo "STOP WORKER API"
        forever stop api
        echo "RUN WORKER API"
        NODE_ENV=$type npm run start-worker
fi
