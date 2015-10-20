```sh
~$ curl -X POST -vu trusted:secret http://localhost:8081/uaa/oauth/token -H "Accept: application/json" -d "password=password&username=user&grant_type=password&scope=read write&client_secret=secret&client_id=trusted"
```
