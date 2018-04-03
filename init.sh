echo starting redis
sudo redis-server &

echo building client at $pwd
cd client
ng build

echo starting web server at $pwd
cd ../server
npm start
 
