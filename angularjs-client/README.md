## Pure AngularJS based client
```sh
~/angularjs-client$ cd web
~/angularjs-client/web$ python -m SimpleHTTPServer 8083
```

### NGINX configuration
```sh
~$ cat /usr/local/etc/nginx/nginx.conf
...
        location /uaa/ {
            proxy_pass  http://127.0.0.1:8081;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        
        
        location /account/ {
            proxy_pass  http://127.0.0.1:8082;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /web/ {
            rewrite ^/web/?(.*)$ /$1 break;  
            proxy_pass  http://127.0.0.1:8083;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
...